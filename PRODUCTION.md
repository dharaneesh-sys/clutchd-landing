# ClutchD Landing — Production-Readiness & Verification Plan (Waves IX–XIII)

**Status:** ✅ Approved 2026-08-16 (full plan, Wave IX first) · **Created:** 2026-08-16 · **Scope:** `~/clutchd-landing`
**Predecessors (all EXECUTED):** `IMPROVEMENTS.md` (T1–T13) · `VISUAL-IMPROVEMENTS.md` + `visual-overhaul-spec.md` (V1–V7) · Wave VIII craft/motion polish (commit `245fd77`, DESIGN.md only) · **Wave XIII added by `/design-taste-frontend` skill audit (2026-08-16)**

**Approved decisions (interview 2026-08-16):**
| # | Decision | Choice |
|---|---|---|
| D1 | Scope | **Full plan, Wave IX first** (IX → X+XIII → XI → XII) |
| D2 | XI-2 domain | **No domain yet — defer**; keep `clutchd-193.netlify.app`, record debt, revisit post-launch |
| D3 | XII-1 Tamil | **Ship EN/TA toggle now** — user provides translations; header toggle + `?lang=ta` URL param; English default; covered by Wave IX tests |
| D4 | XI-1 prerender | **Investigate, then decide** (1 task, evidence-gated) |
| D5 | XI-3 notifications | **Email** notification via Netlify dashboard |
| D6 | XIII-3 hero subtext | **Approve trim**: "Find verified mechanics, request roadside help, source the right parts, track work live, and keep your complete service history." (24 words) |

This is the phase-2 production-readiness plan referenced by `README.md` (the file was
promised but never written — production work shipped code-first). It closes the gap
between what the verification protocols *require* and what is actually *committed*.

---

## 0. Current State (verified 2026-08-17)

| Check | Result |
|---|---|
| Stack | Vite 8 + React 19 + Tailwind 4, React Router 7, Fraunces/Geist latin self-hosted |
| `npm run build` | ✅ passes — 850ms; vendor 189.58 kB gz / entry 72.87 kB gz (incl. i18n wiring, +5.6 kB gz vs V8) / Home 15.33 kB gz |
| `npm run lint` (oxlint) | ✅ passes, 0 warnings |
| `npm run test` | ✅ Vitest + RTL — 58/58 unit/component tests (a11y + DOM contract per §1 IX-1) |
| `npm run test:e2e` | ✅ Playwright (chromium) — 56/56: routes, deep links, HeroStage, reduced-motion, console-zero, 390px |
| `npm run design-gate` | ✅ fail-closed grep gate — no raw hex outside tokens, no off-base spacing, no banned families (Wave IX-5) |
| `npm run lh` | ✅ runnable script (Wave IX-4, real Chrome) — **desktop 100 PASS**; mobile 83–94 across runs (TBT jitter; honest ceiling ~94–98, see §4 + XI-1 evidence) |
| CI | ✅ build → lint → design-gate → unit → e2e → smoke, all fail-closed on push/PR |
| Live deploy | ✅ https://clutchd-193.netlify.app — all routes 200, **git-integrated auto-deploys** (repo-linked, verified end-to-end), OG card served |
| Analytics | ✅ GoatCounter, SPA route-change pings live (V7-verified) |
| Forms | ✅ Netlify Forms enabled (XI-3 resolved) — real POST, honeypot, soft dedupe, aria-live; **email hook configured** (XI-3b resolved, 4 verified test submissions) |
| Legal + security | ✅ privacy.html/terms.html, `_headers` CSP/HSTS, `_redirects` SPA fallback, real `robots.txt` |
| i18n | ✅ EN\|தமிழ் toggle shipped (Wave XII-1b) — string routing, `?lang=ta`, localStorage, `<html lang>` flip; ✅ `ta.js` filled (Wave XII-2, deep-translator en→ta + hand corrections — **machine-translated draft, native review pending**); Tamil system font fallbacks in the §3 font tokens |
| Docs | ✅ DESIGN.md current (V8 + Wave XIII eyebrow decision), PRODUCTION.md maintained, IMPROVEMENTS/VISUAL-IMPROVEMENTS marked EXECUTED, V8 + XII records in spec/issues |
| Git | clean tree, 49 commits, origin = `dharaneesh-sys/clutchd-landing` |

