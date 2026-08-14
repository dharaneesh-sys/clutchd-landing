import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import TrustBar from './components/sections/TrustBar.jsx'
import PrivacyNotice from './components/ui/PrivacyNotice.jsx'

// Below-fold sections are code-split (F2 perf: TBT/Style+Layout budget).
// Each lazy() imports its own chunk; a Suspense boundary with a placeholder
// fallback keeps render order identical and causes no layout shift (CLS 0).
// useReveal attaches its IntersectionObserver on mount, so reveal animations
// still fire when chunks arrive.
const Ecosystem = lazy(() => import('./components/sections/Ecosystem.jsx'))
const Audiences = lazy(() => import('./components/sections/Audiences.jsx'))
const Workflow = lazy(() => import('./components/sections/Workflow.jsx'))
const Trust = lazy(() => import('./components/sections/Trust.jsx'))
const Testimonials = lazy(() => import('./components/sections/Testimonials.jsx'))
const Marketplace = lazy(() => import('./components/sections/Marketplace.jsx'))
const Intelligence = lazy(() => import('./components/sections/Intelligence.jsx'))
const Faq = lazy(() => import('./components/sections/Faq.jsx'))
const EarlyAccess = lazy(() => import('./components/sections/EarlyAccess.jsx'))

// F2 perf: React.lazy alone still fires every dynamic import on first render,
// so all 9 sections would mount eagerly. DeferredSection gates the render on
// viewport proximity instead: a 600px placeholder (carrying the section id so
// nav anchors / hash links keep working) stays in the DOM until the viewport
// gets within 600px of it, and only then is the lazy chunk imported + mounted.
// The placeholder and the Suspense fallback are the same 600px box, so the
// swap is invisible and CLS stays 0. Once near, the section stays mounted.
function useNearViewport() {
  const ref = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px 600px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [near])

  return [ref, near]
}

function SectionPlaceholder({ id }) {
  return (
    <div id={id} className="scroll-mt-20" style={{ minHeight: 600 }} aria-hidden="true" />
  )
}

function DeferredSection({ id, children }) {
  const [ref, near] = useNearViewport()
  if (near) {
    return <Suspense fallback={<SectionPlaceholder id={id} />}>{children}</Suspense>
  }
  return <div ref={ref} className="scroll-mt-20" style={{ minHeight: 600 }} aria-hidden="true" />
}

export default function App() {
  return (
    <div id="top" className="min-h-[100dvh] bg-surface-primary text-text-primary">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <DeferredSection id="ecosystem">
          <Ecosystem />
        </DeferredSection>
        <DeferredSection id="audiences">
          <Audiences />
        </DeferredSection>
        <DeferredSection id="workflow">
          <Workflow />
        </DeferredSection>
        <DeferredSection id="trust">
          <Trust />
        </DeferredSection>
        <DeferredSection id="testimonials">
          <Testimonials />
        </DeferredSection>
        <DeferredSection id="marketplace">
          <Marketplace />
        </DeferredSection>
        <DeferredSection id="intelligence">
          <Intelligence />
        </DeferredSection>
        <DeferredSection id="faq">
          <Faq />
        </DeferredSection>
        <DeferredSection id="early-access">
          <EarlyAccess />
        </DeferredSection>
      </main>
      <Footer />
      <PrivacyNotice />
    </div>
  )
}