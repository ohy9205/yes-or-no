import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // granite.config.ts의 web.port와 반드시 일치해야 함
  server: {
    port: 5174,
    strictPort: true,
  },
})
