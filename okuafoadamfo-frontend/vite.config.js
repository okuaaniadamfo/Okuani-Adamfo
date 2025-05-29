// // Connecting frontend to backend API
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   base: '/',
//   plugins: [react(),tailwindcss()],
//   server: {
//     proxy: {
//       '/api': {
//         // We'd change the api link of the backend here
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   },
//   resolve: {
//     extensions: ['.js', '.jsx', '.json'] 
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // This ensures relative paths for assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
