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
    proxy: {
      // Proxy requests to /bauen-content to the backend server
      '/bauen-content': {
        target: 'http://localhost:4242',
        changeOrigin: true,
      },
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:4242',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    copyPublicDir: true, // Ensures public folder is copied to dist
  },
})
