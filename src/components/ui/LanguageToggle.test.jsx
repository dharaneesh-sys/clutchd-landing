/**
 * LanguageToggle — wiring tests (PRODUCTION.md XII-1b).
 *
 * Asserts the rendered contract only (roles, names, aria-pressed) plus the
 * wiring that makes the toggle actually switch the app language:
 *   - EN is the default pressed option with no URL param / stored language
 *   - clicking தமிழ் flips aria-pressed, persists clutchd-lang, flips
 *     document.documentElement.lang, and re-renders every useT consumer
 *     (cross-component subscription) — with the `ta` {} placeholder this
 *     means strings stay on the EN fallback, so the probes assert `lang`
 *     and the <html lang> attribute, not visible copy
 *   - `?lang=ta` URL param (deep link) is honored on mount
 *
 * localStorage / location.search hygiene is handled by the global setup and
 * the local setSearch/restoreLocation pair (same pattern as i18n.test.js).
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageToggle from './LanguageToggle.jsx'
import { useT, LANG_STORAGE_KEY } from '../../lib/i18n.js'

const REAL_LOCATION = window.location

function setSearch(search) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...REAL_LOCATION, search },
  })
}

function restoreLocation() {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: REAL_LOCATION,
  })
}

// A separate useT consumer that exposes the active language as text so the
// cross-component subscription (toggle → every other consumer re-renders)
// is observable without depending on Tamil strings existing yet.
function LangProbe() {
  const { lang } = useT()
  return <output data-testid="lang-probe">{lang}</output>
}

describe('LanguageToggle', () => {
  afterEach(() => {
    restoreLocation()
    document.documentElement.lang = ''
  })

  it('renders two buttons with the language labels; EN pressed by default', () => {
    render(
      <>
        <LanguageToggle />
        <LangProbe />
      </>,
    )
    const en = screen.getByRole('button', { name: 'EN' })
    const ta = screen.getByRole('button', { name: 'தமிழ்' })
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(ta).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Language', { selector: 'legend' })).toBeInTheDocument()
    expect(screen.getByTestId('lang-probe')).toHaveTextContent('en')
  })

  it('clicking தமிழ் flips aria-pressed, persists, flips html lang, and re-renders other consumers', async () => {
    const user = userEvent.setup()
    render(
      <>
        <LanguageToggle />
        <LangProbe />
      </>,
    )
    const en = screen.getByRole('button', { name: 'EN' })
    const ta = screen.getByRole('button', { name: 'தமிழ்' })

    await user.click(ta)

    expect(ta).toHaveAttribute('aria-pressed', 'true')
    expect(en).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('ta')
    expect(document.documentElement.lang).toBe('ta')
    // cross-component subscription: the separate consumer re-rendered
    expect(screen.getByTestId('lang-probe')).toHaveTextContent('ta')

    // and back to EN
    await user.click(en)
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(ta).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(screen.getByTestId('lang-probe')).toHaveTextContent('en')
  })

  it('honors the ?lang=ta deep link on mount', () => {
    setSearch('?lang=ta')
    render(
      <>
        <LanguageToggle />
        <LangProbe />
      </>,
    )
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'தமிழ்' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('lang-probe')).toHaveTextContent('ta')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('ta')
  })
})
