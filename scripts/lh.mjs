#!/usr/bin/env node
/**
 * Wave IX-4 — Lighthouse one-command gate (PRODUCTION.md §2 IX-4, §3 item 5).
 *
 * `npm run lh`:
 *   1. builds dist (`npm run build`)
 *   2. serves it via `vite preview` on a fixed port (4175, strictPort)
 *   3. launches real Chrome (Playwright chromium from Wave IX-2, else system)
 *   4. runs Lighthouse twice — mobile + desktop presets — against the
 *      production build (never the dev server)
 *   5. writes JSON (+ HTML) reports to `.lighthouse/`
 *   6. exits 0 when both presets meet the documented acceptance
 *      (desktop 100, mobile ≥99); exits 1 on any regression
 *
 * The gate measures — it never changes UX. No src/ edits, no threshold
 * weakening to match a local flake. If a preset falls short on this machine,
 * the measured numbers are reported honestly and the gate still fails.
 *
 * Dependencies: the `lighthouse` devDep + Node builtins only
 * (child_process, http, fs, os, path, url).
 */

import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import http from 'node:http'
import lighthouse, { defaultConfig, desktopConfig, generateReport } from 'lighthouse'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PREVIEW_PORT = 4175
const URL = `http://127.0.0.1:${PREVIEW_PORT}/`
const REPORTS_DIR = join(ROOT, '.lighthouse')

// Documented acceptance (PRODUCTION.md §3 item 5): desktop 100, mobile ≥99.
// These are the rounded category scores as shown in the Lighthouse report.
const ACCEPTANCE = { desktop: 100, mobile: 99 }

// Presets: lighthouse ships both configs — defaultConfig is the mobile preset
// (Moto G Power emulation, mobileSlow4G simulate throttling), desktopConfig is
// the desktop preset (1350×940, desktopDense4G). Both extend 'lighthouse:default'.
const PRESETS = [
  { label: 'mobile', config: defaultConfig, threshold: ACCEPTANCE.mobile },
  { label: 'desktop', config: desktopConfig, threshold: ACCEPTANCE.desktop },
]

const CATEGORY_ORDER = ['performance', 'accessibility', 'best-practices', 'seo']

/* ------------------------------------------------------------------ */
/* Chrome discovery                                                    */
/* ------------------------------------------------------------------ */

function findChrome() {
  const home = homedir()
  const candidates = [
    process.env.CHROME_PATH,
    // Playwright chromium installed by Wave IX-2 (`npx playwright install chromium`)
    ...readdirSync(join(home, '.cache', 'ms-playwright'), { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name.startsWith('chromium-'))
      .flatMap((e) => {
        const dir = join(home, '.cache', 'ms-playwright', e.name)
        return [
          join(dir, 'chrome-linux64', 'chrome'),
          join(dir, 'chrome-linux', 'chrome'),
          join(dir, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
          join(dir, 'chrome-win', 'chrome.exe'),
        ]
      }),
    // System Chrome / Chromium
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/local/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean)

  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Process helpers                                                     */
/* ------------------------------------------------------------------ */

/** Spawn Chrome headless with a dynamic debugging port; resolve with the port. */
function launchChrome(chromePath) {
  return new Promise((resolvePromise, reject) => {
    const proc = spawn(
      chromePath,
      [
        '--headless=new',
        '--no-sandbox', // harmless on desktop, required in CI/root containers
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-background-networking',
        '--no-first-run',
        '--no-default-browser-check',
        '--remote-debugging-port=0', // OS-assigned port, printed to stderr
        'about:blank',
      ],
      // detached: true makes Chrome a process-group leader so cleanup can
      // SIGKILL the whole tree (browser + renderers) via process.kill(-pid).
      { stdio: ['ignore', 'ignore', 'pipe'], detached: true },
    )

    let stderr = ''
    const timer = setTimeout(() => {
      proc.kill('SIGKILL')
      reject(new Error(`Chrome did not report a debugging port within 30s.\n${stderr}`))
    }, 30_000)

    proc.stderr.on('data', (d) => {
      stderr += d.toString()
      const m = stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//)
      if (m) {
        clearTimeout(timer)
        resolvePromise({ proc, port: Number(m[1]) })
      }
    })

    proc.on('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`Chrome exited early (code ${code}).\n${stderr}`))
    })
  })
}

/** Poll a URL with http.get until it responds 2xx or the deadline passes. */
function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolvePromise, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume()
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolvePromise()
        } else {
          retry()
        }
      })
      req.on('error', retry)
      req.setTimeout(2000, () => {
        req.destroy()
        retry()
      })
    }
    const retry = () => {
      if (Date.now() > deadline) {
        reject(new Error(`Server did not become ready at ${url} within ${timeoutMs}ms`))
      } else {
        setTimeout(attempt, 250)
      }
    }
    attempt()
  })
}

