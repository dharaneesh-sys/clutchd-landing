import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import { useT } from '../../lib/i18n.js'

const NAV = [
  { key: 'footer.nav.home', to: '/' },
  { key: 'footer.nav.howItWorks', to: '/how-it-works' },
  { key: 'footer.nav.marketplace', to: '/marketplace' },
  { key: 'footer.nav.forProviders', to: '/for-providers' },
  { key: 'footer.nav.faq', to: '/faq' },
  { key: 'footer.nav.earlyAccess', to: '/early-access' },
]

export default function Footer() {
  const { t } = useT()
  return (
    <footer className="border-t border-border-default bg-surface-soft">
      <div className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-sm font-sans text-sm leading-relaxed text-text-secondary">
              {t['footer.tagline']}
            </p>
          </div>

          <nav aria-label={t['footer.navAriaLabel']} className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-sans text-sm text-text-secondary transition-colors duration-200 hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
              >
                {t[item.key]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
            {t['footer.copyright']}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="font-sans text-xs text-text-secondary" lang="ta">
              {t['footer.tamilComingSoon']}
            </p>
            <a
              href="/privacy.html"
              className="font-sans text-xs text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
            >
              {t['footer.privacy']}
            </a>
            <a
              href="/terms.html"
              className="font-sans text-xs text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
            >
              {t['footer.terms']}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
