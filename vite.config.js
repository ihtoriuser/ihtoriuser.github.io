import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Source entry is app.html. The published site (index.html + assets/ at the repo root) is
// produced by `npm run publish`, because GitHub Pages serves the root of the main branch.
// `npm run build:offline` → dist-offline/: one classic script, opens by double-clicking index.html.
const input = { input: 'app.html' };
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: './',
  server: { open: '/app.html' },
  optimizeDeps: { entries: ['app.html'] },
  build: mode === 'offline'
    ? { outDir: 'dist-offline', chunkSizeWarningLimit: 1500, modulePreload: false, rollupOptions: { ...input, output: { format: 'iife', inlineDynamicImports: true } } }
    : { chunkSizeWarningLimit: 650, rollupOptions: input },
}));
