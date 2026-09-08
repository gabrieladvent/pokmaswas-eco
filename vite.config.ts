import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Animation libraries are stable and shared by every section —
        // splitting them out keeps the app chunk cheap to re-download.
        manualChunks: (id) => (id.includes('node_modules/gsap') ? 'gsap' : undefined),
      },
    },
  },
})
