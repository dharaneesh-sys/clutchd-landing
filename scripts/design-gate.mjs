#!/usr/bin/env node
/**
 * design-gate.mjs — Wave IX-5 (PRODUCTION.md IX-5)
 *
 * Automates verification-protocol item 8:
 *   "no raw hex outside DESIGN.md tokens; no off-base spacing; no banned
 *    families; no new component used 2+ times not in §5"
 *
 * Checks (all against src/; index.css is the token source of truth and is
 * exempt — DESIGN.md §2/§4 token definitions live there):
 *
 *   A. RAW COLOR LITERALS — every hex/rgb/rgba/hsl literal must be a value
 *      documented in DESIGN.md (token table §2, documented rgba §7/§8) or an
 *      explicit allowlisted same-hue variant. Comments are exempt.
 *   B. BANNED FAMILIES — gold / orange / brown / green / black-first
 *      (DESIGN.md §2 Rules). The single tokenized exception
 *      --status-success #1B7F4D lives in index.css (exempt).
 *   C. OFF-BASE SPACING — Tailwind spacing utilities off the 4px base unit
 *      (DESIGN.md §4), minus the documented component-internal allowlist.
 *   D. DUPLICATE NON-TOKENIZED PATTERNS — repeated identical className
 *      clusters (≥60 chars, 2+ uses) not extracted into a §5 primitive.
 *      Soft report so the executor can tokenize.
 *
 * Exit 0 = pass, 1 = fail. Dependency-free (node builtins only).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC_DIR = fileURLToPath(new URL('../src', import.meta.url))
const ROOT = fileURLToPath(new URL('..', import.meta.url))

/* ------------------------------------------------------------------ *
 *  DESIGN.md AUTHORITATIVE COLOR SET (check A)
 * ------------------------------------------------------------------ */

// Every color value documented in DESIGN.md, normalized (lowercase, no
// whitespace). Values are the source of truth for check A.
const ALLOWED_COLORS = new Set([
  // §2 Palette — token values
  '#fcfaf6', // --surface-primary
  '#f8f5ee', // --surface-soft
  '#f2efe8', // --surface-cool
  '#f0eff7', // --surface-tint
  '#0a0e3d', // --text-primary
  '#5b616e', // --text-secondary
  '#26211c', // --text-ink
  '#1e29b6', // --accent-primary (user-pinned)
  '#192295', // --accent-hover
  '#131b76', // --accent-active
  '#3a46df', // --accent-focus-ring
  '#0d124f', // --depth-navy-1
  '#111869', // --depth-navy-2
  '#1b7f4d', // --status-success (tokenized exception to banned green, §2 gate update 2026-08-13)
  // §8 Accessibility — verified pairs
  '#b3261e', // --accent-danger (error text; red is not a banned family)
  '#ffffff', // white-on-accent CTA label (§8, 10.25:1)
  // §7 Depth & Surface — documented tonal-shift values (pre-V-overhaul
  // palette, superseded by the §2 tokens but still documented)
  '#f7f7f7',
  '#eef0f3',
  '#f0f1f9',
  // §2 --border-default warm hairline
  'rgba(38,33,28,0.18)',
  // §5 EditorialCard — interactive-card hover border (same hue, double alpha)
  'rgba(38,33,28,0.36)',
  // §7 hairline borders (coinbase)
  'rgba(91,97,110,0.2)',
  // §7 minimal shadows
  'rgba(13,18,79,0.04)', // Subtle — cards at rest
  'rgba(13,18,79,0.08)', // Default — floating pill nav, dropdowns
  'rgba(13,18,79,0.12)', // Prominent — modals, overlays
  // §7 double-bezel inset highlight
  'rgba(255,255,255,0.15)',
  // Allowlisted same-hue variants of documented §7 values (shipped,
  // reviewed — the gate encodes them as the baseline):
  'rgba(13,18,79,0.05)', // Header scrolled shadow — §7 Default shadow hue (0.08) at softer alpha
  'rgba(91,97,110,0.18)', // HeroStage map-grid stroke — §7 hairline hue (0.2) at lower alpha
])

/* ------------------------------------------------------------------ *
 *  OFF-BASE SPACING ALLOWLIST (check C)
 * ------------------------------------------------------------------ */

