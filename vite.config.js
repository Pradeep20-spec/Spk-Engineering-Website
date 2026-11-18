import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import contactHandler from './api/contact.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      react(),
      {
        name: 'spk-contact-api',
        configureServer(server) {
          server.middlewares.use('/api/contact', (req, res, next) => {
            contactHandler(req, res).catch(next)
          })
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
    },
  }
})

