// Playwright e2e config — Wave IX-2 (PRODUCTION.md §2 IX-2).
//
// Runs against the PRODUCTION build only: the webServer always builds dist
// fresh (`npm run build`) and serves it via `vite preview` on port 4174.
// Never the dev server. Port 4174 (not the smoke job's 4173) with
// reuseExistingServer: false so the suite is self-contained and cannot
// collide with the CI smoke server.
//
// CI note (Wave IX-3): the CI job will add `npx playwright install --with-deps
// chromium` before `npm run test:e2e`. Locally the plain `npx playwright
// install chromium` is sufficient.
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // CI-viable: one worker avoids port/state flakiness between tests.
  workers: 1,
  retries: 0,
  reporter: 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  // Screenshots on failure only (PRODUCTION.md IX-2 acceptance).
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4174 --strictPort',
    port: 4174,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      // 390px mobile — console-zero assertions run on every route here too.
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],
})