import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80, lossless: true },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  build: {
    cssMinify: 'esbuild',
    minify: 'esbuild',
    chunkSizeWarningLimit: 800, // Increase limit for large chapter content chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // State management & data fetching
          'query-vendor': ['@tanstack/react-query'],
          // Icons (Lucide is large)
          'icons-vendor': ['lucide-react'],
          // Animation
          'animation-vendor': ['framer-motion'],
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'css-syntax-error': 'silent' }
  },
  server: {
    host: true, // Listen on all local IPs
    port: 5173,
  }
})
