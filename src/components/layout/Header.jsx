import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Button from '../ui/Button.jsx'
import LanguageToggle from '../ui/LanguageToggle.jsx'
import MobileMenu from './MobileMenu.jsx'
import { useT } from '../../lib/i18n.js'

const NAV = [
  { key: 'nav.howItWorks', to: '/how-it-works' },
  { key: 'nav.marketplace', to: '/marketplace' },
  { key: 'nav.forProviders', to: '/for-providers' },
  { key: 'nav.faq', to: '/faq' },
]

export default function Header() {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const triggerRef = useRef(null)
  const sentinelRef = useRef(null)
  const navigate = useNavigate()

  // V8 scrolled state (DESIGN.md §6): a 1px sentinel at the very top of the
  // page is observed with IntersectionObserver (rootMargin -8px preserves the
  // old 8px threshold). No raw scroll listener. If IntersectionObserver is
  // unavailable, scrolled stays false (acceptable degradation).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: '-8px 0px 0px 0px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full"
      />
      <header
        className={[
          // V8 scrolled state (DESIGN.md §6): stronger hairline + a soft
          // shadow once the page scrolls; transform/opacity/shadow only — no
          // padding or height change (layout animation is forbidden).
          'sticky top-0 z-50 w-full border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-200',
          scrolled
            ? 'border-border-default bg-surface-primary/80 shadow-[0_2px_12px_rgba(13,18,79,0.05)] backdrop-blur-md'
            : 'border-transparent bg-surface-primary/0 shadow-none',
        ].join(' ')}
      >
        <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0" aria-label={t['nav.logoAriaLabel']}>
            <Logo />
          </Link>

          <nav aria-label={t['nav.primaryAriaLabel']} className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'font-sans text-sm font-medium transition-colors duration-200 hover:text-accent-primary',
                    isActive ? 'text-accent-primary' : 'text-text-secondary',
                  ].join(' ')
                }
              >
                {t[item.key]}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <Button variant="primary" size="sm" onClick={() => navigate('/early-access')}>
              {t['nav.cta']}
            </Button>
          </div>

          <button
            ref={triggerRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t['nav.closeMenuAriaLabel'] : t['nav.openMenuAriaLabel']}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <MobileMenu
          id="mobile-menu"
          open={open}
          items={NAV}
          triggerRef={triggerRef}
          onClose={() => setOpen(false)}
        />
      </header>
    </>
  )
}
