# ClutchD Landing Design System

## 0. Research Log

- Embedded refs: shortlisted [coinbase, stripe, linear.app] from `_INDEX.md` → picked [soft-skill (Layer A) + coinbase (Layer B)] because the brief is a premium, trust-first on-demand vehicle-service landing on a light canvas with a single blue accent — coinbase's blue-and-white institutional fintech grammar is the closest shipped analogue, and soft-skill supplies the high-craft execution discipline (double-bezel surfaces, pill CTAs, macro-whitespace, custom-bezier motion).
- Lazyweb: 4 queries run verbatim via the recipe's `lw` function ("on-demand mechanic service booking", "roadside assistance emergency towing", "auto parts marketplace ecommerce", "fleet management vehicle tracking dashboard"), 8 screens downloaded and VIEWED (yourmechanic, wrench, progressive, geico, partstech, roadster, atom-mobility, fleetmatics) → layout grammar harvested: horizontal top nav with a single right-aligned pill CTA that mirrors the hero CTA; two-column hero (text left, product visual right) or centered text over a full-width image with a dark overlay; inline form field + CTA inside the hero; 3-column value-prop trust strip directly below the hero; 3-column icon+title+description feature grids; zigzag alternating feature sections; FAQ accordion; generous whitespace with open hero area. Grammar only — no pixel copies, no marketing copy.
- Designpowers: read `designpowers/README.md` + `lane-c-review.md` → takeaways: review must be anchored on objective `/visual-qa` evidence before design judgment; accessibility outranks aesthetics, usability outranks style; every Critical/Major finding needs a repair decision; Minor findings defer to debt tracking; static screenshots cannot prove interaction/keyboard/screen-reader claims (label them inferred).
- Perfection: read `perfection/README.md` → performance rules adopted: real-browser Lighthouse 100 (mobile + desktop) via Playwright Chromium, never the CLI; win scores in architecture (bundle, font loading, image pipeline, critical CSS); GPU-composited animation only (`transform`/`opacity`/`filter`); `backdrop-blur` only on fixed/sticky elements; `content-visibility: auto` for offscreen sections; preload the LCP asset; never weaken UX to buy points.
- Skipped lanes: imagen concept drafts — no image-generation model on this machine (DeepSeek-only); the hero focal object will be built as CSS/SVG dimensional art instead of a generated bitmap.

## 1. Atmosphere & Identity

A calm, institutional-grade service marketplace that feels like a bank you trust with your car. Light-first: white and cool blue-gray fields carry the page, deep navy carries the words, and a single saturated blue — the pinned `#1E29B6` — is reserved for the moments that matter: the primary CTA, active links, and focus. The signature is **the blue pill on a light field**: every conversion surface is a fully-rounded, machined pill button whose hover deepens the same hue, so the eye always knows where the next action lives. Sections breathe at macro-whitespace scale (96–160px), surfaces separate by tonal shift and hairline borders rather than heavy shadow, and the hero pairs a left-aligned headline with a dimensional product visual on the right — the one moment a visitor remembers is the primary pill CTA sitting inside the hero next to an inline early-access email field.

## 2. Color

### Palette

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Surface/primary | `--surface-primary` | `#FFFFFF` | Main background (coinbase pure white) |
| Surface/soft | `--surface-soft` | `#F7F7F7` | Alternating section fields (coinbase light surface) |
| Surface/cool | `--surface-cool` | `#EEF0F3` | Secondary button bg, subtle panels (coinbase cool gray surface) |
| Surface/tint | `--surface-tint` | `#F0F1F9` | Very light blue canvas — tint of the primary hue (derived from `#1E29B6`, L96%) |
| Text/primary | `--text-primary` | `#0A0E3D` | Deep navy headlines + body (primary hue, L14%) |
| Text/secondary | `--text-secondary` | `#5B616E` | Captions, hints (coinbase muted blue) |
| Border/default | `--border-default` | `rgba(91,97,110,0.2)` | Card borders, dividers (coinbase muted blue @ 20%) |
| Accent/primary | `--accent-primary` | `#1E29B6` | CTAs, links, focus — **user-pinned 2026-08-11** |
| Accent/hover | `--accent-hover` | `#192295` | Hover state — same hue, darker (derived, L34%) |
| Accent/active | `--accent-active` | `#131B76` | Active/pressed state — same hue, darker (derived, L27%) |
| Accent/focus-ring | `--accent-focus-ring` | `#3A46DF` | Focus ring — lighter tint of the same hue (derived, L55%, 6.7:1 on white) |
| Depth/navy-1 | `--depth-navy-1` | `#0D124F` | Deep navy depth layer (primary hue, L18%) |
| Depth/navy-2 | `--depth-navy-2` | `#111869` | Deeper navy depth layer (primary hue, L24%) |
| Status/success | `--status-success` | `#1B7F4D` | Success/positive states — tokenized exception to the banned green family (muted green, same-hue discipline) |

