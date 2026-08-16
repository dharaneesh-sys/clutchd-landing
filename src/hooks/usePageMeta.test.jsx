/**
 * usePageMeta — behavior tests (PRODUCTION.md IX-1). Verifies document.title
 * and the description / OG meta tags are synced per route mount.
 */
import { render } from '@testing-library/react'
import usePageMeta from './usePageMeta.js'

function PageMetaProbe({ title, description }) {
  usePageMeta(title, description)
  return null
}

describe('usePageMeta', () => {
  it('sets document.title and the description/OG meta tags', () => {
    render(<PageMetaProbe title="How it works: ClutchD" description="Step-by-step guide." />)
    expect(document.title).toBe('How it works: ClutchD')
    expect(document.querySelector('meta[name="description"]').content).toBe('Step-by-step guide.')
    expect(document.querySelector('meta[property="og:title"]').content).toBe(
      'How it works: ClutchD',
    )
    expect(document.querySelector('meta[property="og:description"]').content).toBe(
      'Step-by-step guide.',
    )
  })

  it('updates the tags when props change', () => {
    const { rerender } = render(<PageMetaProbe title="A" description="a" />)
    rerender(<PageMetaProbe title="B" description="b" />)
    expect(document.title).toBe('B')
    expect(document.querySelector('meta[name="description"]').content).toBe('b')
    expect(document.querySelector('meta[property="og:title"]').content).toBe('B')
    expect(document.querySelector('meta[property="og:description"]').content).toBe('b')
  })
})