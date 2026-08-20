import LogoMark from './LogoMark.jsx'
import { useT } from '../../lib/i18n.js'

/**
 * Logo — "ClutchD" wordmark lockup (T4).
 *
 * LogoMark + wordmark text. The "D" is rendered in accent-primary
 * (#1E29B6 via token) — the brand's single saturated blue moment.
 * NOT orange, NOT any other hue.
 */
export default function Logo({ className = '', markClassName = 'h-9 w-9', variant = 'light', ...rest }) {
  const { t } = useT()
  const isDark = variant === 'dark'
  return (
    <span className={`inline-flex items-center gap-2.5 ${isDark ? 'text-white' : ''} ${className}`} {...rest}>
      <LogoMark className={markClassName} variant={variant} />
      <span className={`font-sans text-[22px] font-semibold leading-none tracking-tight ${isDark ? '' : 'text-text-primary'}`}>
        {t['brand.wordmark']}
        <span className={isDark ? 'text-blue-400' : 'text-accent-primary'}>{t['brand.wordmarkAccent']}</span>
      </span>
    </span>
  )
}