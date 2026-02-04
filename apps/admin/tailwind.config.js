/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        provifood: {
          primary: '#156F70',
          secondary: '#F08200',
          dark: '#333333',
          gray: '#666666',
        }
      }
    },
  },
  plugins: [],
}
