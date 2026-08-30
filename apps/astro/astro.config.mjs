// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['../..', '../../packages']
      }
    },
    resolve: {
      alias: {
        '@qwik/engine': resolve(__dirname, '../../packages/engine'),
        '@qwik/erm': resolve(__dirname, '../../packages/erm'),
        '@qwik/crm': resolve(__dirname, '../../packages/crm'),
        '@qwik/shared': resolve(__dirname, '../../packages/shared')
      }
    }
  }
});
