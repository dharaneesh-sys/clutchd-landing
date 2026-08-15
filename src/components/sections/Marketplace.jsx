import { Wrench, Disc, Zap, Route, Filter, Package, Star } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import SectionNumeral from '../ui/SectionNumeral.jsx'
import SectionRule from '../ui/SectionRule.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'

// REAL category labels from ClutchD-App/src/lib/constants.js PRODUCT_CATEGORIES
// (verified 2026-08-11) — the illustrative brief list is superseded.
const CATEGORIES = [
  { icon: Wrench, label: 'Engine Parts' },
  { icon: Disc, label: 'Brake Parts' },
  { icon: Zap, label: 'Electrical Components' },
  { icon: Route, label: 'Suspension Parts' },
  { icon: Filter, label: 'Filters' },
  { icon: Package, label: 'Accessories' },
]

// V8 staggered reveal (DESIGN.md §6) — catalog strip, callout pair, and
// catalog card enter as a sequence (80ms apart); reduced-motion instant.
const STAGGER = 80

export default function Marketplace() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="marketplace"
      aria-labelledby="marketplace-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="MARKETPLACE"
          title="Service and parts, on the same system"
          lede="Diagnose → find the required parts → check availability → order → get it serviced → keep the record. One workflow, no hopping between apps."
          id="marketplace-heading"
        />
        <div ref={ref} className="mt-12">
          {/* Ruled catalog strip — hairline ledger of categories (real labels) */}
          <div
            className={[
              'border-y border-border-default transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="hidden divide-x divide-border-default lg:grid lg:grid-cols-6">
              {CATEGORIES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-start gap-2.5 px-5 py-6">
                  <Icon aria-hidden="true" className="h-5 w-5 text-accent-primary" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="divide-y divide-border-default lg:hidden">
              {CATEGORIES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 px-1 py-3.5">
                  <Icon aria-hidden="true" className="h-4 w-4 text-accent-primary" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Capability callouts — 2-up editorial pair */}
          <div
            style={{ transitionDelay: visible ? `${STAGGER}ms` : '0ms' }}
            className={[
              'mt-10 grid grid-cols-1 gap-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:grid-cols-2',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="flex flex-col gap-3">
              <SectionRule variant="short" />
              <div className="mt-2 flex items-baseline gap-3">
                <SectionNumeral n={1} />
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                  Fitment check
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                Pick your make, model, and year — and only see parts that actually fit your vehicle.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <SectionRule variant="short" />
              <div className="mt-2 flex items-baseline gap-3">
                <SectionNumeral n={2} />
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                  Vendor comparison
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                Compare prices across verified suppliers before you order — no more phoning around.
              </p>
            </div>
          </div>

          {/* Catalog card artifact — labeled Preview, illustrative */}
          <div
            style={{ transitionDelay: visible ? `${STAGGER * 2}ms` : '0ms' }}
            className={[
              'mt-10 max-w-sm border border-border-default bg-surface-primary transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                Part № CD-1042
              </span>
              <Badge variant="accent">Preview</Badge>
            </div>
            <div className="flex flex-col gap-1.5 px-5 py-5">
              <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                Brake pads — front
              </h3>
              <p className="font-mono text-sm text-text-secondary">from ₹1,200</p>
            </div>
            <div className="flex items-center justify-between border-t border-border-default px-5 py-3">
              <span className="inline-flex items-center gap-1.5 border border-accent-primary px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-accent-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3 w-3"
                >
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
                Fits your vehicle
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                <Star aria-hidden="true" className="h-3 w-3 fill-accent-primary text-accent-primary" />
                4.8
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}