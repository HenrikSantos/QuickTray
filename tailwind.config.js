/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{ts,tsx}',
    './src/renderer/src/components/**/*.{ts,tsx}',
	],
  theme: {
    extend: {
      boxShadow: {
        'custom': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      },
      borderRadius: {
        'custom': '5px',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} 