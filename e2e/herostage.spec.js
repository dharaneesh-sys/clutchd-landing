// herostage.spec.js — Wave IX-2 HeroStage interaction (PRODUCTION.md §2 IX-2).
//
// The 6-state manual-only demo (Request → Searching → Accepted → En route →
// In progress → Completed): click every state button, keyboard walk, and the
// focus ring on :focus-visible. Step buttons are real <button>s with
// aria-label "Show <title> state (step N)" and aria-pressed.
import { test, expect } from '@playwright/test'
import { blockExternal, collectConsoleErrors, clearStorage } from './helpers.js'

const STEP_BUTTONS = /Show .* state \(step \d\)/

test.beforeEach(async ({ page }) => {
  await blockExternal(page)
  await clearStorage(page)
})

test('initial state is Request with no ETA chip', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  await expect(page.getByText('Service request', { exact: true })).toBeVisible()
  await expect(page.getByText('Arriving in', { exact: true })).toHaveCount(0)
  await expect(page.getByText('All done', { exact: true })).toHaveCount(0)
  expect(errors).toEqual([])
})

test('clicking every state button updates the header and ETA chip', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  await expect(page.getByRole('button', { name: STEP_BUTTONS })).toHaveCount(6)

  // Searching
  await page.getByRole('button', { name: 'Show Searching state (step 2)' }).click()
  await expect(page.getByText(/Searching for verified mechanics/)).toBeVisible()

  // Accepted → ETA chip "Arriving in 18 min"
  await page.getByRole('button', { name: 'Show Accepted state (step 3)' }).click()
  await expect(page.getByText('Mechanic accepted')).toBeVisible()
  await expect(page.getByText('Arriving in', { exact: true })).toBeVisible()
  await expect(page.getByText('18 min', { exact: true })).toBeVisible()

  // En route → "Arriving in 12 min"
  await page.getByRole('button', { name: 'Show En route state (step 4)' }).click()
  await expect(page.getByText('Mechanic en route')).toBeVisible()
  await expect(page.getByText('12 min', { exact: true })).toBeVisible()

  // In progress → "Remaining 6 min"
  await page.getByRole('button', { name: 'Show In progress state (step 5)' }).click()
  await expect(page.getByText('Work in progress')).toBeVisible()
  await expect(page.getByText('Remaining', { exact: true })).toBeVisible()
  await expect(page.getByText('6 min', { exact: true })).toBeVisible()

  // Completed → success chip "All done"
  await page.getByRole('button', { name: 'Show Completed state (step 6)' }).click()
  await expect(page.getByText('Service completed')).toBeVisible()
  await expect(page.getByText('All done', { exact: true })).toBeVisible()

  // Back to Request
  await page.getByRole('button', { name: 'Show Request state (step 1)' }).click()
  await expect(page.getByText('Service request', { exact: true })).toBeVisible()
  await expect(page.getByText('All done', { exact: true })).toHaveCount(0)
  expect(errors).toEqual([])
})

test('keyboard walk: Tab reaches every step button, Enter activates', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  const stepButtons = page.getByRole('button', { name: STEP_BUTTONS })
  await expect(stepButtons).toHaveCount(6)

  // Tab until the first step button receives focus (real keyboard modality —
  // required for :focus-visible to match). The step rail sits after the skip
  // link, header links, and hero form in the tab order.
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    if (await stepButtons.first().evaluate((el) => el === document.activeElement)) break
  }
  await expect(stepButtons.first()).toBeFocused()

  // Walk through the remaining 5 step buttons.
  for (let i = 1; i < 6; i++) {
    await page.keyboard.press('Tab')
    await expect(stepButtons.nth(i)).toBeFocused()
  }

  // Enter activates the last (Completed) state.
  await page.keyboard.press('Enter')
  await expect(page.getByText('All done')).toBeVisible()
  expect(errors).toEqual([])
})

test('focus ring is visible on keyboard focus', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  const stepButtons = page.getByRole('button', { name: STEP_BUTTONS })
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    if (await stepButtons.first().evaluate((el) => el === document.activeElement)) break
  }
  await expect(stepButtons.first()).toBeFocused()

  // The button carries focus-visible:ring-2 focus-visible:ring-accent-focus-ring
  // (a box-shadow ring, outline-none) — assert :focus-visible matches and the
  // ring is a real, non-transparent box-shadow.
  const ring = await stepButtons.first().evaluate((el) => {
    const cs = getComputedStyle(el)
    return {
      focusVisible: el.matches(':focus-visible'),
      boxShadow: cs.boxShadow,
      outlineStyle: cs.outlineStyle,
    }
  })
  expect(ring.focusVisible).toBe(true)
  expect(ring.boxShadow).not.toBe('none')
  expect(ring.boxShadow).not.toContain('transparent')
  expect(errors).toEqual([])
})