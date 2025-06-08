/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        calligraphy: ['Futura', 'Montserrat', 'sans-serif'],
        serif: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
        },
        secondary: {
          DEFAULT: '#ffffff',
        }
      }
    },
  },
  plugins: [],
};