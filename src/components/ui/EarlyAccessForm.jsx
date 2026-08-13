/**
 * EarlyAccessForm — shared email-capture primitive (DESIGN.md §5).
 *
 * Variants:
 *   "section" — full closing-CTA layout: label above, input + button in a
 *     flex-col sm:flex-row row, max-w-md.
 *   "hero"    — inline, compact: no visible label (aria-label on input),
 *     input + pill CTA in a single flex gap-2 row, smaller padding, max-w-sm.
 *
 * States: idle → submitting (spinner, input disabled) → success / error.
 * Validation: EMAIL_RE; error message "Enter a valid email address".
 * Accessibility: unique per-instance ids via useId(), aria-describedby for
 * the error, aria-invalid, aria-live="polite" status region.
 * Debt: client-side only — no backend (DESIGN.md §8).
 */
import { useId, useState } from 'react'
import Button from './Button.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

export default function EarlyAccessForm({ variant = 'section', className = '' }) {
  const id = useId().replace(/:/g, '')
  const emailId = `early-email-${id}`
  const errorId = `early-email-error-${id}`
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setStatus('error')
      setErrorMsg('Enter a valid email address')
      return
    }
    // Client-side validation only — no backend call (accepted debt, see DESIGN.md).
    setStatus('submitting')
    window.setTimeout(() => setStatus('success'), 600)
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
            if (status === 'error') setStatus('idle')
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
            You&apos;re on the list — we&apos;ll email you when ClutchD opens near you.
          </p>
        )}
      </div>
    </form>
  )
}