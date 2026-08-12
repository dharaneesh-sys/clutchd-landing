// T7-T12 — content sections gate.
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

await page.setViewportSize({ width: 320, height: 700 })
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
const noScroll320 = await page.evaluate(() => document.scrollingElement.scrollWidth <= document.documentElement.clientWidth)
results.push(`no-horizontal-scroll@320: ${noScroll320 ? 'PASS' : 'FAIL'}`)

// gold-era copy forbidden
const bodyText = await page.locator('body').textContent()
const goldEra = /vehicle service, on demand/i.test(bodyText || '')
results.push(`no-gold-era-copy: ${goldEra ? 'FAIL' : 'PASS'}`)

const SECTIONS = [
  { id: 'ecosystem', cards: 4, label: 'Ecosystem' },
  { id: 'audiences', cards: 3, label: 'Audiences' },
  { id: 'workflow', cards: 3, label: 'Workflow' },
  { id: 'trust', cards: 3, label: 'Trust' },
  { id: 'marketplace', cards: 3, label: 'Marketplace' },
  { id: 'intelligence', cards: 3, label: 'Intelligence' },
]

for (const s of SECTIONS) {
  const imgCount = await page.$$eval(`#${s.id} img`, (els) => els.length)
  results.push(`${s.id}-no-img: ${imgCount} (expect 0) -> ${imgCount === 0 ? 'PASS' : 'FAIL'}`)
  // Intelligence lists capabilities as <li>; others use <h3> per item.
  const sel = s.id === 'intelligence' ? `#${s.id} li` : `#${s.id} h3`
  const cardCount = await page.$$eval(sel, (els) => els.length)
  results.push(`${s.id}-items: ${cardCount} (expect >=${s.cards}) -> ${cardCount >= s.cards ? 'PASS' : 'FAIL'}`)
}

// screenshots + overflow at 3 breakpoints
for (const w of [375, 768, 1280]) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const ov = await page.evaluate(() => document.scrollingElement.scrollWidth <= document.documentElement.clientWidth)
  results.push(`sections-no-overflow@${w}: ${ov ? 'PASS' : 'FAIL'}`)
  await page.screenshot({ path: `${EVIDENCE}/task-7-12-sections-${w}.png`, fullPage: true })
}

results.push(`console-errors: ${errors.length === 0 ? 'NONE' : errors.join(' | ')}`)
await browser.close()

fs.writeFileSync(`${EVIDENCE}/task-7-12-notes.md`, `# T7-T12 content sections gate\n\n${results.join('\n')}\n`)
console.log(results.join('\n'))
