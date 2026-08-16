// reduced-motion.spec.js — Wave IX-2 reduced-motion emulation
// (PRODUCTION.md §2 IX-2).
//
// With Playwright's reducedMotion: 'reduce' context option, HeroStage renders
// the static Completed layout immediately (no click, no animation) and the
// step buttons carry no CSS transitions (motion-reduce:transition-none).
import { test, expect } from '@playwright/test'
import { blockExternal, collectConsoleErrors, clearStorage } from './helpers.js'

// reducedMotion is a BrowserContext option; this Playwright version's test
// runner only forwards it via the contextOptions fixture.
test.use({ contextOptions: { reducedMotion: 'reduce' } })

test.beforeEach(async ({ page }) => {
  await blockExternal(page)
  await clearStorage(page)
})

test('HeroStage renders the static Completed layout immediately', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  // No click — reduced-motion users start at Completed.
  await expect(page.getByText('All done')).toBeVisible()
  await expect(page.getByText('Service completed')).toBeVisible()
  expect(errors).toEqual([])
})

test('step buttons have no CSS transitions under reduced motion', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  const btn = page.getByRole('button', { name: 'Show Request state (step 1)' })
  const transitionProperty = await btn.evaluate((el) => getComputedStyle(el).transitionProperty)
  expect(transitionProperty).toBe('none')
  expect(errors).toEqual([])
})