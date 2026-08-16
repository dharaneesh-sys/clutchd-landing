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
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left: copy — paints immediately (above the fold, LCP-critical;
            V7 perf: a useReveal opacity-0 start pushed LCP to FCP + reveal
            delay ≈ 2.5s. Above-the-fold content is never reveal-hidden.) */}
        <div className="flex flex-col items-start gap-6">
          <Badge variant="live">{t['hero.liveBadge']}</Badge>

          <h1
            id="hero-heading"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            {t['hero.headline']}
          </h1>

          <p className="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
            {t['hero.subtext']}
          </p>

          <EarlyAccessForm variant="hero" />

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => navigate('/how-it-works')}>
              {t['hero.cta']}
            </Button>
          </div>

        </div>

        {/* Right: interactive product demo — eager (LCP element, above fold) */}
        <div className="flex justify-center lg:justify-end">
          <HeroStage />
        </div>
      </Container>
    </section>
  )
}