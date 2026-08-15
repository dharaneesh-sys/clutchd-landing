import Container from './Container.jsx'

// RouteFallback — Suspense loading state (DESIGN.md §5).
//
// min-h fills the viewport below the sticky header so the shared shell's
// footer stays BELOW the fold while a lazy page chunk loads. V7 perf: without
// it, a short fallback left the footer visible in the viewport and the
// fallback→page swap pushed it down (CLS 0.53 on interior routes; Home was 0
// only by timing). No layout shift on mount → CLS 0 everywhere.
export default function RouteFallback() {
  return (
    <div aria-hidden="true" className="min-h-[calc(100dvh-4.5rem)] bg-surface-primary">
      <Container className="py-16 sm:py-20 lg:py-24">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
          Loading
        </p>
        <div className="mt-6 rounded-2xl border border-border-default bg-surface-soft p-6">
          <div className="h-8 w-2/3 rounded-lg bg-surface-cool" />
          <div className="mt-4 h-4 w-full rounded bg-surface-cool" />
          <div className="mt-3 h-4 w-5/6 rounded bg-surface-cool" />
        </div>
      </Container>
    </div>
  )
}