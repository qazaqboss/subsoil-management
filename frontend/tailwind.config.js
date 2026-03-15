/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0A2540',
          700: '#1E4976',
          500: '#0066FF',
          300: '#66A3FF',
          100: '#E6F0FF',
        },
        success: { 500: '#10B981' },
        warning: { 500: '#F59E0B' },
        error: { 500: '#EF4444' },
        info: { 500: '#3B82F6' },
        dark: {
          bg: '#0F1419',
          surface: '#1A1F2E',
          border: '#2D3748',
          text: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
