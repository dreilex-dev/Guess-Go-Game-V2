/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/componenets/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
      colors: {
        blue: {
          lighter: "#209AAB",
          darker: "#0D3E45",
      },
      white: "#FFFFFF",
    },
    fontSize: {
      'base': "25px",
      'sm': "21px",
      'lg': "30px",
      'xl': "40px",
      '2xl': "48px",
    },
    screens: {
      lg: '1280px',
    },
  },
  plugins: [],
}