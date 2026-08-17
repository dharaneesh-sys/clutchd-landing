// language-toggle.spec.js — Wave XII-2 e2e (PRODUCTION.md §2 XII).
//
// Locks in the Tamil toggle behavior end-to-end on the production build:
//   - `?lang=ta` deep link renders Tamil on first paint and flips <html lang>
//   - the header toggle switches EN ↔ தமிழ் with aria-pressed state
//   - the choice persists across reload (localStorage)
//   - a deep-linked language persists to a plain reload
//   - zero console errors throughout
//
// Runs on BOTH projects (desktop 1280x800 + 390px mobile). The toggle is
// reachable differently per viewport: in the desktop header it is always
// visible; under `lg` it is hidden and lives inside the mobile-menu dialog,
// so the helper opens the hamburger menu first on mobile.
import { test, expect } from '@playwright/test'
import { blockExternal, collectConsoleErrors } from './helpers.js'

const EN_H1 = 'One connected ecosystem for automotive care.'
const TA_H1 = 'வாகனப் பராமரிப்புக்கான ஒரே இணைக்கப்பட்ட சுற்றுச்சூழல் அமைப்பு.'

// Fresh contexts start with empty localStorage, so the persistence tests get a
// clean slate WITHOUT clearStorage (whose addInitScript would also clear on
// reload, defeating the persistence assertion).
test.beforeEach(async ({ page }) => {
  await blockExternal(page)
})

// Return the VISIBLE LanguageToggle button set (header on desktop, mobile-menu
// dialog on mobile), opening the hamburger first if needed. Scope to `:visible`
// because both toggles live inside <header> (MobileMenu renders within it) —
// the hidden one would otherwise trip strict-mode on `.filter()`.
async function visibleToggle(page) {
  const headerToggles = page.locator('header button[aria-pressed]:visible')
  if ((await headerToggles.count()) > 0) {
    return headerToggles
  }
  const dialog = page.locator('[role="dialog"]')
  if (!(await dialog.isVisible())) {
    // Language-independent locator: the hamburger's aria-label is translated
    // (e.g. Tamil "Open menu"), so target its stable aria-controls instead.
    await page.locator('button[aria-controls="mobile-menu"]').click()
  }
  return dialog.locator('button[aria-pressed]:visible')
}

async function clickLang(page, label) {
  await (await visibleToggle(page)).filter({ hasText: label }).click()
}

test('?lang=ta deep link renders Tamil on first paint with html lang=ta', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/?lang=ta')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta')
  await expect(page.locator('main h1')).toHaveText(TA_H1)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // The toggle reflects the active language (தமிழ் pressed, EN not).
  const toggles = await visibleToggle(page)
  await expect(toggles.filter({ hasText: 'தமிழ்' })).toHaveAttribute('aria-pressed', 'true')
  await expect(toggles.filter({ hasText: 'EN' })).toHaveAttribute('aria-pressed', 'false')
  expect(errors).toEqual([])
})

test('header toggle switches EN → தமிழ் → EN with aria-pressed updates', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveText(EN_H1)

  await clickLang(page, 'தமிழ்')
  await expect(page.locator('main h1')).toHaveText(TA_H1)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta')
  const taToggles = await visibleToggle(page)
  await expect(taToggles.filter({ hasText: 'தமிழ்' })).toHaveAttribute('aria-pressed', 'true')
  await expect(taToggles.filter({ hasText: 'EN' })).toHaveAttribute('aria-pressed', 'false')

  await clickLang(page, 'EN')
  await expect(page.locator('main h1')).toHaveText(EN_H1)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const enToggles = await visibleToggle(page)
  await expect(enToggles.filter({ hasText: 'தமிழ்' })).toHaveAttribute('aria-pressed', 'false')
  await expect(enToggles.filter({ hasText: 'EN' })).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('Tamil choice persists across reload (localStorage)', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveText(EN_H1)
  await clickLang(page, 'தமிழ்')
  await expect(page.locator('main h1')).toHaveText(TA_H1)

  await page.reload()
  // No ?lang param — the stored preference alone must keep Tamil active.
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta')
  await expect(page.locator('main h1')).toHaveText(TA_H1)
  const toggles = await visibleToggle(page)
  await expect(toggles.filter({ hasText: 'தமிழ்' })).toHaveAttribute('aria-pressed', 'true')
  expect(errors).toEqual([])
})

test('?lang=ta deep link persists to a plain reload', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/?lang=ta')
  await expect(page.locator('main h1')).toHaveText(TA_H1)

  // Reload WITHOUT the param — the deep link must have persisted to
  // localStorage, so Tamil stays active.
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveText(TA_H1)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta')
  expect(errors).toEqual([])
})