### Rules

- **Banned families — never used anywhere:** gold (`#b8860b`/`#d4a011`), orange (`#f97316`/`#ea580c`), brown, green (`#10b981`/`#059669`), and black-first/dark-first direction. This is a light-first system; the only dark values are the navy text and navy depth layers above.
- Success/positive states use `--status-success` only — the single tokenized exception to the banned green family. Never use a raw green.
- Accent blue is functional only — CTAs, links, focus. Never decorative (coinbase do/don't).
- Surface hierarchy creates depth through tonal shift (white → soft → cool → tint) plus hairline borders; shadows stay minimal (coinbase minimal-shadow system).
- Never introduce a color not in this table. Extend the table first.

## 3. Typography

### Font Stack

- **Primary:** `Geist Variable` via `@fontsource-variable/geist` — premium sans, weight axis 100–900. Maps coinbase's Display/Sans/Text roles onto one variable family. The soft-skill banned generic fonts (Inter, Roboto, Arial, Open Sans, Helvetica) are excluded.
- **Mono (labels only):** `Geist Mono` via `@fontsource-variable/geist-mono` — eyebrow tags, overline, small metadata.

### Scale

| Level | Font | Size | Weight | Line Height | Tracking | Usage |
|-------|------|------|--------|-------------|----------|-------|
| Display Hero | Geist | 60px / 3.75rem | 600 | 1.00 | -0.02em | Hero headline (coinbase display) |
| Display Secondary | Geist | 64px / 4rem | 400 | 1.00 | -0.02em | Sub-hero, section intro |
| Display Third | Geist | 52px / 3.25rem | 400 | 1.00 | -0.015em | Third-tier display |
| Section Heading | Geist | 36px / 2.25rem | 600 | 1.11 | -0.01em | Feature sections |
| Card Title | Geist | 32px / 2rem | 400 | 1.13 | 0 | Card headings |
| Feature Title | Geist | 18px / 1.125rem | 600 | 1.33 | 0 | Feature emphasis |
| Body | Geist | 18px / 1.125rem | 400 | 1.56 | 0 | Standard reading |
| Body Small | Geist | 16px / 1rem | 400 | 1.50 | 0 | Secondary reading |
| Button | Geist | 16px / 1rem | 600 | 1.20 | +0.16px | CTAs, nav links |
| Caption | Geist | 14px / 0.875rem | 600 | 1.50 | 0 | Metadata |
| Small | Geist Mono | 13px / 0.8125rem | 600 | 1.23 | +0.08em | Tags |
| Overline | Geist Mono | 10px / 0.625rem | 600 | 1.30 | +0.2em | Eyebrow badges, uppercase (soft-skill) |

### Rules

- Max 2 font families (Geist + Geist Mono) — both from the same family, so effectively one type system.
- Body text never below 14px.
- Headings that wrap to 4+ lines are too large — use `clamp()`.
- Display headings use ultra-tight 1.00 line-height (coinbase signature).
- Shipped values are authoritative (verified 2026-08-13).

## 4. Spacing & Layout

### Base Unit

Base unit **4px**; scale follows coinbase's 8px-based steps (all multiples of 4).

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight: icon-to-label |
| `--space-2` | 8px | Compact: list items, inline groups |
| `--space-3` | 12px | Default: form field padding |
| `--space-4` | 16px | Standard: card padding |
| `--space-5` | 20px | Comfortable: section inner spacing |
| `--space-6` | 24px | Generous: card padding (default) |
| `--space-8` | 32px | Separated: between card groups |
| `--space-10` | 40px | Sections within a page |
| `--space-12` | 48px | Major section breaks |
| `--space-16` | 64px | Page-level vertical rhythm |
| `--space-24` | 96px | Hero + section padding (soft-skill macro-whitespace floor) |
| `--space-40` | 160px | Maximum section separation (soft-skill `py-40`) |

### Grid

- Max content width: **1280px**.
- Column system: 12-column, 24px gutter, 16px margin at mobile.
- Breakpoints (coinbase): 400px, 576px, 640px, 768px, 896px, 1280px, 1440px, 1600px.
- Mobile override (soft-skill): any asymmetric layout above `md:` falls back to `w-full`, `px-4`, `py-8` below 768px. Never `h-screen` — always `min-h-[100dvh]`.

### Rules

- Tokenize design *intent*; keep browser mechanics raw (`clamp()`, `minmax()`, viewport units).
- Asymmetric spacing is intentional — hero and section rhythm use the macro scale (96–160px) while card interiors use the micro scale (16–24px).

## 5. Components

### Button (pill)
- **Structure**: `<button>` with label; optional trailing icon nested in its own circular wrapper flush with the right inner padding (soft-skill button-in-button).
- **Variants**: primary (accent `#1E29B6`), secondary (cool `#EEF0F3`), ghost (transparent + hairline border).
- **Spacing**: `--space-6` horizontal, `--space-3` vertical.
- **Radius**: 56px pill (coinbase); full pill for icon-only.
- **States**: default → hover `--accent-hover` `#192295` → active `--accent-active` `#131B76` + `scale(0.98)` (soft-skill magnetic press) → focus `--accent-focus-ring` `#3A46DF` ring → disabled (60% opacity, no shadow) → loading (spinner, label preserved).
- **Accessibility**: real `<button>`, visible focus ring, 4.5:1 label contrast.
- **Motion**: 200ms custom cubic-bezier(0.32, 0.72, 0, 1) on background + transform only.
- **Layout**: inline cluster; never full-width except mobile form submit.

### Nav (floating pill)
- **Structure**: sticky top bar, light glass (`backdrop-blur` on this fixed element only), hairline bottom border, logo left, links center, pill CTA right.
- **States**: hover on links (navy → accent), CTA mirrors hero CTA (lazyweb grammar).
- **Accessibility**: `<nav>` landmark, skip link, keyboard reachable.
- **Motion**: 200ms ease-out color transitions; no scroll-jacking.
- **Layout**: cluster; collapses to hamburger below 768px.

### Hero
- **Structure**: two-column — left: overline badge + display headline + subheadline + inline early-access email field + pill CTA; right: dimensional product visual (CSS/SVG art with light, gradient, depth — never flat primitives).
- **States**: form field focus ring `--accent-focus-ring`; submit button loading state.
- **Accessibility**: `min-h-[100dvh]`, semantic `<h1>`, labeled email input.
- **Motion**: entry fade-up `translate-y-16 blur-md → 0` over 800ms+ (soft-skill), staggered.
- **Layout**: grid; collapses to single column below 768px (text on top, visual below).

### Trust Bar
- **Structure**: 3 value props in a horizontal row directly below the hero (lazyweb grammar).
- **Spacing**: `--space-8` between items.
- **Layout**: 3-column grid → 1-column stack below 768px.

### Feature Card
- **Structure**: icon + title + description; double-bezel nested architecture (outer shell with hairline border + inner core with inset highlight — soft-skill).
- **Variants**: standard, featured (tint surface `#F0F1F9`).
- **Radius**: outer `2rem`, inner `calc(2rem - 0.375rem)` (soft-skill concentric curves).
- **States**: hover lifts via tonal shift (no heavy shadow).
- **Layout**: 3-column grid → 1-column below 768px.

### Alternating Feature Section
- **Structure**: zigzag — visual left/text right, then reversed (GEICO grammar).
- **Layout**: 2-column grid → stacked below 768px.

### FAQ Accordion
- **Structure**: `<button>` disclosure headers + panels (GEICO grammar).
- **States**: expanded/collapsed with chevron rotation; focus ring visible.
- **Accessibility**: proper `aria-expanded`/`aria-controls`, keyboard operable.
- **Motion**: 250ms height/opacity via transform+opacity only.

### Testimonial Card
- **Structure**: quote + name + role + star rating (5-star row, filled stars in accent).
- **Surface**: tonal-shift surface (`--surface-soft` / `--surface-cool`) with hairline border (`--border-default`).
- **Spacing**: `--space-6` padding.
- **Layout**: grid; 1-column stack below 768px.

### Stats Strip
- **Structure**: number + label pairs in a horizontal row (lazyweb trust grammar).
- **Numerals**: Geist Mono for the numbers (mono numerals).
- **Surface**: tonal-shift surfaces (alternating section field).
- **Spacing**: `--space-8` between items.
- **Layout**: responsive row → 1-column stack below 768px.

### EarlyAccessForm (shared)
- **Source**: extracted from `EarlyAccess.jsx` (closing CTA section); shared by hero and section variants.
- **Variants**: `variant="hero"` — inline, compact, inside the hero; `variant="section"` — full, current closing CTA layout.
- **States**: idle → submitting (spinner, input disabled) → success (confirmation text) / error (inline message, `--status-error`).
- **Validation**: `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`; error message "Enter a valid email address".
- **Accessibility**: `<label>`, `type="email"`, `required`, `aria-describedby` for error, `aria-invalid`, `aria-live="polite"` status region.
- **Debt**: client-side only — no backend (see Section 8).

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100–150ms | ease-out | Button press, toggle |
| Standard | 200–300ms | cubic-bezier(0.32, 0.72, 0, 1) | Panel open, nav, hover states (soft-skill) |
| Emphasis | 400–600ms | cubic-bezier(0.16, 1, 0.3, 1) | Page transition, hero entry |
| Scroll reveal | 800ms+ | cubic-bezier(0.32, 0.72, 0, 1) | Fade-up `translate-y-16 blur-md → 0` (soft-skill) |

### Rules

- Only animate `transform` and `opacity` (and `filter` for blur). Never layout properties.
- Every interactive element has hover + active + focus states.
- Scroll-triggered reveals use `IntersectionObserver`, never scroll listeners.
- `backdrop-blur` only on fixed/sticky elements (nav, overlays) — never on scrolling content.
- `prefers-reduced-motion`: disable non-essential animation.
- Slop animation is forbidden — motion only where it signals interaction or state.

## 7. Depth & Surface

### Strategy: mixed — tonal-shift + hairline borders + minimal shadows

Coinbase's depth comes from color contrast between sections with a minimal shadow system; soft-skill adds the double-bezel nested architecture. Combined:

- **Tonal shift** is the primary separator: white → soft `#F7F7F7` → cool `#EEF0F3` → tint `#F0F1F9` section fields.
- **Hairline borders**: `1px solid rgba(91,97,110,0.2)` on cards and panels (coinbase).
- **Minimal shadows** reserved for elevation moments only:

| Level | Value | Usage |
|-------|-------|-------|
| Subtle | `0 1px 2px rgba(13,18,79,0.04)` | Cards at rest |
| Default | `0 2px 8px rgba(13,18,79,0.08)` | Floating pill nav, dropdowns |
| Prominent | `0 8px 24px rgba(13,18,79,0.12)` | Modals, overlays |

- **Double-bezel** (soft-skill): major cards and the hero visual use an outer shell (hairline border, `p-1.5`, `rounded-[2rem]`) wrapping an inner core (own background, inset highlight `inset 0 1px 1px rgba(255,255,255,0.15)`, concentric radius).
- **Navy depth layers** `#0D124F` / `#111869` give the hero visual and section accents their dimensional weight — never black.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- WCAG target: **2.2 AA** — contrast floor 4.5:1 body / 3:1 large text. Verified pairs: navy `#0A0E3D` on white 18.4:1; secondary `#5B616E` on white 6.2:1; accent `#1E29B6` on white 8.6:1; focus ring `#3A46DF` on white 6.7:1.
- Visible focus on every interactive element via `--accent-focus-ring`.
- Full keyboard reachability; semantic landmarks (`<nav>`, `<main>`, `<header>`, `<footer>`); labeled form inputs; `prefers-reduced-motion` respected (Section 6).
- Static screenshots cannot prove interaction/keyboard/screen-reader claims — those must be exercised in `/visual-qa` (designpowers lane-c).

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|------|----------|--------------|--------------|
| Early-access form has no backend (client-side only) | Hero + closing CTA form | Landing is a static Vite SPA; no API exists yet in this wave | T3+ wires a mailto/endpoint or a real submission path |
| Tamil locale not covered | Whole page | Product targets Tamil users but i18n is out of scope for the landing wave | Future i18n pass (T17+ or post-launch) |
| No links to the live app (tailnet) yet | Nav + CTAs | Live app URL not provisioned for this landing | Add link when the tailnet app URL is stable |

---

*Token sources: coinbase.md (Layer B) for palette structure, pill radius, type scale, spacing scale, minimal-shadow depth; soft-skill.md (Layer A) for double-bezel surfaces, macro-whitespace, button-in-button, custom-bezier motion, scroll reveals; pinned decisions (2026-08-11) for PRIMARY `#1E29B6`, light canvas, deep navy, and the banned color families. Derived shades are same-hue HSL steps of `#1E29B6`.*

---

## 2026-08-13 — Design-system gate update

First task of the IMPROVEMENTS.md plan: no code may use a token/primitive before it is documented here.

- **§2 Color**: added `--status-success` (`#1B7F4D`) — success/positive states tokenized explicitly. Green stays banned as a family; this is the single tokenized exception (same-hue discipline, derived from a muted green — not `#10b981`/`#059669`). Counterpart to the existing `--accent-danger` error token.
- **§3 Typography**: resolved spec-drift — Display Hero and Section Heading rows updated to shipped CSS values (Hero 60px/600, SectionHeading 36px/600). Shipped values are authoritative (verified 2026-08-13). Note: the task brief said "60px / 5rem"; 60px = 3.75rem, so the row documents `60px / 3.75rem` to avoid introducing a new drift.
- **§5 Components**: added Testimonial Card and Stats Strip primitives (needed by T4); renamed Early-Access Form → **EarlyAccessForm (shared)** with `variant` prop (`hero`/`section`), states, `aria-live` region, and validation regex (needed by T5). FAQ Accordion and Trust Bar left as-is.