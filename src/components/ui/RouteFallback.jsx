import Container from './Container.jsx'

export default function RouteFallback() {
  return (
    <div aria-hidden="true" className="bg-surface-primary">
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