import { Package, Sparkles, Wrench } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

const TILES = [
  { icon: Package, label: 'Spare parts', body: 'OEM and compatible components from verified sellers.' },
  { icon: Sparkles, label: 'Accessories', body: 'Fitment-checked accessories for your exact model.' },
  { icon: Wrench, label: 'Service packages', body: 'Pre-priced maintenance bundles you can book in taps.' },
]

export default function Marketplace() {
  const [ref, visible] = useReveal()
  return (
    <section id="marketplace" aria-labelledby="marketplace-heading" className="scroll-mt-20 bg-surface-primary py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Marketplace"
          title="Parts and packages, matched to your vehicle"
          lede="Browse categories sourced from verified sellers — no guessing whether it fits."
        />
        <div
          ref={ref}
          className={[
            'mt-12 grid grid-cols-1 gap-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:grid-cols-3',
            visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {TILES.map(({ icon: Icon, label, body }) => (
            <article
              key={label}
              className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-soft p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-tint text-accent-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-lg font-semibold text-text-primary">{label}</h3>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
