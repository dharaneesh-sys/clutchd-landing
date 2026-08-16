/**
 * PrivacyNotice — dismissible analytics disclosure (DESIGN.md §5).
 *
 * Informs visitors the page uses GoatCounter (cookie-free analytics; no
 * personal data collected). Informational, not a consent gate — GoatCounter
 * sets no cookies, so no legal consent is required.
 *
 * Dismissal persists per-browser in localStorage['clutchd-privacy-notice-dismissed'];
 * the banner never re-appears for a returning visitor who dismissed it.
 *
 * Accessibility: role="region" + aria-label, real dismiss button with visible
 * focus ring, Escape also dismisses, no focus trap, text/link at 4.5:1.
 */
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'clutchd-privacy-notice-dismissed'

export default function PrivacyNotice() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  // Escape dismisses too (banner is a transient, non-modal disclosure).
  // Skip while a modal dialog is open (mobile menu) — that dialog owns Escape.
  // Note: the menu stays in the DOM when closed (hidden attr), so match only
  // dialogs that are actually visible, else Escape would never dismiss.
  useEffect(() => {
    if (dismissed) return
    const onKey = (e) => {
      // Don't hijack Escape while typing in a field (e.g. the early-access email input).
      if (e.target.closest?.('input, textarea, select')) return
      if (e.key === 'Escape' && !document.querySelector('[aria-modal="true"]:not([hidden])')) {
        setDismissed(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dismissed])

  if (dismissed) return null

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // storage unavailable — banner stays for this session only
    }
    setDismissed(true)
  }

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-surface-soft/95"
    >
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
        <p className="font-sans text-sm leading-relaxed text-text-secondary">
          ClutchD uses GoatCounter, a cookie-free analytics tool, to count page
          views. No personal data is collected.{' '}
          <a
            href="/privacy.html"
            className="font-medium text-accent-primary underline decoration-accent-primary/40 underline-offset-2 transition-colors hover:text-accent-hover hover:decoration-accent-primary"
          >
            Privacy policy
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full border border-border-default bg-surface-primary px-4 py-1.5 font-sans text-sm font-medium text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
