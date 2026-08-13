import { Fragment, useState } from 'react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'

// 9-node connected data flow (user brief §18). Hover/focus a node highlights
// its connected edges — a real affordance, not decoration.
const NODES = [
  'Driver',
  'Vehicle',
  'Service Request',
  'Mechanic',
  'Garage',
  'Parts',
  'Payment',
  'Service History',
  'Vehicle Intelligence',
]

export default function Ecosystem() {
  const [ref, visible] = useReveal()
  const [hovered, setHovered] = useState(null)

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="THE ECOSYSTEM"
          title="Every service, connected"
          lede="ClutchD puts drivers, mechanics, garages, fleets, parts, payments and service history on one system — so the vehicle's story never starts over."
          id="ecosystem-heading"
        />
        <div
          ref={ref}
          className={[
            'mt-12 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          <div className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-1 md:gap-y-3">
            {NODES.map((node, i) => {
              const isHovered = hovered === i
              const isConnected = hovered === i - 1 || hovered === i + 1
              return (
                <Fragment key={node}>
                  <button
                    type="button"
                    aria-label={node}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className={[
                      'rounded-full border px-4 py-2 text-center font-sans text-sm font-medium outline-none transition-colors',
                      isHovered
                        ? 'border-accent-primary bg-surface-tint text-accent-primary ring-2 ring-accent-primary'
                        : isConnected
                          ? 'border-accent-primary bg-surface-soft text-text-primary'
                          : 'border-border-default bg-surface-soft text-text-primary',
                    ].join(' ')}
                  >
                    {node}
                  </button>
                  {i < NODES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={[
                        'select-none text-lg font-bold',
                        hovered === i || hovered === i + 1 ? 'text-accent-primary' : 'text-border-default',
                      ].join(' ')}
                    >
                      <span className="hidden md:inline">→</span>
                      <span className="md:hidden">↓</span>
                    </span>
                  )}
                </Fragment>
              )
            })}
          </div>
          <p className="mt-6 text-center font-sans text-sm text-text-secondary">
            Hover or focus a node to see how it connects to the next step in the chain.
          </p>
        </div>
      </Container>
    </section>
  )
}
