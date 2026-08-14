import Logo from '../brand/Logo.jsx'

const NAV = [
  { label: 'How it works', href: '#workflow' },
  { label: "Who it's for", href: '#audiences' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Trust', href: '#trust' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Early access', href: '#early-access' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-surface-soft">
      <div className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-sm font-sans text-sm leading-relaxed text-text-secondary">
              ClutchD connects drivers, mechanics, garages, fleets, parts, payments and service
              history into one automotive ecosystem.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-sm text-text-secondary transition-colors duration-200 hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
            © 2026 ClutchD
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="font-sans text-xs text-text-secondary" lang="ta">
              தமிழ் விரைவில் — Tamil coming soon
            </p>
            <a
              href="/privacy.html"
              className="font-sans text-xs text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
            >
              Privacy
            </a>
            <a
              href="/terms.html"
              className="font-sans text-xs text-text-secondary transition-colors hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
