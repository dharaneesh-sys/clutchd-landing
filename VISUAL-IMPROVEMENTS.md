# ClutchD Landing — Visual Improvement Plan (Wave V)

**Status:** Approved direction (user-confirmed 2026-08-14) · **Scope:** `~/clutchd-landing`
**Direction:** Warm editorial · **Hero:** Interactive · **Change appetite:** Full overhaul allowed · **Imagery:** Pure CSS/SVG craft (no raster, no generated images)

This plan is the executable contract for the visual overhaul. The design-system gate applies throughout: **no new token, primitive, state, or motion rule is used in code before it is added to `DESIGN.md`.** All existing quality gates stay green: Lighthouse 100 (mobile 99 accepted), a11y AA + keyboard + reduced-motion, CI build/lint/smoke, Netlify Forms, GoatCounter, security headers.

---

## 1. Current State (verified 2026-08-14, code + live browser QA)

| Check | Result |
|---|---|
| Surfaces | Pure white `#FFFFFF` + cool grays (`#F7F7F7`/`#EEF0F3`) + cool tint `#F0F1F9` — institutional, reads cold |
| Accent | Single blue `#1E29B6` (user-pinned 2026-08-11) — keep |
| Text | Deep navy `#0A0E3D` / secondary `#5B616E` |
| Type | Geist Variable + Geist Mono only (latin, self-hosted) |
| Cards | Uniform: `rounded-2xl` + hairline border, `h-11 w-11` icon-in-tint-square repeated in TrustBar/Audiences/Trust/Marketplace/Intelligence — **the AI-slop signature** |
| Hero | Static ServiceCard mockup (timeline, ETA chip, mechanic row, CSS map, estimate) |
| Rhythm | Alternating `surface-primary`/`surface-soft` sections, 10 sections, symmetric grids everywhere |
| Quality baseline | Build ✅ · lint 0/0 ✅ · CI smoke ✅ · a11y APPROVE ✅ · Lighthouse 100/99 mobile ✅ · console 0 ✅ · Netlify live ✅ |

**Slop inventory (what the browser QA + code audit flagged):** icon-in-tinted-square across **5 sections / 6 instances** (TrustBar, Audiences, Trust, Marketplace ×2, Intelligence — sizes vary `h-9 w-9`/`h-11 w-11`); symmetric 4-col/3-col grids of identical cards; every section heading is the same eyebrow+title+lede lockup; generic pill chips (Ecosystem, Marketplace categories); uniform `rounded-2xl` card grammar everywhere; cool gray-on-white palette with zero texture; static hero mockup.

**Strengths to preserve:** token discipline (zero orphan hex), honest "Preview" labeling, custom SVG brand mark (gear/shift-gate), macro-whitespace rhythm, a11y + perf discipline, single-accent restraint, self-hosted latin fonts.

---

## 2. Direction — Warm Editorial ("welcoming but not AI slop")

Model: **Anthropic/Notion editorial warmth**, not template minimalism. Principles that make the page feel human-crafted rather than generated:

1. **Warm paper, not cold white.** Cream/off-white surfaces replace pure white + cool grays. Ink-navy text on warm paper reads like a printed journal, not a dashboard.
2. **Serif display, sans body.** A characterful variable serif (**Fraunces Variable** — warm, soft, wonky optical sizing) carries headlines; Geist stays for body/UI/labels. Literary weight, instantly not-template.
3. **Break the uniform grid.** No more 5 identical icon-in-square cards. Varied card anatomy, editorial asymmetry (2-up + feature, numbered lists, pull-quotes), hairline rules and section numerals as annotations (Linear-style "FIG" energy, editorial tone).
4. **Crafted artifacts, not clip art.** Each mock (service state, estimate, health, product) becomes a *drawn object* — paper card with hairline rules, instrument-style gauges, route diagram. Pure CSS/SVG, consistent with the brand mark's craft.
5. **Texture + depth.** Subtle paper grain (inline SVG noise data-URI), tonal depth layers, restrained shadows — the "materials" that separate craft from flat.
6. **Motion that means something.** Editorial reveals (softer, slower), one interactive hero stage, GPU-composited only, reduced-motion fully honored.
7. **Keep it honest.** All mock figures stay labeled Preview. No fake logos, no stock, no emoji, no purple gradients, no banned families.

**New visual identity in one line:** *warm paper + ink navy + the pinned blue + Fraunces serif headlines + hand-drawn CSS/SVG artifacts + editorial rule annotations.*

---

## 3. Design-Gate Updates Required (do these FIRST, before any code)

