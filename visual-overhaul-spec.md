# ClutchD Landing — Visual Overhaul Spec (fleshed-out)

**Status:** EXECUTED (V1–V8, 2026-08-15 → 2026-08-16) — all waves landed + pushed; live deploy verified. Amendments below marked (V7). **Base plan:** `VISUAL-IMPROVEMENTS.md` · **Scope:** `~/clutchd-landing`
**This spec supersedes the single-page assumptions in `VISUAL-IMPROVEMENTS.md` where they conflict — the site is now a multi-page application.**

---

## 0. Decisions Record (from interview + delegated "your wish" calls)

### User-confirmed (interview)

| # | Decision | Value |
|---|---|---|
| D1 | Art direction | **Warm editorial** (Anthropic/Notion warmth, not template minimalism) |
| D2 | Hero focal | **Interactive HeroStage** (rebuild the static ServiceCard) |
| D3 | Change appetite | **Full overhaul allowed** (new tokens, serif display type, new surfaces) |
| D4 | Imagery | **Pure CSS/SVG craft** — no raster, no generated images |
| D5 | Paper warmth | **Subtle cream** (`~#FCFAF6`-class). Barely-there warmth; safest contrast; premium paper feel |
| D6 | Accent blue | **Keep `#1E29B6` exactly as-is** (pinned 2026-08-11) — warmth comes from the paper, not the accent |
| D7 | Tint squares | **Eliminate entirely** — the `h-11 w-11 bg-surface-tint` icon-square (5 sections / 6 instances) is the primary AI-slop signature |
| D8 | Serif scope | **All display type** — hero h1, section titles, card titles, pull-quotes |
| D9 | Site size | **Full site: 5+ pages** |
| D10 | Content depth | **Real content, honest mocks** — substantive copy per page; "Preview" labeling stays for all mock figures |
| D11 | Routing | **React Router** (add `react-router-dom` — new dependency, URL paths like `/marketplace`) |
| D12 | Navigation | **Sticky header + expanded footer** (footer becomes full sitemap) |
| D13 | Animation appetite | **Page transitions + reveals** — smooth fade/slide route transitions + existing scroll reveals + interactive hero. Tasteful, GPU-composited, reduced-motion honored |
| D14 | HeroStage behavior | **Auto-advance OFF (manual only)** — stage sits at "Request" until the visitor clicks a state; zero surprise motion |
| D15 | SPA fallback | **Yes** — add `public/_redirects` (rewrite to index.html) + extend CI smoke to assert a deep link returns 200 |
| D16 | Bundle strategy | **Route-level code-splitting** — `lazy()` every route (extends the F2 discipline); Home stays the entry |

### Delegated to me ("your wish") — decisions + rationale (review at execution)

| # | Decision | Rationale |
|---|---|---|
| D17 | **Ink: mixed-ink system** — headlines stay deep navy `#0A0E3D`; add ONE new token `--text-ink` (warm near-black `~#26211C`-class) for editorial pull-quotes, lede moments, and the hero subheadline only | Keeps the brand's navy voice for headlines; warm ink gives the printed-journal feel without abandoning the identity. Limited scope keeps contrast work small |
| D18 | **Serif: Fraunces Variable** (primary), Newsreader as the documented fallback | Fraunces is the most characterful/warm — the strongest "not AI" signal (wonk + optical-size axes). Heaviest candidate (~1.9MB package; latin woff2 ~60–90kB) — if Lighthouse budget fails, fall back to Newsreader (~1.3MB, literary, lighter). Decision re-verified at V1 install |
| D19 | **Numerals: serif for the stats strip, mono for prices/labels** | Editorial serif numerals give the stats a magazine feel; Geist Mono stays as the "data language" for prices/figures so the technical contrast survives |
| D20 | **Eyebrows: keep Geist Mono overlines** + add serif section numerals (Nº01…) as new annotations | The mono-label vs literary-headline contrast is exactly what makes the page read crafted rather than generated; serif numerals add the editorial annotation layer |

---

## 1. Page Information Architecture (proposal — approve at V1 kickoff)

Six routed pages + the two existing static legal pages. Section distribution keeps Home rich but not exhaustive.

