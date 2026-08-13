import { BellRing, Gauge, AlertTriangle, Truck, Check } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'

const ITEMS = [
  {
    icon: BellRing,
    title: 'Maintenance reminders',
    body: 'Service records turn into future needs — you get told before it becomes a problem.',
  },
  {
    icon: Gauge,
    title: 'Vehicle health insights',
    body: 'A live view of your vehicle’s systems, from battery to brakes.',
  },
  {
    icon: AlertTriangle,
    title: 'Predictive maintenance & early warnings',
    body: 'Anomalies in the data flag issues early, so you act before a breakdown.',
  },
  {
    icon: Truck,
    title: 'Fleet intelligence',
    body: 'For fleets: proactive scheduling and health monitoring replace reactive firefighting.',
  },
]

// Labeled illustrative Preview card — mock data is not a product claim.
function HealthCard() {
  return (
    <div className="flex max-w-sm flex-col gap-4 rounded-2xl border border-border-default bg-surface-primary p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-lg font-semibold text-text-primary">Vehicle health</h3>
        <Badge variant="accent">Preview</Badge>
      </div>
      <dl className="flex flex-col gap-3 font-sans text-sm">
        <div className="flex items-center justify-between rounded-xl bg-surface-tint px-4 py-3">
          <dt className="text-text-secondary">Battery</dt>
          <dd className="inline-flex items-center gap-2 font-medium text-text-primary">
            <Check className="h-4 w-4 text-accent-primary" />
            78% · healthy
          </dd>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-soft px-4 py-3">
          <dt className="text-text-secondary">Brake wear</dt>
          <dd className="font-medium text-text-primary">due soon</dd>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-surface-soft px-4 py-3">
          <dt className="text-text-secondary">Next service</dt>
          <dd className="font-medium text-text-primary">in 2 months</dd>
        </div>
      </dl>
    </div>
  )
}

export default function Intelligence() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="intelligence"
      aria-labelledby="intelligence-heading"
      className="scroll-mt-20 bg-surface-soft py-20 lg:py-28"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div
            ref={ref}
            className={[
              'flex flex-col gap-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <SectionHeading
              eyebrow="INTELLIGENCE"
              title="Maintenance that happens before things break"
              lede="From reactive breakdowns to proactive care — ClutchD turns vehicle data into early warnings and planned service."
            />
            <ul className="flex flex-col gap-4">
              {ITEMS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-accent-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-text-primary">{title}</h3>
                    <p className="mt-0.5 font-sans text-sm leading-relaxed text-text-secondary">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HealthCard />
          </div>
        </div>
      </Container>
    </section>
  )
}