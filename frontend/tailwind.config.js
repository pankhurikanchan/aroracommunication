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
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(30, 58, 138, 0.08), 0 8px 10px -6px rgba(30, 58, 138, 0.04)',
        'aurora-glow': '0 0 20px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