| Route | Page | Carries (from current sections) |
|---|---|---|
| `/` | **Home** | Hero (+HeroStage), TrustBar, **driver-facing audiences strip (Drivers value props — the primary audience lives here)**, **Trust commitments (driver-facing reassurances: KYC, estimates, ratings, payments, records)**, Workflow (**condensed teaser** — full treatment lives on /how-it-works), Testimonials, Early-access CTA strip |
| `/how-it-works` | **How it works** | Workflow (full), Ecosystem (full), Intelligence |
| `/marketplace` | **Marketplace** | Marketplace (categories, fitment, vendor comparison, product mocks) |
| `/for-providers` | **For providers** | Provider-facing content only: mechanics/garages/fleets capabilities, earnings & reputation copy, provider onboarding path |
| `/faq` | **FAQ** | Full FAQ accordion + support/contact pointer |
| `/early-access` | **Early access** | Full EarlyAccessForm + launch-notes copy + privacy pointer |
| `/privacy.html` | Privacy | (existing static, token-synced in V1) |
| `/terms.html` | Terms | (existing static, token-synced in V1) |

**Nav mapping:** sticky header (5 nav links — How it works, Marketplace, For providers, FAQ, Early access CTA — plus the logo lockup). Footer becomes the full sitemap (all 6 pages + legal + Tamil note + ©).
**Hash anchors** (`#workflow` etc.) move to real routes; Home keeps a few in-page anchors where sections remain (e.g. `#workflow` → `/how-it-works` instead). 404 handling: React Router catch-all → editorial 404 page (not implemented today; add).
**Hash-anchor call sites to migrate at V2 (all currently set `window.location.hash` — must become `useNavigate` or they break under routing):** `Header.jsx` CTA (`#early-access`), `MobileMenu.jsx` CTA (`#early-access`), `Hero.jsx` "How it works" button (`#workflow`). Grep for `location.hash` at V2 and convert every hit. **Also verify the header logo's static `<a href="#top">`:** confirm `id="top"` exists in the shared route shell (App.jsx wraps all pages) so the scroll-to-top anchor keeps working on interior pages.

---

## 2. Design-Gate Updates Required (FIRST, before any code — supersets VISUAL-IMPROVEMENTS.md §3)

| Update | Needed by | Content |
|---|---|---|
| §2 add **warm surface tokens** + `--text-ink` | V1 | `--surface-primary` subtle cream, `--surface-soft`/`--surface-cool`/`--surface-tint` warm-adjusted steps, warm hairline `--border-default`, `--text-ink` warm near-black; **re-verify every contrast pair ≥ AA before code** |
| §3 add **Display Serif** + amend **Max-2-fonts rule** | V1 | Explicit rule change: §3 "Max 2 font families (Geist + Geist Mono)" → **3 families** (Fraunces display + Geist sans + Geist Mono); serif is display-only (never body). Add `--font-display`; move Display Hero + Section Heading rows to serif; pairing rule documented |
| §5 add **HeroStage (interactive)** | V2 | 6 states: **Request → Searching → Accepted → En route → In progress → Completed** (displayed labels; the 5 API statuses are searching/accepted/en_route/in_progress/completed — "Request" is a step title, not a status). Manual-only controls (D14); real `<button>`s; dedicated visually-hidden `aria-live="polite"` region; reduced-motion = static final state |
| §5 add **EditorialCard, SectionRule, EditorialQuote, SectionNumeral** | V3 | Varied card anatomy (never uniform), hairline rules + serif numerals (aria-hidden when decorative), pull-quote anatomy (serif, oversized opening mark, attribution) |
| §4 add **paper texture method** | V1 | Inline SVG noise data-URI on section surfaces; static only (GPU-safe); never on text-bearing containers at risk |
| §6 add **editorial motion rules** | V4/V5 | Page transitions (fade/slide, 200–400ms, GPU-only, reduced-motion = no transition), reveal timing refinement, artifact-draw transitions (stroke-dashoffset), HeroStage state transitions (transform/opacity only) |
| §5 add **PageShell / Layout** (new routing primitive) | V5 | Header + main + footer composition per route; focus management on route change (scroll-to-top + focus heading for a11y); 404 page |
| §5 add **AnnotatedList / LedgerStrip** | V3 | Ruled editorial list (trust commitments, workflow rail, category ledger) |

---

## 3. Waves & Tasks (revised for multi-page)

