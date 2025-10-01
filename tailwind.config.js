/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#61dafb',
        accent: '#ff69b4',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};