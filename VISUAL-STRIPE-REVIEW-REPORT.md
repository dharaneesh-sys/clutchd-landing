# Independent Plan Review — VISUAL-STRIPE-OVERHAUL.md

**Reviewer:** Independent design-engineer review
**Date:** 2026-08-20
**Verdict:** REJECT AS-IS — 4 Critical, 5 Major, 6 Minor issues. Plan needs revision before execution.

---

## Critical Issues (blocks execution)

### C1. Hero Replacement Breaks 8 e2e Tests and Removes the Only Product Demo

**Problem:** The plan replaces the interactive HeroStage (clickable 6-state demo with keyboard walk, focus ring tests, state transitions) with a "static SVG network diagram." This:
- Breaks 8 existing e2e tests (`e2e/herostage.spec.js`: initial state, clicking states, keyboard walk, focus ring)
- Removes the page's only hands-on product engagement moment
- The SVG network diagram with "flowing lines and pulsing nodes" is decorative, not interactive — it communicates "connected ecosystem" abstractly but doesn't show the product working
- A landing page's hero should answer "what does this product do?" — a static illustration can't do that

**Why it matters:** The HeroStage is the highest-leverage element on the page. It's what makes ClutchD feel like a real product, not a concept. Removing it makes the page *less* premium, not more.

**Fix:** Keep HeroStage but restyle it with the new glass/gradient system. The stage already works beautifully — give it a glass frame, gradient mesh backdrop, and polished card surfaces. This achieves the Stripe "dimensional product visual" look without losing interactivity. Wave F3 becomes "HeroStage glass upgrade" instead of "hero replacement." The e2e tests stay green, the product demo stays, and the visual impact comes from the glass treatment + gradient mesh behind it.

---

### C2. Palette Shift Breaks Border Contrast and Potentially Body Text Contrast

**Problem:** Two token changes have dangerous contrast implications:

1. **Border opacity drop**: Current `rgba(38,33,28,0.18)` on cream = 1.43:1 effective contrast. Proposed `rgba(15,23,42,0.08)` on cool-white = ~1.07:1 effective contrast. At 0.08 opacity, a 1px border is nearly invisible — it becomes a suggestion, not a separator. The plan says "subtler" but the design system relies on hairlines as a key depth tool (DESIGN.md §7: "hairline borders: 1px solid").

2. **Text-secondary on new surface**: Current #5B616E on #FCFAF6 = 5.4:1. Proposed #475569 on #F8FAFC = ~4.5:1 (right at the AA floor). On surface-tint (#E0E7FF), it drops to ~4.3:1 — FAILS AA for body text. The plan doesn't re-measure any contrast pairs on the new surfaces.

**Why it matters:** AA compliance is non-negotiable (DESIGN.md §8). A 0.08 opacity border makes the design look broken — sections have no visible separation. Failing AA on body text is a legal/accessibility issue.

**Fix:**
- Border: keep `rgba(15,23,42,0.12)` minimum (not 0.08). Better: `rgba(15,23,42,0.10)` — still subtler than current 0.18, but visible.
- Text-secondary: use `#475569` (slate-600) on primary/soft, but on tint surfaces use `#374151` (slate-700, ~5.2:1 on indigo-100). Or: keep #475569 but ensure tint surface is light enough (#E0E7FF = 91.5% L, contrast ~4.7:1 — borderline but passing). Add a note to §8 that all pairs must be re-measured on the new surfaces.
- Add a **contrast re-measurement step** to Wave F1 (before anything else ships).

---

### C3. Glass on Scrolling Content Violates DESIGN.md §6

**Problem:** DESIGN.md §6 explicitly states: "backdrop-blur only on fixed/sticky elements (nav, overlays) — never on scrolling content." The plan puts backdrop-blur on:
- Hero composition frame (scrolls with the page)
- Footer (scrolls with the page)

This is a direct design-system gate violation. The gate exists because backdrop-blur on scrolling content causes:
- GPU compositor overhead on every scroll frame
- Visual inconsistency (blur changes as background content scrolls underneath)
- Jank on low-end mobile devices

**Why it matters:** The design-system gate is the project's quality contract. Violating it in a plan that claims to follow it undermines the entire governance model.

**Fix:** Two options:
- **Option A (recommended):** Amend §6 to allow backdrop-blur on "the hero composition frame (one instance) and glass-on-dark footer (one instance)" as named exceptions. Document why these two are acceptable (hero = above-fold LCP element, minimal scroll exposure; footer = bottom of page, no competing scroll content). Keep the general rule for everything else.
- **Option B:** Replace hero glass with the existing elevated shadow + translucent fill (no blur). This preserves the §6 rule but loses the glass effect on the most visible element.

