import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'bannister-handbook-pelt.ngrok-free.dev',
      '.ngrok-free.dev',
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true,
      },
      '/gateway-status': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true,
      }
    }
  }
})