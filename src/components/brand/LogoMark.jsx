/**
 * LogoMark — ClutchD brand mark (T4).
 *
 * A machined clutch/gear plate fused with a gear-shift gate: eight rounded
 * teeth bite the outer ring, and the accent core carries an H-pattern shift
 * gate (three rows + neutral rail + knob) — the "shift engagement" motif.
 *
 * Fresh design: NOT the legacy speed-line C, NOT any referenced brand's
 * mark (coinbase / linear / stripe are explicitly avoided — no geometric C,
 * no arrow chevron, no slanted stripe).
 *
 * Two-tone: the gear plate + teeth draw in `currentColor` (navy in the
 * light context) while the core disc is accent-primary and the gate is
 * surface-tint — so the mark inherits surrounding text color but always
 * carries the brand blue core.
 *
 * Self-contained inline SVG: no external refs, no <img>, no URLs.
 */
const TEETH_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

export default function LogoMark({ className = '', variant = 'light', ...rest }) {
  const isDark = variant === 'dark'
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`inline-block h-8 w-8 ${className}`}
      {...rest}
    >
      {/* Gear teeth — eight rounded bites around the plate (currentColor = navy in light, white in dark) */}
      {TEETH_ANGLES.map((deg) => (
        <rect
          key={deg}
          x="21.5"
          y="1.5"
          width="5"
          height="6.5"
          rx="1.5"
          transform={`rotate(${deg} 24 24)`}
          fill="currentColor"
        />
      ))}
      {/* Clutch plate — machined disc (currentColor) */}
      <circle cx="24" cy="24" r="16" fill="currentColor" />
      {/* Engagement core — the brand blue, always present */}
      <circle cx="24" cy="24" r="10" fill={isDark ? 'var(--accent-on-dark)' : 'var(--accent-primary)'} />
      {/* Shift gate — H-pattern rows + neutral rail */}
      <g
        fill="none"
        stroke={isDark ? 'var(--gate-on-dark)' : 'var(--surface-tint)'}
        strokeWidth="2"
        strokeLinecap="round"
      >
        {/* Row 1–2 */}
        <path d="M18.5 19H29.5" />
        {/* Row 3–4 */}
        <path d="M18.5 24H29.5" />
        {/* Row 5–R */}
        <path d="M18.5 29H29.5" />
        {/* Neutral rail */}
        <path d="M24 19V29" />
      </g>
      {/* Shift knob on the top row */}
      <circle cx="18.5" cy="19" r="2.2" fill="var(--surface-tint)" />
    </svg>
  )
}
