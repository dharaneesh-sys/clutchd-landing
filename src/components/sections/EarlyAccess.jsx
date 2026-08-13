import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import EarlyAccessForm from '../ui/EarlyAccessForm.jsx'
import useReveal from '../../hooks/useReveal.js'

export default function EarlyAccess() {
  const [ref, visible] = useReveal()

  return (
    <section
      id="early-access"
      aria-labelledby="early-access-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-start gap-6">
          <div
            ref={ref}
            className={[
              'flex flex-col items-start gap-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <SectionHeading
              eyebrow="EARLY ACCESS"
              title="ClutchD is rolling out in Coimbatore"
              lede="Be among the first to try one connected ecosystem for automotive care."
              id="early-access-heading"
            />

            <EarlyAccessForm variant="section" />
          </div>
        </div>
      </Container>
    </section>
  )
}