import { useEffect, useRef } from 'react'

// GoatCounter (P2) polls location.hash by default — BrowserRouter pushState
// navigation never fires a pageview (V7 live-verified: 0 beacons on SPA
// nav). Ping count() on every route change; skip the first run because
// count.js already counts the initial page load (would double-count).
// No-op when the script is blocked/adblocked (window.goatcounter absent).
// Extracted from App.jsx for the Wave IX-1 unit tests (PRODUCTION.md IX-1).
export default function useGoatCounterRouteChange(pathname) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const gc = window.goatcounter
    if (gc && typeof gc.count === 'function') {
      gc.count({ path: window.location.pathname + window.location.search })
    }
  }, [pathname])
}