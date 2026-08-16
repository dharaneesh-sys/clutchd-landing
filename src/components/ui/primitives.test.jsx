/**
 * Button / Badge / Container — DOM + a11y contract basics (DESIGN.md §5,
 * PRODUCTION.md §1 test-contract note). Asserts the rendered contract only:
 * roles, accessible names, disabled state, aria-hidden decoration, the
 * polymorphic `as` element. Never classes/selectors.
 */
import { render, screen } from '@testing-library/react'
import Button from './Button.jsx'
import Badge from './Badge.jsx'
import Container from './Container.jsx'

describe('Button', () => {
  it('renders a real button with the label as its accessible name', () => {
    render(<Button>Get early access</Button>)
    expect(screen.getByRole('button', { name: 'Get early access' })).toBeInTheDocument()
  })

  it('reflects the disabled state', () => {
    render(<Button disabled>Get early access</Button>)
    expect(screen.getByRole('button', { name: 'Get early access' })).toBeDisabled()
  })

  it('uses aria-label for icon-only buttons', () => {
    render(<Button icon={<span />} iconLabel="Go" />)
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
  })
})

describe('Badge', () => {
  it('renders a non-interactive span with the label text', () => {
    render(<Badge>Beta</Badge>)
    const badge = screen.getByText('Beta')
    expect(badge.tagName).toBe('SPAN')
    expect(badge).not.toHaveAttribute('role')
  })

  it('marks the live dot aria-hidden (decorative)', () => {
    render(<Badge variant="live">Fleet online</Badge>)
    const badge = screen.getByText('Fleet online')
    const dot = badge.querySelector('[aria-hidden="true"]')
    expect(dot).toBeInTheDocument()
  })
})

describe('Container', () => {
  it('renders children inside a div by default', () => {
    render(<Container>Content</Container>)
    expect(screen.getByText('Content').tagName).toBe('DIV')
  })

  it('renders the polymorphic as element', () => {
    render(<Container as="section">Content</Container>)
    expect(screen.getByText('Content').tagName).toBe('SECTION')
  })
})