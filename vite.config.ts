/// <reference types="vitest/config" />
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    watch: {},
  },
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
    tailwindcss(),
    ...(process.env.CI || process.env.DO_APP_PLATFORM
      ? []
      : [
          wayfinder({
            formVariants: true,
          }),
        ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './resources/js'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
});
