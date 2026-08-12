/**
 * Primitive Showcase — T4 gate screen (initial App state).
 *
 * Renders every brand/UI primitive in every resting state so the
 * Primitive Showcase Gate (frontend skill Phase 0) can be verified:
 * logo lockup, button variants × sizes × disabled × icon patterns,
 * badges, section-heading alignments, and the container frame.
 *
 * Hover / focus-visible / active states are exercised by the Playwright
 * interaction pass (evidence/task-4-interaction.mjs) — this screen
 * renders the resting states with stable data-testid selectors.
 *
 * T5+ replaces this screen with the product landing.
 */
import { useState } from 'react'
import { ArrowRight, Zap } from 'lucide-react'
import Logo from './components/brand/Logo.jsx'
import LogoMark from './components/brand/LogoMark.jsx'
import Button from './components/ui/Button.jsx'
import Badge from './components/ui/Badge.jsx'
import SectionHeading from './components/ui/SectionHeading.jsx'
import Container from './components/ui/Container.jsx'

function ShowcaseSection({ title, children }) {
  return (
    <section className="border-b border-border-default py-16">
      <Container>
        <p className="mb-8 font-mono text-[10px] font-semibold uppercase leading-[1.3] tracking-[0.2em] text-text-secondary">
          {title}
        </p>
        {children}
      </Container>
    </section>
  )
}

function App() {
  const [presses, setPresses] = useState(0)

  return (
    <div className="min-h-[100dvh] bg-surface-primary text-text-primary">
      {/* Header */}
      <header className="border-b border-border-default">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <Logo data-testid="logo-lockup" />
          <Badge variant="accent" dot data-testid="badge-header">
            Primitive showcase · T4
          </Badge>
        </Container>
      </header>

      {/* Logo mark & wordmark */}
      <ShowcaseSection title="01 · Logo mark & wordmark">
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <LogoMark className="h-16 w-16" data-testid="logo-mark" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Mark · 64px
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Logo markClassName="h-12 w-12" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Lockup · 48px mark
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface-tint p-8">
            <Logo />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Lockup on tint field
            </span>
          </div>
        </div>
      </ShowcaseSection>

      {/* Buttons */}
      <ShowcaseSection title="02 · Buttons — variants × sizes × states">
        <div className="flex flex-col gap-10">
          {[
            { variant: 'primary', label: 'Primary' },
            { variant: 'secondary', label: 'Secondary' },
            { variant: 'ghost', label: 'Ghost' },
          ].map(({ variant, label }) => (
            <div key={variant} className="flex flex-wrap items-center gap-4">
              <span className="w-28 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                {label}
              </span>
              <Button variant={variant} size="sm" data-testid={`btn-${variant}-sm`}>
                Small
              </Button>
              <Button variant={variant} size="md" data-testid={`btn-${variant}-md`}>
                Medium
              </Button>
              <Button variant={variant} size="lg" data-testid={`btn-${variant}-lg`}>
                Large
              </Button>
              <Button
                variant={variant}
                size="md"
                disabled
                data-testid={`btn-${variant}-md-disabled`}
              >
                Disabled
              </Button>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-4">
            <span className="w-28 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Icon patterns
            </span>
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight />}
              iconLabel="Continue"
              data-testid="btn-primary-md-arrow"
            >
              Get early access
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Zap />}
              iconLabel="Instant booking"
              data-testid="btn-secondary-md-arrow"
            >
              Book in seconds
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon={<ArrowRight />}
              iconLabel="Learn more"
              data-testid="btn-ghost-md-arrow"
            >
              Learn more
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Zap />}
              iconLabel="Quick action"
              data-testid="btn-primary-md-icon"
            />
          </div>

          {/* Keyboard interaction check — Enter activates, Escape does nothing */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="w-28 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Keyboard
            </span>
            <Button
              variant="primary"
              size="md"
              data-testid="btn-interact"
              onClick={() => setPresses((n) => n + 1)}
            >
              Press me (Enter activates)
            </Button>
            <span
              data-testid="interact-count"
              className="font-mono text-sm text-text-secondary"
            >
              activations: {presses}
            </span>
          </div>
        </div>
      </ShowcaseSection>

      {/* Badges */}
      <ShowcaseSection title="03 · Badges">
        <div className="flex flex-wrap items-center gap-4">
          <Badge data-testid="badge-default">Beta</Badge>
          <Badge variant="accent" data-testid="badge-accent">
            New
          </Badge>
          <Badge variant="accent" dot data-testid="badge-accent-dot">
            Verified
          </Badge>
          <Badge variant="live" data-testid="badge-live">
            Fleet online
          </Badge>
        </div>
      </ShowcaseSection>

      {/* Section headings */}
      <ShowcaseSection title="04 · Section headings — alignment">
        <div className="flex flex-col gap-16">
          <SectionHeading
            eyebrow="Platform"
            title="One app for every breakdown, booking, and bill"
            lede="ClutchD connects drivers with vetted mechanics, live fleet status, and transparent pricing — from the first warning light to the final invoice."
            data-testid="heading-left"
          />
          <SectionHeading
            eyebrow="Early access"
            title="Be first on the road"
            lede="Join the waitlist for the launch wave and get priority access to the ClutchD network in your city."
            align="center"
            data-testid="heading-center"
          />
        </div>
      </ShowcaseSection>

      {/* Container */}
      <ShowcaseSection title="05 · Container — 1280px frame">
        <div
          data-testid="container-demo"
          className="rounded-[2rem] border border-border-default bg-surface-soft"
        >
          <Container className="py-10">
            <p className="font-sans text-lg text-text-primary">
              Content frame: max-width 1280px, 16px gutters on mobile, 24px
              at ≥640px, 32px at ≥1024px. The soft field shows the frame
              edges at every breakpoint.
            </p>
          </Container>
        </div>
      </ShowcaseSection>

      {/* Footer note */}
      <footer className="py-10">
        <Container>
          <p className="font-mono text-[10px] uppercase leading-[1.3] tracking-[0.2em] text-text-secondary">
            Hover · focus-visible · active states are exercised by the
            Playwright pass (task-4) — this screen renders resting states.
          </p>
        </Container>
      </footer>
    </div>
  )
}

export default App