Either way, the plan must explicitly acknowledge and resolve this conflict before execution.

---

### C4. Ambient Animations Violate "Slop Animation Forbidden"

**Problem:** DESIGN.md §6 says: "Slop animation is forbidden — motion only where it signals interaction or state." The plan proposes:
- `gradient-shift`: 20s infinite `hue-rotate` loop on hero blob — decorative, doesn't signal state
- `node-pulse`: 2s infinite scale pulse on ecosystem nodes — decorative
- `line-flow`: 3s infinite `stroke-dashoffset` on network SVG — decorative
- `parallax-drift`: continuous scroll-coupled movement — ambient

These are textbook "slop animation" — continuous ambient motion that doesn't communicate anything. They violate the project's core motion philosophy.

**Why it matters:** The design system explicitly banned this. If we allow ambient animation, where do we draw the line? Every section could have a "subtle" ambient effect, and the page becomes a Las Vegas strip.

**Fix:** Cut all infinite ambient animations. Keep only:
- Entrance animations (glass-entrance, backdrop-entrance) — these signal "content arrived"
- Hover interactions (glass-hover) — these signal "this is interactive"
- Scroll reveals (stagger-fade-up) — these signal "more content below"
- The hero blob can have a single entrance animation (scale + opacity on mount) but NOT a continuous loop
- Ecosystem nodes pulse ONLY on hover (interaction signal), not continuously
- Network lines draw on mount (one-shot stroke-dashoffset animation), not loop

This reduces the motion catalog from 8 to ~5, all of which are defensible under §6.

---

## Major Issues (should fix before starting)

### M1. backdrop-blur Budget is Under-Counted

**Problem:** The plan says "≤4 simultaneous blurred elements" but the section-by-section restructure (§5) implies glass on many more surfaces:
- TrustBar cards ("each value prop gets a glass card")
- Ecosystem nodes ("glass pills with backdrop-blur(8px)")
- Intelligence health card ("glass surface, backdrop-blur(12px)")
- Marketplace catalog strip ("glass surface with frosted categories")
- FAQ accordion panels ("glass surface on expanded answers")
- EarlyAccess form container ("glass panel")

That's potentially 10+ simultaneous blurred surfaces during scroll. The "≤4" guardrail in §10 contradicts the ambitions in §5.

**Fix:** Either limit glass to the 4 designated surfaces (hero frame, header, footer, mobile menu) and use translucent-fill-only (no blur) for section artifacts, or increase the budget and accept the perf cost. The former is safer — translucent white fill + border + shadow gives 80% of the glass look with 0% of the blur cost.

---

### M2. useParallax Adds Meaningful Main-Thread Work

**Problem:** The plan says "rAF-throttled to 30fps on mobile" but doesn't address:
- The rAF callback reads `getBoundingClientRect()` on every frame — this triggers layout recalc
- Multiple parallax elements mean multiple layout reads per frame
- On mobile (where LH is already 85-94), adding layout reads during scroll is exactly what causes TBT spikes

The plan's own §10 says "New JS = 1 hook (~40 lines)" — but the parallax hook needs to be carefully optimized to not regress LH.

**Fix:** Use `transform: translate3d()` with CSS custom properties set by the observer, not rAF. The observer updates `--parallax-y` on the element, and CSS `transform: translateY(var(--parallax-y))` handles the rest. This moves the actual transform to the compositor thread. Alternatively, defer parallax to a "Wave F8" and keep F4 focused on scroll reveals only.

---

### M3. F2 (Glass) and F3 (Hero) Have Wasted Work

**Problem:** F2 applies glass to "hero composition frame" (Hero.jsx). F3 replaces the hero entirely. The glass work in F2 gets thrown away when F3 rebuilds the hero.

**Fix:** Either:
- Merge F2+F3 into one wave (apply glass to the hero as part of the hero upgrade)
- Or: F2 applies glass to header, footer, mobile menu only (not hero). F3 applies glass to hero as part of its restructure.

---

### M4. Grain Texture Needs Opacity Recalibration

