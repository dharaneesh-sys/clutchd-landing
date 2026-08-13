import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (DESIGN.md §3) — @fontsource-variable, no CDN
// Latin-only subsets (T8): package ships no per-subset CSS, so latin
// @font-face blocks live in fonts-latin.css (page is English-only).
import './fonts-latin.css'
import './index.css'
import App from './App.jsx'

// Dev-only gate (react-dev-tooling-skill.md) — must stay inside import.meta.env.DEV
if (import.meta.env.DEV) {
  void import('react-scan')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
