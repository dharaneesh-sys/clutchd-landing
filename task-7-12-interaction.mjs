// T7-T12 — content sections gate (plan-spec assertions).
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

const bodyText = await page.locator('body').textContent()
results.push(`no-gold-era-copy: ${/vehicle service, on demand/i.test(bodyText || '') ? 'FAIL' : 'PASS'}`)

// T7 — 9 ecosystem nodes in order
const nodes = await page.$$eval('#ecosystem button', (els) => els.map((e) => e.textContent.trim()))
const expectedNodes = ['Driver', 'Vehicle', 'Service Request', 'Mechanic', 'Garage', 'Parts', 'Payment', 'Service History', 'Vehicle Intelligence']
const nodesOk = nodes.length === 9 && expectedNodes.every((n, i) => nodes[i] === n)
results.push(`ecosystem-9-nodes-in-order: ${nodesOk ? 'PASS' : `FAIL (${nodes.join(',')})`}`)
// hover a middle node → connected edges highlight (state change observable)
await page.hover('#ecosystem button:nth-child(5)') // Garage (index 4)
await page.waitForTimeout(200)
const hoveredClass = await page.$eval('#ecosystem button:nth-child(5)', (el) => el.className)
results.push(`ecosystem-hover-highlights: ${hoveredClass.includes('ring-2') ? 'PASS' : 'FAIL'}`)

// T8 — 4 audience cards with exact role names
const roles = await page.$$eval('#audiences h3', (els) => els.map((e) => e.textContent.trim()))
const rolesOk = ['Drivers', 'Mechanics', 'Garages', 'Fleets'].every((r) => roles.includes(r))
results.push(`audiences-4-roles: ${rolesOk ? 'PASS' : `FAIL (${roles.join(',')})`}`)

// T9 — 6 workflow steps with real status vocabulary
const steps = await page.$$eval('#workflow h3', (els) => els.map((e) => e.textContent.trim()))
const stepsOk = ['Request', 'Match', 'Accept', 'En route', 'In progress', 'Done'].every((s) => steps.includes(s))
const statuses = await page.$$eval('#workflow span', (els) => els.map((e) => e.textContent.trim()))
const vocabOk = ['searching', 'accepted', 'en_route', 'in_progress', 'completed'].every((v) => statuses.includes(v))
results.push(`workflow-6-steps: ${stepsOk ? 'PASS' : `FAIL (${steps.join(',')})`}`)
results.push(`workflow-status-vocab: ${vocabOk ? 'PASS' : 'FAIL'}`)

// T10 — 5 trust primitives + estimate mock labeled Preview
const trustCount = await page.$$eval('#trust h3', (els) => els.length)
results.push(`trust-5-primitives: ${trustCount >= 5 ? 'PASS' : `FAIL (${trustCount})`}`)
const trustText = await page.locator('#trust').textContent()
results.push(`trust-estimate-preview: ${trustText.includes('Preview') && trustText.includes('Approved') ? 'PASS' : 'FAIL'}`)

// T11 — 6 real marketplace categories + callouts + product mock
const cats = await page.$$eval('#marketplace span', (els) => els.map((e) => e.textContent.trim()))
const realCats = ['Engine Parts', 'Brake Parts', 'Electrical Components', 'Suspension Parts', 'Filters', 'Accessories']
const catsOk = realCats.every((c) => cats.includes(c))
results.push(`marketplace-real-categories: ${catsOk ? 'PASS' : 'FAIL'}`)
const mpText = await page.locator('#marketplace').textContent()
results.push(`marketplace-callouts: ${mpText.includes('Fitment check') && mpText.includes('Vendor comparison') ? 'PASS' : 'FAIL'}`)
results.push(`marketplace-product-preview: ${mpText.includes('Preview') && mpText.includes('Fits your vehicle') ? 'PASS' : 'FAIL'}`)

// T12 — 4 intelligence items + health mock labeled Preview
const intelItems = await page.$$eval('#intelligence h3', (els) => els.length)
results.push(`intelligence-4-items: ${intelItems >= 4 ? 'PASS' : `FAIL (${intelItems})`}`)
const intelText = await page.locator('#intelligence').textContent()
results.push(`intelligence-health-preview: ${intelText.includes('Preview') && intelText.includes('Battery') ? 'PASS' : 'FAIL'}`)

// no <img> anywhere in these sections
for (const id of ['ecosystem', 'audiences', 'workflow', 'trust', 'marketplace', 'intelligence']) {
  const imgs = await page.$$eval(`#${id} img`, (els) => els.length)
  results.push(`${id}-no-img: ${imgs === 0 ? 'PASS' : 'FAIL'}`)
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

fs.writeFileSync(`${EVIDENCE}/task-7-12-notes.md`, `# T7-T12 content sections gate (plan-spec)\n\n${results.join('\n')}\n`)
console.log(results.join('\n'))