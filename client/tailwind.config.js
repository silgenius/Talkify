/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': "#882A85",
        'secondary-purple': "#AE56AC",
        customGreen: "#00FF00",
      },
      screens: {
        xs: "440px"
      }
    },
  },
  plugins: [],
}
