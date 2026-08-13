import { useState } from 'react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Button from '../ui/Button.jsx'
import useReveal from '../../hooks/useReveal.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EarlyAccess() {
  const [ref, visible] = useReveal()
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

  return (
    <section
      id="early-access"
      aria-labelledby="early-access-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-start gap-6">
          <div
            ref={ref}
            className={[
              'flex flex-col items-start gap-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
              visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
            ].join(' ')}
          >
            <SectionHeading
              eyebrow="EARLY ACCESS"
              title="ClutchD is rolling out in Coimbatore"
              lede="Be among the first to try one connected ecosystem for automotive care."
            />

            <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-md flex-col gap-2">
              <label htmlFor="early-email" className="font-sans text-sm font-medium text-text-primary">
                Email address
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="early-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  aria-describedby={showError ? 'early-email-error' : undefined}
                  aria-invalid={showError}
                  disabled={isSubmitting}
                  className={[
                    'w-full rounded-xl border bg-surface-soft px-4 py-3 font-sans text-sm text-text-primary outline-none transition-colors',
                    'placeholder:text-text-secondary/70',
                    showError
                      ? 'border-accent-danger'
                      : 'border-border-default focus-visible:ring-2 focus-visible:ring-accent-focus-ring',
                    'disabled:opacity-60',
                  ].join(' ')}
                />
                <Button type="submit" variant="primary" disabled={isSubmitting} className="shrink-0 sm:w-auto">
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
                  <p id="early-email-error" className="mt-2 font-sans text-sm text-accent-danger">
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
          </div>
        </div>
      </Container>
    </section>
  )
}
