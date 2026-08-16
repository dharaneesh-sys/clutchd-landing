import LogoMark from './LogoMark.jsx'
import { useT } from '../../lib/i18n.js'

/**
 * Logo — "ClutchD" wordmark lockup (T4).
 *
 * LogoMark + wordmark text. The "D" is rendered in accent-primary
 * (#1E29B6 via token) — the brand's single saturated blue moment.
 * NOT orange, NOT any other hue.
 */
export default function Logo({ className = '', markClassName = 'h-9 w-9', ...rest }) {
  const { t } = useT()
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} {...rest}>
      <LogoMark className={markClassName} />
      <span className="font-sans text-[22px] font-semibold leading-none tracking-tight text-text-primary">
        {t['brand.wordmark']}
        <span className="text-accent-primary">{t['brand.wordmarkAccent']}</span>
      </span>
    </span>
  )
}