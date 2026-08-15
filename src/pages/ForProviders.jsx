import Container from '../components/ui/Container.jsx'
import Audiences from '../components/sections/Audiences.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function ForProviders() {
  usePageMeta(
    'For providers — ClutchD',
    'Grow your business with ClutchD — verified leads, transparent pricing and reliable payments for mechanics, garages and fleets.',
  )

  return (
    <>
      <section className="border-b border-border-default bg-surface-primary">
        <Container className="py-16 sm:py-20 lg:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Provider network
          </p>
          <h1
            id="page-heading"
            tabIndex="-1"
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            For providers
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-text-secondary">
            Grow your business with verified leads, transparent pricing, and payments you can rely on.
          </p>
        </Container>
      </section>
      <Audiences />
    </>
  )
}