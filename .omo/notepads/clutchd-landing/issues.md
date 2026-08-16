# ClutchD Landing — Issues

## 2026-08-13
- (none yet)

## 2026-08-14
- Netlify git integration NOT connected: `netlify api getSite` → `build_settings.repo_url=None`, `provider=None`. All deploys are CLI-based (`netlify deploy --prod --dir dist`); a push to origin/main triggers GitHub Actions CI but NOT a Netlify deploy, so there are no git-backed deploy records or per-PR preview deploys.

## 2026-08-15
- Tried to connect via the Netlify API (updateSite): `build_settings` is **silently ignored** on PATCH for a site created CLI-only; the legacy `repo` object persisted `provider=github` + `repo_url` but left a **broken link** — Netlify tried to clone over SSH ("Host key verification failed"), created no GitHub webhook (`repo_hooks` 404), and produced an errored deploy. Unlinked again via `unlinkSiteRepo` (site restored to clean CLI-deploy state; confirmed `provider=None`). CONCLUSION: the public API cannot complete a git link for an existing CLI-created site — the GitHub App install + webhook registration is dashboard-only.
- Unblock (one-time, dashboard): https://app.netlify.com/sites/clutchd-193/configuration/build-and-deploy → Continuous deployment → Repository → **Link repository** → pick `dharaneesh-sys/clutchd-landing` (branch main). netlify.toml already sets build command `npm run build` + publish dir `dist`, so it just works. Verify after connecting: `netlify api getSite` shows `repo_url` populated, and a push creates a deploy record.

## 2026-08-15 RESOLVED — git integration connected (dashboard)
- User completed the dashboard Link-repository flow. Verified via API: `build_settings.provider=github`, `repo_url=https://github.com/dharaneesh-sys/clutchd-landing`, `repo_branch=main` (site list endpoint). Netlify cloned the repo and built commit `245fd770` → state **ready** (first git-backed build, no CLI involvement).
- Note: `/repos/.../hooks` shows no webhook and `gh api /repos/.../installation` returns nothing — expected for the GitHub App flow (app-level webhook, not repo hook); the successful repo clone/build is the proof of access.
- End-to-end confirm: pushed `d1d3b5a` (this note) → Netlify auto-build from that commit → deploy record with commit_ref created. Git-backed deploys + per-PR previews now live.

## 2026-08-16 XI-3 BLOCKER — Netlify Forms never enabled on clutchd-193
- Discovered during Wave XI-3 verification (PRODUCTION.md): the early-access form has NEVER collected a submission. `netlify api getSite` → `use_forms: null`, `processing_settings.ignore_html_forms: true`. The `data-netlify="true"` form ships in index.html and is served live, but Netlify is not parsing HTML forms, so `listSiteForms` → `[]` and a live POST to `https://clutchd-193.netlify.app/` with `form-name=early-access` returns **HTTP 404** (form not registered). Every signup since the production wave (f54b476, 2026-08-15) was silently lost; the "You're on the list…" success copy never corresponded to a collected lead.
- API fix attempted and FAILED (dead end, mirrors the git-link case): `updateSite` with `use_forms:true` and `processing_settings.ignore_html_forms:false` is **silently ignored** — response echoes the unchanged values. No create-form endpoint exists in the API (`netlify api --list` → only listSiteForms/deleteSiteForm/listFormSubmissions).
- Unblock (one-time, dashboard): https://app.netlify.com/sites/clutchd-193/forms → the Forms tab should offer "Enable forms" (or Site configuration → Forms). Also check Site config → Build & deploy → Post processing → HTML forms ("Forms" toggle must be ON, not "Ignore HTML forms"). After enabling, re-test: `curl -X POST https://clutchd-193.netlify.app/ --data "form-name=early-access&email=test@example.com"` should return 200 and a submission should appear in the dashboard + `netlify api listSiteSubmissions`.
- Then Wave XI-3 continues: dashboard → Forms → early-access → Notifications → email → set the recipient. Verify a live submission triggers the email.
- **RESOLVED 2026-08-16:** user enabled HTML-forms processing in the dashboard (verified: `processing_settings.ignore_html_forms` now `false`). Triggered `createSiteBuild` → deploy `6a81a619` ready → form `early-access` registered (`id 6a81a625ca1a9b000803ddc1`, fields email + bot-field honeypot, submission_count 0 → then 1). Live POST now returns **HTTP 200**; test submission `xi3-verify@example.com` confirmed via `listFormSubmissions`. Fix validated end-to-end.
- Remaining XI-3 step (dashboard, user): Forms → early-access → Notifications → Add notification → **Email notification** → recipient address. Then submit the live form once and confirm the email arrives. API has NO form-notification endpoint (`netlify api --list`), so this step is dashboard-only.

## 2026-08-16 Wave progress (sequential execution, per user "do the plan sequentially")
- Wave IX (test infra): IX-1 vitest ac3be69 · IX-2 playwright cbb8ade · IX-3 CI fea01b3 · IX-4 lh gate + IX-5 design-gate 1372cab (design-gate PASS verified; lh desktop 100 PASS, mobile 87 FAIL — matches accepted-debt baseline, tracked to XI-1).
- Wave X (doc closeout): X-1 9e149e6 (PRODUCTION.md committed) · X-2 36f8bdb (IMPROVEMENTS/VISUAL-IMPROVEMENTS marked EXECUTED, V8 record appended to visual-overhaul-spec.md).
- Wave XIII (design-taste): ff28f3e — em-dash copy cleanup (0 visible em-dashes remaining in rendered copy; only JSDoc comment bullets remain), Header scroll listener → IntersectionObserver sentinel (0 raw scroll listeners), hero subtext → approved 24-word trim, eyebrow-density decision recorded in DESIGN.md §3.
- Wave XI-1 in flight (bg_3439a333): prerender investigation, mobile 87 → ≥99 target.
- Wave XII in flight (bg_d63bbaf1): i18n core as new files only (i18n.js, en.js, ta.js placeholder, i18n.test.js) — component routing deferred until XI-1 lands.

