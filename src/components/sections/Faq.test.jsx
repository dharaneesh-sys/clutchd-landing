/**
 * Faq (accordion) — DOM + a11y contract tests (DESIGN.md §5 FAQ Accordion,
 * PRODUCTION.md IX-1). Asserts the rendered contract only: real disclosure
 * buttons, aria-expanded toggling, aria-controls ↔ panel id wiring, keyboard
 * operability, single-open behavior. Never classes/selectors.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Faq from './Faq.jsx'

const QUESTIONS = [
  'How does ClutchD matching work?',
  'How do estimates and pricing work?',
  'How are providers verified?',
  'Where is ClutchD available?',
  'What payment methods are supported?',
  'What does "Preview" mean?',
]

describe('Faq accordion', () => {
  it('renders one real disclosure button per question', () => {
    render(<Faq />)
    for (const q of QUESTIONS) {
      expect(screen.getByRole('button', { name: q })).toBeInTheDocument()
    }
  })

  it('toggles aria-expanded on click', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const first = screen.getByRole('button', { name: QUESTIONS[0] })
    expect(first).toHaveAttribute('aria-expanded', 'false')
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')
  })

  it('wires aria-controls to the panel id and aria-labelledby back to the button', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const button = screen.getByRole('button', { name: QUESTIONS[0] })
    await user.click(button)

    const panelId = button.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    const panel = document.getElementById(panelId)
    expect(panel).toBeInTheDocument()
    expect(panel).toHaveAttribute('aria-labelledby', button.id)
    expect(within(panel).getByText(/ClutchD finds verified nearby providers/i)).toBeInTheDocument()
  })

  it('is keyboard operable with Enter and Space', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: QUESTIONS[0] })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: QUESTIONS[0] })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('keeps a single panel open at a time', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const first = screen.getByRole('button', { name: QUESTIONS[0] })
    const second = screen.getByRole('button', { name: QUESTIONS[1] })

    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/ClutchD finds verified nearby providers/i)).toBeInTheDocument()

    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(screen.queryByText(/ClutchD finds verified nearby providers/i)).not.toBeInTheDocument()
    expect(screen.getByText(/You see the price before work starts/i)).toBeInTheDocument()
  })
})