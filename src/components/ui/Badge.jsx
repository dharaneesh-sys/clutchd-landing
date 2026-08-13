import './badge.css'

/**
 * Badge — pill tag (DESIGN.md §3 Overline / §5).
 *
 * Variants:
 *   default — cool surface, secondary text (neutral metadata)
 *   accent  — tint surface, accent text (branded label)
 *   live    — cool surface, navy text + pulsing accent dot (live affordance;
 *             the pulse is the system's one meaningful auto animation)
 *
 * API:
 *   <Badge>Beta</Badge>
 *   <Badge variant="accent">New</Badge>
 *   <Badge variant="live">Fleet online</Badge>
 */
const VARIANTS = {
  default: 'bg-surface-cool text-text-secondary',
  accent: 'bg-surface-tint text-accent-primary',
  live: 'bg-surface-cool text-text-primary',
}

export default function Badge({
  variant = 'default',
  className = '',
  children,
  ...rest
}) {
  const isLive = variant === 'live'
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
        'font-mono text-[10px] font-semibold uppercase leading-[1.3] tracking-[0.2em]',
        VARIANTS[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {isLive && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary live-dot"
        />
      )}
      {children}
    </span>
  )
}