// T6 — hero gate.
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

// 320px: no horizontal scroll
await page.setViewportSize({ width: 320, height: 700 })
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
const noScroll320 = await page.evaluate(() => document.scrollingElement.scrollWidth <= document.documentElement.clientWidth)
results.push(`no-horizontal-scroll@320: ${noScroll320 ? 'PASS' : 'FAIL'}`)

// single h1 page-wide
const h1Count = await page.$$eval('h1', (els) => els.length)
results.push(`single-h1: ${h1Count} (expect 1) -> ${h1Count === 1 ? 'PASS' : 'FAIL'}`)

// "Now live in Coimbatore" present (badge is uppercase via CSS; check textContent, case-insensitive)
const liveText = await page.locator('body').textContent()
results.push(`live-badge: ${/now live in coimbatore/i.test(liveText || '') ? 'PASS' : 'FAIL'}`)

// no <img> inside hero (pure CSS/SVG mockup)
const imgInHero = await page.$$eval('#hero img', (els) => els.length)
results.push(`hero-no-img: ${imgInHero} (expect 0) -> ${imgInHero === 0 ? 'PASS' : 'FAIL'}`)

// both CTA anchors resolve
const ctaEarly = page.getByRole('button', { name: 'Get early access' })
const ctaHow = page.getByRole('button', { name: 'How it works' })
results.push(`cta-present: early=${await ctaEarly.count()} how=${await ctaHow.count()}`)
await ctaEarly.click()
await page.waitForTimeout(200)
const hash1 = await page.evaluate(() => window.location.hash)
results.push(`cta-early-hash: ${hash1} -> ${hash1 === '#early-access' ? 'PASS' : 'FAIL'}`)
await ctaHow.click()
await page.waitForTimeout(200)
const hash2 = await page.evaluate(() => window.location.hash)
results.push(`cta-how-hash: ${hash2} -> ${hash2 === '#workflow' ? 'PASS' : 'FAIL'}`)

// screenshots at 3 breakpoints
for (const w of [375, 768, 1280]) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const ov = await page.evaluate(() => document.scrollingElement.scrollWidth <= document.documentElement.clientWidth)
  results.push(`hero-no-overflow@${w}: ${ov ? 'PASS' : 'FAIL'}`)
  await page.screenshot({ path: `${EVIDENCE}/task-6-hero-${w}.png` })
}

results.push(`console-errors: ${errors.length === 0 ? 'NONE' : errors.join(' | ')}`)
await browser.close()

fs.writeFileSync(`${EVIDENCE}/task-6-notes.md`, `# T6 hero gate\n\n${results.join('\n')}\n`)
console.log(results.join('\n'))
