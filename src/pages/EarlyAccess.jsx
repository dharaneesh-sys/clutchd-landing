import Container from '../components/ui/Container.jsx'
import EarlyAccess from '../components/sections/EarlyAccess.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function EarlyAccessPage() {
  usePageMeta(
    'Early access — ClutchD',
    'Join the ClutchD early-access waitlist and be first in line when the app opens in your city.',
  )

  return (
    <>
      <section className="border-b border-border-default bg-surface-primary">
        <Container className="py-16 sm:py-20 lg:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Get started
          </p>
          <h1
            id="page-heading"
            tabIndex="-1"
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            Early access
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-text-secondary">
            Join the waitlist and be first in line when ClutchD opens in your city.
          </p>
        </Container>
      </section>
      <EarlyAccess />
    </>
  )
}