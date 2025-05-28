// Connecting frontend to backend API
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // We'd change the api link of the backend here
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})