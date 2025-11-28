import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.d.ts',
    exclude: ['node_modules', '.next', 'dist'],
  },
  css: {
    postcss: {
      plugins: [], // wyłączenie ładowania tailwind/postcss w środowisku testowym
    },
  },
});
