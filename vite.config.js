import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

// Inline the built CSS into index.html (F2 perf: render-blocking stylesheet
// audit ~158ms + estimated 450ms savings). Dependency-free: runs in
// closeBundle after Vite writes dist/, replaces the <link rel="stylesheet">
// with an inline <style>, and deletes the emitted CSS asset. Absolute asset
// URLs inside the CSS (fonts) are preserved, so no font regressions.
function inlineCss() {
  let outDir = 'dist'
  let base = '/'
  return {
    name: 'inline-css',
    configResolved(config) {
      outDir = config.build.outDir
      base = config.base
    },
    closeBundle() {
      const htmlPath = resolve(outDir, 'index.html')
      const html = readFileSync(htmlPath, 'utf-8')
      const links = [...html.matchAll(/<link rel="stylesheet"[^>]*?href="([^"]+)"[^>]*?>/g)]
      if (!links.length) return
      let out = html
      let css = ''
      for (const m of links) {
        // href is base-prefixed (e.g. /assets/x.css with base '/') — strip the
        // base before resolving against outDir
        const href = m[1]
        const rel = href.startsWith(base) ? href.slice(base.length) : href.replace(/^\//, '')
        const cssPath = resolve(outDir, rel)
        css = readFileSync(cssPath, 'utf-8')
        out = out.replace(m[0], `<style>${css}</style>`)
        unlinkSync(cssPath)
      }
      // F2 perf: preload the self-hosted woff2 fonts (LCP element is the
      // header brand in Geist). Fonts are discovered via the inlined CSS at
      // low network priority; preload bumps them so the brand paints with its
      // final font on first paint (no swap-repaint, LCP ≈ FCP).
      const fonts = [...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1])
      if (fonts.length) {
        const preloads = fonts
          .map(
            (f) =>
              `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin />`,
          )
          .join('')
        out = out.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />${preloads}`)
      }
      writeFileSync(htmlPath, out)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // P6: Netlify serves the site at the domain root (no subpath), so assets
  // are root-relative. The inlineCss plugin below strips the base prefix
  // from CSS hrefs and emits font preloads — both paths re-verified after
  // this change (fonts would silently 404 otherwise).
  base: '/',
  plugins: [react(), tailwindcss(), inlineCss()],
  build: {
    rollupOptions: {
      output: {
        // F2 perf: split React runtime into its own vendor chunk so the main
        // entry chunk shrinks; lazy() section chunks split automatically.
        // lucide-react is intentionally NOT force-chunked: tree-shaken icons
        // follow their importers, so below-fold icons land in lazy chunks
        // instead of loading eagerly (keeps startup unused-JS at zero).
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor'
          }
        },
      },
    },
  },
})
