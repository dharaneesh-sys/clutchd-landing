import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Button from '../ui/Button.jsx'
import MobileMenu from './MobileMenu.jsx'

const NAV = [
  { label: 'How it works', href: '#workflow' },
  { label: "Who it's for", href: '#audiences' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Trust', href: '#trust' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Intelligence', href: '#intelligence' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const triggerRef = useRef(null)

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
        <a href="#top" className="shrink-0" aria-label="ClutchD home">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="primary" size="sm" onClick={() => (window.location.hash = '#early-access')}>
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
