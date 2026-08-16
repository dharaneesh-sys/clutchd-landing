import { Link } from 'react-router-dom'
import Container from '../components/ui/Container.jsx'
import usePageMeta from '../hooks/usePageMeta.js'
import { useT } from '../lib/i18n.js'

export default function NotFound() {
  const { t } = useT()
  usePageMeta(t['notFound.metaTitle'], t['notFound.metaDescription'])

  return (
    <section className="bg-surface-primary">
      <Container className="flex min-h-[60dvh] flex-col items-center justify-center py-24 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
          {t['notFound.code']}
        </p>
        <h1
          id="page-heading"
          tabIndex="-1"
          className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
        >
          {t['notFound.title']}
        </h1>
        <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
          {t['notFound.body']}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-[56px] bg-surface-cool px-8 py-4 font-sans text-lg font-semibold leading-[1.2] tracking-[0.01em] text-text-primary transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:bg-accent-primary/10 active:scale-[0.98] active:bg-accent-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary"
        >
          {t['notFound.backHome']}
        </Link>
      </Container>
    </section>
  )
}