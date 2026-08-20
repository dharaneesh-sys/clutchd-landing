import { Wrench, Disc, Zap, Route, Filter, Package, Star } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import SectionNumeral from '../ui/SectionNumeral.jsx'
import SectionRule from '../ui/SectionRule.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

// REAL category labels from ClutchD-App/src/lib/constants.js PRODUCT_CATEGORIES
// (verified 2026-08-11) — the illustrative brief list is superseded.
const CATEGORY_KEYS = [
  { icon: Wrench, key: 'marketplace.0.category' },
  { icon: Disc, key: 'marketplace.1.category' },
  { icon: Zap, key: 'marketplace.2.category' },
  { icon: Route, key: 'marketplace.3.category' },
  { icon: Filter, key: 'marketplace.4.category' },
  { icon: Package, key: 'marketplace.5.category' },
]

// V8 staggered reveal (DESIGN.md §6) — catalog strip, callout pair, and
// catalog card enter as a sequence (80ms apart); reduced-motion instant.
const STAGGER = 80

export default function Marketplace() {
  const { t } = useT()
  const [ref, visible] = useReveal()
  return (
    <section
      id="marketplace"
      aria-labelledby="marketplace-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={t['marketplace.eyebrow']}
          title={t['marketplace.title']}
          lede={t['marketplace.lede']}
          id="marketplace-heading"
        />
        <div ref={ref} className="mt-12">
          {/* Ruled catalog strip — hairline ledger of categories (real labels) */}
          <div
            className={[
              'border-y border-border-default transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="hidden divide-x divide-border-default lg:grid lg:grid-cols-6">
              {CATEGORY_KEYS.map(({ icon: Icon, key }) => (
                <div key={key} className="flex flex-col items-start gap-2.5 px-5 py-6">
                  <Icon aria-hidden="true" className="h-5 w-5 text-accent-primary" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                    {t[key]}
                  </span>
                </div>
              ))}
            </div>
            <div className="divide-y divide-border-default lg:hidden">
              {CATEGORY_KEYS.map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-center gap-3 px-1 py-3.5">
                  <Icon aria-hidden="true" className="h-4 w-4 text-accent-primary" />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary">
                    {t[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Capability callouts — 2-up editorial pair */}
          <div
            style={{ transitionDelay: visible ? `${STAGGER}ms` : '0ms' }}
            className={[
              'mt-10 grid grid-cols-1 gap-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:grid-cols-2',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="flex flex-col gap-3">
              <SectionRule variant="short" />
              <div className="mt-2 flex items-baseline gap-3">
                <SectionNumeral n={1} />
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                  {t['marketplace.callout.0.title']}
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                {t['marketplace.callout.0.body']}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <SectionRule variant="short" />
              <div className="mt-2 flex items-baseline gap-3">
                <SectionNumeral n={2} />
                <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                  {t['marketplace.callout.1.title']}
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-text-secondary">
                {t['marketplace.callout.1.body']}
              </p>
            </div>
          </div>

          {/* Catalog card artifact — labeled Preview, illustrative */}
          <div
            style={{ transitionDelay: visible ? `${STAGGER * 2}ms` : '0ms' }}
            className={[
              'mt-10 max-w-md border border-border-default bg-surface-primary shadow-elevated transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                {t['marketplace.catalog.partNo']}
              </span>
              <Badge variant="accent">{t['marketplace.catalog.previewBadge']}</Badge>
            </div>
            <div className="flex flex-col gap-2 px-6 py-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                {t['marketplace.catalog.title']}
              </h3>
              <p className="font-mono text-sm text-text-secondary">{t['marketplace.catalog.price']}</p>
            </div>
            <div className="flex items-center justify-between border-t border-border-default px-6 py-4">
              <span className="inline-flex items-center gap-1.5 rounded border border-accent-primary bg-accent-primary/10 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-accent-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3 w-3"
                >
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
                {t['marketplace.catalog.fits']}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                <Star aria-hidden="true" className="h-3 w-3 fill-accent-primary text-accent-primary" />
                {t['marketplace.catalog.rating']}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}