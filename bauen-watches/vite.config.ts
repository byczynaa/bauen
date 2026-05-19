import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'

const bauenContentRoot = path.resolve(__dirname, 'bauen-content')

const mimeTypeByExtension: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

function serveBauenContent() {
  return {
    name: 'serve-bauen-content',
    configureServer(server: { middlewares: { use: (path: string, handler: (req: { url?: string }, res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (value?: string) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use('/bauen-content', async (req, res, next) => {
        try {
          const rawPath = decodeURIComponent((req.url ?? '').split('?')[0] ?? '')
          const relativePath = rawPath.replace(/^\/+/, '')
          const fullPath = path.resolve(bauenContentRoot, relativePath)

          if (!fullPath.startsWith(bauenContentRoot)) {
            res.statusCode = 403
            res.end('Forbidden')
            return
          }

          const fileStats = await stat(fullPath)
          if (!fileStats.isFile()) {
            next()
            return
          }

          const extension = path.extname(fullPath).toLowerCase()
          res.setHeader('Content-Type', mimeTypeByExtension[extension] ?? 'application/octet-stream')
          createReadStream(fullPath).pipe(res)
        } catch {
          next()
        }
      })
    },
  }
}

// Configuration principale de Vite
export default defineConfig({
  plugins: [
    react(), // active le support React/TSX
    WindiCSS(), // active WindiCSS
    serveBauenContent(),
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
