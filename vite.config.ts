import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    // Chunk size සීමාව 1000kb දක්වා වැඩි කිරීම
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // විශාල libraries (උදා: Supabase, Vendor logs) වෙනම chunks ලෙස වෙන් කිරීම
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['/src/setupTests.ts'],
    globals: true,
  },
  esbuild: {
    drop: ['console', 'debugger'], 
  },
})
