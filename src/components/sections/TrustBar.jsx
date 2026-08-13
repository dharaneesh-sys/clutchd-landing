import { BadgeCheck, ReceiptText, ShieldCheck } from 'lucide-react'
import Container from '../ui/Container.jsx'

/**
 * TrustBar — slim 3-column value-prop strip directly below the hero (DESIGN.md §5).
 *
 * Promotes the hero's inline trust line into a proper strip: Verified providers,
 * Transparent estimates, Secure payments. Icons reuse the Trust.jsx visual
 * language (h-11 w-11 tint square). 3-column grid → 1-column stack below 768px,
 * --space-8 between items. Tokens only — no new colors.
 */
const VALUE_PROPS = [
  {
    icon: BadgeCheck,
    title: 'Verified providers',
    sub: 'Every provider passes identity and skill checks.',
  },
  {
    icon: ReceiptText,
    title: 'Transparent estimates',
    sub: 'See the price before the work starts.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    sub: 'Pay through the platform — protected and receipt-backed.',
  },
]

export default function TrustBar() {
  return (
    <div className="border-y border-border-default bg-surface-primary">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3 md:py-10">
          {VALUE_PROPS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-4 md:justify-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold text-text-primary">{title}</h3>
                <p className="font-sans text-sm text-text-secondary">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}