### V1 — Foundation (tokens, serif, texture, legal sync) · P0
- **Files:** `DESIGN.md` (gate §2/§3/§4), `src/index.css` (tokens + `@theme` + grain), `src/fonts-latin.css` (+Fraunces latin `@font-face`), `package.json` (+`@fontsource-variable/fraunces`), `index.html` (preload), **`public/privacy.html` + `public/terms.html` (inline `:root` sync — never silently drift)**, `public/_redirects` (**NEW**: `/* /index.html 200` SPA fallback)
- **What:** warm palette + `--text-ink`; Fraunces self-hosted latin-only; paper grain; SPA fallback in place from day one.
- **Acceptance:** gate-first; all contrast pairs ≥ AA; exactly one serif latin woff2 in `dist/assets`; `_redirects` present in dist; build + lint pass; Lighthouse not regressed (preload + font-display: swap — prevents FOIT/CLS; LCP element is the header brand span per F2).
- **Verify:** build, lint, `curl` a deep link on `vite preview` returns index (SPA fallback works locally), contrast spreadsheet, grep privacy/terms `:root` match tokens.
- **NOTE (file naming):** Fraunces is multi-axis (wght/opsz/SOFT/WONK) — list `node_modules/@fontsource-variable/fraunces/files/` at install and adapt `src:` paths + `unicode-range` to actual woff2 names.

