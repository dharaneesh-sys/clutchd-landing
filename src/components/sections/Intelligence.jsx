import { BellRing, Gauge, AlertTriangle, Truck, Check } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

const ITEM_KEYS = [
  { icon: BellRing, key: 'intelligence.0' },
  { icon: Gauge, key: 'intelligence.1' },
  { icon: AlertTriangle, key: 'intelligence.2' },
  { icon: Truck, key: 'intelligence.3' },
]

// Instrument-style health card — hairline-ruled rows, gauge bars, mono readings.
// Labeled illustrative Preview card — mock data is not a product claim.
function HealthCard({ t }) {
  return (
    <div className="flex max-w-sm flex-col border border-border-default bg-surface-primary">
      <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
        <h3 className="font-display text-lg font-semibold text-text-primary">{t['intelligence.healthCard.title']}</h3>
        <Badge variant="accent">{t['intelligence.healthCard.previewBadge']}</Badge>
      </div>
      <dl className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <dt className="font-sans text-sm text-text-secondary">{t['intelligence.healthCard.battery']}</dt>
          <dd className="flex items-center gap-3">
            <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-surface-cool">
              <span className="absolute inset-y-0 left-0 rounded-full bg-accent-primary" style={{ width: '78%' }} />
            </span>
            <span className="font-mono text-xs text-text-primary">{t['intelligence.healthCard.batteryValue']}</span>
            <span className="inline-flex items-center gap-1 text-accent-primary">
              <Check aria-hidden="true" className="h-3 w-3" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{t['intelligence.healthCard.batteryStatus']}</span>
            </span>
          </dd>
        </div>
        <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
          <dt className="font-sans text-sm text-text-secondary">{t['intelligence.healthCard.brakeWear']}</dt>
          <dd className="flex items-center gap-3">
            <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-surface-cool">
              <span className="absolute inset-y-0 left-0 rounded-full bg-accent-active" style={{ width: '62%' }} />
            </span>
            <span className="font-mono text-xs text-text-primary">{t['intelligence.healthCard.brakeWearValue']}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{t['intelligence.healthCard.brakeWearStatus']}</span>
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="font-sans text-sm text-text-secondary">{t['intelligence.healthCard.nextService']}</dt>
          <dd className="font-mono text-xs text-text-primary">{t['intelligence.healthCard.nextServiceValue']}</dd>
        </div>
      </dl>
    </div>
  )
}

export default function Intelligence() {
  const { t } = useT()
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
              eyebrow={t['intelligence.eyebrow']}
              title={t['intelligence.title']}
              lede={t['intelligence.lede']}
              id="intelligence-heading"
            />
            {/* Ruled list — divide-y hairlines, serif titles, no tint squares */}
            <ul className="divide-y divide-border-default border-t border-border-default">
              {ITEM_KEYS.map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-start gap-3 py-4">
                  <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
                  <div>
                    <h3 className="font-display font-semibold text-text-primary">{t[`${key}.title`]}</h3>
                    <p className="mt-0.5 font-sans text-sm leading-relaxed text-text-secondary">{t[`${key}.body`]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HealthCard t={t} />
          </div>
        </div>
      </Container>
    </section>
  )
}