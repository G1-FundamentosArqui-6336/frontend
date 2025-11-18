/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#1c8da6',
          700: '#165873',
        },
        neutral: {
          0: '#ffffff',
          200: '#d9d9d9',
          300: '#c2c2c2',
          900: '#000000',
        },
      },
    },
  },
  plugins: [],
}