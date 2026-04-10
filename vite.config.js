import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward /api requests to your backend
      "/api": "http://localhost:3000", // or wherever your backend runs
    },
  },
});
