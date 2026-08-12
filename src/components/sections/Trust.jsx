import { BadgeCheck, ReceiptText, ShieldCheck } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const BLOCKS = [
  {
    icon: BadgeCheck,
    title: 'Verified providers',
    body: 'Every mechanic and roadside partner is identity- and skill-checked before they join the network.',
  },
  {
    icon: ReceiptText,
    title: 'Transparent estimates',
    body: 'See the expected cost up front. Approve the work only when the estimate makes sense to you.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    body: 'Pay through the platform with protected, receipt-backed transactions — no cash, no ambiguity.',
  },
]

export default function Trust() {
  const [ref, visible] = useReveal()
  return (
    <section id="trust" aria-labelledby="trust-heading" className="scroll-mt-20 bg-surface-soft py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Trust by design"
          title="The basics, done right"
          lede="Three commitments that make automotive care something you can rely on."
        />
        <div
          ref={ref}
          className={[
            'mt-12 grid grid-cols-1 gap-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:grid-cols-3',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {BLOCKS.map(({ icon: Icon, title, body }) => (
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
        </div>
      </Container>
    </section>
  )
}
