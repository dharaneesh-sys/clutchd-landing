// routes.spec.js — Wave IX-2 route coverage (PRODUCTION.md §2 IX-2).
//
// All 6 routes + the client-side 404 render their h1; deep links serve the
// app shell; back/forward navigation works; zero console errors on every
// route. Runs on BOTH projects (desktop 1280x800 + 390px mobile), so the
// console-zero assertion is exercised at both viewports.
import { test, expect } from '@playwright/test'
import { blockExternal, collectConsoleErrors, clearStorage } from './helpers.js'

const ROUTES = [
  { path: '/', h1: 'One connected ecosystem for automotive care.' },
  { path: '/how-it-works', h1: 'How it works' },
  { path: '/marketplace', h1: 'Marketplace' },
  { path: '/for-providers', h1: 'For providers' },
  { path: '/faq', h1: 'FAQ' },
  { path: '/early-access', h1: 'Early access' },
]

test.beforeEach(async ({ page }) => {
  await blockExternal(page)
  await clearStorage(page)
})

for (const { path, h1 } of ROUTES) {
  test(`route ${path} renders its h1 with zero console errors`, async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.goto(path)
    // CI-viable wait: #root + the route's h1 (no fixed sleeps).
    await expect(page.locator('#root')).toBeVisible()
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText(h1)
    expect(errors).toEqual([])
  })
}

test('deep links serve the app shell and route content', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  for (const { path, h1 } of ROUTES) {
    await page.goto(path)
    await expect(page.locator('#root')).toBeVisible()
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1)
  }
  expect(errors).toEqual([])
})

test('back/forward navigation between routes preserves scroll and focus', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'One connected ecosystem for automotive care.',
  )
  // Scroll down so the scroll-to-top on navigation is observable.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  // SPA navigation via the hero CTA (visible on desktop and mobile).
  await page.getByRole('button', { name: 'How it works' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How it works')
  // RouteFocus scrolls to top and moves focus to the h1 on every navigation.
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  // Back → Home, forward → How it works again.
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'One connected ecosystem for automotive care.',
  )
  await page.goForward()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How it works')
  expect(errors).toEqual([])
})

test('unknown route renders the client-side NotFound page', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await page.goto('/definitely-not-a-route-xyz')
  await expect(page.locator('#root')).toBeVisible()
  await expect(page.getByText('Error 404')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'This page took a wrong turn.',
  )
  expect(errors).toEqual([])
})

test.describe('Netlify form submission (stubbed endpoint)', () => {
  // The form POSTs FormData to window.location.pathname with
  // form-name=early-access + email + bot-field honeypot. We intercept the
  // POST and fulfill success/error responses — no real network, honest
  // behavior asserted on both paths.

  test('success path posts the expected fields and shows success copy', async ({ page }) => {
    await clearStorage(page)
    let postCount = 0
    let capturedBody = ''
    await page.route('**/*', (route) => {
      const req = route.request()
      if (req.method() === 'POST') {
        postCount++
        capturedBody = req.postData() || ''
        route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
      } else if (req.url().includes('gc.zgo.at') || req.url().includes('clutchd.goatcounter.com')) {
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
      } else {
        route.continue()
      }
    })
    await page.goto('/early-access')
    const form = page.locator('form:not([hidden])')
    await form.getByLabel('Email address').fill('test@example.com')
    await form.getByRole('button', { name: 'Get early access' }).click()
    await expect(page.getByText(/You're on the list/)).toBeVisible()
    expect(postCount).toBe(1)
    // The browser encodes FormData as multipart/form-data — assert the field
    // names and values are present in the request body.
    expect(capturedBody).toContain('name="form-name"')
    expect(capturedBody).toContain('early-access')
    expect(capturedBody).toContain('name="email"')
    expect(capturedBody).toContain('test@example.com')
    expect(capturedBody).toContain('name="bot-field"')
  })

  test('server 500 shows the error copy and logs the failure', async ({ page }) => {
    await clearStorage(page)
    const errors = collectConsoleErrors(page)
    await page.route('**/*', (route) => {
      const req = route.request()
      if (req.method() === 'POST') {
        route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
      } else if (req.url().includes('gc.zgo.at') || req.url().includes('clutchd.goatcounter.com')) {
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
      } else {
        route.continue()
      }
    })
    await page.goto('/early-access')
    const form = page.locator('form:not([hidden])')
    await form.getByLabel('Email address').fill('test@example.com')
    await form.getByRole('button', { name: 'Get early access' }).click()
    await expect(page.getByText(/Something went wrong/)).toBeVisible()
    // Honest behavior: the component logs the failed submission (never fakes
    // success), so the console error is expected here.
    expect(errors.some((e) => e.includes('EarlyAccessForm submit failed'))).toBe(true)
  })

  test('invalid email shows validation error without any network request', async ({ page }) => {
    await clearStorage(page)
    let postCount = 0
    await page.route('**/*', (route) => {
      const req = route.request()
      if (req.method() === 'POST') postCount++
      if (req.url().includes('gc.zgo.at') || req.url().includes('clutchd.goatcounter.com')) {
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
      } else {
        route.continue()
      }
    })
    await page.goto('/early-access')
    const form = page.locator('form:not([hidden])')
    await form.getByLabel('Email address').fill('not-an-email')
    await form.getByRole('button', { name: 'Get early access' }).click()
    await expect(page.getByText('Enter a valid email address')).toBeVisible()
    expect(postCount).toBe(0)
  })
})