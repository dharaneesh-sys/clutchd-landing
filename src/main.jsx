import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted fonts (DESIGN.md §3) — @fontsource-variable, no CDN
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
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
