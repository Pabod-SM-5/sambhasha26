import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // ========== SECURITY: SERVER HEADERS ==========
    headers: {
      // Prevent clickjacking attacks
      'X-Frame-Options': 'DENY',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Enable XSS protection in older browsers
      'X-XSS-Protection': '1; mode=block',
      
      // NOTE: CSP headers are set by Vercel in production (vercel.json)
      // Removing from dev server to avoid conflicts with Vite HMR injection
      
      // Referrer policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Feature policy/Permissions policy
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  },
  build: {
    // ========== OUTPUT: SECURITY & OPTIMIZATION ==========
    chunkSizeWarningLimit: 1000,
    
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs and debugger in production
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        // Mangle variable names for smaller output
        comments: false,
      }
    },

    rollupOptions: {
      output: {
        // ========== MANUAL CHUNKING: SPLIT VENDOR PACKAGES ==========
        manualChunks(id) {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('react')) return 'react-vendor';
            return 'vendors';
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