**Problem:** The `.grain` overlay uses `opacity="0.035"` on the SVG noise, tuned for warm cream (#FCFAF6). On cooler surfaces (#F8FAFC, #F1F5F9), the noise may read differently:
- On cooler whites, the warm noise may look slightly yellow/muddy
- The lower-luminance tint surfaces (#E0E7FF) may make the noise more visible

The plan doesn't mention recalibrating the grain for the new palette.

**Fix:** After F1 palette shift, visually verify the grain on every surface. Likely need to:
- Reduce grain opacity to 0.025 on tint surfaces
- Possibly shift the noise color to cool (the SVG feTurbulence is color-neutral, but the surrounding surface color affects perception)
- Add this as a task in F1

---

### M5. Stat Counters Add Layout Reflow

**Problem:** `<StatCounter>` updates `textContent` on every animation frame for 1500ms. Each update triggers:
- DOM text mutation
- Potential layout recalc (text width changes as numbers grow)
- Paint

With 4 counters running simultaneously (the stats strip), that's 4 DOM mutations per frame for 1500ms = ~90 frames × 4 = 360 layout-triggering mutations during scroll.

**Fix:** Use a `<span>` with `font-variant-numeric: tabular-nums` (Geist already supports this) so number width doesn't change during counting. Pre-calculate the final width and set `min-width` to prevent layout shift. Or: use CSS `counter()` with `@property` animation (GPU-composited, zero JS layout cost). The CSS approach is better but limited formatting options.

---

## Minor Issues (nice to fix)

### m1. Header Already Has Backdrop-Blur

The plan's F2 says "apply glass to sticky header" — but the header already has `backdrop-blur-md` in its scrolled state. F2 should document this as "upgrade existing blur" not "add new glass."

### m2. Footer Already Has Dark Background

Footer currently uses `bg-surface-soft` (#F8F5EE). The plan changes it to `bg-[rgba(15,23,42,0.85)] backdrop-blur(20px)`. This is a dark-surface change, not just a glass addition. The plan should acknowledge this changes the footer from light to dark — a significant visual shift that affects every footer element's color.

### m3. og.png Not Addressed

The og.png still shows warm cream. After palette shift, it will look mismatched. The plan mentions it in "Accepted Debt" but should have a concrete task to regenerate it.

### m4. F5 Scope is Enormous

F5 "Section restructure" touches every section file (10+ files). This should be broken into sub-waves: F5a (above-fold sections: TrustBar, Ecosystem), F5b (mid-page: Trust, Intelligence, Testimonials), F5c (below-fold: Marketplace, Workflow, FAQ, EarlyAccess).

### m5. Tamil Strings May Reference Old Colors

Some Tamil strings (and English) contain layout-dependent text. The palette shift doesn't change text content, but the visual context changes. No action needed, but worth a visual check with `?lang=ta` after F1.

### m6. Gradient Tokens Use Raw Hex in Values

The gradient tokens (`--gradient-hero`, `--gradient-glass`, `--gradient-card`) contain raw hex values and rgba. This conflicts with the design-system gate (no raw color outside tokens). The gradient values should reference existing tokens where possible, or be documented as composite tokens in §2.

---

## Prioritized Action List (Top 10 Changes)

1. **Keep HeroStage** — restyle with glass/gradient instead of replacing (fixes C1, saves 8 e2e tests)
2. **Amend §6** to allow backdrop-blur on hero frame + glass footer as named exceptions (fixes C3)
3. **Cut all infinite ambient animations** — keep only entrance, hover, scroll-reveal (fixes C4)
4. **Fix border opacity** to minimum 0.10 (not 0.08), re-measure all contrast pairs on new surfaces (fixes C2)
5. **Limit blur to 4 surfaces** — section artifacts get translucent fill only, no backdrop-blur (fixes M1)
6. **Merge F2+F3** or resequence to avoid wasted hero glass work (fixes M3)
7. **Defer parallax to Wave F8** — F4 focuses on scroll reveals only (fixes M2)
8. **Add contrast re-measurement step** to F1 before any other wave ships (fixes C2)
9. **Break F5 into sub-waves** (F5a/F5b/F5c) for manageable scope (fixes m4)
10. **Add og.png regeneration** as a concrete task in F7 (fixes m3)

---

## Revised Wave Structure (after applying fixes)

| Wave | What | Risk |
|------|------|------|
| **F1** | Palette shift + contrast re-measurement + grain recalibration | Low |
| **F2** | Glass system: header (upgrade), footer (dark glass), mobile menu, hero frame (amend §6) | Medium |
| **F3** | HeroStage glass upgrade + gradient mesh backdrop (keep interactive demo) | Low |
| **F4** | Scroll reveals (useScrollReveal with modes) — no parallax yet | Low |
| **F5a** | Above-fold sections: TrustBar glass cards, Ecosystem glass pills | Medium |
| **F5b** | Mid-page: Trust glass estimate, Intelligence glass card, Testimonials counters | Medium |
| **F5c** | Below-fold: Marketplace glass, Workflow glass rail, FAQ glass panels, EarlyAccess glass CTA | Medium |
| **F6** | Animated stat counters (CSS @property approach, not JS rAF) | Low |
| **F7** | Verification + og.png regeneration | — |
| **F8** (deferred) | Parallax + ambient effects (if desired after seeing F1-F7 result) | — |
