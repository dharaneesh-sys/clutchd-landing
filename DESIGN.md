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
| Surface/primary | `--surface-primary` | `#FCFAF6` | Main background — subtle cream paper (V-overhaul D5, 2026-08-15) |
| Surface/soft | `--surface-soft` | `#F8F5EE` | Alternating section fields — warm soft step above cream |
| Surface/cool | `--surface-cool` | `#F2EFE8` | Secondary button bg, subtle panels — warm cool step |
| Surface/tint | `--surface-tint` | `#F0EFF7` | Very light warm blue-tint — tint of the primary hue, warm-adjusted from `#F0F1F9` |
| Text/primary | `--text-primary` | `#0A0E3D` | Deep navy headlines + body (primary hue, L14%) — unchanged |
| Text/secondary | `--text-secondary` | `#5B616E` | Captions, hints — unchanged (contrast re-verified on warm surfaces, §8) |
| Text/ink | `--text-ink` | `#26211C` | Warm near-black — editorial pull-quotes, ledes, hero subheadline ONLY (D17, 2026-08-15) |
| Border/default | `--border-default` | `rgba(38,33,28,0.18)` | Card borders, dividers — warm ink hairline (effective 1.434:1 on cream, no regression vs prior 1.333:1) |
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

- **Display:** `Fraunces Variable` via `@fontsource-variable/fraunces` — characterful warm serif, multi-axis (wght 100–900 / opsz / SOFT / WONK), latin-only self-hosted. **Display-only: never body copy.** (V-overhaul D18, 2026-08-15)
- **Primary:** `Geist Variable` via `@fontsource-variable/geist` — premium sans, weight axis 100–900. Maps coinbase's Display/Sans/Text roles onto one variable family. The soft-skill banned generic fonts (Inter, Roboto, Arial, Open Sans, Helvetica) are excluded.
- **Mono (labels only):** `Geist Mono` via `@fontsource-variable/geist-mono` — eyebrow tags, overline, small metadata.

### Scale

| Level | Font | Size | Weight | Line Height | Tracking | Usage |
|-------|------|------|--------|-------------|----------|-------|
| Display Hero | Fraunces | 60px / 3.75rem | 600 | 1.00 | -0.02em | Hero headline (serif) |
| Display Secondary | Fraunces | 64px / 4rem | 400 | 1.00 | -0.02em | Sub-hero, section intro (serif) |
| Display Third | Fraunces | 52px / 3.25rem | 400 | 1.00 | -0.015em | Third-tier display (serif) |
| Section Heading | Fraunces | 36px / 2.25rem | 600 | 1.11 | -0.01em | Feature sections (serif) |
| Card Title | Fraunces | 32px / 2rem | 400 | 1.13 | 0 | Card headings (serif) |
| Feature Title | Geist | 18px / 1.125rem | 600 | 1.33 | 0 | Feature emphasis |
| Body | Geist | 18px / 1.125rem | 400 | 1.56 | 0 | Standard reading |
| Body Small | Geist | 16px / 1rem | 400 | 1.50 | 0 | Secondary reading |
| Button | Geist | 16px / 1rem | 600 | 1.20 | +0.16px | CTAs, nav links |
| Caption | Geist | 14px / 0.875rem | 600 | 1.50 | 0 | Metadata |
| Small | Geist Mono | 13px / 0.8125rem | 600 | 1.23 | +0.08em | Tags |
| Overline | Geist Mono | 10px / 0.625rem | 600 | 1.30 | +0.2em | Eyebrow badges, uppercase (soft-skill) |

### Rules

- **3 font families — Fraunces (display serif) + Geist (sans) + Geist Mono (labels).** [Rule amended 2026-08-15 — was "Max 2 font families".] Fraunces is **display-only**: hero h1, section titles, card titles, pull-quotes. Geist owns body/UI/labels. Geist Mono owns eyebrows/overlines/metadata. Serif never appears in body copy; sans never appears in pull-quotes.
- Numerals: **serif numerals for the stats strip** (magazine feel), **Geist Mono for prices/labels** (the "data language" — D19, 2026-08-15).
- Eyebrows keep Geist Mono overlines; serif section numerals (Nº01…) are the editorial annotation layer (D20).
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
- **States**: idle → submitting (spinner, input disabled) → success / error / duplicate. Error covers both validation and server/network failures (inline message, `--accent-danger`). Duplicate = soft-dedupe message ("You're already on the list").
- **Validation**: `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`; error message "Enter a valid email address".
- **Submission (Netlify Forms, P1)**: POST `FormData` to `window.location.pathname` with `Accept: application/json`; fields `form-name=early-access`, `email`, honeypot `bot-field` (empty string). Netlify detects the form via a hidden static form in `index.html` (`name="early-access"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`). Non-2xx or network failure → error state — never fake success.
- **Soft dedupe**: `localStorage['clutchd-signups']` array of lowercased emails; a repeat submit in the same browser → duplicate message. Per-browser only (Netlify Forms free tier has no read API for server-side dedupe).
- **Accessibility**: `<label>`, `type="email"`, `required`, `aria-describedby` for error, `aria-invalid`, `aria-live="polite"` status region.

