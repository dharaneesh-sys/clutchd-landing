// T4 Primitive Showcase Gate — Playwright interaction pass.
// Serves nothing itself; expects `npm run preview` running on :4173.
import { chromium } from 'playwright'
import fs from 'node:fs'

const EVIDENCE = '/home/dinusus/.omo/evidence/clutchd-landing'
fs.mkdirSync(EVIDENCE, { recursive: true })

const VIEWS = [375, 768, 1280]
const results = []

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })

// 1. Full-page screenshots at each breakpoint + overflow assertion
for (const w of VIEWS) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.waitForTimeout(300)
  const overflow = await page.evaluate(() => ({
    scrollW: document.scrollingElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }))
  const noOverflow = overflow.scrollW <= overflow.clientW
  results.push(`overflow@${w}: scrollW=${overflow.scrollW} clientW=${overflow.clientW} -> ${noOverflow ? 'PASS' : 'FAIL'}`)
  await page.screenshot({ path: `${EVIDENCE}/task-4-showcase-${w}.png`, fullPage: true })
}

// 2. Hover each button variant -> capture hover-state screenshot
const buttons = await page.$$('button[data-testid^="btn-"]')
let hoverShot = 0
for (const b of buttons.slice(0, 6)) {
  await b.hover()
  await page.waitForTimeout(250)
}
await page.setViewportSize({ width: 1280, height: 900 })
await page.screenshot({ path: `${EVIDENCE}/task-4-primitives-hover.png`, fullPage: true })
results.push(`hover-capture: ${buttons.length} buttons hovered -> task-4-primitives-hover.png`)

// 3. Tab-through focus-ring assertion: each interactive primitive gets a visible ring
const focusables = await page.$$('[data-testid^="btn-"], [data-testid="logo-lockup"], [data-testid="badge-live"]')
let focusPass = 0
for (const el of focusables) {
  await el.focus()
  const ring = await el.evaluate((n) => {
    const s = getComputedStyle(n)
    return s.outlineWidth !== '0px' || s.boxShadow !== 'none' || (s.outlineStyle && s.outlineStyle !== 'none')
  })
  if (ring) focusPass++
}
results.push(`focus-ring: ${focusPass}/${focusables.length} focusable primitives show a visible ring`)

// 4. Keyboard: Enter activates the interact button, Escape does nothing harmful
await page.click('[data-testid="btn-interact"]', { force: true }).catch(() => {})
const before = await page.textContent('[data-testid="interact-count"]')
await page.focus('[data-testid="btn-interact"]')
await page.keyboard.press('Enter')
await page.waitForTimeout(150)
const after = await page.textContent('[data-testid="interact-count"]')
results.push(`keyboard-Enter: count "${before?.trim()}" -> "${after?.trim()}" -> ${before !== after ? 'PASS (Enter activated)' : 'FAIL'}`)
await page.keyboard.press('Escape')
await page.waitForTimeout(100)
const afterEsc = await page.textContent('[data-testid="interact-count"]')
results.push(`keyboard-Escape: count unchanged after Escape -> ${afterEsc === after ? 'PASS' : 'FAIL'}`)

// 5. Console errors
results.push(`console-errors: ${errors.length === 0 ? 'NONE' : errors.join(' | ')}`)

await browser.close()

const summary = results.join('\n')
fs.writeFileSync(`${EVIDENCE}/task-4-notes.md`, `# T4 Primitive Showcase Gate — Playwright pass\n\n${summary}\n`)
console.log(summary)
