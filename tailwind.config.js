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
      black: "#000000",
    },
    fontSize: {
      'base': "25px",
      'sm': "21px",
      'lg': "24px",
      'xl': "30px",
      '2xl': "40px",
    },
    screens: {
      lg: '1280px',
    },
    backgroundImage: {
      'gradient-primary': 'linear-gradient(90deg, #57DFF2 0%, #209AAB 50%, #57DFF2 100%)',
    },
  },
  plugins: [],
}