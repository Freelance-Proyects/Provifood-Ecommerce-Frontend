/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'provifood': {
          'primary': '#156F70',      // Verde petróleo/teal principal
          'secondary': '#F08200',    // Naranja
          'dark': '#333333',         // Texto oscuro
          'gray': '#666666',         // Texto gris medio
        }
      },
      fontFamily: {
        'sans': ['Open Sans', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'provifood': '4px',          // Border radius sutil para botones
      }
    },
  },
  plugins: [],
}
