# ClutchD Landing

ClutchD is one connected ecosystem for automotive care: on-demand verified
mechanics, roadside help, a parts marketplace, real-time tracking, and a
digital service history. This repository holds the static landing page for
ClutchD, live in Coimbatore.

## Design system

Design tokens, components, and motion rules live in `DESIGN.md`. Read it
before touching any styles. The design-system gate: no new token, primitive,
or motion rule may be used in code before it is documented in `DESIGN.md`.

## Commands

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the Vite dev server    |
| `npm run build`   | Production build to `dist/`  |
| `npm run lint`    | Run oxlint                   |
| `npm run preview` | Preview the production build |

## Deployment

Deployment to GitHub Pages via GitHub Actions (`.github/workflows/ci.yml`,
planned in T13). `dist/` is the deployable artifact.

## Project structure

```
src/
├── components/
│   ├── sections/   # Page sections (Hero, Trust, Workflow, ...)
│   ├── ui/         # Primitives (Button, Badge, Container, ...)
│   ├── layout/     # Header, Footer, MobileMenu
│   └── brand/      # Logo, LogoMark
├── hooks/
│   └── useReveal.js
└── main.jsx
```