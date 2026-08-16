/**
 * HeroStage — interactive 6-state service demo (DESIGN.md §5 HeroStage).
 *
 * Replaces the static ServiceCard mockup on the Home hero. Manual-only
 * controls (D14): the stage sits at "Request" until the visitor clicks a
 * step button — no auto-advance, no auto-play, no toggle.
 *
 * States (displayed step titles; the 5 backend statuses are
 * searching/accepted/en_route/in_progress/completed — "Request" is a step
 * title, never a status):
 *   Request → Searching → Accepted → En route → In progress → Completed
 *
 * Motion (DESIGN.md §6): transform / opacity / stroke-dashoffset ONLY —
 * timeline fill (scaleX), step circle color, SVG route draw
 * (stroke-dashoffset). 200–300ms cubic-bezier(0.32,0.72,0,1).
 * prefers-reduced-motion: static Completed layout, no transitions, no
 * ticking (no timers exist).
 *
 * Accessibility: real <button>s per state with the global focus-ring
 * discipline; dedicated visually-hidden aria-live="polite" region that
 * announces state changes ONLY (manual clicks — never spams a screen
 * reader).
 */
import { Fragment, useState } from 'react'
import { CheckCircle2, Clock, MapPin, Star, Wrench } from 'lucide-react'
import Badge from './Badge.jsx'

const STEPS = [
  { key: 'request', title: 'Request' },
  { key: 'searching', title: 'Searching' },
  { key: 'accepted', title: 'Accepted' },
  { key: 'en_route', title: 'En route' },
  { key: 'in_progress', title: 'In progress' },
  { key: 'completed', title: 'Completed' },
]

// Header line above the map — the current step title.
const HEADERS = [
  'Service request',
  'Searching for verified mechanics…',
  'Mechanic accepted',
  'Mechanic en route',
  'Work in progress',
  'Service completed',
]

// Route draw progress per state (0 = origin only, 1 = fully drawn).
const PROGRESS = [0, 0.15, 0.35, 0.6, 0.85, 1]

// ETA chip content — states 2–4 only (Accepted / En route / In progress).
const ETA = {
  2: { label: 'Arriving in', value: '18 min' },
  3: { label: 'Arriving in', value: '12 min' },
  4: { label: 'Remaining', value: '6 min' },
}

// aria-live announcements — state changes ONLY (manual clicks).
const ANNOUNCEMENTS = [
  'Status: Request. Waiting for your service request.',
  'Status: Searching, searching for verified mechanics.',
  'Status: Accepted. Rahul K. accepted the job. Arriving in 18 minutes.',
  'Status: En route. Mechanic arriving in 12 minutes.',
  'Status: In progress. Brake pad replacement underway. Estimated ₹1,450.',
  'Status: Completed. Service complete.',
]

const EASE = 'ease-[cubic-bezier(0.32,0.72,0,1)]'

