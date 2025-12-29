
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'Happy-NewYear-2026' with your actual repository name
export default defineConfig({
  plugins: [react()],
  base: '/Happy-NewYear-2026/', 
  build: {
    outDir: 'dist',
  }
});
