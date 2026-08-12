/**
 * SectionHeading — eyebrow + title + lede (DESIGN.md §3).
 *
 * Eyebrow: Geist Mono overline — 10px, 600, uppercase, +0.2em tracking,
 * accent-primary (the section's identity cue).
 * Title: Section Heading — 36px, 400, lh 1.11, -0.01em tracking.
 * Lede: Body — 18px, 400, lh 1.56, secondary text.
 *
 * Alignment: left (default) or center (centered block, max-w-2xl).
 *
 * API:
 *   <SectionHeading eyebrow="Platform" title="Built for the road"
 *     lede="…" align="center" as="h2" />
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  as: Heading = 'h2',
  className = '',
  ...rest
}) {
  const centered = align === 'center'
  return (
    <div
      className={[
        'max-w-2xl',
        centered ? 'mx-auto text-center' : 'text-left',
        className,
      ].join(' ')}
      {...rest}
    >
      {eyebrow && (
        <p className="mb-4 font-mono text-[10px] font-semibold uppercase leading-[1.3] tracking-[0.2em] text-accent-primary">
          {eyebrow}
        </p>
      )}
      <Heading className="font-sans text-4xl font-normal leading-[1.11] tracking-[-0.01em] text-text-primary">
        {title}
      </Heading>
      {lede && (
        <p className="mt-4 font-sans text-lg font-normal leading-[1.56] text-text-secondary">
          {lede}
        </p>
      )}
    </div>
  )
}