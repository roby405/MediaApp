/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan mobile App and all shared core files for Tailwind classes
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/core/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a", // add your theme colors here
      },
    },
  },
  plugins: [],
};