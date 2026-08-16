import { Car, Wrench, Building2, Truck } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import SectionRule from '../ui/SectionRule.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

const ROLES = [
  {
    key: 'drivers',
    icon: Car,
    bullets: [
      'audiences.0.bullets.0',
      'audiences.0.bullets.1',
      'audiences.0.bullets.2',
      'audiences.0.bullets.3',
      'audiences.0.bullets.4',
      'audiences.0.bullets.5',
    ],
  },
  {
    key: 'mechanics',
    icon: Wrench,
    bullets: [
      'audiences.1.bullets.0',
      'audiences.1.bullets.1',
      'audiences.1.bullets.2',
      'audiences.1.bullets.3',
      'audiences.1.bullets.4',
    ],
  },
  {
    key: 'garages',
    icon: Building2,
    bullets: [
      'audiences.2.bullets.0',
      'audiences.2.bullets.1',
      'audiences.2.bullets.2',
      'audiences.2.bullets.3',
    ],
  },
  {
    key: 'fleets',
    icon: Truck,
    bullets: [
      'audiences.3.bullets.0',
      'audiences.3.bullets.1',
      'audiences.3.bullets.2',
      'audiences.3.bullets.3',
      'audiences.3.bullets.4',
    ],
  },
]

// Hand-drawn line motifs (1.5px stroke, accent on paper) — decorative only.
const MOTIFS = {
  drivers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-10 w-10"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
    </svg>
  ),
  mechanics: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path d="M14.5 6.5a4.2 4.2 0 0 0-5.6 5.6L3.5 17.5a2 2 0 0 0 2.8 2.8l5.4-5.4a4.2 4.2 0 0 0 5.6-5.6l-2.6 2.6-2.8-2.8 2.6-2.6Z" />
    </svg>
  ),
  garages: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  ),
  fleets: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <path d="M2.5 7h10.5v9.5H2.5z" />
      <path d="M13 10.5h3.2l3.3 3.3v2.7H13" />
      <circle cx="6.8" cy="17.8" r="1.7" />
      <circle cx="16.2" cy="17.8" r="1.7" />
    </svg>
  ),
}

// Decorative index annotations — the h3 carries the meaning.
const OVERLINES = ['audiences.0.overline', 'audiences.1.overline', 'audiences.2.overline', 'audiences.3.overline']

// V8 staggered reveal (DESIGN.md §6) — 4 cards enter as a sequence, 70ms
// apart, only when hidden→visible; reduced-motion shows them instantly.
const STAGGER = 70

export default function Audiences() {
  const { t } = useT()
  const [ref, visible] = useReveal()
  return (
    <section
      id="audiences"
      aria-labelledby="audiences-heading"
      className="grain scroll-mt-20 bg-surface-soft py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={t['audiences.eyebrow']}
          title={t['audiences.title']}
          lede={t['audiences.lede']}
          id="audiences-heading"
        />
        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12"
        >
          {ROLES.map((role, i) => {
            const featured = i === 0
            const wide = i === 0 || i === 3
            return (
              <article
                key={role.key}
                style={{ transitionDelay: visible ? `${i * STAGGER}ms` : '0ms' }}
                className={[
                  'flex flex-col rounded-2xl border border-border-default bg-surface-primary p-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:p-7',
                  wide ? 'sm:col-span-2 lg:col-span-7' : 'lg:col-span-5',
                  visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
                ].join(' ')}
              >
                {featured && <SectionRule variant="short" />}
                <div className={`flex items-start gap-4 ${featured ? 'mt-5' : ''}`}>
                  <span
                    className={
                      i === 3
                        ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-default'
                        : 'shrink-0'
                    }
                  >
                    {MOTIFS[role.key]}
                  </span>
                  <div>
                    <p
                      aria-hidden="true"
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-primary"
                    >
                      {t[OVERLINES[i]]}
                    </p>
                    <h3
                      className={`mt-1 font-display font-semibold tracking-tight text-text-primary ${
                        featured ? 'text-2xl' : 'text-xl'
                      }`}
                    >
                      {t[`audiences.${i}.title`]}
                    </h3>
                  </div>
                </div>
                <ul className="mt-6 flex-1 divide-y divide-border-default border-t border-border-default">
                  {role.bullets.map((key) => (
                    <li key={key} className="flex items-start gap-3 py-2.5">
                      <span aria-hidden="true" className="mt-[0.55em] h-px w-4 shrink-0 bg-accent-primary" />
                      <span className="font-sans text-sm leading-relaxed text-text-secondary">{t[key]}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}