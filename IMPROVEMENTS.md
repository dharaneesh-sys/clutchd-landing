# ClutchD Landing — Improvement Plan

**Status:** ✅ EXECUTED (T1–T13, 2026-08-13 → 2026-08-15; last task commit `9193271`) · **Created:** 2026-08-13 · **Scope:** `~/clutchd-landing`
**Superseded by:** `PRODUCTION.md` (phase-2 production-readiness, approved 2026-08-16)

This plan is the executable contract for improving the ClutchD landing page. Every task lists its files, acceptance criteria, and verification. The design-system gate applies throughout: **no new token, primitive, state, or motion rule is used in code before it is added to `DESIGN.md`.**

---

## 0. Current State (verified 2026-08-13)

| Check | Result |
|---|---|
| Stack | Vite 8 + React 19 + Tailwind 4, `@fontsource-variable/geist`, lucide-react |
| `npm run build` | ✅ passes — 232.9 kB JS (71 kB gzip), 35 kB CSS (7 kB gzip), 668ms |
| `npm run lint` (oxlint) | ✅ passes |
| Console errors | ✅ zero (Playwright, desktop + 390px mobile) |
| Mobile 390px | ✅ verified via DOM: form stacks `flex-col`, marketplace chips wrap `flex-wrap`, hero is light gradient |
| Accessibility | ✅ skip link, aria labels, focus rings, reduced-motion, keyboard nav, labeled inputs |
| Git | clean tree, 13 commits, **no remote** |
| Design system | `DESIGN.md` exists (218 lines) — tokens, type scale, spacing, components, motion, debt |

**Strengths to preserve:** token discipline (no orphan hex), honest "Preview" labels, pure CSS/SVG visuals, macro-whitespace rhythm, single-blue-accent restraint, accessible primitives (Button/Badge/Container/SectionHeading).

**Gaps this plan closes:** raw backend statuses shown to users, `₹ —` placeholder pricing, no FAQ, zero social proof, hero lacks inline email capture, incomplete social/SEO meta, full font payload, spec drift, no deployment.

---

## 1. DESIGN.md Updates Required (do these FIRST, before any code)

Per the design-system gate, the following sections must be extended in `DESIGN.md` before the corresponding tasks run:

