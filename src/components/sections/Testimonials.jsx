import { Star } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

/**
 * Testimonials — social proof section (DESIGN.md §5 Testimonial Card + Stats Strip).
 *
 * Two parts:
 *   1. Stats strip — 4 illustrative launch figures (the backend has no exported
 *      analytics; labelled clearly as illustrative, not presented as real).
 *   2. Testimonial cards — driver / mechanic / garage operator voices.
 *
 * Placed after Trust (bg-surface-soft), so this section is bg-surface-primary;
 * cards use tonal-shift surfaces (bg-surface-soft) with hairline borders.
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
    rating: 5.0,
    quote:
      'My bike broke down on Trichy Road — a verified mechanic was at my spot in under twenty minutes. I watched the whole thing on the live map.',
  },
  {
    name: 'Mohammed Irfan',
    role: 'Verified mechanic · Chennai',
    rating: 4.9,
    quote:
      "ClutchD brings me jobs I'd never reach on my own. Customers already know my rating before they call.",
  },
  {
    name: 'Deepa Nair',
    role: 'Garage operator · Kochi',
    rating: 4.8,
    quote:
      'Estimates, approvals, payment — it all lands in one place now. My desk stopped being a filing cabinet.',
  },
]

// 5-star row; filled overlay clipped to the exact rating (no invented round-ups).
const STAR_KEYS = [0, 1, 2, 3, 4]
function StarRating({ rating }) {
  const pct = `${(rating / 5) * 100}%`
  return (
    <span className="relative inline-flex items-center gap-2">
      <span className="relative inline-flex" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        <span className="flex gap-0.5">
          {STAR_KEYS.map((n) => (
            <Star key={n} className="h-3.5 w-3.5 text-text-secondary" />
          ))}
        </span>
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: pct }}>
          <span className="flex gap-0.5">
            {STAR_KEYS.map((n) => (
              <Star key={n} className="h-3.5 w-3.5 shrink-0 fill-accent-primary text-accent-primary" />
            ))}
          </span>
        </span>
      </span>
      <span className="font-mono text-xs text-text-secondary">{rating.toFixed(1)}</span>
    </span>
  )
}

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
            'mt-12 flex flex-col gap-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {/* Stats strip — illustrative launch figures, clearly labelled */}
          <div className="rounded-2xl border border-border-default bg-surface-soft px-6 py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Launch figures pending — illustrative
            </p>
            <dl
              aria-label="Illustrative launch figures, not production metrics"
              className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-4"
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col-reverse gap-2">
                  <dt className="font-sans text-sm text-text-secondary">{label}</dt>
                  <dd className="font-mono text-4xl font-semibold text-text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, rating, quote }) => (
              <article
                key={name}
                className="flex flex-col gap-4 rounded-2xl border border-border-default bg-surface-soft p-6"
              >
                <StarRating rating={rating} />
                <blockquote className="font-sans text-sm leading-relaxed text-text-primary">
                  “{quote}”
                </blockquote>
                <footer className="mt-auto flex flex-col gap-1">
                  <span className="font-sans text-sm font-semibold text-text-primary">{name}</span>
                  <span className="font-sans text-xs text-text-secondary">{role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
