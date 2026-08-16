import { lazy, Suspense, useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PrivacyNotice from './components/ui/PrivacyNotice.jsx'
import RouteFallback from './components/ui/RouteFallback.jsx'
import useGoatCounterRouteChange from './hooks/useGoatCounterRouteChange.js'

// Route-level code-splitting (V2): each page is its own chunk, loaded on
// first visit. Supersedes the single-page useNearViewport/DeferredSection
// helpers — sections now mount eagerly inside their lazy page chunk, so the
// viewport-proximity gate is gone. Header/Footer/PrivacyNotice/RouteFallback
// stay eager (shared shell, always needed).
const Home = lazy(() => import('./pages/Home.jsx'))
const HowItWorks = lazy(() => import('./pages/HowItWorks.jsx'))
const Marketplace = lazy(() => import('./pages/Marketplace.jsx'))
const ForProviders = lazy(() => import('./pages/ForProviders.jsx'))
const Faq = lazy(() => import('./pages/Faq.jsx'))
const EarlyAccess = lazy(() => import('./pages/EarlyAccess.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// WCAG 2.4.1 bypass + 2.4.3 focus order (DESIGN.md §5 PageShell): on every
// route change — including the first — scroll to top (instant, no animated
// scroll) and move focus to the page's h1. The h1 gets tabindex="-1" so it
// can receive programmatic focus without entering the tab order. pathname is
// the trigger, not a value the body reads — the `void` reference documents
// that intentional dependency for the exhaustive-deps linters.
// V6+V8 page transitions (DESIGN.md §6 — directional): a keyed wrapper
// re-mounts on pathname change so the entering page animates in — forward
// navigation (PUSH/REPLACE) slides from the right, back/forward-button
// (POP) from the left, initial load = neutral fade (transform/opacity only,
// GPU-composited). prefers-reduced-motion: no animation (CSS media guard).
// The keyed remount resets per-page state — intentional. Lazy chunks are
// module-cached after first visit, so re-mounting does not re-trigger the
// Suspense fallback on interior navigations.
function PageTransition({ children }) {
  const { pathname } = useLocation()
  const navType = useNavigationType()
  // One-shot neutral fade on the very first render only (the ref is consumed
  // during that render — an effect would flip the class after paint and
  // re-trigger the animation). Subsequent navigations are directional.
  const firstRender = useRef(true)
  let cls = 'page-enter'
  if (firstRender.current) {
    firstRender.current = false
  } else {
    cls = navType === 'POP' ? 'page-enter-back' : 'page-enter-forward'
  }
  return (
    <div key={pathname} className={cls}>
      {children}
    </div>
  )
}

// GoatCounter (P2) pings on route change — see hooks/useGoatCounterRouteChange.js.
// Exported for the Wave IX-1 unit tests (PRODUCTION.md IX-1).
export function RouteFocus() {
  const { pathname } = useLocation()
  useGoatCounterRouteChange(pathname)

  useEffect(() => {
    void pathname
    window.scrollTo(0, 0)
    const h1 = document.querySelector('main h1')
    if (h1) {
      h1.tabIndex = -1
      h1.focus({ preventScroll: true })
    }
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div id="top" className="min-h-[100dvh] bg-surface-primary text-text-primary">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Suspense fallback={<RouteFallback />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/for-providers" element={<ForProviders />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/early-access" element={<EarlyAccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>
        <RouteFocus />
        <Footer />
        <PrivacyNotice />
      </div>
    </BrowserRouter>
  )
}