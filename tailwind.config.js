/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f0ff',
        'neon-magenta': '#ff00ff',
        'neon-pink': '#ff1493',
        'neon-blue': '#0ea5e9',
        'neon-gold': '#FFD700',
        
        // Semantic Theme Colors (Mapped to CSS Variables)
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-accent-primary)',
        'accent-hover': 'var(--color-accent-hover)',
        
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        surface: 'var(--color-surface)',
        'glass-border': 'var(--glass-border)',
        'glass-bg': 'var(--glass-bg)',
        
        // Keep these for backward compatibility if needed, or map them too if they are used extensively
        'dark-bg': 'var(--color-bg-primary)', 
        'dark-secondary': 'var(--color-bg-secondary)',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
        'neon-magenta': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'neon-pink': '0 0 10px #ff1493, 0 0 20px #ff1493, 0 0 30px #ff1493',
        'neon-blue': '0 0 10px #0ea5e9, 0 0 20px #0ea5e9, 0 0 30px #0ea5e9',
        'glow-sm': '0 0 5px rgba(0, 240, 255, 0.5), 0 0 10px rgba(255, 0, 255, 0.3)',
        'glow-md': '0 0 10px rgba(0, 240, 255, 0.6), 0 0 20px rgba(255, 0, 255, 0.4)',
        'glow-lg': '0 0 20px rgba(0, 240, 255, 0.7), 0 0 40px rgba(255, 0, 255, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(255, 0, 255, 0.6)',
          },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      fontFamily: {
        'futuristic': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
