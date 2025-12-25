/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f46e5', // Indigo 600
          DEFAULT: '#4338ca', // Indigo 700
          dark: '#3730a3', // Indigo 800
        },
        secondary: {
          light: '#ec4899', // Pink 500
          DEFAULT: '#db2777', // Pink 600
          dark: '#be185d', // Pink 700
        }
      }
    },
  },
  plugins: [],
}
