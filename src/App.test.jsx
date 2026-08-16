/**
 * RouteFocus + useGoatCounterRouteChange — behavior tests (DESIGN.md §5
 * PageShell, PRODUCTION.md IX-1). RouteFocus: scroll-to-top + focus moves to
 * the page h1 on mount and route change. useGoatCounterRouteChange:
 * skip-first-run, no-op when window.goatcounter is absent, count({ path })
 * on subsequent pathname changes.
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { RouteFocus } from './App.jsx'
import useGoatCounterRouteChange from './hooks/useGoatCounterRouteChange.js'

function GoatCounterHarness({ pathname }) {
  useGoatCounterRouteChange(pathname)
  return null
}

describe('useGoatCounterRouteChange', () => {
  it('skips the first run and counts subsequent pathname changes', () => {
    window.goatcounter = { count: vi.fn() }
    const { rerender } = render(<GoatCounterHarness pathname="/a" />)
    expect(window.goatcounter.count).not.toHaveBeenCalled()

    rerender(<GoatCounterHarness pathname="/b" />)
    expect(window.goatcounter.count).toHaveBeenCalledTimes(1)
    expect(window.goatcounter.count).toHaveBeenCalledWith({ path: '/' })
  })

  it('no-ops when window.goatcounter is absent', () => {
    delete window.goatcounter
    const { rerender } = render(<GoatCounterHarness pathname="/a" />)
    expect(() => rerender(<GoatCounterHarness pathname="/b" />)).not.toThrow()
  })
})

describe('RouteFocus', () => {
  it('scrolls to top and moves focus to the page h1 on mount and route change', async () => {
    delete window.goatcounter
    const user = userEvent.setup()

    function NavButton() {
      const navigate = useNavigate()
      return <button type="button" onClick={() => navigate('/two')}>Go to two</button>
    }

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Routes>
          <Route
            path="/one"
            element={
              <>
                <main>
                  <h1>One</h1>
                </main>
                <NavButton />
              </>
            }
          />
          <Route path="/two" element={<main><h1>Two</h1></main>} />
        </Routes>
        <RouteFocus />
      </MemoryRouter>,
    )

    const h1One = screen.getByRole('heading', { name: 'One' })
    expect(h1One).toHaveAttribute('tabindex', '-1')
    expect(h1One).toHaveFocus()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)

    await user.click(screen.getByRole('button', { name: 'Go to two' }))

    const h1Two = screen.getByRole('heading', { name: 'Two' })
    expect(h1Two).toHaveFocus()
    expect(window.scrollTo).toHaveBeenCalledTimes(2)
  })
})