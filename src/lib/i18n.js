/**
 * Wave XII-1 (PRODUCTION.md): dependency-free i18n core.
 *
 * No react-i18next, no CDN. English default; Tamil opt-in via a header
 * toggle (later step) or the `?lang=ta` URL param for deep links.
 *
 * Language resolution order (first match wins):
 *   1. `?lang=ta` URL param (deep links) — persisted to localStorage
 *   2. `localStorage['clutchd-lang']`
 *   3. default `'en'`
 *
 * `useT()` returns `{ t, lang, setLang }`:
 *   - `t`      — the active language's string map. Missing keys fall back to
 *                the EN string, so the app never renders a raw `t('key')`.
 *                A language whose map is missing (e.g. `ta` is a `{}`
 *                placeholder until the user supplies it) resolves to EN.
 *   - `lang`   — `'en' | 'ta'`
 *   - `setLang`— persists the choice to localStorage and re-renders.
 *
 * `T(key)` is the non-hook helper for non-React contexts (meta tags,
 * document.title): it resolves the current language and returns the string.
 *
 * `setHtmlLang(lang)` flips `document.documentElement.lang` (called from a
 * React effect inside `useT`, or directly).
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import EN from './translations/en.js'

export const LANG_STORAGE_KEY = 'clutchd-lang'
export const VALID_LANGS = ['en', 'ta']

/** Re-export the flat-key English baseline (tests + registry consumers). */
export { EN }

/** Language registry. `ta` is a null placeholder until the user supplies
 *  src/lib/translations/ta.js; `useT()` falls back to EN for any language
 *  whose map is missing. */
export const LANGUAGES = { en: EN, ta: null }

/** Coerce any input to a known language ('en' | 'ta'), defaulting to 'en'. */
export function normalizeLang(lang) {
  return VALID_LANGS.includes(lang) ? lang : 'en'
}

function getUrlLang() {
  if (typeof window === 'undefined') return null
  const lang = new URLSearchParams(window.location.search).get('lang')
  return VALID_LANGS.includes(lang) ? lang : null
}

function getStoredLang() {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    return VALID_LANGS.includes(stored) ? stored : null
  } catch {
    // storage unavailable — fall through to the default
    return null
  }
}

function persistLang(lang) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    // storage unavailable — the choice still applies for this session
  }
}

/** Resolve the initial language: URL param → localStorage → 'en'. The URL
 *  param is persisted so a deep link becomes the user's stored preference. */
export function getInitialLang() {
  const fromUrl = getUrlLang()
  if (fromUrl) {
    persistLang(fromUrl)
    return fromUrl
  }
  return getStoredLang() ?? 'en'
}

/** Flip <html lang> to match the active language. SSR-safe. */
export function setHtmlLang(lang) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = normalizeLang(lang)
}

/** Build the effective string map for a language: the active map overrides
 *  EN; empty/undefined values are skipped so a partially-filled map never
 *  blanks a key. A missing map (e.g. `ta: null`) resolves to EN entirely. */
function resolveMap(lang) {
  const map = LANGUAGES[lang]
  if (!map || typeof map !== 'object') return EN
  const overrides = {}
  for (const [key, value] of Object.entries(map)) {
    if (typeof value === 'string' && value.length > 0) overrides[key] = value
  }
  return { ...EN, ...overrides }
}

/** Non-hook lookup for the current language (meta tags, document.title). */
export function T(key) {
  return resolveMap(getInitialLang())[key]
}

// Shared language subscribers (Wave XII-1b): every mounted `useT()` consumer
// registers its setState so a `setLang` call in one component (the header
// toggle) re-renders every other consumer. Subscription lives in an effect so
// mount still resolves via `getInitialLang()` (URL param → localStorage).
const languageListeners = new Set()

/** Hook: active string map + language + setter. `t` is stable per language. */
export function useT() {
  const [lang, setLangState] = useState(getInitialLang)
  const t = useMemo(() => resolveMap(lang), [lang])

  useEffect(() => {
    languageListeners.add(setLangState)
    return () => languageListeners.delete(setLangState)
  }, [])

  const setLang = useCallback((next) => {
    const normalized = normalizeLang(next)
    persistLang(normalized)
    for (const listener of languageListeners) listener(normalized)
  }, [])

  // Keep <html lang> in sync with the active language.
  useEffect(() => {
    setHtmlLang(lang)
  }, [lang])

  return { t, lang, setLang }
}