/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurora: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#b4c6fc',
          400: '#819af9',
          500: '#4f46e5', // vibrant indigo/aurora
          600: '#3b82f6', // bright blue
          700: '#1d4ed8', // royal blue
          800: '#1e3a8a', // deep navy
          900: '#0f172a', // midnight slate
          accent: '#06b6d4', // cyan shimmer
          purple: '#8b5cf6', // purple accent
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(30, 58, 138, 0.08), 0 8px 10px -6px rgba(30, 58, 138, 0.04)',
        'aurora-glow': '0 0 25px -5px rgba(79, 70, 229, 0.35)',
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'card-hover': '0 20px 35px -10px rgba(15, 23, 42, 0.1), 0 10px 15px -5px rgba(15, 23, 42, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
}
