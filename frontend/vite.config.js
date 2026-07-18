import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from the current directory (frontend folder)
  const env = loadEnv(mode, process.cwd(), '');
  
  // Default to empty string if not defined, allowing relative path proxying
  const backendUrl = env.VITE_BACKEND_URL || '';

  return {
    plugins: [react()],
    define: {
      // Safely replace VITE_BACKEND_URL to prevent "undefined/api/..." path bugs
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl)
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
