import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import SectionNumeral from '../ui/SectionNumeral.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useT } from '../../lib/i18n.js'

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
  { n: 1, titleKey: 'workflow.0.title', bodyKey: 'workflow.0.body', labelKey: null },
  { n: 2, titleKey: 'workflow.1.title', bodyKey: 'workflow.1.body', labelKey: 'workflow.1.label' },
  { n: 3, titleKey: 'workflow.2.title', bodyKey: 'workflow.2.body', labelKey: 'workflow.2.label' },
  { n: 4, titleKey: 'workflow.3.title', bodyKey: 'workflow.3.body', labelKey: 'workflow.3.label' },
  { n: 5, titleKey: 'workflow.4.title', bodyKey: 'workflow.4.body', labelKey: 'workflow.4.label' },
  { n: 6, titleKey: 'workflow.5.title', bodyKey: 'workflow.5.body', labelKey: 'workflow.5.label' },
]

function Step({ step, t }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <SectionNumeral n={step.n} className="font-display text-lg italic text-text-primary" />
      <h3 className="font-display text-lg font-semibold text-text-primary">{t[step.titleKey]}</h3>
      <p className="font-sans text-sm leading-relaxed text-text-secondary">{t[step.bodyKey]}</p>
      {step.labelKey && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
          {t[step.labelKey]}
        </span>
      )}
    </div>
  )
}

export default function Workflow() {
  const { t } = useT()
  const [ref, visible] = useReveal()
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="scroll-mt-20 bg-surface-primary py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={t['workflow.eyebrow']}
          title={t['workflow.title']}
          lede={t['workflow.lede']}
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
          {/* Desktop: horizontal rail with finer hairline */}
          <div className="relative hidden md:block">
            <div aria-hidden="true" className="absolute left-0 right-0 top-4 h-px bg-border-default" />
            <div className="relative grid grid-cols-6 gap-4">
              {STEPS.map((s) => (
                <Step key={s.n} step={s} t={t} />
              ))}
            </div>
          </div>
          {/* Mobile: vertical rail with finer border */}
          <ol className="relative ml-5 flex flex-col gap-8 border-l border-border-default md:hidden">
            {STEPS.map((s) => (
              <li key={s.n} className="relative pl-6">
                <span className="absolute -left-[25px] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-primary">
                  <SectionNumeral n={s.n} className="font-display text-sm italic text-text-primary" />
                </span>
                <h3 className="font-display text-lg font-semibold text-text-primary">{t[s.titleKey]}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-text-secondary">{t[s.bodyKey]}</p>
                {s.labelKey && (
                  <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                    {t[s.labelKey]}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}