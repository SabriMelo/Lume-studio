/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Cor de fundo do hero
      colors: {
        cream: '#f0ede6',
      },

      // Família de fontes
      fontFamily: {
        // fonte serif para o título grande (LUME)
        serif: ['Georgia', 'Times New Roman', 'serif'],
        // fonte sans para eyebrow, nav, tagline
        sans:  ['Helvetica Neue', 'Arial', 'sans-serif'],
      },

      // Tracking extra para o eyebrow/tagline
      letterSpacing: {
        widest2: '0.26em',
        widest3: '0.2em',
      },
    },
  },
  plugins: [],
}