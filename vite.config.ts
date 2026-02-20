import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
build: {
    // 1. Chunk size warning එක මඟහැරීමට සීමාව වැඩි කිරීම
    chunkSizeWarningLimit: 1000,
    
    // 2. වඩාත් ප්‍රබල ලෙස කේතය පිරිසිදු කිරීමට Terser භාවිතා කිරීම
    minify: 'terser',
    terserOptions: {
      compress: {
        // සියලුම console logs සහ debugger statements ඉවත් කරයි
        drop_console: true,
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        // 3. විශාල Libraries වෙනම කොටස් වලට වෙන් කිරීම (Manual Chunking)
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
})