Per the gate, the following must be added to `DESIGN.md` before the corresponding tasks run:

| Update | Needed by | Content |
|---|---|---|
| §2 add **warm surface tokens** | V1 | `--surface-primary` cream paper, `--surface-soft` warm soft, `--surface-cool` warm cool, `--surface-tint` warm blue-tint, warm hairline `--border-default`; keep pinned accent + navy ink; **re-verify every contrast pair on the new values before code** (AA floor 4.5:1 / 3:1) |
| §3 add **Display Serif** + update scale + **amend the Max-2-fonts rule** | V1 | **Explicit rule change:** §3 Rules currently says "Max 2 font families (Geist + Geist Mono)… effectively one type system" — amend to 3 families (Fraunces display + Geist sans + Geist Mono), serif is display-only (never body). Add `--font-display: 'Fraunces Variable'` (self-hosted latin, same pattern as Geist/T8 — see V1 task: verify actual `files/*.woff2` names, Fraunces is multi-axis wght/opsz/SOFT/WONK); Display Hero + Section Heading rows move to serif; serif/sans pairing rule documented |
| §5 add **HeroStage (interactive)** primitive | V2 | 6-step service lifecycle, step titles + status labels reused from Workflow exactly: **Request → Searching → Accepted → En route → In progress → Completed** (the 5 API statuses are searching/accepted/en_route/in_progress/completed; "Request" is the step title with no status label — do not present it as a backend status); real `<button>` state controls + auto-advance toggle + pause-on-hover/focus; route draws + ETA updates + timeline fills per state; dedicated visually-hidden `aria-live="polite"` status region — announcements manual-only (state buttons) or throttled, so auto-advance never spams screen readers; reduced-motion = static final state, no autoplay |
| §5 add **EditorialCard** + **SectionRule** + **PaperTexture** primitives | V3 | editorial card anatomy (varied, not uniform), section numerals + hairline rule annotations, paper grain application rule (GPU-safe: static background, never animated) |
| §5 add **Editorial Quote** primitive | V3 | pull-quote testimonial treatment — serif quote, attribution, oversized opening mark |
| §6 add **editorial motion rules** | V4 | reveal timing/easing refinement (500–700ms, softer curve), artifact-draw transitions (stroke-dashoffset on SVG route), hero stage transitions (transform/opacity only); reduced-motion honored everywhere |
| §4 add **paper texture token/method** | V1 | grain application: inline SVG noise data-URI on section surfaces, never on text-bearing containers at <1.5:1 risk, no scroll-coupled effects |
| §8 debt | V7 | update the debt table (old netlify row already removed; add "illustrative figures remain labeled" note stays) |

---

## 4. Waves & Tasks

### V1 — Foundation (tokens, font, texture) · P0
- **Files:** `DESIGN.md` (gate §2/§3/§4), `src/index.css` (new tokens + `@theme` mapping + paper grain utility + base updates), `src/fonts-latin.css` (add Fraunces latin `@font-face`), `package.json` (+`@fontsource-variable/fraunces`), `index.html` (preload Fraunces woff2), **`public/privacy.html` + `public/terms.html` (their inline `:root` token blocks hardcode the current palette — update to the new warm values so the whole site stays on the DESIGN.md source of truth; the "no raw hex outside DESIGN.md tokens" gate applies to these static pages too)**
- **What:** warm palette lands; Fraunces Variable self-hosted latin-only (CSP-safe, no CDN); paper-grain utility; selection/focus colors warmed; all new tokens documented first. **Legal pages' inline `:root` blocks updated in the same wave as the token change** — never leave them silently drifted.
- **Acceptance:** DESIGN.md updated before code; every contrast pair on new surfaces measured ≥ AA; `dist/assets` gains exactly one serif latin woff2; build + lint pass; Lighthouse perf not regressed (display-font preload + font-display: swap — prevents FOIT/CLS; the LCP element is the header brand span per F2, not the headline font).
- **Verify:** `npm run build`, `npm run lint`, grep dist for woff2 set, contrast spreadsheet, Lighthouse, grep privacy/terms `:root` values match the new tokens.
- **NOTE (file naming):** Fraunces is multi-axis (wght/opsz/SOFT/WONK) — after install, list `node_modules/@fontsource-variable/fraunces/files/` and adapt the latin-only `@font-face` `src:` paths + `unicode-range` to the actual woff2 filenames (may not match `*-latin-wght-normal.woff2` exactly).

