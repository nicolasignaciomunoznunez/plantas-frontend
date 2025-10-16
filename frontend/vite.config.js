// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // ✅ AGREGAR ESTO
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})