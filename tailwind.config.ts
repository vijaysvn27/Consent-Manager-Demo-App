import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Perfios brand — used by ConsenTick + CT Manager (do NOT use company.primaryColor for these)
        perfios: {
          50:  '#eff4fb',
          100: '#d6e3f3',
          500: '#3b6dbf',
          600: '#2a5aad',
          700: '#1e4d8c',
          800: '#163b6d',
          900: '#0e2851',
        },
        // Aurva DSPM — separate brand, green leaf mark. White theme product.
        aurva: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        // Flow diagram palette (Tech panel SVG topology)
        flow: {
          b1: '#1E3A8A',   // blue
          b2: '#4F46E5',   // indigo
          b3: '#D97706',   // amber
          b4: '#DC2626',   // red
          b5: '#7C3AED',   // purple
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
        'uml-light': 'umlLight 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        umlLight: {
          '0%': { backgroundColor: 'transparent' },
          '40%': { backgroundColor: '#fef08a' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
