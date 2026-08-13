import { Star, MapPin, Wrench, CheckCircle2, Clock } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import EarlyAccessForm from '../ui/EarlyAccessForm.jsx'
import useReveal from '../../hooks/useReveal.js'

const STEPS = [
  { key: 'searching', label: 'Searching', done: true },
  { key: 'accepted', label: 'Accepted', done: true },
  { key: 'en_route', label: 'En route', active: true },
]

function ServiceCard() {
  return (
    <div className="w-full max-w-sm rounded-[2rem] border border-border-default bg-surface-primary p-5 shadow-[0_8px_24px_rgba(13,18,79,0.12)]">
      {/* Status timeline */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center gap-2">
            <div
              className={[
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                s.active
                  ? 'bg-accent-primary text-white'
                  : s.done
                    ? 'bg-surface-tint text-accent-primary'
                    : 'bg-surface-cool text-text-secondary',
              ].join(' ')}
            >
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={['h-0.5 flex-1 rounded', s.done ? 'bg-accent-primary' : 'bg-surface-cool'].join(' ')} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
          Service request · live
        </p>
        <Badge variant="accent">Preview</Badge>
      </div>

      {/* ETA chip */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-tint px-4 py-3">
        <Clock className="h-5 w-5 text-accent-primary" />
        <div>
          <p className="font-sans text-xs text-text-secondary">Arriving in</p>
          <p className="font-sans text-lg font-semibold text-text-primary">18 min</p>
        </div>
      </div>

      {/* Mechanic row */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border-default bg-surface-soft px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary text-sm font-semibold text-white">
          RK
        </div>
        <div className="flex-1">
          <p className="font-sans text-sm font-semibold text-text-primary">Rahul K.</p>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent-primary text-accent-primary" />
            <span className="font-sans text-xs text-text-secondary">4.9 · Verified</span>
            <Badge variant="accent" className="ml-1 px-2 py-0.5 text-[9px]">
              Verified
            </Badge>
          </div>
        </div>
      </div>

      {/* CSS map motif */}
      <div className="relative mt-4 h-24 overflow-hidden rounded-2xl border border-border-default bg-surface-cool">
        <svg viewBox="0 0 320 96" className="h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(91,97,110,0.18)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="320" height="96" fill="url(#grid)" />
          <path
            d="M30 78 C 90 70, 120 40, 180 36 S 260 30, 290 18"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          <circle cx="30" cy="78" r="5" fill="var(--accent-primary)" />
          <circle cx="290" cy="18" r="5" fill="var(--depth-navy-1)" />
        </svg>
        <MapPin className="absolute right-3 top-2 h-5 w-5 text-accent-primary" />
      </div>

      {/* Estimate card */}
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-primary px-4 py-3">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-text-secondary" />
          <span className="font-sans text-sm text-text-primary">Brake pad replacement</span>
        </div>
        <span className="font-sans text-sm font-semibold text-text-primary">Est. ₹1,450</span>
      </div>
    </div>
  )
}

export default function Hero() {
  const [ref, visible] = useReveal()

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-surface-tint to-surface-primary"
    >
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left: copy */}
        <div
          ref={ref}
          className={[
            'flex flex-col items-start gap-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          <Badge variant="live">Now live in Coimbatore</Badge>

          <h1
            id="hero-heading"
            className="font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            One connected ecosystem for automotive care.
          </h1>

          <p className="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
            Find verified mechanics, request roadside help, source the right parts, track the work
            in real time, and keep your vehicle&apos;s complete service history in one place.
          </p>

          <EarlyAccessForm variant="hero" />

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => (window.location.hash = '#workflow')}>
              How it works
            </Button>
          </div>

        </div>

        {/* Right: product mockup (pure CSS/SVG) */}
        <div className="flex justify-center lg:justify-end">
          <ServiceCard />
        </div>
      </Container>
    </section>
  )
}
