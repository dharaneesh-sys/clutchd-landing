import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Button from '../ui/Button.jsx'
import MobileMenu from './MobileMenu.jsx'

const NAV = [
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'For providers', to: '/for-providers' },
  { label: 'FAQ', to: '/faq' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const triggerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b transition-[background-color,backdrop-filter,border-color] duration-200',
        scrolled
          ? 'border-border-default bg-surface-primary/80 backdrop-blur-md'
          : 'border-transparent bg-surface-primary/0',
      ].join(' ')}
    >
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="ClutchD home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="primary" size="sm" onClick={() => navigate('/early-access')}>
            Get early access
          </Button>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
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
  )
}
