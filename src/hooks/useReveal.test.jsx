/**
 * useReveal — behavior tests (DESIGN.md §6, PRODUCTION.md IX-1). Verifies the
 * IntersectionObserver contract: visible flips on intersect and the target is
 * unobserved; falls back to visible when IntersectionObserver is undefined.
 */
import { render, screen, act } from '@testing-library/react'
import useReveal from './useReveal.js'
import { getIntersectionObservers } from '../test/setup.js'

function RevealProbe() {
  const [ref, visible] = useReveal()
  return <div ref={ref}>{visible ? 'visible' : 'hidden'}</div>
}

describe('useReveal', () => {
  it('starts hidden, becomes visible on intersect, then unobserves the target', () => {
    render(<RevealProbe />)
    expect(screen.getByText('hidden')).toBeInTheDocument()

    const obs = getIntersectionObservers()[0]
    expect(obs).toBeTruthy()
    const target = [...obs.observed][0]
    expect(target).toBeTruthy()

    act(() => obs.trigger(target, true))
    expect(screen.getByText('visible')).toBeInTheDocument()
    expect(obs.observed.has(target)).toBe(false)
  })

  it('falls back to visible when IntersectionObserver is undefined', () => {
    const original = globalThis.IntersectionObserver
    delete globalThis.IntersectionObserver
    try {
      render(<RevealProbe />)
      expect(screen.getByText('visible')).toBeInTheDocument()
    } finally {
      globalThis.IntersectionObserver = original
    }
  })
})