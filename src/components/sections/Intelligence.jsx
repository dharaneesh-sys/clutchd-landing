import { BrainCircuit, Bell, AlertTriangle, TrendingDown } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const CAPABILITIES = [
  { icon: Bell, text: 'Smart reminders based on real usage, not a generic calendar' },
  { icon: AlertTriangle, text: 'Anomaly detection from your service and sensor data' },
  { icon: TrendingDown, text: 'Cost forecasts so big bills never arrive unannounced' },
]

function HealthGauge() {
  // Pure SVG/CSS predictive-maintenance visual — no <img>, no stock photo.
  return (
    <div className="relative flex items-center justify-center rounded-2xl border border-border-default bg-surface-soft p-6">
      <svg viewBox="0 0 200 120" className="h-auto w-full max-w-[260px]" aria-hidden="true">
        <defs>
          <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--depth-navy-1)" />
          </linearGradient>
        </defs>
        {/* arc track */}
        <path d="M20 110 A 80 80 0 0 1 180 110" fill="none" stroke="var(--border-default)" strokeWidth="12" strokeLinecap="round" />
        {/* value arc */}
        <path d="M20 110 A 80 80 0 0 1 150 38" fill="none" stroke="url(#gauge)" strokeWidth="12" strokeLinecap="round" />
        {/* predicted marker */}
        <circle cx="150" cy="38" r="6" fill="var(--accent-primary)" />
        <text x="100" y="92" textAnchor="middle" className="fill-text-primary" style={{ font: '600 22px var(--font-sans)', fontSize: 22 }}>
          86
        </text>
        <text x="100" y="108" textAnchor="middle" className="fill-text-secondary" style={{ font: '600 9px var(--font-mono)', letterSpacing: 2 }}>
          HEALTH SCORE
        </text>
      </svg>
      <span className="absolute bottom-3 right-4 rounded-full bg-surface-tint px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-primary">
        Predicted
      </span>
    </div>
  )
}

export default function Intelligence() {
  const [ref, visible] = useReveal()
  return (
    <section id="intelligence" aria-labelledby="intelligence-heading" className="scroll-mt-20 bg-surface-soft py-20 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div
            ref={ref}
            className={[
              'flex flex-col gap-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <SectionHeading
              eyebrow="Intelligence"
              title="Maintenance that sees problems coming"
              lede="ClutchD learns from your vehicle's history and usage to flag issues before they become breakdowns."
            />
            <ul className="flex flex-col gap-3">
              {CAPABILITIES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 font-sans text-sm text-text-secondary">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-tint text-accent-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <HealthGauge />
        </div>
      </Container>
    </section>
  )
}
