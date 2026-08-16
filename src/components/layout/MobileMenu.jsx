import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import LanguageToggle from '../ui/LanguageToggle.jsx'
import { useT } from '../../lib/i18n.js'

// Accessible mobile disclosure panel (WAI-ARIA menu pattern).
// - focus moves into the panel on open
// - Escape closes and restores focus to the trigger
// - scroll is locked while open
// - closes on any anchor click
// - reduced-motion aware (transitions are transform/opacity only)
export default function MobileMenu({ id, open, items, triggerRef, onClose }) {
  const { t } = useT()
  const panelRef = useRef(null)
  const firstLinkRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // move focus into the panel
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 0)
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, triggerRef])

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t['mobileMenu.dialogAriaLabel']}
      hidden={!open}
      className={[
        'lg:hidden',
        'border-t border-border-default bg-surface-primary',
        'transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
        open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      ].join(' ')}
    >
      <nav aria-label={t['mobileMenu.navAriaLabel']} className="mx-auto flex w-full max-w-[80rem] flex-col gap-1 px-4 py-4 sm:px-6">
        {items.map((item, i) => (
          <Link
            key={item.to}
            ref={i === 0 ? firstLinkRef : null}
            to={item.to}
            onClick={onClose}
            className="rounded-xl px-3 py-3 font-sans text-base font-medium text-text-primary transition-colors duration-200 hover:bg-surface-tint hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring"
          >
            {t[item.key]}
          </Link>
        ))}
        <div className="flex items-center justify-between px-3 pt-3">
          <LanguageToggle />
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose()
              navigate('/early-access')
            }}
          >
            {t['mobileMenu.cta']}
          </Button>
        </div>
      </nav>
    </div>
  )
}
