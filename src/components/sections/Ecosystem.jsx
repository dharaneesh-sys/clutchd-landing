import { Search, Siren, Package, Radar } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const CARDS = [
  {
    icon: Search,
    title: 'Find & book verified mechanics',
    body: 'Search by location, vehicle, and service. Every provider is verified before they join the network.',
  },
  {
    icon: Siren,
    title: 'Roadside help, on demand',
    body: 'Request a tow, jump-start, or on-site fix and watch a verified provider head your way in real time.',
  },
  {
    icon: Package,
    title: 'Parts & service history',
    body: 'Source the right spare parts and keep every invoice, job, and warranty in one searchable record.',
  },
  {
    icon: Radar,
    title: 'Live tracking & transparent estimates',
    body: 'See exactly where your provider is and what the work will cost before a wrench is lifted.',
  },
]

export default function Ecosystem() {
  const [ref, visible] = useReveal()
  return (
    <section id="ecosystem" aria-labelledby="ecosystem-heading" className="scroll-mt-20 bg-surface-primary py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="The ecosystem"
          title="Everything your vehicle needs, in one place"
          lede="One connected platform for the people who drive, the people who fix, and the parts that keep it all moving."
        />
        <div
          ref={ref}
          className={[
            'mt-12 grid grid-cols-1 gap-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:grid-cols-2 lg:grid-cols-4',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {CARDS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-soft p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">{title}</h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
