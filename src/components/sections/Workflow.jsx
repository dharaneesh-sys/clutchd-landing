import { Smartphone, Handshake, Activity } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const STEPS = [
  {
    n: 1,
    icon: Smartphone,
    title: 'Request',
    body: 'Describe the issue or service you need and drop a pin. We match it to the right providers nearby.',
  },
  {
    n: 2,
    icon: Handshake,
    title: 'Match',
    body: 'Verified mechanics and roadside helpers accept the job with a transparent, upfront estimate.',
  },
  {
    n: 3,
    icon: Activity,
    title: 'Track',
    body: 'Follow the provider live, approve the work, and store the record in your vehicle history.',
  },
]

export default function Workflow() {
  const [ref, visible] = useReveal()
  return (
    <section id="workflow" aria-labelledby="workflow-heading" className="scroll-mt-20 bg-surface-primary py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From request to resolved in three steps"
          lede="No phone-tag, no surprise bills — just a clear path from problem to fixed."
        />
        <div
          ref={ref}
          className={[
            'relative mt-12 grid grid-cols-1 gap-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:grid-cols-3',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {/* connecting line (md+) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-0.5 bg-border-default md:block"
          />
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <div key={title} className="relative flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-default bg-surface-tint text-accent-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary font-mono text-xs font-semibold text-white">
                  {n}
                </span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-text-primary">{title}</h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
