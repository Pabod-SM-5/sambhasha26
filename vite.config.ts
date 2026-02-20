import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['/src/setupTests.ts'],
    globals: true,
  },
  esbuild: {
    drop: ['console', 'debugger'], 
  },
  build: {
    chunkSizeWarningLimit: 1600, // සීමාව 1600kb දක්වා වැඩි කිරීම
  },
})
