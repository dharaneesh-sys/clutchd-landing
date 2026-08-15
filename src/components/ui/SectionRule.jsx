/**
 * SectionRule — hairline editorial divider (DESIGN.md §5).
 * Decorative only — always aria-hidden. Variants:
 *   "full"   — full-width hairline within its column (border-t)
 *   "short"  — short rule (w-12) for numeral/eyebrow lockups
 */
export default function SectionRule({ variant = 'full', className = '' }) {
  const base = variant === 'short' ? 'w-12' : 'w-full'
  return <div aria-hidden="true" className={`${base} border-t border-border-default ${className}`} />
}