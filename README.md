# ClutchD Landing

ClutchD is one connected ecosystem for automotive care: on-demand verified
mechanics, roadside help, a parts marketplace, real-time tracking, and a
digital service history. This repository holds the static landing page for
ClutchD, live in Coimbatore.

## Features

The page is built from the sections in `src/components/sections/`, rendered in
this order:

| Section | What it covers |
| ------- | -------------- |
| Hero | The one-ecosystem positioning with an early-access email capture and a live service-request mock (status timeline, ETA, verified mechanic, estimate) |
| TrustBar | Three value props: verified providers, transparent estimates, secure payments |
| Ecosystem | A 9-node connected data flow: driver, vehicle, service request, mechanic, garage, parts, payment, service history, vehicle intelligence |
| Audiences | What the platform offers drivers, mechanics, garages, and fleets |
| Workflow | The 6-step job lifecycle (Request, Match, Accept, En route, In progress, Done), labeled with the real backend status vocabulary |
| Trust | Five commitments: KYC-verified mechanics and garages, transparent estimates, ratings and reviews, secure payments (Stripe, Razorpay), digital service records |
| Testimonials | An illustrative stats strip plus three testimonial cards (driver, mechanic, garage operator); stats are labeled as illustrative, not production metrics |
| Marketplace | Parts categories (engine, brake, electrical, suspension, filters, accessories), fitment check, vendor comparison |
| Intelligence | Maintenance reminders, vehicle health insights, predictive maintenance and early warnings, fleet intelligence |
| Faq | Six questions covering matching, estimates, verification, coverage, payments, and what "Preview" means |
| EarlyAccess | Closing early-access email capture for the Coimbatore rollout |

Any mock figures (prices, stats, ratings) are illustrative previews labeled as
such — the backend has no exported analytics yet.

## Tech stack

- **Vite 8** (`@vitejs/plugin-react`) — build tool and dev server
- **React 19** — UI library
- **Tailwind CSS 4** — utility-first styling, wired via `@tailwindcss/vite`
- **Vanilla CSS design tokens** — semantic custom properties in `src/index.css`,
  mapped into the Tailwind `@theme` namespace; the single source of truth is
  `DESIGN.md`
- **oxlint** — linting (`.oxlintrc.json`, react + oxc plugins)
- **lucide-react** — icon set
- **Geist Variable / Geist Mono Variable** — self-hosted fonts, latin subsets
  only (`src/fonts-latin.css`, no CDN)

## Getting started

Prerequisites: Node.js 22+ and npm.

```sh
npm install     # install dependencies
npm run dev     # start the Vite dev server
npm run build   # production build to dist/
npm run preview # preview the production build
npm run lint    # run oxlint
```

## Design system

Design tokens, components, and motion rules live in `DESIGN.md`. Read it
before touching any styles. The design-system gate: no new token, primitive,
or motion rule may be used in code before it is documented in `DESIGN.md`.

## Project structure

```
src/
├── components/
│   ├── sections/   # Page sections (Hero, TrustBar, Ecosystem, ...)
│   ├── ui/         # Primitives (Button, Badge, Container, ...)
│   ├── layout/     # Header, Footer, MobileMenu
│   └── brand/      # Logo, LogoMark
├── hooks/
│   └── useReveal.js   # IntersectionObserver reveal-on-scroll (DESIGN.md §6)
├── lib/            # Reserved (empty)
├── App.jsx         # Section composition + skip link
├── fonts-latin.css # Self-hosted latin font faces
├── index.css       # Design tokens + base styles
└── main.jsx        # Entry point
```

## Deployment

Netlify (production), connected to this GitHub repo — build `npm run build`,
publish `dist/` (see `netlify.toml`). Live URL: https://clutchd-193.netlify.app/
(site name `clutchd` was taken, so Netlify assigned `clutchd-193`).

`.github/workflows/ci.yml` is the quality gate: on push/PR to `main` it runs
`npm ci`, `npm run lint`, and `npm run build`. GitHub Pages is retired (P6);
Netlify deploys from git automatically.

`vite.config.js` sets `base: '/'` — assets are root-relative (correct for a
root-domain host).

## Accessibility & performance

- Skip link to `#main` (Bypass Blocks) plus semantic landmarks
  (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Visible focus rings on every interactive element (`:focus-visible` in
  `src/index.css`)
- Reduced-motion support: smooth scrolling and reveal animations are disabled
  under `prefers-reduced-motion` (`motion-reduce:` variants)
- Fully keyboard operable: FAQ is a real button accordion with
  `aria-expanded`/`aria-controls`; mobile menu closes on Escape and restores
  focus
- Scroll reveals use IntersectionObserver only, never scroll listeners
  (`src/hooks/useReveal.js`)
- Form inputs are labeled with `aria-invalid`, `aria-describedby`, and an
  `aria-live` status region
- Color contrast verified AA: text primary 18.4:1, text secondary 6.2:1,
  accent 10.3:1 on white (DESIGN.md §8)
- Lighthouse target is 100 on mobile and desktop; the verification protocol
  lives in `IMPROVEMENTS.md` §3

## Documentation

| Document | Purpose |
| -------- | ------- |
| `README.md` | This file — project overview, structure, and commands |
| `DESIGN.md` | Design-system source of truth — tokens, typography, spacing, components, motion. Gated: read before changing styles |
| `IMPROVEMENTS.md` | Improvement plan — waves T1–T13, verification protocol, accepted debt |
| `PRODUCTION.md` | Phase 2 production-readiness plan — real form backend, analytics, legal pages, hosting migration, tests, perf-to-100 |
