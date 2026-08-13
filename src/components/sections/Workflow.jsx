import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Badge from '../ui/Badge.jsx'
import useReveal from '../../hooks/useReveal.js'

// 6-step job lifecycle with the REAL backend status vocabulary
// (ClutchD-reference.md:251-277): searching → accepted → en_route →
// in_progress → completed.
// Label ↔ status mapping (display label on the left, raw API status on the right):
//   Searching → searching
//   Accepted → accepted
//   En route → en_route
//   In progress → in_progress
//   Completed → completed
const STEPS = [
  { n: 1, title: 'Request', body: 'Share the problem and your location.', label: null },
  { n: 2, title: 'Match', body: 'ClutchD finds verified nearby providers.', label: 'Searching' },
  { n: 3, title: 'Accept', body: 'A mechanic takes the job.', label: 'Accepted' },
  { n: 4, title: 'En route', body: 'Track arrival with live ETA.', label: 'En route' },
  { n: 5, title: 'In progress', body: 'Approve the estimate as the work happens.', label: 'In progress' },
  { n: 6, title: 'Done', body: 'Pay securely, review, and the service joins your vehicle’s digital history.', label: 'Completed' },
]

function Step({ step }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-tint font-mono text-sm font-semibold text-accent-primary">
        {step.n}
      </span>
      <h3 className="font-sans text-lg font-semibold text-text-primary">{step.title}</h3>
      <p className="font-sans text-sm leading-relaxed text-text-secondary">{step.body}</p>
      {step.label && (
        <Badge variant="accent" className="px-2.5 py-0.5 text-[9px]">
          {step.label}
        </Badge>
      )}
    </div>
  )
}

export default function Workflow() {
  const [ref, visible] = useReveal()
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="From breakdown to back on the road"
          lede="Six real job states, from the moment you request help to the moment your vehicle's history is updated."
          id="workflow-heading"
        />
        <div
          ref={ref}
          className={[
            'mt-12 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
          ].join(' ')}
        >
          {/* Desktop: horizontal rail */}
          <div className="relative hidden md:block">
            <div aria-hidden="true" className="absolute left-0 right-0 top-5 h-0.5 bg-border-default" />
            <div className="relative grid grid-cols-6 gap-4">
              {STEPS.map((s) => (
                <Step key={s.n} step={s} />
              ))}
            </div>
          </div>
          {/* Mobile: vertical rail */}
          <ol className="relative ml-5 flex flex-col gap-8 border-l-2 border-border-default md:hidden">
            {STEPS.map((s) => (
              <li key={s.n} className="relative pl-6">
                <span className="absolute -left-[25px] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-tint font-mono text-sm font-semibold text-accent-primary">
                  {s.n}
                </span>
                <h3 className="font-sans text-lg font-semibold text-text-primary">{s.title}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-text-secondary">{s.body}</p>
                {s.label && (
                  <Badge variant="accent" className="mt-2 px-2.5 py-0.5 text-[9px]">
                    {s.label}
                  </Badge>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}