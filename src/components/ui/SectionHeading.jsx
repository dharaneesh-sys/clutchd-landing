/**
 * SectionHeading — eyebrow (overline) + h2 + optional lede (DESIGN.md §3/§5).
 * Used by every content section so the type scale and rhythm stay consistent.
 */
export default function SectionHeading({ eyebrow, title, lede, align = 'left' }) {
  const wrap = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'
  return (
    <div className={wrap}>
      {eyebrow && (
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      {lede && <p className="mt-4 font-sans text-lg leading-relaxed text-text-secondary">{lede}</p>}
    </div>
  )
}
