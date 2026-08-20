import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import SectionNumeral from '../ui/SectionNumeral.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

/**
 * Trust — editorial commitments (DESIGN.md §5 AnnotatedList + artifact card).
 *
 * Five commitments as a ruled numbered list (Nº01–05: SectionNumeral + serif
 * title + mono annotation per row, divide-y hairlines) beside a drawn estimate
 * document (ruled sheet, mono prices, Preview + Approved badges). No
 * icon-in-tint-square grammar. 2-col grid → 1-col stack below 768px.
 */
const PRIMITIVE_KEYS = ['trust.0', 'trust.1', 'trust.2', 'trust.3', 'trust.4']

// V8 staggered reveal (DESIGN.md §6) — the five ruled rows enter as a
// sequence (70ms apart), the estimate artifact last; reduced-motion shows
// everything instantly.
const STAGGER = 70

export default function Trust() {
  const { t } = useT()
  const [ref, visible] = useReveal()
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="grain relative scroll-mt-20 bg-surface-soft py-24 lg:py-32"
    >
      {/* Ghost numeral Nº01 — behind the heading, decorative. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-8 font-display font-light italic leading-none text-text-primary opacity-[0.04] max-md:hidden"
        style={{ fontSize: 'clamp(8rem, 14vw, 14rem)' }}
      >
        Nº01
      </span>
      <Container className="relative">
        <SectionHeading
          eyebrow={t['trust.eyebrow']}
          title={t['trust.title']}
          lede={t['trust.lede']}
          id="trust-heading"
          numeral={1}
          rule
        />
        <div
          ref={ref}
          className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16"
        >
          {/* Ruled numbered list — Nº01–05 */}
          <ol className="divide-y divide-border-default">
            {PRIMITIVE_KEYS.map((base, i) => (
              <li
                key={base}
                style={{ transitionDelay: visible ? `${i * STAGGER}ms` : '0ms' }}
                className={[
                  'grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 py-5 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:gap-x-6',
                  visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
                ].join(' ')}
              >
                <SectionNumeral n={String(i + 1).padStart(2, '0')} className="pt-1" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl font-semibold text-text-primary">{t[`${base}.title`]}</h3>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {t[`${base}.tag`]}
                  </span>
                </div>
                <p className="col-start-2 font-sans text-sm leading-relaxed text-text-secondary">
                  {t[`${base}.body`]}
                </p>
              </li>
            ))}
          </ol>

          {/* Estimate document — drawn paper artifact with stacked-sheet edge, labeled Preview */}
          <div className="relative md:self-start">
            {/* Stacked-sheet edge (pure CSS, DESIGN.md §7 elevated shadow) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-1 translate-y-1 rounded-lg border border-border-default bg-surface-soft"
            />
            <div
              style={{ transitionDelay: visible ? `${PRIMITIVE_KEYS.length * STAGGER}ms` : '0ms' }}
              className={[
                'relative rounded-lg border border-border-default bg-surface-primary p-8 shadow-elevated transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] sm:p-9',
                visible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
              ].join(' ')}
            >
            <div className="flex items-start justify-between gap-4 border-b border-border-default pb-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-2xl font-semibold text-text-primary">{t['trust.estimate.title']}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">ClutchD-2026-0847</span>
              </div>
              <Badge variant="accent">{t['trust.estimate.previewBadge']}</Badge>
            </div>
            <dl className="mt-3 flex flex-col">
              <div className="flex items-baseline justify-between py-3">
                <dt className="font-sans text-sm text-text-secondary">{t['trust.estimate.labour']}</dt>
                <dd className="font-mono text-sm font-medium text-text-primary">{t['trust.estimate.labourValue']}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border-default py-3">
                <dt className="font-sans text-sm text-text-secondary">{t['trust.estimate.parts']}</dt>
                <dd className="font-mono text-sm font-medium text-text-primary">{t['trust.estimate.partsValue']}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border-default py-3">
                <dt className="font-sans text-sm font-semibold text-text-primary">{t['trust.estimate.total']}</dt>
                <dd className="font-mono text-sm font-semibold text-text-primary">{t['trust.estimate.totalValue']}</dd>
              </div>
            </dl>
            <div className="mt-5 flex justify-end border-t border-border-default pt-5">
              <span className="rotate-[-8deg] rounded border-2 border-accent-primary px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-primary ring-4 ring-accent-primary/10">
                {t['trust.estimate.approved']}
              </span>
            </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}