export default function HeroStage() {
  // Manual-only (D14): start at Request; reduced-motion users get the static
  // Completed layout immediately (no interaction needed, no animation).
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 0
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? STEPS.length - 1
      : 0
  })
  // Empty on mount — the region announces state changes only, never on load.
  const [announcement, setAnnouncement] = useState('')
  // V8 invitation cue: true until the visitor interacts with any state — the
  // soft ring on the Request button is mount-only and disappears on the first
  // click (DESIGN.md §5 HeroStage; reduced-motion users start at Completed,
  // so the cue never renders for them).
  const [interacted, setInteracted] = useState(false)

  const handleSelect = (i) => {
    setInteracted(true)
    setActive(i)
    setAnnouncement(ANNOUNCEMENTS[i])
  }

  const progress = PROGRESS[active]
  const eta = ETA[active]
  const completed = active === STEPS.length - 1

  return (
    <div className="w-full max-w-sm rounded-[2rem] border border-border-default bg-surface-primary p-5 shadow-[0_8px_24px_rgba(13,18,79,0.12)]">
      {/* Screen-reader status — state changes only (manual clicks) */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Step rail — one real button per state */}
      <fieldset className="m-0 flex min-w-0 items-center gap-2 border-0 p-0">
        <legend className="sr-only">Demo status steps</legend>
        {STEPS.map((s, i) => (
          <Fragment key={s.key}>
            <button
              type="button"
              onClick={() => handleSelect(i)}
              aria-pressed={active === i}
              // Visible text is the step number (or check icon) — keep it in
              // the accessible name (label-content-name-mismatch).
              aria-label={`Show ${s.title} state (step ${i + 1})`}
              className={[
                'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                'transition-[transform,background-color,color] duration-200',
                EASE,
                'motion-reduce:transition-none',
                'hover:scale-[1.05] active:scale-[0.95]',
                active === i
                  ? 'bg-accent-primary text-white'
                  : i < active
                    ? 'bg-surface-tint text-accent-primary'
                    : 'bg-surface-cool text-text-secondary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary',
              ].join(' ')}
            >
              {i < active || (completed && i === active) ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                i + 1
              )}
              {/* V8 invitation cue — mount-only ring on the Request state */}
              {i === 0 && !interacted && active === 0 && (
                <span
                  aria-hidden="true"
                  className="herostage-cue pointer-events-none absolute inset-0 rounded-full border-2 border-accent-primary motion-reduce:border-0"
                />
              )}
            </button>
            {i < STEPS.length - 1 && (
              <div className="relative h-0.5 flex-1 overflow-hidden rounded bg-surface-cool">
                <div
                  aria-hidden="true"
                  className={[
                    'absolute inset-0 origin-left rounded bg-accent-primary',
                    'transition-transform duration-300',
                    EASE,
                    'motion-reduce:transition-none',
                  ].join(' ')}
                  style={{ transform: `scaleX(${active > i ? 1 : 0})` }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </fieldset>

      {/* Header — current step title + honest-mock Preview badge */}
      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
          {HEADERS[active]}
        </p>
        <Badge variant="accent">Preview</Badge>
      </div>

      {/* ETA chip (Accepted → In progress) / success chip (Completed) */}
      {eta && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-tint px-4 py-3">
          <Clock className="h-5 w-5 text-accent-primary" />
          <div>
            <p className="font-sans text-xs text-text-secondary">{eta.label}</p>
            <p className="font-sans text-lg font-semibold text-text-primary">{eta.value}</p>
          </div>
        </div>
      )}
      {completed && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-tint px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-accent-primary" />
          <div>
            <p className="font-sans text-xs text-text-secondary">Service complete</p>
            <p className="font-sans text-lg font-semibold text-text-primary">All done</p>
          </div>
        </div>
      )}

      {/* Mechanic card (Accepted onward) */}
      {active >= 2 && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border-default bg-surface-soft px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary text-sm font-semibold text-white">
            RK
          </div>
          <div className="flex-1">
            <p className="font-sans text-sm font-semibold text-text-primary">Rahul K.</p>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-primary text-accent-primary" />
              <span className="font-sans text-xs text-text-secondary">4.9 · Verified</span>
              <Badge variant="accent" className="ml-1 px-2 py-0.5 text-[9px]">
                Verified
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* CSS map motif — route draws via stroke-dashoffset per state */}
      <div className="relative mt-4 h-24 overflow-hidden rounded-2xl border border-border-default bg-surface-cool">
        <svg viewBox="0 0 320 96" className="h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="herostage-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(91,97,110,0.18)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="320" height="96" fill="url(#herostage-grid)" />
          {/* Track — faint dashed route */}
          <path
            d="M30 78 C 90 70, 120 40, 180 36 S 260 30, 290 18"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 6"
            opacity="0.25"
          />
          {/* Progress — solid accent draws over the track */}
          <path
            d="M30 78 C 90 70, 120 40, 180 36 S 260 30, 290 18"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
            className={[
              'transition-[stroke-dashoffset] duration-300',
              EASE,
              'motion-reduce:transition-none',
            ].join(' ')}
          />
          <circle cx="30" cy="78" r="5" fill="var(--accent-primary)" />
          <circle cx="290" cy="18" r="5" fill="var(--depth-navy-1)" />
        </svg>
        <MapPin className="absolute right-3 top-2 h-5 w-5 text-accent-primary" />
      </div>

      {/* Estimate card (In progress onward) — carries the honest-mock Preview badge */}
      {active >= 4 && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-surface-soft px-4 py-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="font-sans text-sm text-text-primary">Brake pad replacement</p>
              <Badge variant="accent" className="mt-1 px-2 py-0.5 text-[9px]">
                Preview
              </Badge>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold text-text-primary">Est. ₹1,450</span>
        </div>
      )}
    </div>
  )
}