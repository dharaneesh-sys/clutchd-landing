import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import EarlyAccessForm from '../ui/EarlyAccessForm.jsx'
import HeroStage from '../ui/HeroStage.jsx'
import { useT } from '../../lib/i18n.js'

// HeroStage is EAGER (V7 perf): the stage card is the page's LCP element —
// it only painted after its lazy chunk fetched + mounted behind the Suspense
// fallback, pushing LCP to ~1.7s past FCP (probe-verified). Home is already
// its own lazy route chunk (D16 preserved), so the 7 kB stage costs nothing
// at startup; route-level code-splitting is unchanged. No fallback/swap.

export default function Hero() {
  const { t } = useT()
  const navigate = useNavigate()

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-surface-tint to-surface-primary"
    >
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-28">
        {/* Left: copy — paints immediately (above the fold, LCP-critical;
            V7 perf: a useReveal opacity-0 start pushed LCP to FCP + reveal
            delay ≈ 2.5s. Above-the-fold content is never reveal-hidden.) */}
        <div className="flex flex-col items-start gap-6">
          <Badge variant="live">{t['hero.liveBadge']}</Badge>

          <h1
            id="hero-heading"
            className="font-display font-semibold leading-[1.00] tracking-[-0.03em] text-text-primary"
            style={{ fontSize: 'clamp(2.25rem, 4.5vw + 1rem, 5rem)' }}
          >
            {t['hero.headline']}
          </h1>

          <p className="max-w-lg text-xl leading-relaxed text-text-ink">
            {t['hero.subtext']}
          </p>

          <EarlyAccessForm variant="hero" />

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => navigate('/how-it-works')}>
              {t['hero.cta']}
            </Button>
          </div>

        </div>

        {/* Right: HeroComposition — the page's visual anchor moment (Wave IX).
            Three layers: backdrop motif → elevated frame → HeroStage.
            Only this column animates (backdrop-entrance); left column paints
            immediately to preserve LCP. */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Layer 3 (back): geometric grid backdrop — echoes HeroStage's
              herostage-grid map language at a larger scale. aria-hidden,
              pointer-events-none, purely decorative. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-[280px] w-[280px] opacity-[0.06]"
          >
            <svg viewBox="0 0 280 280" className="h-full w-full">
              <defs>
                <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" stroke="var(--text-secondary)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="280" height="280" fill="url(#hero-grid)" rx="24" />
            </svg>
          </div>

          {/* Layer 2 (middle): elevated composition frame — dimensional
              product window with elevated shadow, border, and gradient bg. */}
          <div
            className="backdrop-entrance glass-light relative w-full max-w-lg rounded-3xl p-1"
          >
            {/* Layer 1 (front): HeroStage — fills the frame at full width */}
            <HeroStage />
          </div>
        </div>
      </Container>
    </section>
  )
}
