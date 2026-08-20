import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import { useT } from '../../lib/i18n.js'

// Wave D: 3-column editorial colophon — product nav + legal nav, split.
const PRODUCT_NAV = [
  { key: 'footer.nav.howItWorks', to: '/how-it-works' },
  { key: 'footer.nav.marketplace', to: '/marketplace' },
  { key: 'footer.nav.forProviders', to: '/for-providers' },
  { key: 'footer.nav.earlyAccess', to: '/early-access' },
]

const LEGAL_NAV = [
  { key: 'footer.nav.faq', to: '/faq' },
]

const LINK_CLASS =
  'font-sans text-sm text-slate-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--glass-dark-bg)]'

export default function Footer() {
  const { t } = useT()
  return (
    <footer className="glass-dark border-t border-white/10">
      <div className="mx-auto w-full max-w-[80rem] px-4 py-16 sm:px-6 lg:px-8">
        {/* 3-column editorial layout on desktop, 1-col stack on mobile */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Left column — logo, tagline, accent rule */}
          <div className="flex flex-col gap-4">
            <Logo variant="dark" />
            <span
              aria-hidden="true"
              className="h-px w-16 bg-accent-primary"
            />
            <p className="max-w-xs font-sans text-sm leading-relaxed text-slate-400">
              {t['footer.tagline']}
            </p>
          </div>

          {/* Center column — Product nav */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Product
            </span>
            <nav aria-label={t['footer.navAriaLabel']} className="flex flex-col gap-2.5">
              {PRODUCT_NAV.map((item) => (
                <Link key={item.to} to={item.to} className={LINK_CLASS}>
                  {t[item.key]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right column — Legal nav + ghost numeral */}
          <div className="relative flex flex-col gap-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Legal
            </span>
            <nav className="flex flex-col gap-2.5">
              {LEGAL_NAV.map((item) => (
                <Link key={item.to} to={item.to} className={LINK_CLASS}>
                  {t[item.key]}
                </Link>
              ))}
              <a href="/privacy.html" className={LINK_CLASS}>
                {t['footer.privacy']}
              </a>
              <a href="/terms.html" className={LINK_CLASS}>
                {t['footer.terms']}
              </a>
            </nav>
            {/* Ghost numeral — decorative, editorial flair */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-2 right-0 font-display text-[5rem] font-light italic leading-none text-white opacity-[0.06] max-md:hidden"
            >
              Nº
            </span>
          </div>
        </div>

        {/* Bottom row — copyright, tamil, unchanged */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {t['footer.copyright']}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="font-sans text-xs text-slate-400" lang="ta">
              {t['footer.tamilComingSoon']}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
