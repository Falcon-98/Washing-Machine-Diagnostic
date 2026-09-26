/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['/home/claude/pwa/index.html', '/home/claude/pwa/assets/app.js'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#d32f2f', dark: '#b71c1c', light: '#ef5350' }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto',
               'Noto Sans Sinhala', 'Iskoola Pota', 'Helvetica Neue', 'sans-serif']
      }
    }
  },
  plugins: []
};
