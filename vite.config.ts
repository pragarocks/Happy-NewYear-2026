
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This MUST match your repository name on GitHub
export default defineConfig({
  plugins: [react()],
  base: '/Happy-NewYear-2026/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
