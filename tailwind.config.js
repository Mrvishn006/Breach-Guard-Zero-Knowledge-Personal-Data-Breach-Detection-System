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
        cyber: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111722',
          800: '#171f2e',
          700: '#212d42',
          600: '#2f3f5c',
          500: '#465d87',
          cyan: '#00f0ff',
          neonGreen: '#00ff9d',
          neonRed: '#ff2a5f',
          neonPurple: '#a855f7',
          neonAmber: '#ffaa00'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-red': '0 0 20px -3px rgba(255, 42, 95, 0.35)',
        'glow-green': '0 0 20px -3px rgba(0, 255, 157, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(168, 85, 247, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
