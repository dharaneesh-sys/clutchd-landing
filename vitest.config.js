import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Wave IX-1 (PRODUCTION.md): Vitest + React Testing Library unit/component
// tests. Separate from vite.config.js so the build-only inlineCss plugin
// never touches the test pipeline; vite build behavior is unchanged.
//
// jsdom environment (DOM contract + a11y contract assertions), setup file
// stubs the browser APIs jsdom lacks (matchMedia, IntersectionObserver, rAF,
// scrollTo). Coverage via the v8 provider — report exists, no numeric gate
// (PRODUCTION.md §4 accepted debt).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['**/*.test.{js,jsx}'],
    exclude: ['node_modules', 'dist'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/main.jsx'],
    },
  },
})