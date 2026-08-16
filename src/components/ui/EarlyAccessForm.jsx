/**
 * EarlyAccessForm — shared email-capture primitive (DESIGN.md §5).
 *
 * Variants:
 *   "section" — full closing-CTA layout: label above, input + button in a
 *     flex-col sm:flex-row row, max-w-md.
 *   "hero"    — inline, compact: no visible label (aria-label on input),
 *     input + pill CTA in a single flex gap-2 row, smaller padding, max-w-sm.
 *
 * States: idle → submitting (spinner, input disabled) → success / error /
 *   duplicate. Error covers validation + server/network failures.
 *
 * Submission (Netlify Forms, P1): POST FormData to the current page path with
 *   Accept: application/json — fields form-name=early-access, email, honeypot
 *   bot-field (empty). Netlify detects the form via the hidden static form in
 *   index.html (data-netlify="true"). Non-2xx or network failure → error state;
 *   never fake success.
 *
 * Soft dedupe: localStorage['clutchd-signups'] array of lowercased emails;
 *   a repeat submit in the same browser → "already on the list" message.
 *   Per-browser only (Netlify Forms free tier has no read API).
 *
 * Accessibility: unique per-instance ids via useId(), aria-describedby for the
 *   error, aria-invalid, aria-live="polite" status region.
 */
import { useId, useState } from 'react'
import Button from './Button.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FORM_NAME = 'early-access'
const HONEYPOT_NAME = 'bot-field'
const STORAGE_KEY = 'clutchd-signups'

const VARIANTS = {
  hero: {
    form: 'flex w-full max-w-sm flex-col gap-2',
    row: 'flex gap-2',
    input: 'px-4 py-2.5',
    buttonSize: 'sm',
  },
  section: {
    form: 'flex w-full max-w-md flex-col gap-2',
    row: 'flex flex-col gap-2 sm:flex-row',
    input: 'px-4 py-3',
    buttonSize: 'md',
  },
}

function getStoredEmails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // storage unavailable (private mode / SSR) — dedupe degrades gracefully
    return []
  }
}

function rememberEmail(email) {
  try {
    const emails = getStoredEmails()
    if (!emails.includes(email)) emails.push(email)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails))
  } catch {
    // storage unavailable — still submitted server-side, just not deduped
  }
}

export default function EarlyAccessForm({ variant = 'section', className = '' }) {
  const id = useId().replace(/:/g, '')
  const emailId = `early-email-${id}`
  const errorId = `early-email-error-${id}`
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | duplicate
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setStatus('error')
      setErrorMsg('Enter a valid email address')
      return
    }
    if (getStoredEmails().includes(value.toLowerCase())) {
      setStatus('duplicate')
      return
    }
    setStatus('submitting')
    try {
      const formData = new FormData()
      formData.append('form-name', FORM_NAME)
      formData.append('email', value)
      formData.append(HONEYPOT_NAME, '')
      const res = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
      if (!res.ok) throw new Error(`Form submission failed: ${res.status}`)
      rememberEmail(value.toLowerCase())
      setStatus('success')
    } catch (err) {
      // Log for debugging deployed CSP/network failures (never fake success).
      console.error('EarlyAccessForm submit failed:', err)
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  const isSubmitting = status === 'submitting'
  const showError = status === 'error'
  const v = VARIANTS[variant]

  return (
    <form onSubmit={handleSubmit} noValidate className={[v.form, className].filter(Boolean).join(' ')}>
      {variant === 'section' && (
        <label htmlFor={emailId} className="font-sans text-sm font-medium text-text-primary">
          Email address
        </label>
      )}
      <div className={v.row}>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-label={variant === 'hero' ? 'Email address' : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error' || status === 'duplicate') setStatus('idle')
          }}
          aria-describedby={showError ? errorId : undefined}
          aria-invalid={showError}
          disabled={isSubmitting}
          className={[
            'w-full rounded-xl border bg-surface-soft font-sans text-sm text-text-primary outline-none transition-colors',
            'placeholder:text-text-secondary/70',
            v.input,
            showError
              ? 'border-accent-danger'
              : 'border-border-default focus-visible:ring-2 focus-visible:ring-accent-focus-ring',
            'disabled:opacity-60',
          ].join(' ')}
        />
        <Button type="submit" variant="primary" size={v.buttonSize} disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              Submitting…
            </span>
          ) : (
            'Get early access'
          )}
        </Button>
      </div>

      {/* status region */}
      <div aria-live="polite">
        {showError && (
          <p id={errorId} className="mt-2 font-sans text-sm text-accent-danger">
            {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p className="mt-2 font-sans text-sm text-accent-primary">
            You&apos;re on the list. We&apos;ll email you when ClutchD opens near you.
          </p>
        )}
        {status === 'duplicate' && (
          <p className="mt-2 font-sans text-sm text-accent-primary">
            You&apos;re already on the list. We&apos;ll email you when ClutchD opens near you.
          </p>
        )}
      </div>
      {/* Legal microcopy (production plan): launch-only contact + privacy pointer */}
      <p className="mt-2 font-sans text-xs leading-relaxed text-text-secondary">
        We&apos;ll only email you about the Coimbatore launch.{' '}
        <a
          href="/privacy.html"
          className="underline decoration-accent-primary/40 underline-offset-2 transition-colors hover:text-accent-primary hover:decoration-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2"
        >
          Privacy policy
        </a>
      </p>
    </form>
  )
}