// Component-internal micro-values of documented §5 primitives that predate
// the gate. The §4 base unit (4px) governs layout rhythm; these are the
// shipped, reviewed component internals. Each entry points at its DESIGN.md
// justification. Anything NOT listed here is flagged.
const SPACING_ALLOWLIST = new Map([
  ['gap-2.5', 'icon/label gap inside documented primitives — §5 Button (icon-in-button), §5 Nav (logo), §5 EditorialCard (category cell)'],
  ['py-2.5', 'compact hero input + ruled-list row padding — §5 EarlyAccessForm (hero variant), §5 AnnotatedList'],
  ['mt-0.5', 'icon/body baseline micro-alignment — §5 AnnotatedList (Intelligence rows)'],
  ['h-1.5', 'gauge-bar thickness + live-dot size — §5 Intelligence (HealthCard), §5 Badge (live dot)'],
  ['gap-1.5', 'dot/label + chip gap — §5 Badge, §5 EditorialCard (Marketplace chips)'],
  ['py-3.5', 'mobile catalog row padding — §5 EditorialCard (Marketplace)'],
  ['h-3.5', 'star-rating icon glyph size — §5 HeroStage (mechanic card)'],
  ['w-3.5', 'star-rating icon glyph size — §5 HeroStage (mechanic card)'],
  ['py-0.5', 'compact Badge override inside HeroStage — §5 HeroStage'],
  ['h-0.5', 'step-rail thickness between state buttons — §5 HeroStage'],
  ['py-1.5', 'dismiss-button padding — §5 PrivacyNotice'],
  ['w-1.5', 'live-dot size — §5 Badge'],
])

/* ------------------------------------------------------------------ *
 *  Helpers
 * ------------------------------------------------------------------ */

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const st = statSync(p)
    if (st.isDirectory()) files.push(...walk(p))
    else if (/\.(jsx|js|css)$/.test(entry)) files.push(p)
  }
  return files
}

function lineOf(src, index) {
  return src.slice(0, index).split('\n').length
}

// Token scanner: matches comments (skipped) and color literals (returned).
// The (?:^|[^:]) guard keeps `https://` / `http://` from being read as a
// line comment.
const TOKEN_RE =
  /\{\/\*[\s\S]*?\*\/\}|\/\*[\s\S]*?\*\/|(?:^|[^:])\/\/[^\n]*|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g

