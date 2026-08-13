import { BadgeCheck, ReceiptText, Star, ShieldCheck, FileText } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'

const PRIMITIVES = [
  {
    icon: BadgeCheck,
    title: 'Verified mechanics & garages',
    body: 'Every provider passes identity and skill verification (KYC) before they join the network.',
  },
  {
    icon: ReceiptText,
    title: 'Transparent estimates',
    body: 'See the price before the work starts. Approve the estimate, then the wrench lifts.',
  },
  {
    icon: Star,
    title: 'Ratings & reviews',
    body: 'Real feedback from real jobs keeps the network honest and accountable.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    body: 'Pay through the platform with Stripe and Razorpay — protected and receipt-backed.',
  },
  {
    icon: FileText,
    title: 'Digital service records',
    body: 'Your vehicle’s history lives on the vehicle, not in a drawer of paper invoices.',
  },
]

export default function Trust() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="scroll-mt-20 bg-surface-soft py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="TRUST"
          title="Know exactly who you're dealing with"
          lede="Five commitments that make automotive care something you can rely on."
          id="trust-heading"
        />
        <div
          ref={ref}
          className={[
            'mt-12 grid grid-cols-1 gap-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:grid-cols-2 lg:grid-cols-3',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {PRIMITIVES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-primary p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">{title}</h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">{body}</p>
            </div>
          ))}

          {/* Estimate breakdown mock — labeled Preview, generic amounts */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-primary p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-lg font-semibold text-text-primary">Estimate</h3>
              <Badge variant="accent">Preview</Badge>
            </div>
            <dl className="flex flex-col gap-2 font-sans text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Labour</dt>
                <dd className="font-medium text-text-primary">₹850</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-secondary">Parts</dt>
                <dd className="font-medium text-text-primary">₹1,200</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border-default pt-2">
                <dt className="font-semibold text-text-primary">Total</dt>
                <dd className="font-semibold text-text-primary">₹2,050</dd>
              </div>
            </dl>
            <Badge className="self-start px-2.5 py-0.5 text-[9px]">Approved</Badge>
          </div>
        </div>
      </Container>
    </section>
  )
}