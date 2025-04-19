import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// Only use the GitHub Pages base path for production builds
const base = process.env.NODE_ENV === 'production' ? '/novabox_digital/' : '/';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  base,
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       */
      include: [
        '@react-three/fiber',
        '@react-three/drei',
        'three',
        'react-reconciler'
      ],
    },
    noExternal: ['three', '@react-three/fiber', '@react-three/drei', 'react-reconciler'],
  },
});
