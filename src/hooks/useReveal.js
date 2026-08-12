import { useEffect, useRef, useState } from 'react'

// Reveal-on-scroll hook (DESIGN.md §6): IntersectionObserver only, never
// scroll listeners. Adds a visible flag when the element enters the viewport.
// GPU-composited reveal (opacity + translateY) is applied by the consumer via
// CSS; prefers-reduced-motion is honored in CSS so this stays a no-op visually.
export default function useReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [options])

  return [ref, visible]
}
