/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ada2ff",
        primaryDark: "#ada2ff",
        secondary: "#EE9B01",
        secondaryDark: "#d48b02",
        tertiary: "#00ACCF",
        tertiaryDark: "#0496b4",
        white: "#FFFFFF",
      },
    },
    fontFamily: {
      serif: ["Open Sans", "sans-serif"],
      display: ["Poppins", "sans-serif"],
      roboto: ["Roboto Condensed", "sans-serif"],
      robotoNormal: ["Roboto", "sans-serif"],
      heading: ["Open Sans", "sans-serif"],
    },
  },
  plugins: [],
};