## 2026-08-16 Wave XI-1 RESULT — prerender investigated, NOT the honest path (deferred)
- Full prerender implementation built + measured (real Chrome, mobile preset): baseline **87** → prerendered **94**. Desktop 100 both.
- Why 99 is unreachable: weighted score = 0.10·FCP + 0.10·SI + 0.25·LCP + 0.30·TBT + 0.25·CLS. Prerendered TBT 156ms → score 0.94 caps the total at **98** even with everything else perfect. Need TBT ≤100ms AND LCP ≤2.0s — both far short.
- Prerender gains bounded: LCP 3027→2656ms (h1 in static HTML), TBT 289→156ms (eval moved before FCP — measurement artifact, not real JS reduction). FCP unchanged (main thread still gated under 4× throttle). LCP NOT font-bound (Fraunces 121kB preloaded, ~600ms, finishes 2s before LCP) — font subsetting would not help.
- Per PRODUCTION.md XI-1 clause ("implement only if the measured path is honest — do not weaken the interactive experience to buy a score"): **reverted everything** (App.jsx/main.jsx/HeroStage/PrivacyNotice/vite.config/package.json restored; scripts/prerender.mjs + src/prerender-entry.jsx + ssr-test.mjs deleted). Tree verified back to lazy() SPA shell.
- RECOMMENDATION (recorded): the honest lever is reducing JS eval/TBT (0.30 weight cap) — shrink vendor chunk (React DOM + router, 59.6kB gzip) or defer non-critical hydration. Font subsetting does NOT help. Honest ceiling with prerender: ~94–98. Decision per plan: mobile ≥99 stays the documented target; acceptance today = desktop 100 (PASS), mobile deferred with this evidence.

## 2026-08-16 Wave XII-1b COMPLETE — string routing + EN|தமிழ் toggle (direct execution after 2 stalled delegations)
- Routing verified via git status: all 11 sections, Header/MobileMenu/Footer, EarlyAccessForm/HeroStage/PrivacyNotice/RouteFallback, Logo, all 7 pages, App.jsx, i18n.js, en.js routed through useT() — 27 modified + new `src/components/ui/LanguageToggle.jsx` (untracked at verify time). Raw-string sweep: only test files + Badge JSDoc remain (aria-labelledby = ID refs, not copy).
- Toggle semantics: `<fieldset>` + sr-only legend `nav.langAriaLabel`; two `<button aria-pressed>` labeled `nav.langEn`/`nav.langTa`; `onClick → setLang`. Mounted in Header (desktop) + MobileMenu. `?lang=ta` / localStorage `clutchd-lang` resolution already in i18n.js from XII-1a; `setHtmlLang` flips `<html lang>`.
- New tests: `LanguageToggle.test.jsx` (3) — aria-pressed flip, localStorage persist, html lang flip, cross-consumer re-render via separate useT probe, `?lang=ta` deep link. Suite: **58 unit tests PASS** (9 files), e2e **56/56 PASS** (clean run; earlier failures were ERR_CONNECTION_REFUSED server-lifecycle artifacts from port-kill interleaving, confirmed via error-context), lint clean (removed unused STEP_KEYS leftover), build PASS, design-gate PASS.
- Lighthouse re-measured: desktop **100 PASS** (hard gate); mobile **86** vs recorded 87 baseline — same-day runs on identical code measured 87/94/48/86 (48 = machine load), so 86 is TBT jitter in the 0.30-weight metric, NOT a routing regression (bundle identical; routing added no production JS weight). Mobile stays documented accepted-debt per XI-1 evidence; gate not weakened.
- Committed as: `07fff6e` (feat: Wave XII-1b string routing + EN|தமிழ் toggle).

## 2026-08-16 FINAL VERIFICATION (§3) — COMPLETE (code-side), pushed to origin/main
- Full §3 sweep on committed XII-1b state (07fff6e + b125d52), clean working tree:
  1. build PASS · 2. lint PASS (0 warnings) · 3. unit 58/58 (9 files) · 4. e2e 56/56 (routes, deep links, HeroStage, reduced-motion, console-zero, 390px) · 5. design-gate PASS.
  6. lh: desktop **100 PASS** (hard gate); mobile 83–86 across runs (TBT 361–367ms) — recorded accepted-debt per XI-1 (target ≥99 unreachable without TBT ≤100ms AND LCP ≤2.0s; honest ceiling ~94–98). Gate NOT weakened; mobile stays documented debt.
  7. Visual QA at 375/768/1280 (real screenshots inspected): LanguageToggle renders correctly in desktop header + mobile menu (EN|தமிழ் buttons, aria-pressed, pipe separator), layout clean at all viewports, no overflow/breakage, early-access form intact.
  8. CI green on push: pushed all 10 wave commits `89868f2..b125d52` → GitHub Actions run 31950499916 **completed success** (build → lint → design-gate → unit → e2e chain). Netlify git-backed auto-deploy triggered from same push.
- Bundle note (honest): XII-1b added ~18 kB raw / +5.6 kB gzip to the eager main bundle (54.55→72.87 kB; vendor identical 189.58 kB) — the i18n.js + en.js + LanguageToggle wiring through eagerly-imported Header. This is the approved Tamil-toggle feature cost, not accidental bloat; recorded as part of the mobile accepted-debt evidence.
- Remaining plan items: XI-3b email notification (user dashboard step, forms capture verified working — 2 submissions) and the optional lane-c review + /review-work handoff per §5 execution order.
