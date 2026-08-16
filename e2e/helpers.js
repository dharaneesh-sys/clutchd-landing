// Shared e2e helpers — Wave IX-2 (PRODUCTION.md §2 IX-2).
//
// Three concerns, all in service of hermetic, console-clean, CI-viable tests:
//   1. blockExternal — neutralize GoatCounter (the only external origin; fonts
//      are self-hosted via @fontsource). We FULFILL with an empty 200 body
//      rather than abort: an aborted <script> logs "Failed to load resource:
//      net::ERR_FAILED" as a console error, which would trip the zero-console
//      assertion on every route. Fulfilling an empty script keeps the request
//      off the network AND the console clean.
//   2. collectConsoleErrors — attach console + pageerror listeners and return
//      the collected array for a per-test zero-console assertion.
//   3. clearStorage — wipe localStorage (the form soft-dedupe key) so tests
//      never leak state into each other.

export async function blockExternal(page) {
  await page.route('**gc.zgo.at/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
  await page.route('**clutchd.goatcounter.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
}

export function collectConsoleErrors(page) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  return errors
}

export async function clearStorage(page) {
  // Runs before every page script on every navigation — clears the form
  // soft-dedupe key before the app loads. (A plain page.evaluate in
  // beforeEach would run on about:blank, where localStorage access is denied.)
  await page.addInitScript(() => localStorage.clear())
}