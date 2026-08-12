// T5 — header / mobile menu / footer gate.
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

// No dead links in footer (no href="#")
const deadLinks = await page.$$eval('footer a', (as) => as.filter((a) => a.getAttribute('href') === '#').length)
results.push(`footer-dead-links: ${deadLinks} (expect 0) -> ${deadLinks === 0 ? 'PASS' : 'FAIL'}`)

// No horizontal scroll at 375
const ov = await page.evaluate(() => document.scrollingElement.scrollWidth <= document.documentElement.clientWidth)
results.push(`no-horizontal-scroll@375: ${ov ? 'PASS' : 'FAIL'}`)

// Open menu via click
await page.click('button[aria-controls="mobile-menu"]')
await page.waitForTimeout(300)
const opened = await page.getAttribute('button[aria-controls="mobile-menu"]', 'aria-expanded')
results.push(`menu-open-click: aria-expanded=${opened} -> ${opened === 'true' ? 'PASS' : 'FAIL'}`)
await page.screenshot({ path: `${EVIDENCE}/task-5-menu-open.png` })

// Focus moved into panel
const focusInPanel = await page.evaluate(() => {
  const d = document.getElementById('mobile-menu')
  return d && d.contains(document.activeElement)
})
results.push(`focus-moved-into-panel: ${focusInPanel ? 'PASS' : 'FAIL'}`)

// Escape closes + restores focus to trigger
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
const closed = await page.getAttribute('button[aria-controls="mobile-menu"]', 'aria-expanded')
const focusOnTrigger = await page.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'mobile-menu')
results.push(`escape-closes: aria-expanded=${closed} -> ${closed === 'false' ? 'PASS' : 'FAIL'}`)
results.push(`escape-restores-focus: ${focusOnTrigger ? 'PASS' : 'FAIL'}`)

// Open via keyboard (Enter on trigger)
await page.focus('button[aria-controls="mobile-menu"]')
await page.keyboard.press('Enter')
await page.waitForTimeout(300)
const openedKb = await page.getAttribute('button[aria-controls="mobile-menu"]', 'aria-expanded')
results.push(`menu-open-keyboard: aria-expanded=${openedKb} -> ${openedKb === 'true' ? 'PASS' : 'FAIL'}`)

// Click a nav link -> panel closes
await page.click('#mobile-menu nav a')
await page.waitForTimeout(300)
const closedAfterLink = await page.getAttribute('button[aria-controls="mobile-menu"]', 'aria-expanded')
results.push(`menu-closes-on-link: aria-expanded=${closedAfterLink} -> ${closedAfterLink === 'false' ? 'PASS' : 'FAIL'}`)

results.push(`console-errors: ${errors.length === 0 ? 'NONE' : errors.join(' | ')}`)
await browser.close()

fs.writeFileSync(`${EVIDENCE}/task-5-notes.md`, `# T5 header / menu / footer gate\n\n${results.join('\n')}\n`)
console.log(results.join('\n'))
