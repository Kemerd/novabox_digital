import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Only use the GitHub Pages base path for production builds
const base = process.env.NODE_ENV === 'production' ? '/novabox_digital/' : '/';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  base,
  build: {
    outDir: 'dist',
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