function scanColorLiterals(src) {
  const out = []
  TOKEN_RE.lastIndex = 0
  for (let m = TOKEN_RE.exec(src); m; m = TOKEN_RE.exec(src)) {
    const tok = m[0]
    if (tok[0] === '#' || /^rgba?\(/i.test(tok) || /^hsla?\(/i.test(tok)) {
      out.push({ value: tok, line: lineOf(src, m.index) })
    }
  }
  return out
}

// Classify a hex color into a banned family (DESIGN.md §2 Rules).
// Returns 'gold' | 'orange' | 'brown' | 'green' | null.
function bannedFamily(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (r > 140 && g > 100 && b < 90 && r >= g && g > b) return 'gold'
  if (r > 180 && g > 60 && g < 160 && b < 60 && r > g && g > b) return 'orange'
  if (r > 80 && g > 40 && b < 60 && r > g && g > b) return 'brown'
  if (g > r && g > b && g > 60) return 'green'
  return null
}

const normalize = (v) => v.toLowerCase().replace(/\s+/g, '')

/* ------------------------------------------------------------------ *
 *  Check A — raw color literals
 * ------------------------------------------------------------------ */

function checkColors(files) {
  const violations = []
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    for (const { value, line } of scanColorLiterals(src)) {
      if (!ALLOWED_COLORS.has(normalize(value))) {
        violations.push({ file: f, line, value })
      }
    }
  }
  return violations
}

/* ------------------------------------------------------------------ *
 *  Check B — banned families
 * ------------------------------------------------------------------ */

const BANNED_NAMED_RE =
  /\b(?:bg|text|border|fill|stroke|from|to|via|ring|shadow|decoration|divide|outline)-(?:orange|yellow|amber|green|emerald|lime|teal|brown|gold)-\d+\b|\bbg-black\b|\bbg-\[#0[0-9a-fA-F]{5}\]/g

function checkBanned(files) {
  const violations = []
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    // Hex values in banned hue ranges (comments skipped via token scanner).
    for (const { value, line } of scanColorLiterals(src)) {
      if (!/^#/.test(value)) continue
      const hex = value.toLowerCase()
      if (hex === '#1b7f4d') continue // --status-success tokenized exception (§2)
      const family = bannedFamily(hex)
      if (family) violations.push({ file: f, line, value, family })
    }
    // Named Tailwind utilities for banned families + black-first/dark-first
    // (large near-black backgrounds: bg-black, bg-[#0…]).
    BANNED_NAMED_RE.lastIndex = 0
    for (let m = BANNED_NAMED_RE.exec(src); m; m = BANNED_NAMED_RE.exec(src)) {
      violations.push({ file: f, line: lineOf(src, m.index), value: m[0], family: 'named-utility' })
    }
  }
  return violations
}

/* ------------------------------------------------------------------ *
 *  Check C — off-base spacing
 * ------------------------------------------------------------------ */

const SPACING_RE =
  /\b(?:p[trblxy]?|m[trblxy]?|gap|w|h|inset|top|bottom|left|right|space-[xy])-(\d+\.5)\b/g

function checkSpacing(files) {
  const violations = []
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    SPACING_RE.lastIndex = 0
    for (let m = SPACING_RE.exec(src); m; m = SPACING_RE.exec(src)) {
      const token = m[0]
      if (!SPACING_ALLOWLIST.has(token)) {
        violations.push({ file: f, line: lineOf(src, m.index), value: token })
      }
    }
  }
  return violations
}

/* ------------------------------------------------------------------ *
 *  Check D — duplicate non-tokenized className clusters (soft report)
 * ------------------------------------------------------------------ */

function findDuplicates(files) {
  const counts = new Map() // className -> [{ file, line }]
  for (const f of files) {
    const src = readFileSync(f, 'utf8')
    // Static className="…"
    const re1 = /className="([^"]{60,})"/g
    for (let m = re1.exec(src); m; m = re1.exec(src)) {
      const c = m[1]
      if (!counts.has(c)) counts.set(c, [])
      counts.get(c).push({ file: f, line: lineOf(src, m.index) })
    }
    // className={[ … ].join(' ')}
    const re2 = /className=\{\[([\s\S]*?)\]\s*\.join\(/g
    for (let m = re2.exec(src); m; m = re2.exec(src)) {
      const parts = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
      const joined = parts.join(' ')
      if (joined.length >= 60) {
        if (!counts.has(joined)) counts.set(joined, [])
        counts.get(joined).push({ file: f, line: lineOf(src, m.index) })
      }
    }
  }
  // Target ad-hoc repeated clusters in section/page files — a cluster that
  // only repeats inside a single ui/ primitive is that primitive's own
  // internal (fine per §5). Flag when at least one use is in sections/ or
  // pages/.
  const dups = []
  for (const [className, locs] of counts) {
    if (locs.length < 2) continue
    const inSectionOrPage = locs.some(
      (l) => l.file.includes(`${join('components', 'sections')}`) || l.file.includes(`${join('pages')}`),
    )
    if (inSectionOrPage) dups.push({ className, locations: locs })
  }
  return dups
}

/* ------------------------------------------------------------------ *
 *  Main
 * ------------------------------------------------------------------ */

const files = walk(SRC_DIR).filter((f) => !f.endsWith('index.css'))
const rel = (f) => relative(ROOT, f)

const colorViolations = checkColors(files)
const bannedViolations = checkBanned(files)
const spacingViolations = checkSpacing(files)
const duplicates = findDuplicates(files)

const fail = colorViolations.length > 0 || bannedViolations.length > 0 || spacingViolations.length > 0

console.log(`design-gate: scanning src/ (${files.length} files, index.css exempt as token source)`)
console.log('')

if (colorViolations.length === 0) {
  console.log('  ✓ raw color literals — every value traces to a DESIGN.md token or documented rgba')
} else {
  console.log(`  ✗ raw color literals — ${colorViolations.length} value(s) not in the DESIGN.md token table:`)
  for (const v of colorViolations) console.log(`      ${rel(v.file)}:${v.line} — ${v.value}`)
}

if (bannedViolations.length === 0) {
  console.log('  ✓ banned families — none found (gold/orange/brown/green/black-first)')
} else {
  console.log(`  ✗ banned families — ${bannedViolations.length} hit(s):`)
  for (const v of bannedViolations) console.log(`      ${rel(v.file)}:${v.line} — ${v.value} (${v.family})`)
}

if (spacingViolations.length === 0) {
  console.log('  ✓ off-base spacing — every spacing utility is on the 4px base unit or allowlisted')
} else {
  console.log(`  ✗ off-base spacing — ${spacingViolations.length} utility(ies) off the 4px base unit (DESIGN.md §4):`)
  for (const v of spacingViolations) console.log(`      ${rel(v.file)}:${v.line} — ${v.value}`)
}

if (duplicates.length === 0) {
  console.log('  ✓ duplicate className clusters — none ≥60 chars used 2+ times')
} else {
  console.log(`  ⚠ duplicate className clusters (≥60 chars, 2+ uses) — tokenize per DESIGN.md §5:`)
  for (const d of duplicates) {
    const first = d.locations[0]
    console.log(`      ${rel(first.file)}:${first.line} (${d.locations.length}×) — ${d.className.slice(0, 90)}…`)
  }
}

console.log('')
if (fail) {
  console.log('design-gate: FAIL — fix the violations above (do not silence them)')
  process.exit(1)
}
console.log('design-gate: PASS — src/ complies with DESIGN.md')
process.exit(0)