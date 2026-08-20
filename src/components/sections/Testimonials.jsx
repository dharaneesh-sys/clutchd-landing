import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import EditorialQuote from '../ui/EditorialQuote.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

/**
 * Testimonials — social proof section (DESIGN.md §5 EditorialQuote + AnnotatedList).
 *
 * Two parts:
 *   1. Stats strip — 4 illustrative launch figures as a ruled ledger (divide-y,
 *      mono numerals, honest "illustrative" label).
 *   2. Pull-quotes — driver / mechanic / garage operator voices via EditorialQuote
 *      (serif, oversized opening mark, attribution).
 *
 * Placed after Trust (bg-surface-soft), so this section is bg-surface-primary.
 */

// Illustrative figures only — see plan §4 debt note. Never display as production metrics.
const STAT_KEYS = ['testimonials.0', 'testimonials.1', 'testimonials.2', 'testimonials.3']
const QUOTE_KEYS = ['testimonials.quote.0', 'testimonials.quote.1', 'testimonials.quote.2']

export default function Testimonials() {
  const { t } = useT()
  const [ref, visible] = useReveal()
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative scroll-mt-20 bg-surface-tint py-16 lg:py-20"
    >
      {/* Ghost numeral Nº03 — DESIGN.md §5 Display Statement. Decorative,
          aria-hidden, positioned behind the heading at display scale. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-8 font-display font-light italic leading-none text-text-primary opacity-[0.04] max-md:hidden"
        style={{ fontSize: 'clamp(8rem, 14vw, 14rem)' }}
      >
        Nº03
      </span>
      <Container className="relative">
        <SectionHeading
          eyebrow={t['testimonials.eyebrow']}
          title={t['testimonials.title']}
          lede={t['testimonials.lede']}
          id="testimonials-heading"
        />
        <div
          ref={ref}
          className={[
            'mt-12 flex flex-col gap-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {/* Stats strip — ruled ledger, mono numerals, illustrative label */}
          <div className="divide-y divide-border-default border border-border-default bg-surface-soft px-6 py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
              {t['testimonials.statsLabel']}
            </p>
            <dl
              aria-label={t['testimonials.statsAriaLabel']}
              className="grid grid-cols-1 gap-0 divide-y divide-border-default md:grid-cols-4 md:divide-x md:divide-y-0"
            >
              {STAT_KEYS.map((base) => (
                <div key={base} className="flex flex-col gap-1 px-0 py-4 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0">
                  <dt className="font-sans text-xs text-text-secondary">{t[`${base}.label`]}</dt>
                  <dd className="font-display text-5xl font-semibold tracking-tight text-text-primary lg:text-6xl">{t[`${base}.value`]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Pull-quotes — editorial, serif, oversized opening mark */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {QUOTE_KEYS.map((base) => (
              <EditorialQuote
                key={base}
                quote={t[`${base}.quote`]}
                name={t[`${base}.name`]}
                role={t[`${base}.role`]}
                className="border-t border-border-default pt-6"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}