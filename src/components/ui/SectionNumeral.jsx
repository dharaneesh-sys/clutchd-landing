/**
 * SectionNumeral — editorial annotation `Nº01` (DESIGN.md §5).
 * Decorative only: the number is a visual annotation, never content —
 * always rendered aria-hidden. Pair with SectionRule for the
 * numeral + rule lockup.
 */
export default function SectionNumeral({ n, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`font-display text-sm italic tracking-wide text-text-secondary ${className}`}
    >
      Nº{n}
    </span>
  )
}