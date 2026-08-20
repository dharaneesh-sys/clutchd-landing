import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import EarlyAccessForm from '../ui/EarlyAccessForm.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

export default function EarlyAccess() {
  const { t } = useT()
  const [ref, visible] = useReveal()

  return (
    <section
      id="early-access"
      aria-labelledby="early-access-heading"
      className="scroll-mt-20 bg-surface-tint py-24 lg:py-32"
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
              eyebrow={t['earlyAccess.eyebrow']}
              title={t['earlyAccess.title']}
              lede={t['earlyAccess.lede']}
              id="early-access-heading"
            />

            <EarlyAccessForm variant="section" />
          </div>
        </div>
      </Container>
    </section>
  )
}