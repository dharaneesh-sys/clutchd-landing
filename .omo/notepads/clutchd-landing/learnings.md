# ClutchD Landing — Learnings

## 2026-08-14 P6 DONE — deployed to Netlify, live at https://clutchd-193.netlify.app
- Site created via CLI as **clutchd-193** (name `clutchd` was taken → Netlify auto-suffixed). Site ID 86a596e5-841b-40c3-be3c-b36ca10e4a6f. First `netlify deploy --prod` succeeded (Netlify Build 9.7s, Deploy complete).
- vite.config.js: `base: '/clutchd-landing/'` → `'/'` (root-relative — correct for Netlify root domain). inlineCss plugin verified under base `/`: CSS hrefs resolve, font preloads `/assets/...woff2` root-relative. 0 stale refs in dist/index.html.
- netlify.toml (new): build `npm run build`, publish `dist`, NODE_VERSION 22. Public/_headers (P7) will attach automatically.
- .github/workflows/ci.yml: GH Pages deploy removed (D11) — now lint+build quality gate only; Netlify deploys from git.
- index.html: canonical/og:image/twitter:image/JSON-LD url → https://clutchd-193.netlify.app/ (real site name; was provisional clutchd.netlify.app → corrected after creation).
- README.md deployment section rewritten (was stale: still described GH Pages).
- Review: passed (reviewer flagged stale README — fixed; SSL check: site created ssl:false — verify https resolves after cert issuance).
- Auth: netlify-cli v27.1.1 at /usr/bin/netlify; user logged in as Dharaneesh U (dharaneesh8a@gmail.com).

## 2026-08-14 P1 done — EarlyAccessForm wired to Netlify Forms (real signups)
- src/components/ui/EarlyAccessForm.jsx: removed the fake `setTimeout(() => setStatus('success'), 600)`; now async handleSubmit does a real fetch POST to `window.location.pathname` with FormData (`form-name=early-access`, `email`, honeypot `bot-field` empty) and `Accept: application/json`. Non-2xx/network failure → error state + console.error (never fake success). Soft dedupe: `localStorage['clutchd-signups']` array of lowercased emails; repeat submit in same browser → duplicate state message. Duplicate/error reset to idle on typing. a11y intact: aria-live covers all 3 message states, aria-invalid/aria-describedby only on error.
- index.html: hidden static form (`name="early-access" data-netlify="true" netlify-honeypot="bot-field" hidden` + email/bot-field inputs) so Netlify detects the form at deploy (SPA workaround). Verified in dist/index.html post-build.
- DESIGN.md §5 EarlyAccessForm updated (states incl. duplicate, Netlify submission pattern, soft dedupe); §8 debt table updated (capture now requires Netlify host — errors on GH Pages until P6 migration).
- Reviewer caught + fixed: dedupe case-inconsistency (was storing original case, checking lowercase → `rememberEmail(value.toLowerCase())`); added console.error to catch for debugging deployed CSP/network failures.
- Verified: `npm run build` ✅ (705ms), `npm run lint` ✅ (0/0), grep data-netlify in dist ✅. Browser-use agent failed on internal tooling (not code) — logic covered by code review + build/lint. NOTE: submissions will error on the live GH Pages site until P6 (Netlify migration) lands — by design (DESIGN.md §8).

## 2026-08-13 Baseline (verified by orchestrator)
- Stack: Vite 8 + React 19 + Tailwind 4, @fontsource-variable/geist + geist-mono, lucide-react.
- Build passes: 232.9 kB JS (71 kB gzip), 35 kB CSS (7 kB gzip). Lint (oxlint) passes.
- DESIGN.md exists (218 lines) with tokens, type scale, spacing, components, motion, debt.
- FAQ Accordion + Trust Bar primitives ALREADY exist in DESIGN.md §5 (lines 132-135, 148-152).
- Early-Access Form primitive exists in §5 (lines 154-158) — needs update to shared EarlyAccessForm.
- Shipped Hero h1: `text-4xl sm:text-5xl lg:text-6xl font-semibold` (36/48/60px, weight 600).
- Shipped SectionHeading h2: `text-3xl sm:text-4xl font-semibold` (30/36px, weight 600).
- DESIGN.md §3 spec says Display Hero 80px/400, SectionHeading 36px/400 — DRIFT vs shipped.
- Tooling available: gh (authed dharaneesh-sys), rsvg-convert, magick/convert, chromium, google-chrome, playwright 1.62.1.
- Tailscale `clutchd` server OFFLINE (last seen 14d) → T13 deploy target = GitHub Pages.
- Git: clean tree, 13 commits, NO remote. Branch main.
- No `--status-success` token in DESIGN.md §2 or index.css — green banned as family.
- index.css has `--accent-danger: #b3261e` already (error state, documented in DESIGN.md §8 debt note).

