/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        background: '#F8FAFC',
        card: '#FFFFFF',
        textmain: '#0F172A',
        bordercol: '#E2E8F0',
      },
    },
  },
  plugins: [],
}
