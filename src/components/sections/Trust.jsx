import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import SectionNumeral from '../ui/SectionNumeral.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'

/**
 * Trust — editorial commitments (DESIGN.md §5 AnnotatedList + artifact card).
 *
 * Five commitments as a ruled numbered list (Nº01–05: SectionNumeral + serif
 * title + mono annotation per row, divide-y hairlines) beside a drawn estimate
 * document (ruled sheet, mono prices, Preview + Approved badges). No
 * icon-in-tint-square grammar. 2-col grid → 1-col stack below 768px.
 */
const PRIMITIVES = [
  {
    tag: 'KYC',
    title: 'Verified mechanics & garages',
    body: 'Every provider passes identity and skill verification (KYC) before they join the network.',
  },
  {
    tag: 'ESTIMATE',
    title: 'Transparent estimates',
    body: 'See the price before the work starts. Approve the estimate, then the wrench lifts.',
  },
  {
    tag: 'RATINGS',
    title: 'Ratings & reviews',
    body: 'Real feedback from real jobs keeps the network honest and accountable.',
  },
  {
    tag: 'PAYMENTS',
    title: 'Secure payments',
    body: 'Pay through the platform with Stripe and Razorpay — protected and receipt-backed.',
  },
  {
    tag: 'RECORDS',
    title: 'Digital service records',
    body: 'Your vehicle’s history lives on the vehicle, not in a drawer of paper invoices.',
  },
]

// V8 staggered reveal (DESIGN.md §6) — the five ruled rows enter as a
// sequence (70ms apart), the estimate artifact last; reduced-motion shows
// everything instantly.
const STAGGER = 70

export default function Trust() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="grain scroll-mt-20 bg-surface-soft py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="TRUST"
          title="Know exactly who you're dealing with"
          lede="Five commitments that make automotive care something you can rely on."
          id="trust-heading"
          numeral={1}
          rule
        />
        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16"
        >
          {/* Ruled numbered list — Nº01–05 */}
          <ol className="divide-y divide-border-default">
            {PRIMITIVES.map(({ tag, title, body }, i) => (
              <li
                key={title}
                style={{ transitionDelay: visible ? `${i * STAGGER}ms` : '0ms' }}
                className={[
                  'grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 py-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:gap-x-6',
                  visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
                ].join(' ')}
              >
                <SectionNumeral n={String(i + 1).padStart(2, '0')} className="pt-1" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl font-semibold text-text-primary">{title}</h3>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {tag}
                  </span>
                </div>
                <p className="col-start-2 font-sans text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
              </li>
            ))}
          </ol>

          {/* Estimate document — drawn paper artifact, labeled Preview */}
          <div
            style={{ transitionDelay: visible ? `${PRIMITIVES.length * STAGGER}ms` : '0ms' }}
            className={[
              'rounded-lg border border-border-default bg-surface-primary p-6 shadow-[0_8px_24px_rgba(13,18,79,0.08)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:p-7 md:self-start',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-default pb-4">
              <h3 className="font-display text-2xl font-semibold text-text-primary">Estimate</h3>
              <Badge variant="accent">Preview</Badge>
            </div>
            <dl className="mt-2 flex flex-col">
              <div className="flex items-baseline justify-between py-3">
                <dt className="font-sans text-sm text-text-secondary">Labour</dt>
                <dd className="font-mono text-sm font-medium text-text-primary">₹850</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border-default py-3">
                <dt className="font-sans text-sm text-text-secondary">Parts</dt>
                <dd className="font-mono text-sm font-medium text-text-primary">₹1,200</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border-default py-3">
                <dt className="font-sans text-sm font-semibold text-text-primary">Total</dt>
                <dd className="font-mono text-sm font-semibold text-text-primary">₹2,050</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-end border-t border-border-default pt-4">
              <span className="rotate-[-6deg] rounded border-2 border-accent-primary px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-primary">
                Approved
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}