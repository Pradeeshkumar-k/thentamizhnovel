import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
          // Split React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split animation libraries
          'animation-vendor': ['framer-motion', 'gsap'],
          // Split Swiper library
          'swiper-vendor': ['swiper']
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'css-syntax-error': 'silent' }
  }
})
