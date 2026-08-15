import { useEffect } from 'react'

/**
 * usePageMeta — per-route <title> + meta description (V4, spec §3 V4).
 *
 * Client-side routing means index.html's static <head> can't vary per page.
 * This effect syncs document.title plus the description / OG / Twitter meta
 * tags on every route mount so each page is uniquely titled for SEO and
 * social sharing. No cleanup on unmount: every route sets its own values, so
 * the last-mounted page wins (Home re-sets the index.html defaults).
 */
const META_DESCRIPTION = 'meta[name="description"]'
const META_OG_TITLE = 'meta[property="og:title"]'
const META_OG_DESCRIPTION = 'meta[property="og:description"]'

function setMeta(selector, content) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute('content', content)
}

export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    setMeta(META_DESCRIPTION, description)
    setMeta(META_OG_TITLE, title)
    setMeta(META_OG_DESCRIPTION, description)
  }, [title, description])
}
