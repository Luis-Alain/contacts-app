import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    // The API doesn't send CORS headers, so in dev the browser calls Vite and Vite forwards to the API.
    server: VITE_API_URL
      ? {
          proxy: {
            '/api': { target: VITE_API_URL, changeOrigin: true },
            '/healthz': { target: VITE_API_URL, changeOrigin: true },
          },
        }
      : undefined,
  }
})
