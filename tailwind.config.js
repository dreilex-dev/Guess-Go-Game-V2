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
  },
  plugins: [],
}