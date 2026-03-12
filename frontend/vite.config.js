import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // ✅ generates a self-signed cert automatically
  ],
  server: {
    https: false,
    port: 5173,
  }
})