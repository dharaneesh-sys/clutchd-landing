import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const FAQ_ITEMS = [
  {
    q: 'How does ClutchD matching work?',
    a: 'ClutchD finds verified nearby providers for your request, and you can track the match in real time.',
  },
  {
    q: 'How do estimates and pricing work?',
    a: 'You see the price before work starts and approve the estimate before the wrench lifts.',
  },
  {
    q: 'How are providers verified?',
    a: 'Every mechanic and garage passes identity and skill verification (KYC) before joining the network.',
  },
  {
    q: 'Where is ClutchD available?',
    a: 'Currently rolling out in Coimbatore, with more cities planned.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'Pay securely through the platform with Stripe and Razorpay.',
  },
  {
    q: 'What does "Preview" mean?',
    a: 'Some screens and figures on this page are illustrative previews of the product; real numbers update as ClutchD rolls out.',
  },
]

// Panel body — conditionally rendered so no layout property is ever animated
// (DESIGN.md §6: transform/opacity/filter only). Fades + slides in on mount
// via opacity/translateY; unmounts instantly on close. Reduced-motion aware.
function FaqPanel({ open, buttonId, panelId, children }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  if (!open) return null

  return (
    <section
      id={panelId}
      aria-labelledby={buttonId}
      className={[
        'transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
      ].join(' ')}
    >
      <p className="px-6 pb-5 font-sans text-sm leading-relaxed text-text-secondary">{children}</p>
    </section>
  )
}

// Single-open accordion (DESIGN.md §5 FAQ Accordion). Real <button> disclosure
// headers; chevron rotates on transform only.
export default function Faq() {
  const [ref, visible] = useReveal()
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => setOpenIndex((prev) => (prev === index ? null : index))

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <div
          ref={ref}
          className={[
            'mx-auto flex max-w-2xl flex-col gap-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            lede="Everything you need to know about how ClutchD works before you book."
            id="faq-heading"
          />

          <div className="divide-y divide-border-default rounded-2xl border border-border-default">
            {FAQ_ITEMS.map((item, index) => {
              const open = openIndex === index
              const buttonId = `faq-button-${index}`
              const panelId = `faq-panel-${index}`
              return (
                <div key={item.q}>
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-sans font-semibold text-text-primary">{item.q}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={[
                          'h-5 w-5 shrink-0 text-text-secondary transition-transform duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
                          open ? 'rotate-180' : '',
                        ].join(' ')}
                      />
                    </button>
                  </h3>
                  <FaqPanel open={open} buttonId={buttonId} panelId={panelId}>
                    {item.a}
                  </FaqPanel>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}