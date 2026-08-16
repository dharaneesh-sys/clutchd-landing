/**
 * Wave IX-1 (PRODUCTION.md): global test setup for Vitest + RTL.
 *
 * Stubs the browser APIs jsdom lacks so the DOM/a11y contract tests can run:
 *   - matchMedia — jsdom has none; the stub exposes a controllable
 *     prefers-reduced-motion flag via setReducedMotion() (HeroStage reads it
 *     in its useState initializer, so tests flip it BEFORE render).
 *   - IntersectionObserver — jsdom has none; the stub records instances so
 *     useReveal tests can fire intersect callbacks and assert unobserve.
 *   - requestAnimationFrame — fires synchronously so FaqPanel's mount-fade
 *     resolves inside the same act() (no act warnings, no timers to flush).
 *   - window.scrollTo — jsdom logs "Not implemented"; RouteFocus calls it.
 *
 * Also mirrors index.html's meta tags so usePageMeta has real targets.
 */
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// --- matchMedia stub (controllable prefers-reduced-motion) ---
let reducedMotion = false

const matchMediaImpl = vi.fn((query) => ({
  matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: matchMediaImpl,
})

/** Flip the prefers-reduced-motion media query for the next render. */
export function setReducedMotion(value) {
  reducedMotion = Boolean(value)
}

// --- IntersectionObserver stub (records instances for test control) ---
class IntersectionObserverStub {
  static instances = []

  constructor(callback, options = {}) {
    this.callback = callback
    this.options = options
    this.observed = new Set()
    IntersectionObserverStub.instances.push(this)
  }

  observe(el) {
    this.observed.add(el)
  }

  unobserve(el) {
    this.observed.delete(el)
  }

  disconnect() {
    this.observed.clear()
  }

  takeRecords() {
    return []
  }

  /** Test helper: fire an intersection entry for a target. */
  trigger(target, isIntersecting) {
    this.callback([{ target, isIntersecting }], this)
  }
}

globalThis.IntersectionObserver = IntersectionObserverStub

/** Instances created since the last test (cleared in beforeEach). */
export function getIntersectionObservers() {
  return IntersectionObserverStub.instances
}

// --- requestAnimationFrame: fire synchronously (FaqPanel mount-fade) ---
globalThis.requestAnimationFrame = (cb) => {
  cb()
  return 1
}
globalThis.cancelAnimationFrame = () => {}

// --- window.scrollTo: jsdom logs "Not implemented" otherwise ---
window.scrollTo = vi.fn()

// --- localStorage shim ---
// Node 22+ exposes an experimental `localStorage` accessor (undefined without
// --localstorage-file). vitest's populateGlobal skips copying jsdom's
// localStorage because the key already exists on globalThis, so the real
// jsdom Storage never reaches the test. Replace the accessor with a working
// in-memory data property (defineProperty avoids invoking Node's getter, which
// would emit an ExperimentalWarning per process) so the EarlyAccessForm
// soft-dedupe contract is testable.
const lsDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
if (!lsDescriptor || typeof lsDescriptor.value === 'undefined') {
  const store = new Map()
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
      key: (index) => [...store.keys()][index] ?? null,
      get length() {
        return store.size
      },
    },
    writable: true,
    configurable: true,
  })
}

// --- Mirror index.html meta tags so usePageMeta has targets ---
function ensureMeta(attrs, content) {
  const selector = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join('')
  if (!document.head.querySelector(`meta[${selector}]`)) {
    const el = document.createElement('meta')
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    el.setAttribute('content', content)
    document.head.appendChild(el)
  }
}
ensureMeta({ name: 'description' }, '')
ensureMeta({ property: 'og:title' }, '')
ensureMeta({ property: 'og:description' }, '')

// --- Per-test hygiene ---
beforeEach(() => {
  reducedMotion = false
  IntersectionObserverStub.instances.length = 0
  window.scrollTo.mockClear()
  window.localStorage?.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})