/** Start `vite preview` on the fixed port (strictPort). Resolves with the proc. */
function startPreview() {
  return new Promise((resolvePromise, reject) => {
    // Spawn the vite CLI directly (node node_modules/vite/bin/vite.js) rather
    // than via `npm run preview`: killing an npm wrapper orphans the vite
    // child, leaking the server on the fixed port.
    const viteCli = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
    const proc = spawn(
      process.execPath,
      [
        viteCli,
        'preview',
        '--host',
        '127.0.0.1', // vite preview binds `localhost` → [::1] (IPv6-only) by default
        '--port',
        String(PREVIEW_PORT),
        '--strictPort',
      ],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
    )

    let out = ''
    proc.stdout.on('data', (d) => (out += d.toString()))
    proc.stderr.on('data', (d) => (out += d.toString()))

    proc.on('exit', (code) => {
      reject(
        new Error(
          `vite preview exited early (code ${code}). ` +
            `Is port ${PREVIEW_PORT} already in use? ` +
            `Free it (e.g. \`fuser -k ${PREVIEW_PORT}/tcp\`) and re-run.\n${out}`,
        ),
      )
    })

    waitForServer(URL, 60_000)
      .then(() => resolvePromise(proc))
      .catch((err) => {
        proc.kill('SIGKILL')
        reject(err)
      })
  })
}

/* ------------------------------------------------------------------ */
/* Lighthouse runs                                                     */
/* ------------------------------------------------------------------ */

async function runPreset(port, { label, config, threshold }) {
  console.log(`\n  → running ${label} preset…`)
  const result = await lighthouse(URL, { port, output: 'json', logLevel: 'warn' }, config)
  if (!result) throw new Error(`${label}: lighthouse returned no result`)

  const lhr = result.lhr
  const scores = {}
  for (const name of CATEGORY_ORDER) {
    const cat = lhr.categories[name]
    scores[name] = cat ? Math.round(cat.score * 100) : null
  }

  const perf = scores.performance
  const pass = perf >= threshold
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const base = join(REPORTS_DIR, `${label}-${stamp}`)
  writeFileSync(`${base}.json`, result.report)
  // HTML report is a free bonus for humans; the gate reads the JSON.
  writeFileSync(`${base}.html`, generateReport(lhr, 'html'))

  return { label, scores, perf, threshold, pass, reportPath: `${base}.json` }
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  const chromePath = findChrome()
  if (!chromePath) {
    console.error('✗ No Chrome/Chromium found. Install one or set CHROME_PATH.')
    process.exit(1)
  }

  console.log('Lighthouse gate — clutchd-landing (Wave IX-4)')
  console.log(`  URL:    ${URL}`)
  console.log(`  Chrome: ${chromePath}`)

  // 1. Build the production bundle.
  console.log('\n  → building dist…')
  const build = spawnSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' })
  if (build.status !== 0) {
    console.error('✗ `npm run build` failed — aborting.')
    process.exit(1)
  }

  // 2. Serve dist via vite preview (fixed port, strictPort).
  console.log(`\n  → starting vite preview on :${PREVIEW_PORT}…`)
  const preview = await startPreview()

  // 3. Launch Chrome.
  console.log('  → launching Chrome…')
  const chrome = await launchChrome(chromePath)

  mkdirSync(REPORTS_DIR, { recursive: true })

  // NOTE: never call process.exit() inside the try — it skips the finally
  // cleanup and leaks Chrome + the preview server. Set exitCode, let the
  // finally run, then exit below.
  let exitCode = 0
  try {
    // 4. Run both presets.
    const results = []
    for (const preset of PRESETS) {
      results.push(await runPreset(chrome.port, preset))
    }

    // 5. Report.
    console.log('\n  ┌──────────┬─────────────┬──────────────┬─────────────────┬─────┬────────┐')
    console.log('  │ preset   │ performance │ accessibility │ best-practices │ seo │ gate   │')
    console.log('  ├──────────┼─────────────┼──────────────┼─────────────────┼─────┼────────┤')
    for (const r of results) {
      const row = [
        r.label.padEnd(8),
        String(r.scores.performance).padStart(11),
        String(r.scores.accessibility).padStart(12),
        String(r.scores['best-practices']).padStart(15),
        String(r.scores.seo).padStart(3),
        (r.pass ? 'PASS' : 'FAIL').padStart(6),
      ]
      console.log(`  │ ${row.join(' │ ')} │`)
    }
    console.log('  └──────────┴─────────────┴──────────────┴─────────────────┴─────┴────────┘')
    console.log(`  Reports: ${REPORTS_DIR}/`)

    // 6. Gate.
    const failures = results.filter((r) => !r.pass)
    if (failures.length) {
      console.error('\n✗ Lighthouse gate FAILED — regression below documented acceptance:')
      for (const f of failures) {
        console.error(
          `    ${f.label}: performance ${f.perf} < ${f.threshold} ` +
            `(documented acceptance: desktop 100, mobile ≥99)`,
        )
      }
      console.error('  The gate measures — it never changes UX. Fix the regression, do not lower the bar.')
      exitCode = 1
    } else {
      console.log('\n✓ Lighthouse gate PASSED — desktop 100 / mobile ≥99 (documented baseline).')
    }
  } finally {
    // 7. Cleanup: kill Chrome (whole process group) and the preview server.
    try {
      process.kill(-chrome.proc.pid, 'SIGKILL')
    } catch {
      chrome.proc.kill('SIGKILL')
    }
    preview.kill('SIGKILL')
  }

  process.exit(exitCode)
}

main().catch((err) => {
  console.error(`\n✗ Lighthouse gate failed: ${err.message}`)
  if (err.stack) console.error(err.stack)
  process.exit(1)
})