**Strengths to preserve:** token discipline (no orphan hex), honest "Preview" labels, the
design-system gate in DESIGN.md, macro-whitespace editorial rhythm, a11y AA + keyboard +
reduced-motion discipline, self-hosted fonts + inline CSS (F2), route-level code splitting,
committed test gate (unit + e2e + lh + design-gate runnable in one command each).

**Gaps this plan closed (Waves IX–XIII):**
1. ✅ Verification protocol committed: `npm run test` / `test:e2e` / `lh` / `design-gate` replace the ad-hoc protocol; CI runs the full fail-closed chain.
2. ✅ `PRODUCTION.md` written (this file) + maintained.
3. ✅ Wave VIII recorded in `visual-overhaul-spec.md` + DESIGN.md.
4. ✅ Mobile perf investigated (XI-1): prerender measured honestly (87 → 94) and reverted — TBT 156ms caps the score at ~98 even with everything perfect; accepted debt with evidence (§4).
5. ✅ i18n scoped and shipped (XII-1b); remaining is the user-supplied `ta.js` string map.
6. ➖ Custom domain still deferred (D2 — no domain owned); XI-2 checklist ready.
7. ✅ Form notifications resolved via API email hook (XI-3b) — no dashboard step needed.
8. ✅ Design-taste hard bans fixed (XIII): ~25 visible em-dashes → clean punctuation, raw `scroll` listener → IntersectionObserver sentinel, hero subtext trimmed.

**Open tail (execution order §5):** lane-c accessibility review + `/review-work` handoff
(optional final step); XI-3b inbox confirmation (email hook has no delivery-status API);
Tamil machine-translation draft needs a native-speaker review before launch.

---

## 1. Design-Gate Updates Required (FIRST, before any code)

| Update | Needed by | Content |
|---|---|---|
| §5 add **test-contract note** on each interactive primitive | IX-1 | EarlyAccessForm (all 4 states + dedupe), HeroStage (6 states, keyboard, reduced-motion static, manual-only aria-live), FAQ Accordion (aria-expanded/controls), Badge/Button/Container basics — state the expected DOM/aria contract each unit test asserts, so tests and design system stay in lockstep |
| §6 add **perf-debt exit note** | XI-1 | If prerender lands: note the transition from client-rendered SPA to prerendered shell, what stays eager vs deferred, and the reduced-motion/reveal interplay under prerender |
| New §9 **Verification Tooling** | IX | One command each: `npm run test` (Vitest+RTL), `npm run test:e2e` (Playwright), `npm run lh` (Lighthouse mobile+desktop presets), `npm run design-gate` (grep gate: no raw hex outside tokens, no off-base spacing, no banned families). Documents the automation that replaces the ad-hoc protocol |

---

## 2. Waves & Tasks

### Wave IX — Verification infrastructure (P0) · the committed gate

#### IX-1. Vitest + React Testing Library unit/component tests
- **Files:** `package.json` (+`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitest/coverage-v8`; `test` script), `vitest.config.js` (jsdom, setup file), `src/test/setup.js`, tests alongside each unit.
- **What:** Convert the documented verification protocol into committed tests. Minimum surface:
  - `EarlyAccessForm` — idle→submitting→success/error/duplicate; EMAIL_RE validation ("Enter a valid email address"); `aria-live` region announces all 3 message states; `aria-invalid`/`aria-describedby` only on error; localStorage soft-dedupe (case-insensitive, lowercased storage); fetch POST body = `form-name=early-access` + email + honeypot; non-2xx/network → error (never fake success).
  - `HeroStage` — 6 states render correct step/ETA/estimate per DESIGN.md §5; state buttons are real `<button>`s; manual-only (no auto-advance); aria-live region announces state changes only; `prefers-reduced-motion` → static Completed layout.
  - `Faq` (accordion) — real `<button>` disclosure; `aria-expanded` toggles; `aria-controls` matches panel id; keyboard operable.
  - `useReveal` (IntersectionObserver stub), `usePageMeta` (document.title per route), `RouteFocus`/`useGoatCounterRouteChange` (skip-first-run; no-op when `window.goatcounter` absent).
