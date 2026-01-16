import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './', // Allows opening dist/index.html directly (mostly)
  server: {
    host: true, // Listen on all addresses (0.0.0.0)
  }
});
