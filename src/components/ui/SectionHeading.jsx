import SectionNumeral from './SectionNumeral.jsx'
import SectionRule from './SectionRule.jsx'

/**
 * SectionHeading — eyebrow (overline) + h2 + optional lede (DESIGN.md §3/§5).
 * V3: display title is serif (Fraunces); optional `numeral` + `rule` render
 * the editorial annotation lockup (SectionNumeral + SectionRule, both
 * decorative/aria-hidden).
 */
export default function SectionHeading({ eyebrow, title, lede, align = 'left', id, numeral, rule = false }) {
  const wrap = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'
  return (
    <div className={wrap}>
      {(eyebrow || numeral) && (
        <div
          className={
            align === 'center'
              ? 'flex flex-col items-center gap-3'
              : 'flex items-center gap-3'
          }
        >
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
              {eyebrow}
            </p>
          )}
          {numeral && <SectionNumeral n={numeral} />}
        </div>
      )}
      {rule && <SectionRule variant="short" className="mt-3" />}
      <h2
        id={id}
        className="mt-3 font-display font-semibold leading-[1.10] tracking-tight text-text-primary"
        style={{ fontSize: 'clamp(1.75rem, 2.5vw + 0.5rem, 3rem)' }}
      >
        {title}
      </h2>
      {lede && <p className="mt-4 font-sans text-lg leading-relaxed text-text-secondary">{lede}</p>}
    </div>
  )
}