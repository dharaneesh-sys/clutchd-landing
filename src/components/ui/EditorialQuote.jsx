/**
 * EditorialQuote — pull-quote (DESIGN.md §5). Serif quote body in warm ink
 * on light surfaces, oversized serif opening mark, attribution block.
 * Quote is real content — never aria-hidden.
 */
export default function EditorialQuote({ quote, name, role, align = 'left', className = '' }) {
  const wrap = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'
  return (
    <figure className={`${wrap} ${className}`}>
      <span aria-hidden="true" className="font-display text-6xl leading-none text-accent-primary">
        “
      </span>
      <blockquote className="font-display text-2xl font-medium leading-snug text-text-ink sm:text-[1.75rem]">
        {quote}
      </blockquote>
      <figcaption className="mt-4 flex flex-col gap-1">
        <span className="font-sans text-sm font-semibold text-text-primary">{name}</span>
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary">{role}</span>
      </figcaption>
    </figure>
  )
}