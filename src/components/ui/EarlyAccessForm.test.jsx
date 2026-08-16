/**
 * EarlyAccessForm — DOM + a11y contract tests (DESIGN.md §5 EarlyAccessForm,
 * PRODUCTION.md IX-1). Asserts the rendered contract only: roles, names,
 * aria attributes, visible text, fetch body, localStorage dedupe. Never
 * classes/selectors. The status region is queried by its aria-live attribute
 * (dom-accessibility-api does not map aria-live="polite" to a role).
 */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EarlyAccessForm from './EarlyAccessForm.jsx'

const VALID_EMAIL = 'driver@example.com'

function stubFetch(impl) {
  const fn = vi.fn(impl)
  global.fetch = fn
  return fn
}

function statusRegion(container) {
  return container.querySelector('[aria-live="polite"]')
}

describe('EarlyAccessForm', () => {
  it('renders the idle state: enabled input + submit button, no message', () => {
    const { container } = render(<EarlyAccessForm />)
    expect(screen.getByLabelText('Email address')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Get early access' })).toBeEnabled()
    expect(statusRegion(container)).toBeInTheDocument()
    expect(screen.queryByText(/on the list/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/enter a valid email/i)).not.toBeInTheDocument()
  })

  it('walks idle → submitting → success and POSTs the Netlify form body', async () => {
    let resolveFetch
    const fetchMock = stubFetch(() => new Promise((res) => (resolveFetch = res)))
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), VALID_EMAIL)
    await user.click(screen.getByRole('button', { name: 'Get early access' }))

    // submitting: spinner label, input + button disabled
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()
    expect(screen.getByLabelText('Email address')).toBeDisabled()

    resolveFetch({ ok: true })
    await waitFor(() => expect(statusRegion(container)).toHaveTextContent(/on the list/i))

    // fetch contract: POST to the current path, Accept json, FormData fields
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      window.location.pathname,
      expect.objectContaining({ method: 'POST', headers: { Accept: 'application/json' } }),
    )
    const body = fetchMock.mock.calls[0][1].body
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('form-name')).toBe('early-access')
    expect(body.get('email')).toBe(VALID_EMAIL)
    expect(body.get('bot-field')).toBe('')

    // success clears the error contract: aria-invalid back to the neutral
    // "false" state, aria-describedby removed
    const input = screen.getByLabelText('Email address')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('stores the submitted email lowercased in localStorage', async () => {
    stubFetch(() => Promise.resolve({ ok: true }))
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), 'Driver@Example.COM')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))
    await waitFor(() => expect(statusRegion(container)).toHaveTextContent(/on the list/i))

    expect(JSON.parse(localStorage.getItem('clutchd-signups'))).toEqual(['driver@example.com'])
  })

  it('rejects an invalid email with the EMAIL_RE message and the error aria contract', async () => {
    const fetchMock = stubFetch(vi.fn())
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))

    expect(statusRegion(container)).toHaveTextContent('Enter a valid email address')
    const input = screen.getByLabelText('Email address')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const errorId = input.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId)).toHaveTextContent('Enter a valid email address')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('clears the error state when the user types again', async () => {
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), 'bad')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))
    expect(statusRegion(container)).toHaveTextContent('Enter a valid email address')

    await user.type(screen.getByLabelText('Email address'), '@good.com')
    expect(statusRegion(container)).not.toHaveTextContent('Enter a valid email address')
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'false')
  })

  it('soft-dedupes case-insensitively against localStorage and never POSTs', async () => {
    localStorage.setItem('clutchd-signups', JSON.stringify(['driver@example.com']))
    const fetchMock = stubFetch(vi.fn())
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), 'DRIVER@EXAMPLE.COM')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))

    expect(statusRegion(container)).toHaveTextContent(/already on the list/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows the error state on a non-2xx response: never fake success', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    stubFetch(() => Promise.resolve({ ok: false, status: 500 }))
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), VALID_EMAIL)
    await user.click(screen.getByRole('button', { name: 'Get early access' }))

    await waitFor(() =>
      expect(statusRegion(container)).toHaveTextContent(/something went wrong/i),
    )
    expect(screen.queryByText(/on the list/i)).not.toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('shows the error state on a network failure: never fake success', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    stubFetch(() => Promise.reject(new Error('network down')))
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)

    await user.type(screen.getByLabelText('Email address'), VALID_EMAIL)
    await user.click(screen.getByRole('button', { name: 'Get early access' }))

    await waitFor(() =>
      expect(statusRegion(container)).toHaveTextContent(/something went wrong/i),
    )
    expect(screen.queryByText(/on the list/i)).not.toBeInTheDocument()
    expect(errorSpy).toHaveBeenCalled()
  })

  it('announces every message state inside the aria-live status region', async () => {
    const user = userEvent.setup()
    const { container } = render(<EarlyAccessForm />)
    const region = statusRegion(container)

    // error
    await user.type(screen.getByLabelText('Email address'), 'bad')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))
    expect(within(region).getByText('Enter a valid email address')).toBeInTheDocument()

    // duplicate
    localStorage.setItem('clutchd-signups', JSON.stringify(['driver@example.com']))
    await user.clear(screen.getByLabelText('Email address'))
    await user.type(screen.getByLabelText('Email address'), 'driver@example.com')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))
    expect(within(region).getByText(/already on the list/i)).toBeInTheDocument()

    // success
    stubFetch(() => Promise.resolve({ ok: true }))
    await user.clear(screen.getByLabelText('Email address'))
    await user.type(screen.getByLabelText('Email address'), 'other@example.com')
    await user.click(screen.getByRole('button', { name: 'Get early access' }))
    await waitFor(() => expect(within(region).getByText(/on the list/i)).toBeInTheDocument())
  })

  it('hero variant keeps the input accessible via aria-label', () => {
    render(<EarlyAccessForm variant="hero" />)
    expect(screen.getByRole('textbox', { name: 'Email address' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Get early access' })).toBeInTheDocument()
  })
})