### PrivacyNotice (dismissible banner)
- **Purpose**: transparent disclosure that the page uses GoatCounter (cookie-free analytics, no personal data). Required by the production plan (D14) — informational, not a consent gate (no cookies → no legal consent requirement).
- **Structure**: fixed bottom banner (full-width bar, `--surface-soft` + hairline top border, or tonal card with `--border-default`); short text + inline link to `/privacy.html` + dismiss button (X or "Got it").
- **States**: visible → dismissed. Dismissal persists in `localStorage['clutchd-privacy-notice-dismissed']` (per-browser); no server round-trip.
- **Accessibility**: `role="region"` + `aria-label`; dismiss is a real `<button>` with a visible focus ring; text + link at 4.5:1; banner must not cover page content on mobile (safe-area / bottom padding) and must not trap focus.
- **Motion**: fade/slide-in on mount only, `prefers-reduced-motion` respected (no animation under reduced motion).
- **Layout**: full-width bottom bar → stacks on mobile; dismiss button always reachable.

### Badge (pill tag)
- **Structure**: inline pill `<span>` — mono overline text (10px / 600 / +0.2em tracking, uppercase) + optional leading dot; `--space-3` horizontal / `--space-1` vertical padding; full pill radius.
- **Variants**: `default` (cool surface, secondary text — neutral metadata); `accent` (tint surface, accent text — branded label); `live` (cool surface, navy text + pulsing accent dot — the system's one meaningful auto animation).
- **Accessibility**: non-interactive `<span>`; the live dot is `aria-hidden="true"` (decorative).
- **Layout**: inline cluster, wraps with text flow.

### Container (page frame)
- **Structure**: centered page frame — `max-w-[80rem]` (1280px max content width, DESIGN.md §4 grid), horizontal padding from the spacing scale (16px mobile → 24px ≥640px → 32px ≥1024px), `mx-auto`.
- **Variants**: polymorphic `as` prop (default `div`; sections may pass `as="section"` etc.).
- **Layout**: single column; never introduces horizontal scroll.

### SectionHeading
- **Structure**: eyebrow (mono overline, accent, uppercase) + `<h2>` (Section Heading scale — 30/36px, weight 600, tight tracking) + optional lede (Body scale, secondary).
- **Variants**: `align="left"` (default, `max-w-2xl`) / `align="center"` (centered `max-w-2xl`).
- **Accessibility**: accepts `id` (wired to the section's `aria-labelledby`); exactly one `<h2>` per instance.

### PageShell (routing primitive) — V2, 2026-08-15
- **Structure**: header + main + footer composition shared by every route (skip link first, `id="top"` on the shell wrapper, `<main>` landmark, `<PrivacyNotice/>` last).
- **Focus management on route change**: scroll-to-top (instant, no animated scroll) + move focus to the page's `<h1>` (target gets `tabindex="-1"`). Satisfies WCAG 2.4.1 bypass + 2.4.3 focus order.
- **Layout**: every route renders inside the same shell so header/footer persist; interior pages own their `<h1>`.
- **Analytics (V7)**: GoatCounter pings `count({ path })` on every route change (BrowserRouter pushState never fires count.js's hash-poll) — skip-first-run so the initial load isn't double-counted; no-op when the beacon script is blocked.
- **Motion**: no motion on route shell itself; route content transitions are §6-gated (V6).

### RouteFallback (Suspense loading state) — V2, 2026-08-15
- **Structure**: route-level skeleton while a lazy page chunk loads — editorial, never a blank flash: mono overline "Loading" + static hairline-ruled placeholder block.
- **Motion**: static (no pulse/spinner) — the swap to content is instant; reduced-motion unaffected.
- **Layout**: `min-h-[calc(100dvh-4.5rem)]` — fills the viewport below the sticky header so the shell's footer stays below the fold while a lazy chunk loads (V7: without this, the fallback→page swap shifted the footer down, CLS 0.53 on interior routes; Home was 0 only by timing). CLS 0 on every route.

### 404 Page (catch-all route) — V2, 2026-08-15
- **Structure**: mono overline "Error 404" + serif display heading (editorial: "This page took a wrong turn.") + body copy + secondary Button → `/`.
- **Accessibility**: `<main>` landmark, one `<h1>`, descriptive link text.
- **Layout**: centered, macro-whitespace rhythm (§4).

### HeroStage (interactive) — V2, 2026-08-15
- **Purpose**: replaces the static ServiceCard mockup on Home hero (V-overhaul D2). Pure CSS/SVG craft (D4), warm paper surfaces, tokens only.
- **States**: **Request → Searching → Accepted → En route → In progress → Completed** — the 6 *displayed* step titles; the 5 backend statuses are `searching`/`accepted`/`en_route`/`in_progress`/`completed` ("Request" is a step title, never a status — reused from Workflow).
- **Behavior**: **manual-only controls (D14)** — real `<button>`s, one per state; stage sits at Request until a visitor clicks. **No auto-advance, no toggle.**
- **Content per state**: Request = step 1 + origin dot; Searching = step 2 + "Searching for verified mechanics…"; Accepted = step 3 + mechanic card (Rahul K., 4.9, Verified) + ETA 18 min; En route = step 4 + route draws further + ETA 12 min; In progress = step 5 + estimate card appears (Est. ₹1,450, labeled **Preview**) + ETA 6 min; Completed = step 6 + route fully drawn + checkmark, no ETA.
- **Accessibility**: state buttons keyboard-operable with visible focus ring; dedicated visually-hidden `aria-live="polite"` region announcing **state changes only** (manual-only — never spams a screen reader); reduced-motion = static Completed layout, no animation, no ticking.
- **Motion**: `transform`/`opacity`/`stroke-dashoffset` only — timeline fill (color/transform), SVG route draw (stroke-dashoffset), ETA chip tick (content update, opacity crossfade); 200–300ms §6 easings; GPU-composited.
- **Invitation cue (V8 — D14 intact)**: on initial mount only, a soft expanding ring pulses around the first (Request) state button — a single ambient hint that the demo is interactive. No autoplay, no auto-advance, no looping content motion. The cue disappears on the first interaction (any state click) and is `motion-reduce`-disabled (`animation: none`). §6-gated keyframe (`herostage-pulse`).
- **Layout**: same footprint as the static card it replaces (`max-w-sm`, `rounded-[2rem]` shell, hairline + warm surfaces).

### EditorialCard (V3, 2026-08-15) — anatomy pattern, never a uniform grid
- **Purpose**: the editorial card family replaces the uniform `rounded-2xl` + `h-11 w-11 tint square` grammar. Cards are **varied by design** — no two sections share the same card anatomy (V3 acceptance).
- **Anatomy options (choose per section, mix freely)**: feature card (large serif title + lede, spanning 2 grid cells), standard card (serif card title + body, hairline border), ruled card (AnnotatedList inside), artifact card (drawn object: estimate document, instrument gauge, catalog card).
- **Surface**: `--surface-primary`/`--surface-soft` with `--border-default` hairline; tonal-shift separation, minimal shadow (§7).
- **Rules**: exactly one `<h3>` per card (heading order h1→h2→h3 per page); every mock figure keeps its "Preview" label; decorative numerals/rules are `aria-hidden="true"`; icons never sit in a tint square (D7 — eliminated entirely).
- **Layout**: asymmetric grids (feature + standard mix), never 3/4 identical clones; mobile falls back to `w-full` stack below 768px (§4).
- **Interaction (V8)**: an *interactive* card (one that navigates or toggles) gets the **editorial lift** — hover border warms to `rgba(38,33,28,0.36)` (the `--border-default` hue at double alpha — same family, no new color), `hover:-translate-y-1` (4px), no shadow change (minimal-shadow §7); 200ms §6 Standard; keyboard focus uses the global ring (§8). **Informational artifacts deliberately have NO hover** — static is the designed resting state, so interactive vs informational reads as a system, not an accident (V8 acceptance: hover only where there is an interaction; never fake clickability).

### SectionRule (V3, 2026-08-15)
- **Structure**: hairline divider using `--border-default` — `border-t border-border-default`, full-width within its column, or a short rule (`w-12`-class) under a numeral/eyebrow.
- **Accessibility**: decorative only — always `aria-hidden="true"` when purely visual; the rule itself never carries text.
- **Usage**: section annotations, ledger separators, numeral + rule lockups (with SectionNumeral).

### SectionNumeral (V3, 2026-08-15)
- **Structure**: editorial annotation `Nº01`-style — serif (`font-display`), `--text-secondary`, small/medium size, `aria-hidden="true"` (visual annotation, not content — V3 acceptance).
- **Usage**: numbered editorial lists (Trust Nº01–05), step rails (Workflow), catalog ledgers (Marketplace), section numerals beside eyebrow/rule (D20).
- **Rules**: rendered only when decorative; if the number is meaningful content, it belongs in the visible text, not a numeral annotation.

### EditorialQuote (V3, 2026-08-15)
- **Structure**: pull-quote — oversized serif opening mark (typographic `“`, `font-display`, accent or secondary), serif quote body (`font-display`, `--text-ink` on light surfaces — verified AA §8), attribution block (name in sans semibold + role in mono/secondary).
- **Accessibility**: wrapped in `<blockquote>`; attribution in `<footer>` or `<cite>`; quote is real content (not aria-hidden).
- **Surface**: sits directly on the section surface with a `SectionRule` above — no enclosing card box required (breaks uniform-card grammar).
- **Layout**: `max-w-2xl`+ measure for readability; centered variant allowed for single quotes.

### AnnotatedList (V3, 2026-08-15)
- **Structure**: ruled editorial list — rows separated by `--border-default` hairlines (`divide-y divide-border-default`), each row: serif item title + optional mono annotation (right-aligned `--text-secondary`) + optional body.
- **Usage**: trust commitments (Trust), workflow rail (How-it-works), category ledger (Marketplace), intelligence item rows.
- **Accessibility**: real list semantics (`<ol>`/`<ul>` + `<li>`); decorative numerals `aria-hidden`; each row's text is content.
- **Layout**: full-width within its column; rows `py-4`-class rhythm; hover state (warm border + subtle lift, §6) only when the row is interactive.

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
- **Directional route transitions (V8)**: forward navigation (PUSH/REPLACE) slides content in from the right; back/forward-button (POP) from the left; initial page load = neutral fade. 400ms §6 Emphasis. `transform`/`opacity` only; `prefers-reduced-motion` = no transition (V8).
- **Staggered reveals (V8)**: card grids may stagger children on entry — 60–80ms per child via `transition-delay`, total ≤ 400ms. Entry-only (never on above-the-fold load-critical content); `prefers-reduced-motion` = no delay (all children appear instantly).

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

### Paper Texture (V-overhaul, 2026-08-15)

- **Method:** inline SVG noise data-URI as a static background on section surfaces (e.g. `background-image: url("data:image/svg+xml,...")` with a tiny feTurbulence fractalNoise).
- **Rules:** static only — never animated, never scroll-coupled, never GPU-animated (texture is a background, not a composited layer). Never applied to text-bearing containers where it could lower contrast below AA (grain opacity ≤ ~3–4%). Applied on alternating surfaces (primary/soft/cool) for the printed-paper feel.
- **Tokens:** no texture token needed — the data-URI lives in the `.grain` utility (src/index.css) and is applied via class.
- **Application (V8)**: keep the grain sparse — soft surfaces only (Trust, Audiences, Intelligence). The tactile register reads as a system when it is sparing; do not over-apply to `--surface-primary` sections or artifact cards.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- WCAG target: **2.2 AA** — contrast floor 4.5:1 body / 3:1 large text. Verified pairs on warm surfaces (re-verified 2026-08-15 for V-overhaul palette; all text pairs ≥ AA on every surface — primary `#FCFAF6`, soft `#F8F5EE`, cool `#F2EFE8`, tint `#F0EFF7`): navy `#0A0E3D` 16.0–17.6:1; secondary `#5B616E` 5.4–6.0:1; ink `#26211C` 13.9–15.3:1; accent `#1E29B6` 8.9–9.8:1; focus ring `#3A46DF` 5.9–6.5:1; white-on-accent (CTA label) 10.25:1; danger `#B3261E` 5.7–6.3:1. Warm hairline `rgba(38,33,28,0.18)` effective 1.434:1 on cream — decorative separator only (tonal shift is the primary separator, §7), no regression vs prior 1.333:1.
- Visible focus on every interactive element via `--accent-focus-ring`.
- Full keyboard reachability; semantic landmarks (`<nav>`, `<main>`, `<header>`, `<footer>`); labeled form inputs; `prefers-reduced-motion` respected (Section 6).
- Static screenshots cannot prove interaction/keyboard/screen-reader claims — those must be exercised in `/visual-qa` (designpowers lane-c).

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|------|----------|--------------|--------------|
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