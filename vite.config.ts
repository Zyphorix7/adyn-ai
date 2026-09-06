import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  // Base './' ensures all assets load properly regardless of whether the project
  // is deployed at the root domain or inside a GitHub Pages subfolder (e.g. username.github.io/aetheris-ai/)
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
