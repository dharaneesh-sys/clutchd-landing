import Container from '../components/ui/Container.jsx'
import Marketplace from '../components/sections/Marketplace.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function MarketplacePage() {
  usePageMeta(
    'Marketplace: ClutchD',
    'Browse the ClutchD marketplace: parts categories, fitment checks and verified vendors for your vehicle, with transparent estimates.',
  )

  return (
    <>
      <section className="border-b border-border-default bg-surface-primary">
        <Container className="py-16 sm:py-20 lg:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            The marketplace
          </p>
          <h1
            id="page-heading"
            tabIndex="-1"
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            Marketplace
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-text-secondary">
            Browse verified providers, transparent estimates, and real-time availability across the ecosystem.
          </p>
        </Container>
      </section>
      <Marketplace />
    </>
  )
}