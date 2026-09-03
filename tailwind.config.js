/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#F7F8FA',
          card: '#FFFFFF',
          subtle: '#F1F3F5',
          hover: '#EAEDF0'
        },
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        rose: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', 'monospace']
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '26px',
        '4xl': '32px'
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 28px -6px rgba(0, 0, 0, 0.08)',
        'float': '0 20px 35px -10px rgba(0, 0, 0, 0.10)',
        'accent-orange': '0 8px 24px -4px rgba(249, 115, 22, 0.25)',
        'accent-emerald': '0 8px 24px -4px rgba(16, 185, 129, 0.20)',
        'accent-indigo': '0 8px 24px -4px rgba(99, 102, 241, 0.20)',
        'accent-rose': '0 8px 24px -4px rgba(239, 68, 68, 0.20)'
      }
    },
  },
  plugins: [],
}
