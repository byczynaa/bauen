import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#FAF7F2',        // fond principal (warm cream)
        surface: '#f5f5f5',     // fond secondaire
        textMain: '#111111',    // texte noir élégant
        textSubtle: '#555555',  // gris doux
        accent: '#bfa15a',      // doré Bauen
        border: '#e5e5e5',      // lignes grises claires
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      letterSpacing: {
        wide: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [],
})