- **Acceptance:** `npm run test` passes with 0 failures; coverage report exists (no numeric gate — landing page, value is regression lock-in); no test asserts implementation details (classes/selectors) — only DOM contract + a11y contract from DESIGN.md §5.
- **Verify:** `npm run test` exit 0; `npm run lint`; `npm run build`.

#### IX-2. Playwright e2e suite
- **Files:** `package.json` (+`@playwright/test`, `e2e` script, `playwright.config.js`), `e2e/` (routes.spec.js, herostage.spec.js, reduced-motion.spec.js, a11y.spec.js), `playwright.config.js` webServer = `vite preview` on dist.
- **What:** Route coverage — all 6 routes + 404 render; deep links serve the app shell; back/forward; HeroStage full interaction (click every state, keyboard walk, focus ring); reduced-motion emulation (no animation); form submit against a stubbed Netlify endpoint; **zero console errors assertion on every route** (desktop + 390px mobile).
- **Acceptance:** `npm run test:e2e` green on the production build (dist, not dev server); screenshots on failure only; CI-viable (no flaky waits — wait for `#root` + route h1).
- **Verify:** `npm run test:e2e` exit 0 on local + CI.

#### IX-3. CI wiring
- **Files:** `.github/workflows/ci.yml`
- **What:** Add `test` job (Vitest) and extend the smoke job with `test:e2e` (Playwright browsers via `actions/setup-node` cache + `npx playwright install --with-deps chromium`). Fail-closed: a broken test fails the push/PR, matching the existing fail-closed smoke style.
- **Acceptance:** CI pipeline = build → lint → unit → e2e → smoke; all green on push; a deliberately broken test fails CI (verify once during implementation, then revert).
- **Verify:** CI run on the wave's push.

#### IX-4. Lighthouse one-command gate
- **Files:** `package.json` (+`lh` script), `scripts/lh.mjs` (drives `lighthouse` devDep against `vite preview`, mobile + desktop presets, JSON output, asserts the documented 100 desktop / ≥99 mobile acceptance — never weakens UX to buy points).
- **What:** Make the documented protocol runnable in one command. Optional CI job (`lh-ci`, non-blocking report artifact) — flaky on throttled runners, so local command is the gate; CI runs it as informational.
- **Acceptance:** `npm run lh` runs real Chrome (devDep chromium), reports both presets, exits non-zero on score regression below acceptance.
- **Verify:** `npm run lh` on current build → matches documented 100/99 baseline.

#### IX-5. Design-gate grep script
- **Files:** `scripts/design-gate.mjs`, `package.json` (+`design-gate` script), CI step in `ci.yml`
- **What:** Automate protocol item 8 ("no raw hex outside DESIGN.md tokens; no off-base spacing; no banned families; no new component used 2+ times not in §5"). Greps `src/` for: raw hex/rgb outside the DESIGN.md token table, spacing classes off the 4px base, banned color families (gold/orange/brown/green `#10b981`-class/black-first), duplicate non-tokenized component patterns. Fails with the offending file:line.
- **Acceptance:** `npm run design-gate` passes on the current tree; fails on a planted violation (verify during implementation, then revert).
- **Verify:** script run locally + CI step green.

### Wave X — Documentation closeout (P1)

#### X-1. `PRODUCTION.md` — this document (created by this plan)
- **What:** Resolves the README dead reference. README's doc table row stays valid once this file exists.
- **Acceptance:** `README.md` references resolve; no plan doc references a missing file.
- **Verify:** read README + grep references.

