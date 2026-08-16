import Container from '../components/ui/Container.jsx'
import Faq from '../components/sections/Faq.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function FaqPage() {
  usePageMeta(
    'FAQ: ClutchD',
    'Straight answers about how ClutchD works: matching, estimates, verification, coverage, payments and what Preview means.',
  )

  return (
    <>
      <section className="border-b border-border-default bg-surface-primary">
        <Container className="py-16 sm:py-20 lg:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Support
          </p>
          <h1
            id="page-heading"
            tabIndex="-1"
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            FAQ
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-text-secondary">
            Straight answers about how ClutchD works, what it costs, and how your data is handled.
          </p>
        </Container>
      </section>
      <Faq />
    </>
  )
}