// T14 — accessibility + SEO gate.
import { chromium } from 'playwright'
import fs from 'node:fs'

const EVIDENCE = '/home/dinusus/.omo/evidence/clutchd-landing'
fs.mkdirSync(EVIDENCE, { recursive: true })
const results = []
const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

await page.setViewportSize({ width: 375, height: 800 })
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })

// skip link visible on Tab-first
await page.keyboard.press('Tab')
await page.waitForTimeout(300)
const skipFocused = await page.evaluate(() => document.activeElement?.classList.contains('skip-link'))
const skipVisible = await page.evaluate(() => {
  const el = document.querySelector('.skip-link')
  const r = el.getBoundingClientRect()
  return r.top >= 0 && r.top < window.innerHeight
})
results.push(`skip-link-focused-on-tab: ${skipFocused ? 'PASS' : 'FAIL'}`)
results.push(`skip-link-visible-on-focus: ${skipVisible ? 'PASS' : 'FAIL'}`)
await page.screenshot({ path: `${EVIDENCE}/task-14-skiplink.png` })

// single h1
const h1 = await page.$$eval('h1', (els) => els.length)
results.push(`single-h1: ${h1 === 1 ? 'PASS' : `FAIL (${h1})`}`)

// all aria-labelledby resolve to existing ids
const dangling = await page.evaluate(() => {
  const bad = []
  document.querySelectorAll('[aria-labelledby]').forEach((el) => {
    el.getAttribute('aria-labelledby').split(/\s+/).forEach((id) => {
      if (!document.getElementById(id)) bad.push(`${el.id || el.tagName}->${id}`)
    })
  })
  return bad
})
results.push(`aria-labelledby-resolves: ${dangling.length === 0 ? 'PASS' : `FAIL (${dangling.join(',')})`}`)

// landmarks
const landmarks = await page.evaluate(() => ({
  header: !!document.querySelector('header'),
  nav: !!document.querySelector('nav'),
  main: !!document.querySelector('main'),
  footer: !!document.querySelector('footer'),
}))
const lmOk = Object.values(landmarks).every(Boolean)
results.push(`landmarks: ${lmOk ? 'PASS' : `FAIL (${JSON.stringify(landmarks)})`}`)

// no horizontal scroll at 320
await page.setViewportSize({ width: 320, height: 700 })
await page.reload({ waitUntil: 'networkidle' })
const noScroll = await page.evaluate(() => document.scrollingElement.scrollWidth <= document.documentElement.clientWidth)
results.push(`no-horizontal-scroll@320: ${noScroll ? 'PASS' : 'FAIL'}`)

// reduced-motion honored: reveal elements render visible immediately
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(300)
const revealVisible = await page.evaluate(() => {
  const el = document.querySelector('#ecosystem [class*="transition"]')
  return el && getComputedStyle(el).opacity === '1'
})
results.push(`reduced-motion-reveal-instant: ${revealVisible ? 'PASS' : 'FAIL'}`)

// index.html SEO
const html = fs.readFileSync('/home/dinusus/clutchd-landing/index.html', 'utf8')
results.push(`html-lang-en: ${html.includes('<html lang="en">') ? 'PASS' : 'FAIL'}`)
results.push(`title: ${html.includes('<title>ClutchD — Connected automotive care</title>') ? 'PASS' : 'FAIL'}`)
results.push(`meta-description: ${html.includes('name="description"') ? 'PASS' : 'FAIL'}`)
results.push(`og-tags: ${html.includes('property="og:type"') && html.includes('property="og:title"') ? 'PASS' : 'FAIL'}`)

// favicon is the blue clutch mark (not vite purple)
const favicon = fs.readFileSync('/home/dinusus/clutchd-landing/public/favicon.svg', 'utf8')
results.push(`favicon-blue-mark: ${favicon.includes('#1e29b6') && !favicon.includes('#863bff') ? 'PASS' : 'FAIL'}`)

results.push(`console-errors: ${errors.length === 0 ? 'NONE' : errors.join(' | ')}`)
await browser.close()

fs.writeFileSync(`${EVIDENCE}/task-14-notes.md`, `# T14 accessibility + SEO gate\n\n${results.join('\n')}\n`)
console.log(results.join('\n'))