import { BellRing, Gauge, AlertTriangle, Truck, Check } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'

const ITEMS = [
  {
    icon: BellRing,
    title: 'Maintenance reminders',
    body: 'Service records turn into future needs: you get told before it becomes a problem.',
  },
  {
    icon: Gauge,
    title: 'Vehicle health insights',
    body: 'A live view of your vehicle\'s systems, from battery to brakes.',
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

// Instrument-style health card — hairline-ruled rows, gauge bars, mono readings.
// Labeled illustrative Preview card — mock data is not a product claim.
function HealthCard() {
  return (
    <div className="flex max-w-sm flex-col border border-border-default bg-surface-primary">
      <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">Vehicle health</h3>
        <Badge variant="accent">Preview</Badge>
      </div>
      <dl className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <dt className="font-sans text-sm text-text-secondary">Battery</dt>
          <dd className="flex items-center gap-3">
            <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-surface-cool">
              <span className="absolute inset-y-0 left-0 rounded-full bg-accent-primary" style={{ width: '78%' }} />
            </span>
            <span className="font-mono text-xs text-text-primary">78%</span>
            <span className="inline-flex items-center gap-1 text-accent-primary">
              <Check aria-hidden="true" className="h-3 w-3" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em]">healthy</span>
            </span>
          </dd>
        </div>
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <dt className="font-sans text-sm text-text-secondary">Brake wear</dt>
          <dd className="flex items-center gap-3">
            <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-surface-cool">
              <span className="absolute inset-y-0 left-0 rounded-full bg-accent-active" style={{ width: '62%' }} />
            </span>
            <span className="font-mono text-xs text-text-primary">62%</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">due soon</span>
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="font-sans text-sm text-text-secondary">Next service</dt>
          <dd className="font-mono text-xs text-text-primary">in 2 months</dd>
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
      className="grain scroll-mt-20 bg-surface-soft py-20 lg:py-28"
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
              lede="From reactive breakdowns to proactive care, ClutchD turns vehicle data into early warnings and planned service."
              id="intelligence-heading"
            />
            {/* Ruled list — divide-y hairlines, serif titles, no tint squares */}
            <ul className="divide-y divide-border-default border-t border-border-default">
              {ITEMS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3 py-4">
                  <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
                  <div>
                    <h3 className="font-display font-semibold text-text-primary">{title}</h3>
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