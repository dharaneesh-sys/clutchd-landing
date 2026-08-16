import { Fragment, useState } from 'react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

// 9-node connected data flow (user brief §18). Visual chain visualization —
// not interactive controls; intentionally out of tab order. Hover (mouse)
// highlights connections.
const NODE_KEYS = [
  'ecosystem.0.node',
  'ecosystem.1.node',
  'ecosystem.2.node',
  'ecosystem.3.node',
  'ecosystem.4.node',
  'ecosystem.5.node',
  'ecosystem.6.node',
  'ecosystem.7.node',
  'ecosystem.8.node',
]

export default function Ecosystem() {
  const { t } = useT()
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
          eyebrow={t['ecosystem.eyebrow']}
          title={t['ecosystem.title']}
          lede={t['ecosystem.lede']}
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
            {NODE_KEYS.map((nodeKey, i) => {
              const isHovered = hovered === i
              const isConnected = hovered === i - 1 || hovered === i + 1
              return (
                <Fragment key={nodeKey}>
                  <span
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className={[
                      'rounded-full border px-4 py-2 text-center font-sans text-sm font-medium outline-none transition-colors',
                      isHovered
                        ? 'border-accent-primary bg-surface-tint text-accent-primary ring-2 ring-accent-primary'
                        : isConnected
                          ? 'border-accent-primary bg-surface-soft text-text-primary'
                          : 'border-border-default bg-surface-soft text-text-primary',
                    ].join(' ')}
                  >
                    {t[nodeKey]}
                  </span>
                  {i < NODE_KEYS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="flex items-center select-none"
                    >
                      <span className="hidden md:block">
                        <svg role="img" aria-hidden="true" width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <title>{t['ecosystem.connectsNext']}</title>
                          <path
                            d="M0 6H20M20 6L16 2M20 6L16 10"
                            stroke={hovered === i || hovered === i + 1 ? "var(--accent-primary)" : "var(--border-default)"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="md:hidden">
                        <svg role="img" aria-hidden="true" width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <title>{t['ecosystem.connectsNext']}</title>
                          <path
                            d="M6 0V20M6 20L2 16M6 20L10 16"
                            stroke={hovered === i || hovered === i + 1 ? "var(--accent-primary)" : "var(--border-default)"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  )}
                </Fragment>
              )
            })}
          </div>
          <p className="mt-6 text-center font-sans text-sm text-text-secondary">
            {t['ecosystem.hint']}
          </p>
        </div>
      </Container>
    </section>
  )
}