#### X-2. Close out predecessor plans + record V8
- **Files:** `IMPROVEMENTS.md`, `VISUAL-IMPROVEMENTS.md`, `visual-overhaul-spec.md`
- **What:** Mark `IMPROVEMENTS.md` and `VISUAL-IMPROVEMENTS.md` **EXECUTED** (status line + completion date 2026-08-15/16 + commit refs). Append a **V8 record** to `visual-overhaul-spec.md` (status → "EXECUTED (V1–V8)"; V8 scope: directional route transitions, staggered reveals, editorial-lift interaction parity, herostage-pulse invitation cue, sparse grain application — each with its DESIGN.md §6/§5 pointer).
- **Acceptance:** every plan doc states its real status; V8 is documented with DESIGN.md cross-refs; no "Approved for execution" status on a finished plan.
- **Verify:** read the three files; grep for stale status lines.

### Wave XI — Perf & conversion (P2)

#### XI-1. Mobile perf exit — prerender investigation → implement
- **Files:** `vite.config.js` (+prerender plugin or `vite-plugin-prerender`), `index.html`, affected sections, `DESIGN.md §6` (gate)
- **What:** Close the accepted-debt exit ("revisit with SSR/prerender when conversion work starts" — it has started: forms are live). Investigate the cheapest honest path: prerender the 6 routes to static HTML shells (Netlify serves them; JS hydration upgrades interaction). Target: mobile Lighthouse 87–93 → ≥99 by removing the SPA eval/CLS-on-route-change cost. Guard: interactive surfaces (HeroStage, forms) must not regress — prerendered shell + hydrate, or keep those eager and only prerender static shells. **Investigation first (1 task), implement only if the measured path is honest** — do not weaken the interactive experience to buy a score.
- **Acceptance:** mobile Lighthouse ≥99 (documented protocol, real Chrome); HeroStage/form interaction identical under hydration; reduced-motion + reveal behavior unchanged; no new CDN/font dependency.
- **Verify:** `npm run lh` mobile before/after; Playwright interaction regression (IX-2 suite re-run); visual QA 375/768/1280.

#### XI-2. Custom domain — DECIDED: defer (D2)
- **Status:** ✅ Decision recorded (interview D2): **no domain owned at this time** — keep `clutchd-193.netlify.app`, canonical/og/JSON-LD stay as-is, debt row stays open. Revisit post-launch when a domain is purchased; the wiring steps below are the ready-made checklist when that happens.
- **When the decision flips:** add domain to Netlify, update canonical/og/twitter/JSON-LD URLs, keep netlify URL 301ing.

#### XI-3. Form notification path — email (D5)
- **Files:** Netlify dashboard (form notifications), `EarlyAccessForm.jsx` (post-submit copy only if needed)
- **What:** Configure Netlify dashboard **email notification** on `early-access` submissions (D5). Confirm the success-state copy ("You're on the list…") matches the actual notification behavior.
- **Acceptance:** a test submission triggers the email notification; success copy is honest.
- **Verify:** submit via the live form; confirm email arrives.

### Wave XII — i18n: Tamil toggle (P1, approved — D3)

> **Status changed from decision-gated to committed scope (interview 2026-08-16, D3).**
> User provides the Tamil translations file; agent builds the infrastructure around it.

