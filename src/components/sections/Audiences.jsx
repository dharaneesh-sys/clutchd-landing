import { Car, Wrench, Truck, Check } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const ROLES = [
  {
    icon: Car,
    title: 'Car owners',
    bullets: [
      'Book verified mechanics without the guesswork',
      'Track every job and keep a full service history',
      'See transparent estimates before you approve',
    ],
  },
  {
    icon: Wrench,
    title: 'Workshops & mechanics',
    bullets: [
      'Get matched to nearby jobs that fit your skills',
      'Manage requests, invoices, and reviews in one place',
      'Build a verified reputation drivers trust',
    ],
  },
  {
    icon: Truck,
    title: 'Fleets & dealers',
    bullets: [
      'Coordinate maintenance across many vehicles',
      'Standardize service records and spend reporting',
      'Prioritize uptime with proactive scheduling',
    ],
  },
]

export default function Audiences() {
  const [ref, visible] = useReveal()
  return (
    <section id="audiences" aria-labelledby="audiences-heading" className="scroll-mt-20 bg-surface-soft py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Who it's for"
          title="Built for everyone who keeps a vehicle running"
          lede="One ecosystem, three perspectives — all working from the same verified network."
        />
        <div
          ref={ref}
          className={[
            'mt-12 grid grid-cols-1 gap-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:grid-cols-3',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {ROLES.map(({ icon: Icon, title, bullets }) => (
            <article
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-border-default bg-surface-primary p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">{title}</h3>
              <ul className="flex flex-col gap-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 font-sans text-sm text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