### V2 — Interactive HeroStage · P0 (the centerpiece)
- **Files:** `src/components/sections/Hero.jsx` (eager hero shell stays; stage becomes a **lazy-loaded chunk** via the existing `DeferredSection`/`lazy()` pattern so the eager hero stays light — matches the F2 code-split strategy), new `src/components/ui/HeroStage.jsx`, `DESIGN.md §5 HeroStage` (gate first)
- **What:** Replace the static ServiceCard with a live 6-state demo: **Request → Searching → Accepted → En route → In progress → Done**. The visitor clicks state buttons (or toggles auto-advance) and watches: the status timeline fill step-by-step, the CSS route map draw itself (`stroke-dashoffset`), the ETA chip count down, the mechanic card update, the estimate appear at "In progress". Displayed status labels (mapping to the real backend statuses) reused from Workflow. Serif headline, warm paper hero, form + "How it works" CTA unchanged.
- **Acceptance:** keyboard-operable (state buttons are real `<button>`s, focus ring); **dedicated visually-hidden `aria-live="polite"` status region with manual-only or throttled announcements** (auto-advance must not spam screen readers); auto-advance pauses on hover/focus and is disabled under reduced-motion (static final state shown); GPU-composited only (transform/opacity/stroke-dashoffset); CLS 0; no console errors.
- **Verify:** build + lint, Playwright interaction (click each state, keyboard walk, reduced-motion), Lighthouse (TBT/LCP within budget), visual QA 375/768/1280.

### V3 — Surfaces & cards: kill the slop · P0
- **Files:** `TrustBar.jsx`, `Audiences.jsx`, `Trust.jsx`, `Workflow.jsx`, `Testimonials.jsx`, `Marketplace.jsx`, `Intelligence.jsx`, `Ecosystem.jsx`, `SectionHeading.jsx`, `DESIGN.md §5 EditorialCard/SectionRule/EditorialQuote` (gate first)
- **What:**
  - **TrustBar** — 3 value props become a hairline-ruled editorial strip (rules + numerals, not icon-in-tint-square).
  - **Audiences** — 4 uniform cards → editorial asymmetry (e.g. 1 featured wide + 2 standard + 1 wide, or 2×2 with varied anatomy); crafted SVG motifs replace the tint-square icons.
  - **Trust** — 5 cards → editorial numbered list (Nº01–05) + the estimate as a drawn paper "document" artifact.
  - **Workflow** — 6-step rail refined: serif step numerals, finer rail, "FIG"-style status annotations (keep real vocabulary labels).
  - **Testimonials** — pull-quote editorial treatment (serif quotes, opening mark, attribution); stats strip keeps honest "illustrative" label, styled as a ruled ledger.
  - **Marketplace** — category chips → ruled catalog strip; product mock → catalog card artifact.
  - **Intelligence** — health card → instrument-style artifact (gauges/bars, hairline rules).
  - **Ecosystem** — chain diagram refined with drawn connecting strokes; hover connection highlight preserved.
  - **SectionHeading** — serif display titles; optional `numeral` + `rule` annotation props (SectionRule primitive).
- **Acceptance:** zero remaining `h-11 w-11 bg-surface-tint` icon-square repetitions; no two sections share the identical card grammar; all headings serif; every mock still labeled Preview; no new colors outside tokens; a11y landmark/heading order stays valid (h1→h2→h3); **decorative numerals/rules (e.g. Nº01–05) are `aria-hidden="true"`** (visual annotations, not content).
- **Verify:** build + lint, axe heading-order + landmarks, visual QA at 375/768/1280, browser console 0.

### V4 — Typography & texture pass · P1
- **Files:** `fonts-latin.css` (finalize), `SectionHeading.jsx`, all section headings, `src/index.css` (grain on section surfaces), `DESIGN.md §6` editorial motion (gate first)
- **What:** **Optical-size + scale refinement pass** (serif first application already happened in V2/V3 — this wave tunes it, it does not re-apply): Fraunces opsz/SOFT/WONK tuning per level (hero vs section titles vs card titles), line-height + tracking adjustments for serif optical sizes, paper grain applied to alternating surfaces, editorial reveal timing refinement.
- **Acceptance:** serif/sans pairing rule respected (no serif in body copy); grain static and GPU-safe; reveals remain IntersectionObserver + transform/opacity; reduced-motion unaffected.
- **Verify:** Lighthouse (font loading, LCP), visual QA, contrast re-check on serif text.

