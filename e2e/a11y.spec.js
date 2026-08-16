// a11y.spec.js — Wave IX-2 accessibility contract (PRODUCTION.md §2 IX-2).
//
// Skip link (WCAG 2.4.1 bypass) is first focusable and targets #main; every
// route has exactly one h1; sections wire aria-labelledby to existing
// headings; form inputs carry accessible labels; zero console errors.
import { test, expect } from '@playwright/test'
import { blockExternal, collectConsoleErrors, clearStorage } from './helpers.js'

const ROUTES = [
  { path: '/', h1: 'One connected ecosystem for automotive care.' },
  { path: '/how-it-works', h1: 'How it works' },
  { path: '/marketplace', h1: 'Marketplace' },
  { path: '/for-providers', h1: 'For providers' },
  { path: '/faq', h1: 'FAQ' },
  { path: '/early-access', h1: 'Early access' },
  { path: '/definitely-not-a-route-xyz', h1: 'This page took a wrong turn.' },
]

test.beforeEach(async ({ page }) => {
  await blockExternal(page)
  await clearStorage(page)
})

test('skip link is first focusable and targets #main', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  const skip = page.locator('a.skip-link')
  await expect(skip).toBeVisible()
  await expect(skip).toHaveAttribute('href', '#main')
  // First focusable element in the document (DOM order = tab order here).
  const firstFocusable = await page.evaluate(() => {
    const els = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    return els.length ? els[0].outerHTML : null
  })
  expect(firstFocusable).toContain('skip-link')
  // Tab from page load lands on it.
  await page.keyboard.press('Tab')
  await expect(skip).toBeFocused()
  expect(errors).toEqual([])
})

for (const { path, h1 } of ROUTES) {
  test(`exactly one h1 on ${path}`, async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.goto(path)
    const headings = page.locator('main h1')
    await expect(headings).toHaveCount(1)
    await expect(headings).toHaveText(h1)
    expect(errors).toEqual([])
  })
}

test('Home sections wire aria-labelledby to existing headings', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  // Wait for the lazy Home chunk to mount before counting sections.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const sections = page.locator('main section[aria-labelledby]')
  const count = await sections.count()
  // Spot-check the Home sections: hero, trust, testimonials, early-access.
  expect(count).toBeGreaterThanOrEqual(4)
  for (let i = 0; i < count; i++) {
    const id = await sections.nth(i).getAttribute('aria-labelledby')
    expect(id).toBeTruthy()
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
  expect(errors).toEqual([])
})

test('form inputs carry accessible labels', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  // Section variant on /early-access: visible <label>.
  await page.goto('/early-access')
  const form = page.locator('form:not([hidden])')
  await expect(form.getByLabel('Email address')).toBeVisible()
  // Home has both variants (hero aria-label + section label) — both inputs
  // expose the accessible name "Email address".
  await page.goto('/')
  await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveCount(2)
  expect(errors).toEqual([])
})