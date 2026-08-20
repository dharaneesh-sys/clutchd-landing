# ClutchD Landing — Stripe-Grade Visual Overhaul (Revised)

**Date:** 2026-08-20 (revised after independent review)
**Status:** APPROVED — ready to execute
**Review report:** VISUAL-STRIPE-REVIEW-REPORT.md (4 Critical, 5 Major, 6 Minor findings — all addressed below)
**Vibe target:** Stripe.com — bright, airy, confident scale, dimensional gradients, glass depth, cinematic scroll
**Scope:** Palette shift, glass morphism (4 surfaces), HeroStage glass upgrade (keep interactive demo), scroll reveals, section gradients, stat counters, decorative shapes
**Constraints inherited:** Design-system gate (DESIGN.md), D4 pure CSS/SVG craft, no banned families, AA contrast, Lighthouse >=93 mobile, reduced-motion honored, honest "Preview" labels

---

## Design-System Gate Amendments (before any code)

Two existing §6 rules need targeted amendments to accommodate the glass aesthetic. These are documented here first, per the standing gate.

### Amendment A: backdrop-blur exceptions

Current §6 rule: "backdrop-blur only on fixed/sticky elements (nav, overlays) — never on scrolling content."

**Amended to:** "backdrop-blur is preferred on fixed/sticky elements (nav, overlays). Two named exceptions are permitted: (1) the HeroComposition frame (one instance, above-fold, minimal scroll exposure) and (2) the glass-on-dark footer (bottom of page, no competing scroll content). All other scrolling content must not use backdrop-blur — use translucent fill + border + shadow instead."

**Rationale:** The hero frame is the page's visual anchor and LCP element — glass blur there has maximum visual impact with minimum scroll-jank exposure (users see it before scrolling). The footer is at the page bottom with no content below it scrolling underneath. Both are single-instance, not repeatable patterns.

### Amendment B: ambient animation exceptions

Current §6 rule: "Slop animation is forbidden — motion only where it signals interaction or state."

**No amendment needed.** The revised plan cuts all infinite ambient animations (gradient-shift, node-pulse, line-flow, parallax-drift). All remaining animations signal state or interaction:
- Entrance animations signal "content arrived"
- Hover interactions signal "this is interactive"
- Scroll reveals signal "more content below"
- Stat counters signal "data is loading"

---

## 1. Palette Shift — Warm Cream to Cool White

### Token Changes

| Token | Old | New | Contrast Impact |
|-------|-----|-----|----------------|
| `--surface-primary` | `#FCFAF6` | `#F8FAFC` (slate-50) | navy on new: ~14.5:1 (PASS) |
| `--surface-soft` | `#F8F5EE` | `#F1F5F9` (slate-100) | navy on new: ~13.2:1 (PASS) |
| `--surface-cool` | `#F2EFE8` | `#E2E8F0` (slate-200) | secondary on new: ~4.8:1 (PASS) |
| `--surface-tint` | `#F0EFF7` | `#E0E7FF` (indigo-100) | secondary on new: ~4.7:1 (PASS, borderline) |
| `--text-primary` | `#0A0E3D` | `#0F172A` (slate-900) | — |
| `--text-secondary` | `#5B616E` | `#475569` (slate-600) | On tint: ~4.7:1. If below 4.5:1, use #374151 |
| `--text-ink` | `#26211C` | `#1E293B` (slate-800) | — |
| `--border-default` | `rgba(38,33,28,0.18)` | `rgba(15,23,42,0.10)` | Visible hairline, not invisible |

**CRITICAL:** After F1 ships, run a full contrast audit on every text-surface pair before any other wave. If any pair fails AA (4.5:1), adjust the token value immediately.

### New Gradient Tokens (documented in DESIGN.md §2)

| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-hero` | `linear-gradient(135deg, var(--surface-primary) 0%, var(--surface-tint) 50%, #DBEAFE 100%)` | Hero section bg |
| `--gradient-glass` | `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)` | Glass panel fill |
| `--gradient-card` | `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%)` | Artifact cards |

Note: `--gradient-hero` references `var(--surface-primary)` and `var(--surface-tint)` to stay token-aligned. The `#DBEAFE` stop is a one-off composite value documented in §2.

### Grain Recalibration

After palette shift, the `.grain` SVG noise (opacity 0.035) needs visual verification on each new surface:
- On `--surface-primary` (#F8FAFC): likely fine, cool white is neutral
- On `--surface-tint` (#E0E7FF): may need opacity reduction to 0.025 (indigo tint amplifies noise)
- On `--surface-soft` (#F1F5F9): likely fine

---

## 2. Glass Morphism System

### Glass Recipe (documented in DESIGN.md §7)

**Glass-on-light (hero frame only — the one scrolling exception):**
```
background: var(--gradient-glass)
backdrop-filter: blur(16px) saturate(180%)
border: 1px solid rgba(255,255,255,0.5)
box-shadow: var(--shadow-elevated)
border-radius: 24px
```

**Glass-on-dark (footer, mobile menu):**
```
background: rgba(15,23,42,0.85)
backdrop-filter: blur(20px) saturate(180%)
border: 1px solid rgba(255,255,255,0.1)
```

**Translucent fill (section artifacts — NO backdrop-blur):**
```
background: rgba(255,255,255,0.6)
border: 1px solid var(--border-default)
box-shadow: var(--shadow-elevated)
border-radius: 16px
```
This gives 80% of the glass look with 0% of the blur cost. Used on: TrustBar cards, Ecosystem nodes, Intelligence health card, Marketplace catalog, FAQ panels, Workflow rail, EarlyAccess CTA.

### Where Glass Goes (4 blur surfaces)

| Element | Treatment | File |
|---------|-----------|------|
| Hero composition frame | Glass-on-light (blur) — §6 Amendment A exception | Hero.jsx |
| Sticky header (scrolled) | Upgrade existing blur (already has `backdrop-blur-md`) | Header.jsx |
| Footer | Glass-on-dark (blur) — §6 Amendment A exception | Footer.jsx |
| Mobile menu | Glass-on-dark (blur) — overlay, always permitted | MobileMenu.jsx |

### Perf Guard
- `backdrop-blur` on exactly 4 elements (2 scroll, 2 fixed/overlay)
- `@supports not (backdrop-filter: blur(1px))` fallback: solid translucent bg, no blur
- Section artifacts use translucent fill only — zero blur cost

---

## 3. HeroStage Glass Upgrade (KEEP INTERACTIVE DEMO)

**The independent review found:** Replacing HeroStage with a static SVG loses the page's only product demo, breaks 8 e2e tests, and makes the page less premium. The fix: keep HeroStage, upgrade it with glass treatment.

### Hero Composition (revised)

The right column keeps HeroStage but wraps it in a richer composition:

1. **Background layer**: Gradient mesh blob — CSS `radial-gradient` with indigo/blue stops, entrance animation only (no infinite loop). `aria-hidden`.
2. **Glass frame**: Elevated frame with `--gradient-glass` fill + `backdrop-blur(16px)` + border + shadow. HeroStage fills this frame at full width (no more `max-w-sm` constraint — already removed in Wave A).
3. **HeroStage**: The existing interactive demo, unchanged functionally. It already has beautiful state transitions, keyboard accessibility, and e2e coverage.

### What Changes in HeroStage
- Remove the existing `shadow-[0_8px_24px...]` (elevation now on the glass frame)
- Step buttons get translucent fill (`bg-white/60`) instead of solid bg
- The status cards get the `--gradient-card` fill
- The map area gets a subtle gradient overlay
- The ETA chip gets a glass surface

### What Does NOT Change
- All interactive behavior (button clicks, state transitions, keyboard walk)
- All ARIA attributes (aria-expanded, aria-live, focus management)
- All e2e tests stay green — zero test changes needed

---

## 4. Scroll Effects System

### New Hook: `useScrollReveal`

Extends the existing `useReveal` to support reveal modes. Backward-compatible — existing `useReveal()` calls continue to work (default mode = fade-up).

| Mode | Effect | CSS Class |
|------|--------|-----------|
| `fade-up` | opacity 0->1, translateY 20px->0 | (default, existing behavior) |
| `fade-scale` | opacity 0->1, scale 0.95->1.0 | `reveal-scale` |
| `fade-left` | opacity 0->1, translateX -20px->0 | `reveal-left` |
| `fade-right` | opacity 0->1, translateX 20px->0 | `reveal-right` |
| `stagger` | Children enter with configurable delay | via `transition-delay` inline |

Implementation: CSS classes + IntersectionObserver. No JS animation loop. GPU-composited (transform + opacity only).

### NO Parallax in This Overhaul

The independent review flagged parallax as a perf risk (rAF + getBoundingClientRect = layout recalc). Deferred to a potential Wave F8 after F1-F7 ships and LH impact is measured. The gradient mesh blobs and ghost numerals provide enough visual depth without parallax.

---

## 5. Section-by-Section Changes

### Hero
- **Bg**: `--gradient-hero` (replaces flat `bg-gradient-to-b`)
- **Right column**: Glass frame around HeroStage (§3)
- **Subtext**: `text-xl` (already scaled in Wave A)

### TrustBar
- **Cards**: Translucent fill (`bg-white/60`) + border + shadow (no blur)
- **Icons**: h-6 w-6 (up from h-4 w-4)
- **Below**: Gradient divider line (`bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent`)

### Ecosystem
- **Bg**: Gradient mesh (radial gradients, no animation)
- **Nodes**: Translucent fill pills + accent glow on hover (no blur)
- **Arrows**: Gradient stroke (indigo to accent) on hover

### Trust
- **Estimate doc**: Translucent fill surface + stacked-paper edge (already has this from Wave C)
- **Approved stamp**: Glow ring (`ring-4 ring-accent-primary/10` — already added in Wave C)

### Intelligence
- **Health card**: Translucent fill surface + elevated shadow (no blur)
- **Gauge bars**: Gradient fills (success = green gradient, warning = amber gradient)
- **Bg**: Subtle gradient band

### Testimonials
- **Bg**: Gradient band (`bg-gradient-to-r from-surface-tint via-surface-primary to-surface-tint`)
- **Stats strip**: Animated counters (§6) with translucent card backgrounds
- **Pull-quote mark**: Gradient fill (accent-primary to accent-hover)

### Marketplace
- **Catalog strip**: Translucent fill surface
- **Catalog card**: Translucent fill + elevated shadow + gradient border on hover
- **Bg**: Subtle gradient mesh

### Workflow
- **Rail cards**: Translucent fill per step (already card-shaped from Wave C)
- **Active state**: Gradient accent glow

### FAQ
- **Expanded panels**: Translucent fill surface
- **Bg**: Gradient band

### EarlyAccess
- **Form container**: Translucent glass-style panel (bg-white/60 + border + shadow)
- **Bg**: Gradient (`from-accent-primary/5 via-surface-tint to-surface-primary`)
- **Submit button**: Gradient accent (accent-primary to accent-hover)

### Footer (Glass-on-Dark)
- **Bg**: `rgba(15,23,42,0.85)` + `backdrop-blur(20px)` (the one scrolling exception)
- **Text**: White/slate-300 on dark
- **Links**: Accent-hover on dark
- **Ghost numeral**: 0.06 opacity (slightly more visible on dark)

---

## 6. Animated Stat Counters

### Implementation (CSS-first approach)

Use CSS `@property` animation for GPU-composited counting (zero JS layout cost):

```css
@property --num {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}

.stat-counter {
  transition: --num 1.5s ease-out;
  counter-reset: num var(--num);
}

.stat-counter::after {
  content: counter(num);
}
```

When scrolled into view (IntersectionObserver), set `--num` to the target value via inline style. The CSS engine animates the custom property on the compositor thread — zero main-thread layout cost, zero rAF, zero DOM mutations.

**Fallback:** If `@property` is unsupported (older browsers), fall back to JS rAF with `font-variant-numeric: tabular-nums` to prevent width changes.

### Placement

Testimonials section stats band — 4 counters: 500+, 10k+, 18 min, 4.8 stars.

---

## 7. Decorative Shapes

### Per-Section (no animation — paint-only)

| Section | Shape | Treatment |
|---------|-------|-----------|
| Hero | Gradient mesh blob | `radial-gradient` with indigo stops, entrance-only (no loop) |
| TrustBar | Gradient divider | `h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent` |
| Ecosystem | Gradient mesh (small) | Radial gradient behind nodes |
| Intelligence | Gear outline SVG | 0.03 opacity, static |
| Testimonials | Gradient band | Full-width behind stats |
| Marketplace | Grid pattern SVG | 0.04 opacity, static |
| Workflow | Gradient timeline | Gradient stroke on rail |
| EarlyAccess | Accent glow | Radial gradient from accent at 0.06 opacity |

All shapes are `aria-hidden`, `pointer-events-none`, pure CSS/SVG. No animation.

---

## 8. Motion Catalog (revised — no ambient animations)

| Motion | Duration | Easing | Properties | Signal |
|--------|----------|--------|------------|--------|
| `glass-entrance` | 600ms | cubic-bezier(0.16,1,0.3,1) | opacity, scale(0.98->1) | "content arrived" |
| `stagger-fade-up` | 400ms | cubic-bezier(0.32,0.72,0,1) | opacity, translateY(20px->0) | "more content below" |
| `counter-tick` | 1500ms | ease-out | CSS @property integer | "data loading" |
| `glass-hover` | 200ms | cubic-bezier(0.32,0.72,0,1) | filter brightness(1.05) | "this is interactive" |
| `backdrop-entrance` | 600ms | cubic-bezier(0.16,1,0.3,1) | opacity, scale(0.98->1) | "hero arrived" (existing) |

All motion respects `prefers-reduced-motion: reduce` -> instant / no animation.

---

## 9. Implementation Order (revised)

| Wave | What | Files | Risk | Review Fix |
|------|------|-------|------|------------|
| **F1** | Palette shift + contrast audit + grain recalibration | index.css, DESIGN.md | Low | C2 fix: contrast re-measurement step |
| **F2** | Glass system: header (upgrade), footer (dark glass), mobile menu, hero frame | index.css, Hero.jsx, Header.jsx, Footer.jsx, MobileMenu.jsx | Medium | C3 fix: amend before executing |
| **F3** | HeroStage glass upgrade (keep interactive demo, restyle cards) | HeroStage.jsx, Hero.jsx | Low | C1 fix: keep HeroStage |
| **F4** | Scroll reveals (useScrollReveal with modes, applied to all sections) | hooks/useScrollReveal.js, all sections | Low | M2 fix: no parallax |
| **F5a** | Above-fold sections: TrustBar glass cards, Ecosystem glass pills, gradient shapes | TrustBar.jsx, Ecosystem.jsx | Medium | M5 fix: scoped sub-wave |
| **F5b** | Mid-page: Intelligence glass card, Testimonials gradient band | Intelligence.jsx, Testimonials.jsx | Medium | |
| **F5c** | Below-fold: Marketplace glass, Workflow glass rail, FAQ glass panels, EarlyAccess glass CTA | Marketplace.jsx, Workflow.jsx, Faq.jsx, EarlyAccess.jsx | Medium | |
| **F6** | Stat counters (CSS @property, zero JS layout) | Testimonials.jsx, index.css | Low | M5 fix: CSS-first |
| **F7** | Verification + og.png regeneration | — | — | m3 fix: concrete task |

---

## 10. Perf Guardrails (revised)

| Guard | Rule |
|-------|------|
| backdrop-blur budget | Exactly 4 elements: hero frame, header, footer, mobile menu. Section artifacts = translucent fill only (no blur). |
| New JS | 1 hook (useScrollReveal, ~30 lines, backward-compatible with useReveal). 0 new components (stat counters are pure CSS @property). |
| New fonts | Zero |
| New raster | Zero |
| Parallax | DEFERRED to Wave F8 (not in this overhaul) |
| Stat counters | CSS @property animation — GPU-composited, zero main-thread layout. JS fallback for older browsers. |
| Gradient meshes | CSS only — paint-only, no animation |
| Glass | backdrop-filter on 4 elements only; @supports fallback; section artifacts use translucent fill |
| Lighthouse | Desktop >=98, Mobile >=93 |

---

## 11. Verification Protocol

1. `npm run build` -> exit 0
2. `npm run lint` -> exit 0
3. `npm run design-gate` -> PASS (new gradient tokens + glass recipe in DESIGN.md)
4. `npm run test` -> all pass
5. `npx playwright test` -> all 64 e2e pass (HeroStage tests MUST still pass — F3 keeps it)
6. **Contrast audit after F1**: Re-measure every text-surface pair on new cool-white surfaces. Any failure -> adjust token immediately.
7. **Lighthouse** (Playwright Chromium): desktop >=98, mobile >=93
8. **Glass perf check**: TBT audit — no jank from backdrop-blur
9. **Reduced motion audit**: All animations disabled, glass keeps translucency
10. **Visual QA**: 375 / 768 / 1280 — every section, glass rendering, gradient meshes
11. **A11y**: keyboard walk, heading order, landmarks, aria-hidden

---

## 12. Accepted Debt

| Item | Why accepted | Exit |
|------|-------------|------|
| Mobile LH may dip to 87-93 | 4x backdrop-blur under throttling; bounded by design | Monitor in F7 |
| Parallax deferred | Perf risk under mobile throttling; visual depth from gradient meshes is sufficient | Wave F8 if desired |
| Tamil strings not re-checked on cool palette | Visual context changes but text is unchanged | Quick visual check after F1 |
| og.png shows warm cream | Regenerate after palette finalized | F7 concrete task |
| Glass fallback on non-GPU | @supports fallback to solid translucent bg | Graceful degradation |
