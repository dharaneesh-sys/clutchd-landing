import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