### V2 — Interactive HeroStage + Router skeleton · P0
- **Files:** `src/App.jsx` (add `BrowserRouter` + `Routes` + `lazy()` routes + catch-all 404), `src/main.jsx` (unchanged — router wraps App), new `src/pages/*.jsx` (6 page shells), `src/components/ui/HeroStage.jsx` (**eager** — V7 perf amendment: probe-verified the stage card is the page's LCP element; lazy-loading it behind a Suspense fallback pushed LCP ~1.7s past FCP. Home is already its own lazy route chunk (D16 preserved), so the 7 kB stage costs nothing at startup), `DESIGN.md §5 HeroStage + PageShell` (gate first), `src/components/layout/Header.jsx` + `Footer.jsx` (nav links → routes), `.github/workflows/ci.yml` (smoke: assert `/marketplace` 200 via preview + `_redirects` presence)
- **What:** site becomes a routed app; every page mounts; HeroStage replaces the static card on Home — manual-only 6-state demo with route-draw, ETA countdown, timeline fill; sticky header + expanded footer wired.
- **Acceptance:** all 6 routes render (build + preview + curl); deep link `/marketplace` returns 200 through the fallback; HeroStage keyboard-operable, `aria-live` manual-only announcements, reduced-motion static; focus moves to main heading on route change; scroll restored to top; no console errors.
- **Verify:** build, lint, CI smoke (updated), Playwright: navigate every route, back/forward, deep link, HeroStage interaction + reduced-motion, Lighthouse per route (Home + one interior).

### V3 — Surfaces & cards: kill the slop · P0
- **Files:** `TrustBar.jsx`, `Audiences.jsx` (→ For providers), `Trust.jsx`, `Workflow.jsx`, `Testimonials.jsx`, `Marketplace.jsx`, `Intelligence.jsx`, `Ecosystem.jsx`, `SectionHeading.jsx`, `DESIGN.md §5 EditorialCard/SectionRule/EditorialQuote/SectionNumeral/AnnotatedList` (gate first)
- **What:** per `VISUAL-IMPROVEMENTS.md` §4 V3 — editorial asymmetry, drawn artifacts (estimate document, health instrument, catalog card), ruled lists, serif numerals; zero icon-in-tint-square remains; every mock stays labeled Preview.
- **Acceptance:** zero `h-11 w-11 bg-surface-tint` repetitions; no two sections share card grammar; headings serif; decorative numerals/rules `aria-hidden`; heading order h1→h2→h3 valid on every page.
- **Verify:** build, lint, axe heading-order per page, visual QA 375/768/1280.

### V4 — Real content for 6 pages · P1
- **Files:** all `src/pages/*.jsx` + section copy, new `src/hooks/usePageMeta.js` (per-route `<title>` + description via `document.title` + meta update effect — client-side routing means `index.html`'s static meta can't cover interior pages)
- **What:** each page gets substantive, real copy (D10) — How-it-works explains the lifecycle in depth; For-providers speaks to mechanics/garages/fleets (earnings, reputation, scheduling); Marketplace describes fitment/vendors; FAQ grows; Early-access has launch notes. Honest "Preview" labels preserved on every mock figure. **Every route sets its own title + meta description via `usePageMeta`** (Lighthouse SEO + social sharing need per-page metadata).
- **Acceptance:** no lorem/placeholder copy; all mock figures labeled; copy tone matches warm editorial (plain language, Coimbatore/₹ figures real-illustrative); nav + footer + per-page CTAs all route correctly; no dead links; every route has a unique `<title>` + description.
- **Verify:** link audit (no dead anchors/routes), copy review, Lighthouse SEO per page (titles present), browser tab title changes on navigation.

### V5 — Typography, texture, chrome · P1
- **Files:** `fonts-latin.css` (finalize), `SectionHeading.jsx`, page shells, `Header.jsx`/`Footer.jsx`/`MobileMenu.jsx`/`Logo.jsx`/`PrivacyNotice.jsx`, `src/index.css` (grain), `DESIGN.md §6 editorial motion` (gate first)
- **What:** optical-size/scale refinement (Fraunces opsz/SOFT/WONK per level — V3/V4 already applied serif; this wave tunes), paper grain on alternating surfaces, warm header/footer treatment (glass discipline + z-index layering preserved: header z-50 > banner z-40; mobile menu a11y intact), privacy notice token sync.
- **Acceptance:** serif/sans pairing rule respected; grain static; z-index + Escape/focus behavior unchanged; contrast re-verified on warm surfaces.
- **Verify:** build, lint, keyboard walk (F4 protocol), visual QA.

### V6 — Page transitions + micro-interactions · P2
- **Files:** route transition wrapper (e.g. `useTransition`-style fade/slide on route change — transform/opacity only), `src/index.css`, affected sections, `DESIGN.md §6` (gate first)
- **What:** fade/slide route transitions (200–400ms, reduced-motion = none); editorial reveal easing refinement; card hover warm-border + subtle lift; artifact-draw transitions; FAQ/accordion unchanged within rules.
- **Acceptance:** every animation transform/opacity/filter only; reduced-motion fully honored; each motion signals state/interaction (no slop).
- **Verify:** reduced-motion audit, Lighthouse TBT, visual QA.

### V7 — Verification & launch · P2
- **What:** full protocol below against the multi-page site; F4 a11y re-run (now multi-page: skip link, landmarks per page, keyboard walk every route, focus on route change), F2 Lighthouse (Home + interior + mobile), F3 visual QA all pages; browser-QA HeroStage + transitions; deploy to Netlify; verify live (`/`, deep link, headers, forms, GoatCounter across routes, legal pages, `_redirects`); CI green incl. updated smoke.
- **Acceptance:** Lighthouse 100 desktop / ≥99 mobile (Home + one interior route); a11y APPROVE; axe 0 critical; console 0; live curl checks all pass; GoatCounter receives pageview on a route change (verify `count.js` SPA tracking — may need a small route-change ping; add to debt if the beacon requires it).
- **Verify:** CI run, `curl -sI` live incl. deep link, browser-use end-to-end.

---

## 4. Technical Notes (from interview consequences)

- **Routing:** `react-router-dom` latest; `BrowserRouter` + `Routes` + `Route path` + `lazy()` per route with an explicit **Suspense fallback** (a minimal editorial loading state — route-level skeleton, not a blank flash); catch-all `*` → editorial 404. `vite.config.js` unchanged (base `/`).
- **SPA fallback:** `public/_redirects` → `/* /index.html 200`. Netlify serves deep links. The CI smoke job gains a deep-link assertion — **verify at implementation whether `vite preview` serves the SPA fallback directly** (Vite's default `appType: 'spa'` does provide history fallback for unknown paths, so `/marketplace` on the preview server may just work; if it does not, assert `_redirects` presence statically and do the real deep-link check on Netlify via curl/browser-use).
- **GoatCounter + routes:** `count.js` polls `location.hash` by default; for `BrowserRouter` pushState navigation, verify the beacon fires on route change — if not, add a minimal route-change ping (e.g. call `goatcounter.count()` in a route-change effect). Document as V7 verification item; add debt line if a hook is needed.
- **Bundle:** per-route `lazy()` (D16). Home = entry; vendor chunk shared; each page its own chunk. Monitor total JS vs the current 240 kB baseline.
- **Focus management:** on route change — scroll to top + move focus to the page `<h1>` (a11y, WCAG 2.4.3 focus order / 2.4.1 bypass).
- **CSP:** unchanged — all fonts self-hosted; React Router needs no script-src change.

---

## 5. Verification Protocol (every wave — supersets VISUAL-IMPROVEMENTS.md §5)

1. `npm run build` → exit 0 · `npm run lint` → exit 0
2. CI smoke (updated: `_redirects` presence + static markers) stays green on push
3. Contrast re-measured on every new surface value (AA floor) — highest a11y risk of the overhaul
4. Playwright/browser-use: zero console errors; **every route** exercised (navigate, back/forward, deep link, 404); HeroStage + transitions + reduced-motion
5. Lighthouse (real Chrome, prod build, mobile + desktop, Home + one interior route): 100/100/100/100 (mobile 99 accepted)
6. Visual QA 375/768/1280 every page, interaction states, motion inspected
7. Accessibility (lane-c): keyboard walkthrough per route, screen-reader spot check, reduced-motion verified
8. Design-gate grep: no raw hex outside DESIGN.md tokens; no new component used 2+ times not in §5; no off-base spacing; no banned families

---

## 6. Accepted Debt / Risks (supersets VISUAL-IMPROVEMENTS.md §6)

| Item | Why accepted | Exit |
|---|---|---|
| Illustrative figures remain labeled Preview | Backend has no exported analytics | Replace when backend analytics exist |
| Fraunces adds ~1 font file (~60–90 kB latin woff2) | Display-only, latin, swap, preloaded | Lighthouse gate; fall back to Newsreader if over budget (D18) |
| Warm palette changes contrast pairs | Tokens verified ≥ AA before code | F4 contrast re-run at V7 |
| HeroStage JS — **eager** in Home chunk (V7: was lazy) | Manual-only interaction, GPU-composited, reduced-motion static; probe-verified LCP element → eager is the perf-correct choice | Bundle check in Lighthouse gate |
| Mobile perf ~87–93 (LH throttled) vs ≥99 single-page baseline | Client-rendered SPA + react-router JS eval on 4× CPU throttle; desktop = 100/100/100/100 (Home + interior), CLS 0 both | Revisit with SSR/prerender when conversion work starts |
| React Router + 6 pages adds JS | Route-level lazy() keeps per-route cost low | Total-JS monitor vs 240 kB baseline |
| `vite preview` lacks SPA fallback | Local smoke asserts `_redirects` presence; real deep-link verified on Netlify | Live curl + browser-use check at V7 |
| GoatCounter route-change tracking — SOLVED (V7) | `count.js` hash-polls by default; pushState nav fired 0 beacons (live-verified). Fixed: `useGoatCounterRouteChange` in App.jsx pings `goatcounter.count({ path })` on pathname change, skip-first-run (count.js counts the initial load) | None |
| `public/og.png` navy brand card may not match warm identity | Regenerated only if visibly off | rsvg-convert (T7 workflow) at V7 if needed |
| Editorial asymmetry reduces uniformity | Intentional anti-slop choice | None (by design) |

---

## 7. Execution Order

```
V1 foundation (tokens + serif + _redirects + legal sync)
→ V2 Router skeleton + HeroStage (alone — highest-risk wave, mirrors T5 handling)
→ V3 surfaces & cards → V4 real content → V5 typography/chrome
→ V6 transitions → V7 full verification → deploy
```

Dependency notes: V2 must precede V3–V6 (all page work needs the router). Each wave commits + pushes so CI (incl. the updated smoke) runs continuously. `DESIGN.md` gate updates land in the same commit as the code they enable.

---

## 8. V8 Record — Craft & Motion Polish (2026-08-16, commit `245fd77`)

Wave VIII refined motion and interaction parity after the V1–V7 art direction landed. Scope (each item cross-references its `DESIGN.md` gate):

| Item | Scope | DESIGN.md pointer |
|---|---|---|
| Directional route transitions | Entering page slides from the right on forward nav (PUSH/REPLACE), from the left on back/forward (POP); initial load = neutral fade | §6 page transitions + `PageTransition` in `App.jsx` |
| Staggered reveals | Multi-element sections reveal in sequence rather than as one block | §6 reveal rules (`useReveal`, CSS transition delays) |
| Editorial-lift interaction parity | Hover/focus/active affordances normalized across editorial components (quotes, numerals, rules) | §5 EditorialCard / SectionNumeral / SectionRule / EditorialQuote |
| HeroStage pulse invitation cue | Mount-only soft ring on the Request state, gone after first interaction; never renders under reduced motion | §5 HeroStage (V8) |
| Sparse grain application | Paper-grain texture applied selectively, not page-wide | §7 Paper Texture |

Executed via `245fd77 feat: Wave VIII craft & motion polish`; documented in `DESIGN.md` §5/§6/§7. PRODUCTION.md carries the phase-2 production-readiness plan (Waves IX–XIII).