| Update | Needed by | Content |
|---|---|---|
| §5 add **FAQ Accordion** primitive | T3 | disclosure pattern, chevron rotation, `aria-expanded`/`aria-controls`, 250ms transform/opacity motion (already spec'd in §5 — promote from spec to shipped primitive) |
| §5 add **Testimonial Card** + **Stats Strip** primitives | T4 | card anatomy (quote, name, role, star rating), stats strip anatomy (number + label, mono numerals), tonal-shift surfaces |
| §5 add **EarlyAccessForm** shared primitive | T5 | extracted from `EarlyAccess.jsx`; hero variant (inline, compact) + section variant (full); states: idle/submitting/success/error |
| §5 add **Trust Bar** primitive | T6 | 3-column value-prop strip below hero, icon + title, `--space-8` between items |
| §2 add **`--status-success`** token if needed | T2 | green is banned as a family; success/positive states must be tokenized explicitly (e.g. `#1B7F4D`-class, same-hue discipline) before use |
| §3 resolve **typography spec-drift** | T12 | align scale table with shipped sizes (Hero 60px/600 vs spec 80px/400; SectionHeading 36px/600 vs spec 36px/400) — document the shipped values |

---

## 2. Improvements

### Wave 1 — Content & Conversion (P0)

#### T1. Humanize workflow status badges
- **Files:** `src/components/sections/Workflow.jsx`
- **What:** Replace raw backend vocabulary (`searching`, `accepted`, `en_route`, `in_progress`, `completed`) with display labels ("Searching", "Accepted", "En route", "In progress", "Completed"). Keep the backend constants in the code comment (they are the real API statuses).
- **Acceptance:** No snake_case visible in rendered DOM; labels match the step titles; comment retains the API vocabulary mapping.
- **Verify:** `npm run build`, `npm run lint`, DOM snapshot of `#workflow` shows humanized labels.

#### T2. Replace `₹ —` placeholder pricing with realistic illustrative amounts
- **Files:** `src/components/sections/Hero.jsx` (line ~100), `src/components/sections/Trust.jsx` (lines 81–90), `src/components/sections/Marketplace.jsx` (line ~87)
- **What:** The three mock cards show `Est. ₹—`, `₹ —`, `from ₹ —` — reads as broken content, not "Preview". Use realistic illustrative INR amounts (e.g. `Est. ₹1,450`, `₹ 850`, `from ₹ 1,200`) on cards already labeled Preview. If a success/positive color is needed for any state, add the token to DESIGN.md §2 first (see §1).
- **Acceptance:** No `₹ —` or `₹—` placeholder anywhere in rendered DOM; amounts are plausible for the item; Preview labels retained.
- **Verify:** grep for `₹ —` returns zero; `npm run build`.

#### T3. Add FAQ accordion section
- **Files:** new `src/components/sections/Faq.jsx`; wire into `src/App.jsx` between `Intelligence` and `EarlyAccess`; add nav/footer link if nav space allows (else footer only)
- **What:** 5–6 questions: how matching works, how estimates/pricing work, provider verification process, coverage area (Coimbatore rollout), payment methods, what "Preview" means. Use the DESIGN.md §5 FAQ Accordion primitive (real `<button>` disclosure, `aria-expanded`/`aria-controls`, chevron, 250ms transform/opacity, keyboard operable, reduced-motion aware).
- **Acceptance:** All questions expand/collapse; keyboard operable; `aria-expanded` toggles; no layout-property animation; section has `id="faq"` + `aria-labelledby`.
- **Verify:** `npm run build`, `npm run lint`, Playwright interaction test (click, keyboard, focus ring), DOM snapshot.

#### T4. Add social proof: testimonials + stats
- **Files:** new `src/components/sections/Testimonials.jsx` (or extend `Trust.jsx`); wire into `App.jsx`
- **What:** The Trust section is 100% self-claims. Add (a) a **stats strip** — verified mechanics count, garages, service records, avg response time — using *real* numbers from the ClutchD backend if obtainable, else clearly illustrative values labeled as such; (b) **2–3 testimonial cards** (driver, mechanic, garage operator) with name, role, star rating, short quote. Use the DESIGN.md §5 primitives (Testimonial Card + Stats Strip). No invented brand logos.
- **Acceptance:** Stats are either real (sourced from backend) or explicitly labeled illustrative; testimonials have name + role + rating; section follows tonal-shift surface rhythm; no banned colors.
- **Verify:** `npm run build`, `npm run lint`, visual QA at 375/768/1280.

#### T5. Hero inline email capture (shared EarlyAccessForm)
- **Files:** new `src/components/ui/EarlyAccessForm.jsx` (extracted from `EarlyAccess.jsx`); update `Hero.jsx` (replace/augment the two-button row with inline email + pill CTA); update `EarlyAccess.jsx` to use the shared component
- **What:** DESIGN.md §5 hero spec + lazyweb grammar both call for "inline early-access email field + pill CTA inside the hero". Extract the form logic (validation, submitting/success/error states, `aria-live` region) into one shared component with a `variant` prop (`hero` = compact inline, `section` = current full layout). Hero keeps the "How it works" secondary button.
- **Acceptance:** Email field + submit in hero; validation identical to current form; success/error states announced via `aria-live`; both hero and section forms share one implementation; no duplicate logic.
- **Verify:** `npm run build`, `npm run lint`, Playwright: submit invalid → error, valid → success, both variants; DOM snapshot.

#### T6. Trust bar directly below hero
- **Files:** `src/components/sections/Hero.jsx` (or new `src/components/sections/TrustBar.jsx` rendered inside/after Hero)
- **What:** Promote the inline "Verified providers · Transparent estimates · Secure payments" line into a proper 3-column value-prop strip (icon + title) directly below the hero, per DESIGN.md §5 Trust Bar primitive. Keep the hero copy clean.
- **Acceptance:** 3-column grid → 1-column stack below 768px; icons from lucide; `--space-8` between items; no new colors.
- **Verify:** `npm run build`, visual QA at 375/768/1280.

#### T9. Replace template README
- **Files:** `README.md`
- **What:** Replace the untouched Vite template with one page: what the site is, design-system pointer to `DESIGN.md`, dev/build/lint commands, deploy target.
- **Acceptance:** No "This template provides" text remains; commands match `package.json`.
- **Verify:** read file.

### Wave 2 — SEO & Performance (P1)

#### T7. Complete social/SEO meta + structured data
- **Files:** `index.html`
- **What:** Add `og:image` (generate a 1200×630 OG card from the brand — navy field, logo mark, headline — as `public/og.png`), `twitter:card` (`summary_large_image`), `canonical`, `theme-color` (`#1E29B6`), `apple-touch-icon` (PNG from `favicon.svg`), and JSON-LD structured data (`LocalBusiness`/`SoftwareApplication` with `areaServed: Coimbatore`).
- **Acceptance:** All meta tags present and valid; OG image exists and is referenced; JSON-LD validates (no schema.org errors); Lighthouse SEO 100.
- **Verify:** `npm run build`, Lighthouse SEO category, JSON-LD validator.

#### T8. Trim font payload to latin subsets
- **Files:** `src/main.jsx`
- **What:** Switch to explicit latin imports (`@fontsource-variable/geist/latin.css` + `@fontsource-variable/geist-mono/latin.css`) to drop cyrillic/vietnamese/latin-ext subsets from the build (~100 kB leaner dist, fewer font requests). Verify no visual regression (page is English-only).
- **Acceptance:** `dist/assets` contains only latin woff2 files; build passes; rendered text identical.
- **Verify:** `npm run build`, list `dist/assets/*.woff2`, visual QA.

### Wave 3 — Consistency (P2)

#### T10. Ecosystem nodes: stop being inert buttons
- **Files:** `src/components/sections/Ecosystem.jsx`
- **What:** Nine `<button>` elements do nothing on click — an a11y anti-pattern (focusable controls with no action). Convert to non-interactive elements that keep the hover/focus highlight affordance (e.g. styled `<span>` with `tabIndex={0}` + `aria-hidden` semantics, or remove from tab order while keeping the visual hover), OR give them a real purpose (scroll to the matching section).
- **Acceptance:** No button without an action in the section; keyboard focus behavior is intentional and documented; hover/focus highlight preserved.
- **Verify:** `npm run build`, keyboard walkthrough, DOM snapshot.

#### T11. Clarify "For you" nav label
- **Files:** `src/components/layout/Header.jsx`, `src/components/layout/Footer.jsx`
- **What:** Rename "For you" → "Who it's for" (matches the section eyebrow) or "Roles". Consider dropping "Intelligence" from the 6-item nav if it stays crowded.
- **Acceptance:** Nav and footer labels match the section's identity; no dead links.
- **Verify:** DOM snapshot of nav.

#### T12. Resolve typography spec-drift
- **Files:** `DESIGN.md` §3 (and code only if a real defect is found)
- **What:** DESIGN.md says Display Hero 80px/weight 400; shipped is 60px/weight 600. The rendered result is good (visual review praised it) — this is doc drift, not a bug. Update DESIGN.md's scale table to the shipped sizes (or align code if the spec is preferred — decide once, document it).
- **Acceptance:** DESIGN.md §3 matches shipped CSS; no ambiguity for future work.
- **Verify:** read DESIGN.md + grep font sizes.

### Wave 4 — Launch (P3)

#### T13. Deployment pipeline
- **Files:** `.github/workflows/ci.yml` (new), git remote, deploy config
- **What:** Push to GitHub; add a minimal Actions workflow (`npm ci && npm run lint && npm run build`); deploy `dist/` (444 kB) to GitHub Pages / Cloudflare Pages, or serve from the existing tailnet funnel. This clears DESIGN.md's accepted-debt item "no links to the live app".
- **Acceptance:** CI green on push; deployed URL serves the built site; nav/hero CTAs can link to the live app URL once stable.
- **Verify:** CI run, curl deployed URL.

---

## 3. Verification Protocol (every wave)

1. `npm run build` → exit 0
2. `npm run lint` → exit 0
3. Playwright: zero console errors on desktop + 390px mobile
4. **Design-system compliance grep:** no raw hex/rgb outside `DESIGN.md` tokens; no spacing values off the 4px base; no new component used 2+ times that isn't documented in DESIGN.md §5
5. **Lighthouse (real Chrome via Playwright, production build, mobile + desktop presets, 3–5 runs, median):** 100 in all four categories. Never the CLI. Never weaken UX to buy points.
6. **Visual QA:** 375 / 768 / 1280px, every section, interaction states (hover/focus/active) and motion driven and inspected
7. **Accessibility (lane-c):** keyboard walkthrough of every interactive element; screen-reader spot check on nav, FAQ, forms; `prefers-reduced-motion` verified
8. **Heuristic evaluation (lane-c):** Nielsen H1–H10 walkthrough of the key task (visitor → signup) on the shipped surface

## 4. Accepted Debt (unchanged + new)

| Item | Location | Why accepted | Exit |
|---|---|---|---|
| Early-access form has no backend (client-side only) | Hero + closing CTA form | Static Vite SPA; no API in this wave | Wire a real submission path (mailto/endpoint) post-launch |
| Tamil locale not covered | Whole page | i18n out of scope for landing wave | Future i18n pass |
| No links to the live app (tailnet) yet | Nav + CTAs | Live app URL not provisioned | Add link when tailnet app URL is stable (T13) |
| Illustrative stats/testimonials may be placeholder | T4 | Real backend numbers not yet exported | Replace with real data when backend analytics exist |

---

## 5. Execution Order

```
DESIGN.md updates (§1) → Wave 1 (T1 T2 T3 T4 T6 T9 parallel; T5 alone — shared component extraction)
→ Wave 2 (T7 T8) → Wave 3 (T10 T11 T12) → Wave 4 (T13)
→ Full verification protocol (§3) → lane-c review → /review-work
```

T5 is the only task with a real dependency risk (shared `EarlyAccessForm` touches Hero + EarlyAccess + a new component) — run it alone or first in Wave 1.