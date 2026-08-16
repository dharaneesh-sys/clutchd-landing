import { Fragment } from 'react'
import { useT } from '../../lib/i18n.js'

/**
 * LanguageToggle — EN | தமிழ் switcher (Wave XII-1b).
 *
 * Compact two-button group: the active language is accented
 * (text-accent-primary), the inactive one is text-secondary. Real buttons
 * with aria-pressed (toggle semantics), global focus-visible ring, and a
 * fieldset legend (sr-only) labelling the group. Mounted in the desktop
 * Header and the MobileMenu; setLang propagates to every useT consumer.
 */
const OPTIONS = [
  { value: 'en', labelKey: 'nav.langEn' },
  { value: 'ta', labelKey: 'nav.langTa' },
]

export default function LanguageToggle({ className = '' }) {
  const { t, lang, setLang } = useT()

  return (
    <fieldset
      className={`inline-flex items-center gap-1 border-0 p-0 m-0 ${className}`}
    >
      <legend className="sr-only">{t['nav.langAriaLabel']}</legend>
      {OPTIONS.map((opt, i) => (
        <Fragment key={opt.value}>
          {i > 0 && (
            <span aria-hidden="true" className="font-sans text-xs text-text-secondary">
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(opt.value)}
            aria-pressed={lang === opt.value}
            className={[
              'rounded-full px-2 py-0.5 font-sans text-xs font-semibold transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring',
              lang === opt.value
                ? 'text-accent-primary'
                : 'text-text-secondary hover:text-text-primary',
            ].join(' ')}
          >
            {t[opt.labelKey]}
          </button>
        </Fragment>
      ))}
    </fieldset>
  )
}