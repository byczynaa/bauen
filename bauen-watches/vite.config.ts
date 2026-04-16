import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'

// Configuration principale de Vite
export default defineConfig({
  plugins: [
    react(), // active le support React/TSX
    WindiCSS(), // active WindiCSS
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // permet d'utiliser @/ au lieu de chemins relatifs longs
    },
  },
  server: {
    port: 5173,
    open: true, // ouvre automatiquement le navigateur
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
