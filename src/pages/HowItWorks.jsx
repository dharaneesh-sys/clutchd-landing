import Container from '../components/ui/Container.jsx'
import Workflow from '../components/sections/Workflow.jsx'
import Ecosystem from '../components/sections/Ecosystem.jsx'
import Intelligence from '../components/sections/Intelligence.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function HowItWorks() {
  usePageMeta(
    'How it works: ClutchD',
    'See how ClutchD connects you with verified mechanics in minutes: from service request to completed work, with real-time tracking at every step.',
  )

  return (
    <>
      <section className="border-b border-border-default bg-surface-primary">
        <Container className="py-16 sm:py-20 lg:py-24">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            The platform
          </p>
          <h1
            id="page-heading"
            tabIndex="-1"
            className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            How it works
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-text-secondary">
            From request to completed service, see how ClutchD connects you with verified providers in minutes.
          </p>
        </Container>
      </section>
      <Workflow />
      <Ecosystem />
      <Intelligence />
    </>
  )
}