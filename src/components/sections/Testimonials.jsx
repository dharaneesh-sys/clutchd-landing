import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import EditorialQuote from '../ui/EditorialQuote.jsx'
import useReveal from '../../hooks/useReveal.js'

/**
 * Testimonials — social proof section (DESIGN.md §5 EditorialQuote + AnnotatedList).
 *
 * Two parts:
 *   1. Stats strip — 4 illustrative launch figures as a ruled ledger (divide-y,
 *      mono numerals, honest "illustrative" label).
 *   2. Pull-quotes — driver / mechanic / garage operator voices via EditorialQuote
 *      (serif, oversized opening mark, attribution).
 *
 * Placed after Trust (bg-surface-soft), so this section is bg-surface-primary.
 */

// Illustrative figures only — see plan §4 debt note. Never display as production metrics.
const STATS = [
  { value: '120+', label: 'Verified mechanics' },
  { value: '35+', label: 'Partner garages' },
  { value: '12k+', label: 'Service records' },
  { value: '~18 min', label: 'Avg response time' },
]

const TESTIMONIALS = [
  {
    name: 'Ravi K',
    role: 'Two-wheeler owner · Coimbatore',
    quote:
      'My bike broke down on Trichy Road: a verified mechanic was at my spot in under twenty minutes. I watched the whole thing on the live map.',
  },
  {
    name: 'Mohammed Irfan',
    role: 'Verified mechanic · Chennai',
    quote:
      "ClutchD brings me jobs I'd never reach on my own. Customers already know my rating before they call.",
  },
  {
    name: 'Deepa Nair',
    role: 'Garage operator · Kochi',
    quote:
      'Estimates, approvals, payment: it all lands in one place now. My desk stopped being a filing cabinet.',
  },
]

export default function Testimonials() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="PROOF"
          title="People on the road, in their own words"
          lede="What drivers, mechanics and garages say about working on the ClutchD network."
          id="testimonials-heading"
        />
        <div
          ref={ref}
          className={[
            'mt-12 flex flex-col gap-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {/* Stats strip — ruled ledger, mono numerals, illustrative label */}
          <div className="divide-y divide-border-default border border-border-default bg-surface-soft px-6 py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Launch figures pending: illustrative
            </p>
            <dl
              aria-label="Illustrative launch figures, not production metrics"
              className="grid grid-cols-1 gap-0 divide-y divide-border-default md:grid-cols-4 md:divide-x md:divide-y-0"
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1 px-0 py-4 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0">
                  <dt className="font-sans text-xs text-text-secondary">{label}</dt>
                  <dd className="font-mono text-3xl font-semibold text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Pull-quotes — editorial, serif, oversized opening mark */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, quote }) => (
              <EditorialQuote
                key={name}
                quote={quote}
                name={name}
                role={role}
                className="border-t border-border-default pt-6"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}