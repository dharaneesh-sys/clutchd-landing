import { Wrench, Disc, Zap, Route, Filter, Package, SlidersHorizontal, ArrowLeftRight, Star } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
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
        />
        <div
          ref={ref}
          className={[
            'mt-12 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {/* Category chips (real labels) */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-soft px-4 py-2 font-sans text-sm text-text-primary"
              >
                <Icon className="h-4 w-4 text-accent-primary" />
                {label}
              </span>
            ))}
          </div>

          {/* Capability callouts */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-soft p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <SlidersHorizontal className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">Fitment check</h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                Pick your make, model, and year — and only see parts that actually fit your vehicle.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-soft p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <ArrowLeftRight className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">Vendor comparison</h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                Compare prices across verified suppliers before you order — no more phoning around.
              </p>
            </div>
          </div>

          {/* Product card mock — labeled Preview, illustrative */}
          <div className="mt-8 flex max-w-sm flex-col gap-3 rounded-2xl border border-border-default bg-surface-soft p-6">
            <div className="flex items-center justify-between">
              <Badge variant="accent">Preview</Badge>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-text-secondary">
                <Star className="h-3.5 w-3.5 fill-accent-primary text-accent-primary" />
                4.8
              </span>
            </div>
            <h3 className="font-sans text-lg font-semibold text-text-primary">Brake pads — front</h3>
            <p className="font-sans text-sm text-text-secondary">from ₹ —</p>
            <span className="self-start rounded-full bg-surface-tint px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-primary">
              Fits your vehicle
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}