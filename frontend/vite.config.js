import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'smart.restaurant.vtcb02.tech',
      protocol: 'ws'
    }
  },
  plugins: [react()],
  allowedHosts: ['smart.restaurant.vtcb02.tech']
})