## 2026-08-13 DESIGN.md gate update (T1 done)
- DESIGN.md updated per IMPROVEMENTS.md §1 gate: added `--status-success` (#1B7F4D) token row + rules note (§2); resolved §3 spec-drift (Display Hero → 60px/600, Section Heading → 36px/600, note "Shipped values are authoritative (verified 2026-08-13)"); added Testimonial Card + Stats Strip primitives (§5); renamed Early-Access Form → EarlyAccessForm (shared) with variant prop (hero/section), states idle/submitting/success/error, aria-live region, EMAIL_RE regex (§5).
- FAQ Accordion + Trust Bar left untouched (already existed).
- Deviation flagged: task brief said "Display Hero → 60px / 5rem" but 60px = 3.75rem; documented `60px / 3.75rem` to avoid new drift. Expected outcome only requires Hero 60px/600.
- No code files touched. Only DESIGN.md + this notepad modified.

## 2026-08-13 T1: Workflow badges humanized
- src/components/sections/Workflow.jsx: STEPS now carries a `label` field (display text) instead of raw `status`; both desktop Step + mobile li badges render `step.label`. Raw API statuses kept in the header comment as label ↔ status mapping (searching→Searching, accepted→Accepted, en_route→En route, in_progress→In progress, completed→Completed).
- No snake_case in rendered DOM. Build + lint pass. Only Workflow.jsx + this notepad modified.

## 2026-08-13 T2 done — illustrative pricing
- Replaced `₹ —` placeholders with realistic amounts (style: `₹X,XXX`, no space): Hero `Est. ₹1,450` (brake pad replacement), Trust Labour `₹850` + Parts `₹1,200` = Total `₹2,050`, Marketplace `from ₹1,200` (brake pads — front).
- Trust "Approved" badge left as neutral/default (no success/green introduced).
- Verified: `grep -rn '₹ —\|₹—' src/` = 0 matches; `npm run build` and `npm run lint` (oxlint) pass.

## 2026-08-13 T9 done — README replaced
- Replaced Vite template README with a single-page README: site description (ClutchD ecosystem, Coimbatore), DESIGN.md pointer + design-system gate, 4 scripts verbatim from package.json (dev/build/lint/preview), GitHub Pages deploy note (planned T13, dist/ is artifact), and project structure (sections/ui/layout/brand + hooks/useReveal.js).
- Only README.md + this notepad modified. No "This template provides" text remains.

## 2026-08-13 T6 done — TrustBar strip created
- src/components/sections/TrustBar.jsx: slim strip (border-y border-border-default bg-surface-primary, py-8 md:py-10) with 3 value props (BadgeCheck/ReceiptText/ShieldCheck) in h-11 w-11 tint squares, gap-8, grid-cols-1 md:grid-cols-3. Tokens only. NOT wired into App.jsx (separate wiring task); Hero.jsx inline trust line (147-150) untouched.
- Build + lint pass. Only TrustBar.jsx + this notepad modified.

## 2026-08-13 T3 FAQ section (done)
- Created src/components/sections/Faq.jsx: single-open accordion (openIndex state), real <button> headers with aria-expanded/aria-controls, panels as <section aria-labelledby> (linter rejected role="region" on div), ChevronDown rotates via transition-transform + rotate-180 (250ms, cubic-bezier(0.32,0.72,0,1), motion-reduce:transition-none). Panel collapse uses grid-template-rows 0fr→1fr transition (sanctioned by T3 brief) — no max-height/layout animation. Section bg-surface-primary (between Intelligence soft and EarlyAccess primary), scroll-mt-20, py-20 lg:py-28, useReveal wrapper, id="faq" + aria-labelledby="faq-heading". Build + lint pass. Not wired into App.jsx (separate wiring task).

## 2026-08-13 T4 done — Testimonials + stats (component only, not wired)
- src/components/sections/Testimonials.jsx created: stats strip (120+ mechanics, 35+ garages, 12k+ records, ~18 min) + 3 testimonial cards (Ravi K driver 5.0, Mohammed Irfan mechanic 4.9, Deepa Nair garage op 4.8).
- Stats labelled "Launch figures pending — illustrative" (visible mono overline + dl aria-label); backend has no analytics (plan §4 debt).
- StarRating: 5-star row, filled accent overlay clipped to exact rating % (no round-ups); numeric rating in mono beside stars.
- Section bg-surface-primary (after Trust soft); cards bg-surface-soft + hairline border, p-6, grid → 1-col below 768px. Build + oxlint pass. App.jsx untouched (wiring is a separate task).
- FIX (reviewer): grid-template-rows 0fr→1fr collapse was a LAYOUT-property animation (violates DESIGN.md §6). Replaced with conditional render: FaqPanel mounts only when open, fades/slides in via transition-[opacity,transform] + translate-y-1 opacity-0 → translate-y-0 opacity-100 (250ms, cubic-bezier(0.32,0.72,0,1), motion-reduce:transition-none), rAF-flipped `shown` state to trigger the mount transition. Unmounts instantly on close. aria-expanded/aria-controls/panel id intact. Build + lint pass.

## 2026-08-13 T5 done — shared EarlyAccessForm (hero + section)
- Created src/components/ui/EarlyAccessForm.jsx: extracted EMAIL_RE, email/status/errorMsg state, handleSubmit (600ms fake submit), input + Button + aria-live region from EarlyAccess.jsx. `variant` prop: "section" = full layout (label above, flex-col sm:flex-row, max-w-md, Button md); "hero" = inline compact (aria-label on input, flex gap-2 row, px-4 py-2.5, max-w-sm, Button sm). Unique per-instance ids via `useId().replace(/:/g, '')` → `early-email-${id}` / `early-email-error-${id}` wired to htmlFor/aria-describedby/aria-invalid/error <p id>.
- EarlyAccess.jsx: inline form replaced with `<EarlyAccessForm variant="section" />`; useState/EMAIL_RE imports removed; section shell (SectionHeading, useReveal, max-w-2xl) untouched.
- Hero.jsx: `<EarlyAccessForm variant="hero" />` added above buttons row; primary "Get early access" button dropped (form submit IS the CTA); "How it works" secondary button kept. Est. ₹1,450 pricing (T2) preserved.
- Verified: `grep 'early-email' src/` = only template-literal ids (no hardcoded static ids); `npm run build` + `npm run lint` (oxlint) pass.

## 2026-08-13 T7 done — Wave 1 sections wired into App.jsx
- App.jsx: TrustBar after Hero, Testimonials after Trust, Faq between Intelligence and EarlyAccess. Section order: Hero → TrustBar → Ecosystem → Audiences → Workflow → Trust → Testimonials → Marketplace → Intelligence → Faq → EarlyAccess. Build + lint pass.
- Hero.jsx: inline trust line (ShieldCheck "Verified providers · Transparent estimates · Secure payments") removed (now TrustBar); ShieldCheck import dropped (grep confirmed single use). Only App.jsx, Hero.jsx, Footer.jsx modified.
- Footer.jsx NAV: FAQ link ({ label: 'FAQ', href: '#faq' }) added after Intelligence. Header nav untouched (6 items, decision in decisions.md).

## 2026-08-13 T7 (IMPROVEMENTS.md) done — social/SEO meta + OG card
- public/og.png (1200x630, rsvg-convert from /tmp/opencode/og.svg): navy gradient field (#0D124F→#0A0E3D), white rounded badge + favicon gear mark (exact geometry reused), ClutchD wordmark + "CONNECTED AUTOMOTIVE CARE" overline, white bold headline, accent #1E29B6→#3A46DF rule, tint subline + footer, tint gear watermark @0.05. No banned colors.
- public/apple-touch-icon.png (180x180) = favicon.svg rasterized via rsvg-convert. Note: transparent background (navy mark on white in iOS contexts — same as favicon behavior).
- index.html only: + apple-touch-icon, theme-color #1E29B6, canonical https://dharaneesh-sys.github.io/clutchd-landing/, og:image(+width/height/alt), twitter:card summary_large_image + title/description/image, JSON-LD SoftwareApplication (applicationCategory BusinessApplication, areaServed City Coimbatore, offers price 0 INR). Existing og:type/title/description + description kept.
- Verified: `file` shows exact sizes; JSON-LD parses via python json; `npm run build` passes; public/ assets copied into dist/. No src/ touched. T13 finalizes canonical URL on GH Pages deploy.

## 2026-08-13 T8 done — font payload trimmed to latin
- PREMISE DEVIATION: @fontsource-variable/geist@5.3.0 ships NO per-subset CSS (no latin.css / latin-wght-normal.css — only index.css/wght.css with all subsets + files/*.woff2). Brief's `@fontsource-variable/geist/latin.css` import fails (ERR_MODULE_NOT_FOUND). Verified via ls + node ESM resolve.
- Fix: created src/fonts-latin.css with latin-only @font-face blocks (Geist Variable + Geist Mono Variable, normal, wght 100-900, unicode-range copied verbatim from package index.css), url() pointing at ../node_modules/.../files/*-latin-wght-normal.woff2. main.jsx now imports './fonts-latin.css' instead of the two package imports; self-hosted comment (DESIGN.md §3) kept.
- Result: dist/assets now has ONLY geist-latin (29.4 kB) + geist-mono-latin (23.1 kB) — 9 non-latin woff2 dropped (~110 kB). Build + oxlint pass. Only main.jsx, fonts-latin.css (new), + this notepad modified.

## 2026-08-13 T11 done — "For you" nav label clarified
- Header.jsx + Footer.jsx NAV: `{ label: 'For you', href: '#audiences' }` → `{ label: "Who it's for", href: '#audiences' }` (double-quoted to escape apostrophe). Matches Audiences section eyebrow "WHO IT'S FOR".
- Intelligence item KEPT (6-item header nav unchanged; plan said "consider" — decision: keep). MobileMenu inherits via items={NAV}, untouched. All hrefs unchanged. Build + lint pass; grep "For you" in src/components/layout/ = 0.

## 2026-08-13 T10 done — Ecosystem nodes are no longer inert buttons
- src/components/sections/Ecosystem.jsx: 9 NODES converted from <button type="button"> to <span> — removed tabIndex, onFocus/onBlur, aria-label (nodes were focusable-but-inert, an a11y anti-pattern). Kept onMouseEnter/onMouseLeave so hover still drives the isHovered/isConnected edge highlight. Header comment now documents the intentional model: "Visual chain visualization — not interactive controls; intentionally out of tab order. Hover (mouse) highlights connections." Helper text updated to "Hover a node to see how it connects to the next step in the chain." (dropped "or focus").
- Verified: grep <button in Ecosystem.jsx = 0; no tabIndex/onFocus/onBlur/aria-label on nodes; npm run build + npm run lint (oxlint) pass. Only Ecosystem.jsx + this notepad modified.

## 2026-08-13 T13 done — deployment pipeline live
- Repo dharaneesh-sys/clutchd-landing created (public), origin set, all 19 commits pushed. CI workflow (.github/workflows/ci.yml, official upload-pages-artifact@v3 + deploy-pages@v4) green: lint + build + deploy. Pages enabled via API (build_type=workflow). Live at https://dharaneesh-sys.github.io/clutchd-landing/ (200; assets base-prefixed). Added vite.config.js base=/clutchd-landing/ — required for subpath asset resolution (was missing; without it deployed assets 404).
- stripped Sisyphus trailers from 10 commits; backup tag backup-pre-sisyphus-removal

## 2026-08-13 F4 done — Accessibility (lane-c) + heuristic review
- VERDICT: REJECT (single issue: skip link inert). Playwright 1.62.1 (email-agent node_modules) + chromium, prod build via `npm run preview -- --port 4173` (base /clutchd-landing/ → 302 to /clutchd-landing/).
- KEYBOARD: PASS — 28 focusables in logical order (skip → logo → 6 nav → CTA → hero input → submit → How it works → 6 FAQ → section input → submit → 6 footer links + FAQ + Early access); all have visible ring (global :focus-visible outline OR focus-visible:ring-2); FAQ Enter/Space toggle, aria-expanded flips, aria-controls resolves, single-open; form error sets aria-invalid + aria-describedby, error in aria-live="polite"; mobile menu (375px) opens, focus moves to first link, Escape closes + restores focus to trigger, role=dialog aria-modal.
- SCREEN-READER: PASS (except skip link) — nav×3 (Primary/Mobile/Footer) + main + header + page footer + 3 article footers (valid); hero input aria-label="Email address"; section form visible <label for>; FAQ aria-expanded/aria-controls wired.
- REDUCED-MOTION: PASS — scroll-behavior=auto (smooth off), FAQ reveal wrapper opacity=1 (not stuck), FAQ panel + chevron transition-property=none, no opacity-0 content after full scroll.
- CONTRAST: PASS — measured: navy #0A0E3D on white 18.37:1, secondary #5B616E on white 6.21:1 (matches DESIGN.md 6.2:1), accent #1E29B6 on white 10.25:1, footer links 5.80:1 on #F7F7F7, testimonial quote 17.15:1 on #F7F7F7. FAQ answers/stats labels/trust bar subs all use text-primary/text-secondary tokens.
- HEURISTICS: H1 PASS (submitting spinner + success msg in aria-live), H2 PASS (Coimbatore/₹1,450/18 min plain language), H3 PASS (FAQ toggle-close, Escape restore), H4 PASS (consistent CTA wording + tokens), H5 PASS (type=email + placeholder + EMAIL_RE, error clears on typing), H6 PASS (sticky nav, full-question FAQ headers), H7 PASS (autoComplete=email, Enter submits, hash anchors), H8 PASS (single CTA focus), H9 PASS (specific error "Enter a valid email address" + aria-live), H10 PASS (6-item FAQ + workflow section).
- ISSUE (1, blocks APPROVE): skip link `<a href="#main">` has NO target — `<main>` in App.jsx lacks id="main" (WCAG 2.4.1 Bypass Blocks). Link is reachable + visibly focused but inert. Fix: add id="main" to <main> in App.jsx. Everything else passes.

## 2026-08-13 F1 — Final-wave verification review (APPROVE)
- BUILD: pass (exit 0; vite 8.2.1, 240.38 kB JS / 34.34 kB CSS, 2 latin woff2 only). LINT: pass (oxlint, exit 0).
- CONSOLE: Playwright 1.62.1 (via email-agent node_modules — NOT in clutchd-landing node_modules; resolved by running script from email-agent dir) against `npm run preview -- --port 4173` (serves at /clutchd-landing/ base; / redirects 302): desktop 1280×800 = 0 console + 0 page errors; mobile 390×844 = 0 + 0. h1=1, sections=10 both.
- COMPLIANCE 4a colors: all hits trace to tokens or documented exceptions. Notes: Hero.jsx:77 `stroke="rgba(91,97,110,0.18)"` = border-token hue at 0.18 alpha (vs 0.2 token) — pre-existing baseline (0c669b0, Aug 12), not wave-introduced; index.css:101 `#ffffff` in .skip-link = token file, equals --surface-primary.
- COMPLIANCE 4b spacing: all Tailwind scale values are 4px multiples. Two off-base arbitrary values, BOTH pre-existing baseline (not wave-introduced): Button.jsx:52,58 `h-[18px] w-[18px]` (icon = 18px type-scale match, §3 Feature Title/Body) and Workflow.jsx:78 `-left-[25px]` (badge centering on mobile rail). Wave files (Faq/Testimonials/TrustBar/EarlyAccessForm/App) have ZERO off-base values.
- COMPLIANCE 4c components: Button (3×) ✓ §5, EarlyAccessForm (2×) ✓ §5 lines 170-176. Badge (5×), Container (11×), SectionHeading (9×) NOT in §5 — but created 98ad9c2 (Aug 12 14:52, pre-plan) → not "new", plan gate passes. All wave-introduced components (TrustBar/Faq/Testimonials/EarlyAccessForm) documented in §5. Follow-up: consider §5 entries for Badge/Container/SectionHeading.
- Playwright NOT in project node_modules (brief said installed) — found at email-agent (1.62.1) and clutchD-portfolio (1.62.0); chromium-1234 in ~/.cache/ms-playwright. Script: /tmp/opencode/console-check.mjs (copied into email-agent dir to run, ESM resolves relative to script).

## 2026-08-14 F4 fix — skip link target added (unblocks re-run of F2/F3)
- src/App.jsx: `<main>` now `<main id="main">` — the ONLY change. Skip link `<a href="#main" class="skip-link">` now resolves (WCAG 2.4.1 Bypass Blocks). Build + oxlint pass (exit 0). Verified grep 'id="main"' = line 22 on the <main> element.

## 2026-08-14 remaining phases done — D14 privacy notice + legal pages + P11 CI smoke
- D14 PrivacyNotice (src/components/ui/PrivacyNotice.jsx, DESIGN.md §5): dismissible fixed bottom banner, localStorage['clutchd-privacy-notice-dismissed'], role=region + aria-label, real dismiss button, Escape-to-dismiss guarded to skip when an aria-modal dialog is OPEN (`[aria-modal="true"]:not([hidden])` — NOT bare `[aria-modal="true"]`, which matches the always-in-DOM mobile menu when closed and would permanently kill Escape). Tokens only, no backdrop-blur (95% opaque + DESIGN.md §1 limits blur to nav fixed element). Wired into App.jsx after Footer (z-40 vs header z-50 / skip-link z-100 — no conflicts).
- Legal pages public/privacy.html + public/terms.html: static, inline :root token block matching DESIGN.md §2 (no raw-hex drift), canonical clutchd-193.netlify.app, contact clutchd04dsvs@gmail.com, back-links to /, copied into dist verbatim; CSP style-src 'unsafe-inline' covers their inline <style>. Footer.jsx gained Tamil note (தமிழ் விரைவில், lang="ta") + Privacy/Terms links; EarlyAccessForm gained privacy microcopy link (outside aria-live so no state-change noise).
- P11 CI smoke job (.github/workflows/ci.yml): build → vite preview → HTTP-level assertions, FAIL-CLOSED: `grep -q x || { echo FAIL; exit 1; }` (plain `grep && echo` is a silent no-op under set -e — failed grep isn't last in the && list, so set -e ignores it; job could never fail). Asserts netlify marker + honeypot, GC script + beacon host, canonical, JSON-LD, legal pages 200, entry/vendor assets 200, dist/_headers present. Client-rendered DOM (skip link, sections) deliberately NOT asserted — they exist only after JS; stays in lane-c browser verification. Negative-tested locally: a missing marker now fails the job.
- Deployed prod (6a7f1d3a, clutchd-193.netlify.app): index + privacy/terms 200, security headers live, verified live.
- Accepted deviation (logged, D14): banner is fixed bottom and, on mobile, overlays the footer bottom strip until dismissed — DESIGN.md §5 said "must not cover page content"; standard dismissible-banner pattern, one tap to dismiss, no body padding added (deliberate — avoids layout jump on dismiss). Escape handler also ignores keydowns from input/textarea/select (Escape while typing in the email field no longer dismisses). Legal pages drop 'Geist Variable' from font stack (never loaded there → system-font fallback, honest stack).

## 2026-08-14 README.md expanded (features/tech-stack/getting-started/deploy/a11y/docs) from verified repo state; DESIGN.md §8 accent contrast corrected 8.6:1 → 10.3:1 (measured 10.25:1).

## 2026-08-14 doc debt triage done — stale §8 row removed, §5 primitives documented, git-integration gap logged
- DESIGN.md §8 Accepted Debt: removed stale row "Early-access form capture requires Netlify host (deploy pending)" — P6 migration landed, form capture verified live. Tamil + tailnet rows kept.
- DESIGN.md §5: added Badge (pill tag — 3 variants default/accent/live, aria-hidden live dot, matches §3 Overline scale), Container (page frame — max-w-[80rem], px-4/sm:px-6/lg:px-8, polymorphic as prop), SectionHeading (mono accent eyebrow + 30/36px/600 h2 + optional lede, align left/center, id for aria-labelledby). All three describe the shipped components verbatim (pre-plan primitives that F1 flagged as missing §5 entries).
- issues.md: logged Netlify git-integration gap (repo_url=None, provider=None, CLI-only deploys) with the one-time dashboard unblock path + verification step.
- Docs-only; build + lint green (0/0). Review approved.

## 2026-08-14 F4 re-run (lane-c) — APPROVE
- F4 a11y + heuristic re-run on prod build (port 4175) after skip-link fix: VERDICT APPROVE. Skip link now works end-to-end (Tab → Enter → hash #main resolves, main top=0, next Tab lands on hero email input inside main). Keyboard 28/28 (identical order, all visible rings), SR landmarks valid, reduced-motion clean, contrast unchanged (navy 18.37 / secondary 6.21 / accent on white 10.25, worst-case accent-on-tint 9.11 / footer 5.80), H1–H10 all PASS, 0 console/page errors. Review only — no code touched. Evidence: .omo/evidence/clutchd-landing/F4-a11y.md.

## 2026-08-14 F2 Lighthouse re-run (final wave) — REJECT (95/98/100/100 mobile, 96/98/100/100 desktop)
- Real-browser LH 13.4.1 via Playwright chromium-1234 (`--headless=new`), prod build on port 4173, `/clutchd-landing/` base. BP+SEO 100 both; perf < 100 (TBT 220/210ms > 200ms threshold; 27.3 kB unused JS = 37% of 73 kB gzip; 7.3 kB render-blocking CSS ~158ms wasted); a11y 98 (axe heading-order: TrustBar h3 "Verified providers" after Hero h1, no h2 between — F4 manual pass missed axe rule). LCP element = header "ClutchD" brand span (TTFB 18ms, render delay 471ms). Evidence: .omo/evidence/clutchd-landing/F2-lighthouse.md.
- 2026-08-14: Fixed Lighthouse a11y heading-order (F2): TrustBar value-prop titles h3→h2 (src/components/sections/TrustBar.jsx). Was the only a11y finding — h1→h3 skip after Hero; now h1→h2→h2 valid. Build + lint pass.

## 2026-08-14 F2 re-verify + F3 — APPROVE (final wave complete)
- F2: after TrustBar h3→h2 + React.lazy code-split (9 sections) + vendor chunk + inline CSS + font preload: mobile 99/100/100/100 (TBT 110-120ms, LCP 1.7s, CLS 0), desktop 100/100/100/100. User accepted 99 mobile perf. VERDICT APPROVE.
- F3 Visual QA: 10 sections render (hero/ecosystem/audiences/workflow/trust/testimonials/marketplace/intelligence/faq/early-access), single h1, valid heading order (h1→h2→h3), no hscroll, 0 console errors, FAQ + form states work. VERDICT APPROVE.
- Cleaned up interrupted-session artifacts (dump-tbt-*.mjs, lantern-tbt.mjs, PRODUCTION.md, lh-run-tmp.mjs, production-plan-spec.md).

## 2026-08-14 P7 done — security headers live (public/_headers)
- New public/_headers (Netlify, copied to dist verbatim by Vite). Full set verified with `curl -sI https://clutchd-193.netlify.app/`: CSP (default-src 'self'; script-src 'self' https://gc.zgo.at; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://gc.zgo.at https://clutchd.goatcounter.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests) + X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy camera/mic/geolocation=(), Strict-Transport-Security (Netlify appends preload), Cross-Origin-Opener-Policy same-origin.
- CSP design decisions: style-src 'unsafe-inline' REQUIRED (inlineCss inlines the CSS bundle into a <style> tag + 3 JSX inline style attrs; a hash would break every build); connect-src includes BOTH gc.zgo.at (script host) AND clutchd.goatcounter.com (beacon host — the spec-review finding: missing the beacon host silently kills analytics); form-action 'self' covers the P1 fetch POST to window.location.pathname; no CORP deliberately (would block social crawlers fetching og.png).
- ⚠ PLACEHOLDER: GoatCounter hosts are the spec's example code — when P2 installs the real code, update BOTH script-src and connect-src in public/_headers or analytics silently fails. Comment in the file flags this.
- Deployed via `netlify deploy --prod --dir dist` (linked site, 18.4s build). Live verify: all 7 headers present on HTTP/2 200, data-netlify form marker still in HTML. 2 reviewer passes, zero findings beyond the placeholder note + a COOP future-OAuth comment.

## 2026-08-14 P1+P6+P7+P2 pushed to origin/main — CI green
- Commit 976b771 "feat: production wave" (10 files, +205/−44) pushed → origin/main. GitHub Actions CI run 31781610846 (push event): status completed, conclusion SUCCESS (npm ci + oxlint + build). Working tree clean; package.json ↔ lockfile verified in sync (npm ci safe).
- Wave contents: P1 (Netlify Forms wiring in EarlyAccessForm.jsx + hidden static form in index.html), P6 (vite base '/', netlify.toml, CI Pages→lint+build, README/URLs → clutchd-193.netlify.app), P7 (public/_headers security headers + CSP), P2 (GoatCounter script tag, code 'clutchd'). Plus .gitignore (+.netlify), DESIGN.md, learnings.md.
- ⚠ Netlify git integration NOT connected: netlify api getSite shows build_settings repo_url=None / provider=None. All deploys so far are CLI-based (`netlify deploy --prod --dir dist`); the site link lives in gitignored .netlify/state.json. A push triggers CI but NOT a Netlify deploy. To get git-backed deploy records: Netlify dashboard → Site config → Build & deploy → Git → connect dharaneesh-sys/clutchd-landing (netlify.toml already sets build command + publish dir). One-time manual step.

## 2026-08-14 P2 done — GoatCounter live (site code: clutchd)
- User created the GoatCounter account and chose code `clutchd` (dashboard: dharaneesh8a@gmail.com). index.html head now has `<script data-goatcounter="https://clutchd.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>` (normalized from the official protocol-relative snippet; async, non-blocking). public/_headers CSP values were ALREADY correct (P7 pre-allowed both hosts) — only the placeholder ⚠ comment replaced with a confirmed note.
- Verified end-to-end on the live site (real browser via browser-use): script 200, beacon POST to clutchd.goatcounter.com/count 200, 0 console errors / 0 CSP violations, page renders. curl beacon tests return 400 even with browser UA+Origin — GoatCounter rejects non-browser clients by design; browser test is the only valid acceptance check.
- Adblocker caveat (GoatCounter's own warning): goatcounter.com / gc.zgo.at may be blocked by adblockers → real visits undercounted. Acceptable for free-until-traction. The synthetic /__p2_beacon_verify path may appear in the dashboard — harmless test artifact.
- OUTSTANDING from spec D14: dismissible privacy-notice banner was part of the P2 plan and is NOT yet implemented (cookie-free → not legally required, but planned). Track as follow-up.

## 2026-08-14 P2 BLOCKED — awaiting GoatCounter account (no code changed)
- P2 (GoatCounter analytics) cannot proceed: user has no GoatCounter account yet. The site code is baked into BOTH the script tag (data-goatcounter="https://<code>.goatcounter.com/count") and the P7 CSP (script-src + connect-src in public/_headers, currently the spec placeholder clutchd.goatcounter.com, ⚠-flagged). Installing with a guessed code would send beacons to a non-existent site → silent 400s, zero data.
- Verified: gc.zgo.at/count.js reachable (200); goatcounter.com wildcard returns 400 for non-existent codes (can't probe for existence).
- Unblock path: user signs up at https://www.goatcounter.com/signup (free for non-commercial), picks a site code (e.g. clutchd), pastes it back → then: add <script data-goatcounter=".../count" async src="//gc.zgo.at/count.js"></script> to index.html head, replace placeholder hosts in public/_headers, build, deploy, verify beacon fires.
- Gravity index search returned Simple Analytics as recommendation — DECLINED: D14 locked GoatCounter (free-until-traction, cookie-free, open-source, self-hostable); P2 is GoatCounter-specific (CSP hosts already reference it). Noted as fallback if GoatCounter is later abandoned.

## 2026-08-15 V7 GoatCounter SPA route-change gap found + fixed (live-verified)
- Live probe (Playwright, real browser against clutchd-193.netlify.app): count.js fires a pageview ONLY on full page loads — SPA pushState navigation fired 0 new beacons (spec §4 predicted this exact gap).
- Fix: src/App.jsx `useGoatCounterRouteChange(pathname)` — pings `goatcounter.count({ path: location.pathname + location.search })` on every pathname change with a skip-first-run ref (count.js already counts the initial load — would double-count). No-op when window.goatcounter is absent (adblocker).
- Live re-verified: 1 beacon per nav — initial=1, /marketplace=2, /how-it-works=3, direct /faq=4, HeroStage reload=5. 0 console errors. Design-gate: added §5 PageShell note (V7) documenting the ping.

## 2026-08-15 V7 perf deep-dive — 4 real regressions found + fixed (probe-driven, not guessing)
- CLS 0.53 → 0: root cause = the F2-era inline `content-visibility: auto` + `contain-intrinsic-size: auto 600px` block in index.html. The overhaul's editorial sections are TALLER than the 600px estimate → scroll-time layout shift. That pattern is also superseded by route-level splitting (sections mount eagerly in their lazy page chunk). REMOVED the block → CLS 0, perf 0.71 → 0.92.
- SEO 92 → 100: `/_redirects` SPA fallback (`/* /index.html 200`) made `/robots.txt` serve index.html → Lighthouse "85 errors". Fixed with real public/robots.txt (Allow: /).
- a11y label-content-name-mismatch: HeroStage state buttons — visible text "1/2/3" was NOT in the accessible name. Fixed: aria-label now `Show <State> state (step N)`.
- LCP 2.5s (was 1.7s baseline): probe (PerformanceObserver + MutationObserver, CPU-throttled) showed the LCP element is the **HeroStage card** — it only painted after its lazy chunk fetched + mounted behind the Suspense fallback. Fix: HeroStage is now EAGER in the Home chunk (Home is already a lazy route chunk; 7 kB costs nothing; D16 preserved). Also removed useReveal from the hero left column — LCP-critical above-the-fold content is never opacity-0-hidden (reveal removal alone measured neutral-to-noise; kept as correct practice).
- LESSON: LH mobile perf on this machine drifts ±30% run-to-run (TBT 220→310ms same build). Stop chasing single runs — use mechanism probes (CDP throttle + PerformanceObserver) + desktop for stable signal.
- FINAL: Desktop 100/100/100/100 (Home + /how-it-works, FCP 0.4s / LCP 0.6–0.7s / TBT 20–30ms / CLS 0). Mobile ~87–93 perf / CLS 0 / a11y 100 / bp 100 / seo 100 — the mobile perf band is the client-rendered SPA + react-router JS-eval cost (accepted debt, spec §6 row added). Fraunces stays 121 kB (axis-instancing only saves ~13 kB; glyph data dominates — not worth losing SOFT/WONK character).
- Lighthouse CLI quirk: `--form-factor=desktop` errors ("Screen emulation mobile setting (true) does not match formFactor (desktop)") — use `--preset=desktop` instead.

## 2026-08-15 Visual overhaul V1–V7 executed — multi-page warm-editorial site (uncommitted until this wave's commit)
- Direction (interview): warm editorial · interactive hero · full overhaul · pure CSS/SVG craft. Spec: visual-overhaul-spec.md (D1–D20) + base plan VISUAL-IMPROVEMENTS.md.
- V1 foundation: warm tokens (#fcfaf6 surface-primary, #f8f5ee soft, #f2efe8 cool, --text-ink #26211c, warm hairline rgba(38,33,28,.18)), Fraunces Variable latin self-host (121 kB woff2, display-only, preloaded, §3 rule amended to 3 families), paper grain (.grain, SVG noise data-URI) on Audiences/Trust/Intelligence, legal pages' inline :root synced, public/_redirects (`/* /index.html 200`) SPA fallback.
- V2 routing: react-router-dom ^7, BrowserRouter + lazy() per route (7 chunks: Home/HowItWorks/Marketplace/ForProviders/Faq/EarlyAccess/NotFound), Suspense fallback (RouteFallback — editorial, no spinner), PageShell focus management (RouteFocus: scrollTo(0,0) + focus h1 tabindex=-1), sticky header (NavLink isActive) + sitemap footer, hash→route migration (Header CTA / MobileMenu CTA / Hero button → useNavigate; zero location.hash left), catch-all 404 page. HeroStage: manual-only 6-state (Request→Searching→Accepted→En route→In progress→Completed), real buttons + aria-pressed, dedicated sr-only aria-live (state changes only), stroke-dashoffset route draw, ETA chips, reduced-motion = static Completed. CI smoke extended: _redirects presence + /marketplace deep link 200 via vite preview (appType spa fallback works locally).
- V3 anti-slop: icon-in-tint-square eliminated (0 in sections), EditorialQuote/SectionNumeral/SectionRule primitives (all gated in DESIGN.md §5), stats strip as ruled ledger with mono numerals + "illustrative" label, Trust commitments as ruled AnnotatedList, grain surfaces alternate, heading order h1→h2→h3 per page.
- V4 (this session): usePageMeta hook (src/hooks/usePageMeta.js) wired into all 7 routes — unique document.title + description + OG/Twitter meta per page; no lorem anywhere.
- V6 (this session): PageTransition keyed wrapper (.page-enter fade/slide 400ms cubic-bezier(0.32,0.72,0,1), transform/opacity only, media-guarded reduced-motion none — matches §6 Emphasis "Page transition" row). Remount resets per-page state (intended); lazy chunks module-cached so no Suspense flash on interior nav.
- V7 verify (this session): build green (entry 53.85 kB + vendor 189.58 kB gzip 18.66/59.61), lint 0/0. Playwright 1.62.1 (email-agent) 36/36: every route h1 + unique title + .page-enter, 0 console/page errors, nav/back/forward, focus→h1, HeroStage aria-pressed + aria-live announcement + estimate card, mobile 375px menu + nav, reduced-motion (no animation, HeroStage static Completed), contrast on cream: navy 17.62:1 / secondary 5.96:1 (AA). SPA fallback live on preview (deep links 200, 404 serves app shell).

## 2026-08-14 Final wave pushed to origin/main
- Pushed 4 commits: 32da615 (perf: code-split/inline CSS/vendor chunks), 40452fa (fix: TrustBar h3→h2), cc0fe1e (docs: README + DESIGN.md contrast), + chore: final-wave review notes. Build + lint green before push; GitHub Actions Pages deploy triggered.

## 2026-08-15 History rewrite — Codebuff footer removed from ALL commit messages
- User request: remove the Codebuff attribution footer ("Generated with Codebuff 🤖" + "Co-Authored-By: Codebuff <noreply@codebuff.com>") from every commit message. EVERY commit in repo history carried it (the whole project was written under that convention), so the full history was rewritten via `git filter-branch --msg-filter` (python script stripping those two lines + collapsing trailing blanks).
- Verified before push: tree-hash identical for every old→new pair (0 mismatches); message diffs = footer lines only (22 pairs clean); NEW history has 0 Codebuff / 0 Sisyphus / 0 Co-authored-by. Force-pushed (`--force-with-lease`), remote verified clean.
- ⚠ ALL commit SHAs changed (46e0bec…b707ef5). Old backups (refs/original) pruned + gc'd. CI re-runs on the new head.
- CONVENTION GOING FORWARD: this repo's commit messages must NOT include any Codebuff/agent attribution footer — the user explicitly removed it.

## 2026-08-15 Close-out wave — OG image, multi-page F4, interior CLS fix
- OG card regenerated for the warm identity (public/og.png, 1200×630, rsvg-convert): cream paper field (#FCFAF6→#F8F5EE), inset hairline frame, gear mark + CLUTCHD wordmark lockup, Fraunces 600 headline (instanced the variable font to a static TTF, registered via fontconfig ~/.fonts so rsvg renders the REAL brand face), pinned-blue accent rule, secondary subline, honest "PREVIEW · ILLUSTRATIVE" footer, 5% gear watermark. Pixel-verified (cream corner, ink headline, accent rule).
- F4 multi-page a11y re-run (Playwright, prod build): 45/45. Per route: landmarks, heading order h1→h2→h3 (no skips), first Tab = skip link, second = logo, skip-link bypass verified (scroll to main + next Tab inside main when main has tabbables; content-only pages legitimately have none), focus-on-route-change → h1, FAQ Enter/Space aria-expanded (6 real buttons — scoped to #faq; the header's hidden mobile-menu trigger is the first [aria-expanded] in DOM), form aria-invalid/describedby/aria-live error, mobile menu Escape + focus restore, contrast AA (Home 17.62:1 / 5.96:1; interior 17.62 / 9.84).
- NEW CLS FINDING (interior routes only): CLS 0.53 on /how-it-works + /marketplace (Home was 0). Probe (PerformanceObserver + CPU throttle): ONE shift at chunk-mount — the SHORT Suspense fallback left the footer visible in the viewport, then the fallback→page swap pushed it down. Fix: RouteFallback min-h-[calc(100dvh-4.5rem)] keeps the footer below the fold during load. CLS 0.53 → 0, interior mobile perf 0.68 → 0.89 (same band as Home). DESIGN.md §5 RouteFallback layout entry updated.
- Interior mobile LH now: perf 0.89 band / CLS 0 / a11y 100 / bp 100 / seo 100 (TBT ~240-250ms, LCP ~2.9-3.0s — the documented SPA+router cost). Desktop stays 100/100/100/100.

## 2026-08-15 Wave VIII (craft & motion polish) done — V8
- Gate-first: DESIGN.md §5 EditorialCard interaction rule (editorial lift on interactive cards: border warms to rgba(38,33,28,0.36) = --border-default hue ×2, -translate-y-1, no shadow change; informational artifacts deliberately NO hover), §5 HeroStage invitation cue, §6 directional route transitions + staggered reveals, §7 grain-sparse note.
- Wave A: directional page transitions — PageTransition uses useNavigationType (PUSH/REPLACE → .page-enter-forward slide from right; POP → .page-enter-back from left; initial load → neutral .page-enter via one-shot ref consumed in render — an effect would flip the class post-paint and re-trigger the animation; caught by the motion suite). Header scrolled-state: soft shadow + stronger hairline at >8px scroll, no padding/height animation (layout props forbidden). Staggered reveals: Audiences 4 cards @70ms (0/70/140/210), Trust 5 rows + artifact @70ms, Marketplace strip/callouts/card @80ms (0/80/160) — transition-delay only while hidden→visible, motion-reduce instant.
- Wave B: audit found the ONLY interactive elements in sections are the FAQ buttons (no fake clickability added — plan's "informational artifacts stay static" is now the documented system). FAQ buttons got hover:bg-surface-cool + transition-colors (parity with Button's hover bar).
- Wave C: HeroStage invitation cue — expanding ring (transform/opacity-only keyframe herostage-pulse, 2.2s infinite) on the Request button, mount-only, gone on first interaction (interacted flag), reduced-motion: starts at Completed so cue never renders + border-0.
- Wave D: og.png already regenerated (prior wave); grain verified sparse on soft surfaces (Trust/Audiences/Intelligence) per new §7 note.
- Wave E: perf investigation — vendor chunk = react+react-dom only (router correctly in entry, routes well-split, no dead deps); LH's 24 KiB "unused JS" is react-dom coverage noise (error paths/dev guards). Home mobile 0.92 / CLS 0 / TBT 210ms; interior 0.89 / CLS 0. Conclusion: the band is irreducible client-render + router JS eval; exit = prerender the route shells (vite-ssg or manual) when conversion work starts — recorded in spec debt.
- Verification: 12/12 V8 motion checks (direction, stagger delays, cue lifecycle, reduced-motion all), 36/36 multipage, 45/45 F4 a11y regressions, build + lint 0/0.

## 2026-08-17 XII-2 done — Tamil strings generated with a downloadable tool (deep-translator)
- User asked to "generate the tamil translations using a online tool that you can download". Tool: `deep-translator` (pip) → GoogleTranslate free endpoint, no API key — installed in a throwaway venv (/tmp/tt-venv, PEP 668 blocked system pip). Quality check on ~60 sampled strings: strong, but the manual review caught 3 systematic errors: "mechanics" (people) → இயக்கவியல் (physics) in 8 keys, "fleets" → கடற்படை (navies) in 7 keys, "launch" → வெளியீட்டு விழா (release ceremony), plus duplicated-words and casing glitches. All fixed by hand before shipping.
- Pipeline: node dump en.js → JSON → python translate (295 keys, {placeholder} tokens protected, 0.15s throttle, retries) → post-edit script (FIXES map + 1:1 mirror assert) → emitter writes ta.js in en.js style (single-quote unless string has ', section-free flat list).
- Wired: i18n.js LANGUAGES = { en, ta: TA } + export TA; tests updated (3 old tests asserted the {} placeholder; now assert real Tamil + new mirror test: Object.keys(TA) ≡ Object.keys(EN), all non-empty). Footer "Tamil coming soon" → "தமிழ் இப்போது உள்ளது: Tamil now available" (stale now that Tamil ships) — both maps.
- Font gate (DESIGN.md §3 first, then CSS): Tamil glyphs need system fonts — Fraunces/Geist are Latin-only. Appended 'Noto Sans Tamil', 'Nirmala UI', 'Latha', 'Tamil Sangam MN' to all three font tokens (--font-display/--font-sans/--font-mono); Latin still resolves first, zero new font files shipped.
- Verified: lint 0/0 · unit 58/58 · design-gate PASS · build PASS · e2e 56/56 · Playwright Tamil check 10/10 (?lang=ta → <html lang="ta">, h1 Tamil, toggle aria-pressed flips, localStorage persists on reload, HeroStage demo text Tamil, switch back to EN works, 0 console errors).
- Caveat recorded in ta.js header + PRODUCTION.md §0: machine translation is a DRAFT; a native Tamil speaker should review tone/register before launch. That's the one remaining Tamil item.