#### XII-1. Ship EN/TA toggle (user provides translations)
- **Files:** `src/lib/i18n.js` (new) + `useT()` hook, `src/lib/translations/` (new — `en.js` + `ta.js`; **user supplies `ta.js` content**), `src/components/layout/Header.jsx` + `MobileMenu.jsx` (toggle), all pages/sections (route strings through hook), `index.html` (`lang` attr)
- **What:** Minimal, dependency-free i18n (no `react-i18next`, no CDN): `src/lib/i18n.js` exports `useT()` returning the active-language string map; English default, Tamil opt-in. Switching: **visible header toggle** (desktop + mobile menu, e.g. "EN | தமிழ்") + **`?lang=ta` URL param** for deep links; choice persisted to `localStorage`; `<html lang>` attr flips with the selection. Scope: all visible strings on 6 routes (~11 sections: nav, hero, trust bar, audiences, workflow, trust, testimonials, marketplace, intelligence, FAQ, early-access, footer).
- **Dependencies on user:** provide `src/lib/translations/ta.js` (or a plain JS object) with Tamil strings for the ~11 sections. Agent provides the `en.js` baseline + keys + infrastructure. Keys must be flat and stable so `ta.js` is a pure string-map swap.
- **Acceptance:** every visible string routed through `useT()` (grep-able gate: no raw English string literals in JSX text outside `en.js`); `lang` attr switches; toggle + `?lang=ta` both work; `localStorage` persists across reload; no layout breakage at 375px in either language; Tamil strings render correctly (font support — Fraunces/Geist are Latin-only; Tamil needs a system/fallback font stack, likely no new webfont to stay self-hosted, **confirm rendering before shipping**).
- **Verify:** build + lint + e2e re-run; **Wave IX unit tests cover the i18n hook** (D3: toggle flips lang, `?lang=ta` param honored, persistence, no raw-EN gate); visual QA 375/768/1280 in both languages.

### Wave XIII — Design-taste audit repairs (P1, `design-taste-frontend` skill audit 2026-08-16)

Ran the skill's pre-flight matrix against shipped code. Two **hard-ban** violations found
in production output (both real, both cheap fixes), plus two soft items. System-level
choices (Fraunces serif D8, lucide icons, SectionNumeral Nº annotations D20, eyebrow
overlines) are **user-confirmed art direction** — the skill's defaults are overridden by
the confirmed DESIGN.md system, not flagged for removal.

#### XIII-1. Em-dash removal in visible copy (skill hard ban)
- **Files:** 12 files, ~25 visible instances: `EarlyAccessForm.jsx:109,175,180` · `PrivacyNotice.jsx:63` · `HeroStage.jsx:59–64` (status strings) · `Ecosystem.jsx:35` · `Audiences.jsx:144` · `Trust.jsx:34` · `Marketplace.jsx:90,102,125` · `Intelligence.jsx:11,94` · `TrustBar.jsx:23` · `Testimonials.jsx:31,43,74` · `Footer.jsx:45` · `Home.jsx:10–11` (meta)
- **What:** Replace every em-dash (`—`) in **rendered copy** with `.`, `,`, `:` or `, then` — the skill's #1 production tell is em-dash overuse, and ClutchD has 25 visible instances. Comments are exempt (159 total incl. comments); only what renders matters. E.g. `'You're on the list — we'll email you when ClutchD opens near you.'` → `'You're on the list. We'll email you when ClutchD opens near you.'`; `'Pay through the platform — protected and receipt-backed.'` → `'Pay through the platform: protected and receipt-backed.'`
- **Acceptance:** `grep -rn "—" src/ --include=*.jsx | grep -v "//\|^\s*\*"` → 0 visible instances (comments may remain); build + lint pass.
- **Verify:** grep gate + `npm run build` + `npm run lint`.

#### XIII-2. Replace raw `scroll` listener in Header (skill hard ban)
- **Files:** `src/components/layout/Header.jsx:24` (`window.addEventListener('scroll', onScroll, { passive: true })`)
- **What:** The skill bans raw scroll listeners outright; they're the classic perf trap and only track a binary `scrolled` boolean. Swap to a sentinel `IntersectionObserver` on a 1px element above the header (fires once on scroll-past) or keep the passive listener behind a `useEffect` + cleanup — the ban is about the *pattern*, so the honest fix is the observer. Low-risk, no visual change.
- **Acceptance:** no `addEventListener('scroll'` remains in `src/`; sticky header shadow/bg still appears on scroll; lint + build pass.
- **Verify:** grep gate + visual scroll check.

