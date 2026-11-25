import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import contactHandler from './api/contact.js'

function serveContact(server) {
  server.middlewares.use('/api/contact', (req, res, next) => {
    contactHandler(req, res).catch(next)
  })
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      react(),
      {
        name: 'spk-contact-api',
        configureServer: serveContact,
        configurePreviewServer: serveContact,
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
  }
})

