import Container from '../ui/Container.jsx'
import SectionNumeral from '../ui/SectionNumeral.jsx'
import { useT } from '../../lib/i18n.js'

/**
 * TrustBar — hairline-ruled editorial strip directly below the hero (DESIGN.md §5).
 *
 * Promotes the hero's inline trust line into a printed index: three value props
 * with decorative serif numerals Nº01–03, items separated by hairlines
 * (divide-y on mobile, divide-x ≥768px). No icons, no tint squares.
 * 3-column grid → 1-column stack below 768px. Tokens only — no new colors.
 */

export default function TrustBar() {
  const { t } = useT()
  const items = [0, 1, 2]
  return (
    <div className="border-y border-border-default bg-surface-primary py-12 lg:py-16">
      <Container>
        <ol className="grid grid-cols-1 divide-y divide-border-default md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((i) => (
            <li
              key={i}
              className="flex flex-col gap-2 py-6 md:px-8 md:py-8 md:first:pl-0 md:last:pr-0"
            >
              <SectionNumeral n={String(i + 1).padStart(2, '0')} />
              <h2 className="font-display text-lg font-semibold text-text-primary">{t[`trustBar.${i}.title`]}</h2>
              <p className="font-sans text-sm text-text-secondary">{t[`trustBar.${i}.sub`]}</p>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  )
}