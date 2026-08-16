/**
 * HeroStage — DOM + a11y contract tests (DESIGN.md §5 HeroStage,
 * PRODUCTION.md IX-1). Asserts the rendered contract only: step titles,
 * ETA/estimate content, real buttons, aria-pressed, the aria-live region,
 * and the prefers-reduced-motion static layout. Never classes/selectors.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeroStage from './HeroStage.jsx'
import { setReducedMotion } from '../../test/setup.js'

const STEP_LABELS = [
  'Show Request state (step 1)',
  'Show Searching state (step 2)',
  'Show Accepted state (step 3)',
  'Show En route state (step 4)',
  'Show In progress state (step 5)',
  'Show Completed state (step 6)',
]

async function clickStep(user, label) {
  await user.click(screen.getByRole('button', { name: label }))
}

describe('HeroStage', () => {
  it('renders six real step buttons', () => {
    render(<HeroStage />)
    for (const label of STEP_LABELS) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('starts at Request and never auto-advances', () => {
    render(<HeroStage />)
    expect(screen.getByText('Service request')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: STEP_LABELS[0] })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.queryByText('18 min')).not.toBeInTheDocument()
  })

  it.each([
    [0, 'Service request', null, null, false, false],
    [1, 'Searching for verified mechanics…', null, null, false, false],
    [2, 'Mechanic accepted', 'Arriving in', '18 min', true, false],
    [3, 'Mechanic en route', 'Arriving in', '12 min', true, false],
    [4, 'Work in progress', 'Remaining', '6 min', true, true],
    [5, 'Service completed', null, null, true, true],
  ])(
    'state %i renders the DESIGN.md §5 content',
    async (i, header, etaLabel, etaValue, hasMechanic, hasEstimate) => {
      const user = userEvent.setup()
      render(<HeroStage />)
      await clickStep(user, STEP_LABELS[i])

      expect(screen.getByText(header)).toBeInTheDocument()

      if (etaLabel) {
        expect(screen.getByText(etaLabel)).toBeInTheDocument()
        expect(screen.getByText(etaValue)).toBeInTheDocument()
      } else {
        expect(screen.queryByText('18 min')).not.toBeInTheDocument()
        expect(screen.queryByText('12 min')).not.toBeInTheDocument()
        expect(screen.queryByText('6 min')).not.toBeInTheDocument()
      }

      if (hasMechanic) {
        expect(screen.getByText('Rahul K.')).toBeInTheDocument()
        expect(screen.getByText(/4\.9/)).toBeInTheDocument()
      } else {
        expect(screen.queryByText('Rahul K.')).not.toBeInTheDocument()
      }

      if (hasEstimate) {
        expect(screen.getByText('Brake pad replacement')).toBeInTheDocument()
        expect(screen.getByText('Est. ₹1,450')).toBeInTheDocument()
      } else {
        expect(screen.queryByText('Est. ₹1,450')).not.toBeInTheDocument()
      }
    },
  )

  it('Completed shows the success chip and no ETA', async () => {
    const user = userEvent.setup()
    render(<HeroStage />)
    await clickStep(user, STEP_LABELS[5])
    expect(screen.getByText('Service complete')).toBeInTheDocument()
    expect(screen.getByText('All done')).toBeInTheDocument()
    expect(screen.queryByText('18 min')).not.toBeInTheDocument()
  })

  it('marks the active step button with aria-pressed', async () => {
    const user = userEvent.setup()
    render(<HeroStage />)
    await clickStep(user, STEP_LABELS[3])
    expect(screen.getByRole('button', { name: STEP_LABELS[3] })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: STEP_LABELS[0] })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('keeps the aria-live region empty on mount and announces state changes only', async () => {
    const user = userEvent.setup()
    const { container } = render(<HeroStage />)
    const status = container.querySelector('[aria-live="polite"]')
    expect(status).toBeEmptyDOMElement()
    await clickStep(user, STEP_LABELS[2])
    expect(status).toHaveTextContent(/Status: Accepted/i)
  })

  it('renders the static Completed layout under prefers-reduced-motion', () => {
    setReducedMotion(true)
    const { container } = render(<HeroStage />)
    expect(screen.getByText('Service completed')).toBeInTheDocument()
    expect(screen.getByText('All done')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: STEP_LABELS[5] })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(container.querySelector('[aria-live="polite"]')).toBeEmptyDOMElement()
  })

  it('keeps manual controls under prefers-reduced-motion', async () => {
    setReducedMotion(true)
    const user = userEvent.setup()
    render(<HeroStage />)
    await clickStep(user, STEP_LABELS[3])
    expect(screen.getByText('Mechanic en route')).toBeInTheDocument()
    expect(screen.getByText('12 min')).toBeInTheDocument()
  })

  it('step buttons are keyboard operable', async () => {
    const user = userEvent.setup()
    render(<HeroStage />)
    await user.tab() // Request button
    await user.tab() // Searching button
    await user.keyboard('{Enter}')
    expect(screen.getByText('Searching for verified mechanics…')).toBeInTheDocument()
  })
})