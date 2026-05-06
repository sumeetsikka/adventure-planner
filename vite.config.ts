import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Stamp the service worker's CACHE constant with the current build timestamp
 * so each deploy invalidates old caches and forces clients to fetch fresh
 * assets. The SW source uses the literal `__BUILD_VERSION__` placeholder.
 */
function stampServiceWorker(): Plugin {
  return {
    name: 'stamp-service-worker',
    apply: 'build',
    closeBundle() {
      const swPath = resolve('dist/sw.js')
      try {
        const src = readFileSync(swPath, 'utf8')
        const stamped = src.replace(/__BUILD_VERSION__/g, Date.now().toString())
        writeFileSync(swPath, stamped, 'utf8')
      } catch {
        /* sw.js missing — non-fatal */
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), stampServiceWorker()],
  server: {
    proxy: {
      '/api': 'http://localhost:3173',
    },
  },
})