### V5 — Header, footer, brand warmth · P1
- **Files:** `Header.jsx`, `Footer.jsx`, `Logo.jsx`, `MobileMenu.jsx`, `PrivacyNotice.jsx`
- **What:** warm paper treatment on nav (keep glass discipline — DESIGN.md §6 "blur on fixed elements only"); footer editorial bottom bar (hairline rules, numeral); logo unchanged (mark is already brand-craft) except color-role check on new surfaces; privacy notice surface token update.
- **Acceptance:** sticky nav behavior + z-index layering unchanged (header z-50 > banner z-40); mobile menu a11y intact (Escape/focus/aria-modal); contrast re-verified on warm surfaces.
- **Verify:** build + lint, keyboard walk (F4 protocol), visual QA.

### V6 — Motion & micro-interactions · P2
- **Files:** `src/index.css`, `useReveal.js` (if needed), affected sections, `DESIGN.md §6` (gate first)
- **What:** editorial reveal easing (softer curve, 500–700ms); card hover: warm border + subtle lift (no heavy shadow); route-draw transitions in HeroStage and Ecosystem; chevron/FAQ motion stays within existing rules.
- **Acceptance:** every animation transform/opacity/filter only; reduced-motion fully honored; no slop animation added (each motion signals state or interaction).
- **Verify:** reduced-motion audit, Lighthouse (TBT), visual QA.

### V7 — Verification & launch · P2
- **What:** full protocol below; re-run F4 a11y, F2 Lighthouse, F3 visual QA against the new surface; browser-QA the interactive hero end-to-end (click all states, keyboard, reduced-motion); deploy to Netlify; verify live (headers, forms, GoatCounter, legal pages); CI green incl. smoke.
- **Acceptance:** Lighthouse 100 desktop / ≥99 mobile; a11y APPROVE; axe 0 critical; console 0; live curl checks all pass.
- **Verify:** CI run, `curl -sI` live, browser-use end-to-end.

---

## 5. Verification Protocol (every wave)

1. `npm run build` → exit 0 · `npm run lint` → exit 0
2. CI smoke job (already fail-closed) stays green on push
3. **Contrast re-measure on every new surface value** (AA floor) — the palette change is the highest a11y risk
4. Playwright / browser-use: zero console errors desktop + 390px mobile; interactive hero exercised (states, keyboard, reduced-motion)
5. Lighthouse (real Chrome via Playwright, prod build, mobile + desktop): 100/100/100/100 (mobile 99 accepted)
6. Visual QA 375 / 768 / 1280, every section, interaction states, motion driven and inspected
7. Accessibility (lane-c): keyboard walkthrough, screen-reader spot check, `prefers-reduced-motion` verified
8. **Design-gate grep:** no raw hex outside DESIGN.md tokens; no new component used 2+ times that isn't in §5; no off-base spacing; no banned families

---

## 6. Accepted Debt / Risks

| Item | Why accepted | Exit |
|---|---|---|
| Illustrative figures (stats, prices, testimonials) remain labeled Preview | Backend has no exported analytics | Replace when backend analytics exist (unchanged from prior plan) |
| Fraunces adds ~1 font file (~30–60 kB woff2) | One display face, latin-only, `font-display: swap`, preloaded | Monitor Lighthouse; drop to a lighter weight axis if perf regresses |
| Warm palette changes measured contrast pairs | New tokens chosen + verified against AA before code | Re-run F4 contrast audit at V7 |
| HeroStage adds small JS — **lazy-loaded as its own chunk** (hero shell stays eager; stage is below the fold-adjacent content loaded via the existing lazy pattern) | One small interactive chunk, GPU-composited, reduced-motion static | Keep bundle check in Lighthouse gate |
| Some editorial layouts reduce card uniformity | Intentional anti-slop choice — content-driven asymmetry over grid sameness | None (by design) |
| `public/og.png` is a navy-gradient brand card — may not match the warm identity | OG regenerated only if it looks off after the redesign lands | Regenerate OG card (rsvg-convert, same brand-geometry workflow as T7) at V7 if needed |

---

## 7. Execution Order

```
V1 foundation (tokens + font + texture) → V2 HeroStage (alone — new primitive + biggest risk)
→ V3 surfaces & cards → V4 typography/texture → V5 chrome (header/footer) → V6 motion
→ V7 full verification → deploy → review
```

Dependency notes: V2 is the only task with real risk (new interactive primitive touching Hero) — run it alone or first after V1, mirroring how T5 was handled in Wave 1. V3 is the largest visual diff but purely presentational (lowest risk). Each wave commits + pushes so CI (incl. smoke) runs continuously.