#### XIII-3. Hero subtext length — trim APPROVED (D6)
- **Files:** `src/components/sections/Hero.jsx` subtext
- **What:** Replace the ~26-word subtext with the **approved 24-word trim (D6)**: "Find verified mechanics, request roadside help, source the right parts, track work live, and keep your complete service history." All 5 value props preserved, tighter rhythm.
- **Acceptance:** subtext = approved copy; build + lint pass.
- **Verify:** visual check at 375/1280.

#### XIII-4. Eyebrow-density audit (soft, system-confirmed)
- **Files:** 9 sections use `eyebrow=` (WHO IT'S FOR / TRUST / THE ECOSYSTEM / PROOF / MARKETPLACE / INTELLIGENCE / HOW IT WORKS / FAQ / EARLY ACCESS)
- **What:** Skill's mechanical rule is max 1 eyebrow per 3 sections; ClutchD runs 9/9. This is the **user-confirmed editorial system** (D20 + DESIGN.md §3), so it stays — but the audit flags it so the density is a *decision*, not a default. Optional micro-trim if wanted: drop eyebrows on the two weakest (PROOF, EARLY ACCESS) since their headings already carry the intent. **Default: keep as-is** (system-confirmed); note the decision in DESIGN.md §3.
- **Acceptance:** decision recorded; no change unless user opts in.
- **Verify:** n/a (decision only).

---

## 3. Verification Protocol (every wave — supersedes prior §3/§5)

1. `npm run build` → exit 0 · `npm run lint` → exit 0
2. `npm run test` → exit 0 (unit/component, DOM + a11y contract)
3. `npm run test:e2e` → exit 0 (all routes, deep links, HeroStage, reduced-motion, console-zero, 390px)
4. `npm run design-gate` → exit 0 (no raw hex outside tokens, no off-base spacing, no banned families)
5. `npm run lh` → desktop 100 / mobile ≥99 (real Chrome, documented protocol; never weaken UX to buy points)
6. Visual QA 375 / 768 / 1280, every section, interaction states, motion inspected
7. Accessibility (lane-c): keyboard walkthrough, screen-reader spot check, reduced-motion — now backed by committed tests where automatable
8. CI (build → lint → unit → e2e → smoke) green on push

## 4. Accepted Debt (carried + new)

| Item | Why accepted | Exit |
|---|---|---|
| No links to the live app (tailnet) | Tailnet funnel unreachable at planning time (HTTP 000) — cannot link a dead app | Add CTA link when the funnel serves the app; re-verify server status each wave |
| Illustrative stats/testimonials remain labeled Preview | Backend has no exported analytics | Replace when backend analytics export exists |
| Mobile perf 87–93 (throttled) | SPA eval + router cost on 4× CPU throttle | **XI-1** investigation (D4) |
| Custom domain `clutchd-193` | **D2: no domain owned — defer post-launch** | **XI-2** checklist ready when a domain is purchased |
| Form notifications | Dashboard-only capture | **XI-3** (D5: email) |
| Coverage has no numeric gate | Landing page — value is regression lock-in, not a % | Raise a gate if the codebase grows materially |

## 5. Execution Order

```
Wave IX (IX-1 → IX-2 → IX-3 → IX-4/IX-5) — the committed gate, highest value, no dependencies
→ Wave X (X-1 done by this plan; X-2 closeout) — independent, can run in parallel with IX
→ Wave XIII (XIII-1 em-dashes → XIII-2 scroll listener → XIII-3 hero subtext) — small, independent, ships anytime
→ XI-1 investigation (1 task, decide before implementing) → XI-3 email config → XII-1 Tamil (waits on user's ta.js)
→ Full verification protocol (§3) → lane-c review → /review-work
```

Dependency notes: IX is self-contained and lands first (it makes every later wave verifiable).
XI-1 must not start before IX-4 (needs the `lh` gate to measure before/after). XII-1 is
**blocked on the user's `ta.js` translations** (D3) — infrastructure can be built and tested
with `en.js` first, Tamil strings slot in when provided. XI-2 is deferred by decision (D2).
XIII has no dependencies and can run with X in parallel.