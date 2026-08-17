/**
 * Wave XII-1 (PRODUCTION.md): i18n core unit tests.
 *
 * Covers the language plumbing contract:
 *   - default 'en' with no URL param / stored language
 *   - `?lang=ta` URL param honored (deep links) and persisted
 *   - setLang('ta') / setLang('en') persist to localStorage and switch maps
 *   - missing keys fall back to the EN string (critical for the `ta` `{}`
 *     placeholder phase — the app never renders a raw key)
 *   - setHtmlLang flips document.documentElement.lang
 *
 * localStorage is cleared between tests by the global setup
 * (src/test/setup.js beforeEach). window.location.search is stubbed per-test
 * and restored in afterEach.
 */
import { renderHook, act } from '@testing-library/react'
import { useT, T, setHtmlLang, EN, TA, LANG_STORAGE_KEY } from './i18n.js'

const REAL_LOCATION = window.location

/** Point window.location.search at a value (jsdom location is read-only, so
 *  shadow it with a plain object carrying the props i18n reads). */
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

describe('useT', () => {
  afterEach(() => {
    restoreLocation()
    document.documentElement.lang = ''
  })

  it('defaults to en with no URL param or stored language', () => {
    const { result } = renderHook(() => useT())
    expect(result.current.lang).toBe('en')
    expect(result.current.t).toEqual(EN)
    expect(result.current.t['hero.headline']).toBe(EN['hero.headline'])
  })

  it('honors the ?lang=ta URL param and persists it to localStorage', () => {
    setSearch('?lang=ta')
    const { result } = renderHook(() => useT())
    expect(result.current.lang).toBe('ta')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('ta')
  })

  it('setLang("ta") persists to localStorage and switches to the Tamil map', () => {
    const { result } = renderHook(() => useT())
    act(() => result.current.setLang('ta'))
    expect(result.current.lang).toBe('ta')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('ta')
    // real Tamil strings, not the EN fallback
    expect(result.current.t['hero.headline']).toBe(TA['hero.headline'])
    expect(result.current.t['faq.0.q']).toBe(TA['faq.0.q'])
    expect(result.current.t['nav.howItWorks']).toBe(TA['nav.howItWorks'])
  })

  it('setLang("en") persists and switches back', () => {
    const { result } = renderHook(() => useT())
    act(() => result.current.setLang('ta'))
    act(() => result.current.setLang('en'))
    expect(result.current.lang).toBe('en')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en')
    expect(result.current.t).toEqual(EN)
  })

  it('never renders a raw key: a key absent from both maps is undefined', () => {
    const { result } = renderHook(() => useT())
    act(() => result.current.setLang('ta'))
    expect(result.current.t['no.such.key.anywhere']).toBeUndefined()
  })

  it('syncs document.documentElement.lang via effect', () => {
    const { result } = renderHook(() => useT())
    expect(document.documentElement.lang).toBe('en')
    act(() => result.current.setLang('ta'))
    expect(document.documentElement.lang).toBe('ta')
  })

  it('ignores an invalid ?lang= value and falls back to the default', () => {
    setSearch('?lang=fr')
    const { result } = renderHook(() => useT())
    expect(result.current.lang).toBe('en')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBeNull()
  })
})

describe('T helper', () => {
  afterEach(() => {
    restoreLocation()
  })

  it('returns the EN string for the current language', () => {
    expect(T('hero.headline')).toBe(EN['hero.headline'])
    expect(T('footer.tagline')).toBe(EN['footer.tagline'])
  })

  it('honors the ?lang=ta URL param and returns the Tamil string', () => {
    setSearch('?lang=ta')
    expect(T('hero.headline')).toBe(TA['hero.headline'])
  })
})

describe('LANGUAGES registry', () => {
  it('mirrors the EN key set 1:1 with non-empty values (pure string-map swap)', () => {
    expect(Object.keys(TA).sort()).toEqual(Object.keys(EN).sort())
    for (const key of Object.keys(EN)) {
      expect(typeof TA[key]).toBe('string')
      expect(TA[key].length).toBeGreaterThan(0)
    }
  })
})

describe('setHtmlLang', () => {
  it('flips document.documentElement.lang', () => {
    setHtmlLang('ta')
    expect(document.documentElement.lang).toBe('ta')
    setHtmlLang('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('coerces an invalid language to en', () => {
    setHtmlLang('fr')
    expect(document.documentElement.lang).toBe('en')
  })
})