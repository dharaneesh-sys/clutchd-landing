# ClutchD Landing — Learnings

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
