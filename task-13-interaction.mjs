// T13 — early-access signup form gate.
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

// heading present
const heading = await page.locator('#early-access h2').textContent()
results.push(`heading: ${heading === 'ClutchD is rolling out in Coimbatore' ? 'PASS' : `FAIL (${heading})`}`)

const input = page.locator('#early-email')
const submitBtn = page.locator('#early-access').getByRole('button', { name: 'Get early access' })

// invalid email → error + aria-invalid
await input.fill('not-an-email')
await submitBtn.click()
await page.waitForTimeout(200)
const errorVisible = await page.locator('#early-email-error').isVisible()
const ariaInvalid = await input.getAttribute('aria-invalid')
results.push(`invalid-shows-error: ${errorVisible ? 'PASS' : 'FAIL'}`)
results.push(`invalid-aria-invalid: ${ariaInvalid === 'true' ? 'PASS' : `FAIL (${ariaInvalid})`}`)
await page.screenshot({ path: `${EVIDENCE}/task-13-error.png` })

// valid email → success, no fetch happened (no network post)
await input.fill('user@example.com')
await submitBtn.click()
const submitting = await page.getByRole('button', { name: /Submitting/ }).count()
results.push(`submitting-state: ${submitting === 1 ? 'PASS' : 'FAIL'}`)
const disabledWhileSubmitting = await page.getByRole('button', { name: /Submitting/ }).isDisabled()
results.push(`disabled-while-submitting: ${disabledWhileSubmitting ? 'PASS' : 'FAIL'}`)
await page.waitForTimeout(900)
const successVisible = await page.locator('#early-access').textContent().then((t) => t.includes('You\'re on the list'))
results.push(`valid-shows-success: ${successVisible ? 'PASS' : 'FAIL'}`)
await page.screenshot({ path: `${EVIDENCE}/task-13-success.png` })

// success persists until page reload (state only)
await page.reload({ waitUntil: 'networkidle' })
const successAfterReload = await page.locator('#early-access').textContent().then((t) => t.includes('You\'re on the list'))
results.push(`success-resets-on-reload: ${!successAfterReload ? 'PASS' : 'FAIL'}`)

// no fetch/axios usage in the form file
import fs2 from 'node:fs'
const src = fs2.readFileSync('/home/dinusus/clutchd-landing/src/components/sections/EarlyAccess.jsx', 'utf8')
results.push(`no-backend-calls: ${!/fetch|axios|XMLHttpRequest/.test(src) ? 'PASS' : 'FAIL'}`)

results.push(`console-errors: ${errors.length === 0 ? 'NONE' : errors.join(' | ')}`)
await browser.close()

fs.writeFileSync(`${EVIDENCE}/task-13-notes.md`, `# T13 early-access form gate\n\n${results.join('\n')}\n`)
console.log(results.join('\n'))
