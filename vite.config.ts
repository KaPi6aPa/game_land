import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Proxy API requests to Vercel/Local function during dev
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Assumes Vercel dev or manual node server
        changeOrigin: true,
        // Fallback for simple local dev without full backend emulation:
        // You might need to mock this if not running 'vercel dev'
      }
    }
  }
});