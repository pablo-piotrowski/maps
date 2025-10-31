import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: ['node_modules', '.next', 'dist'],
  },
  css: {
    postcss: {
      plugins: [], // wyłączenie ładowania tailwind/postcss w środowisku testowym
    },
  },
});
