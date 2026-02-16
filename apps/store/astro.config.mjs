import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';

export default defineConfig({
  integrations: [
    tailwind(),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    ssr: {
      external: ['@provifood/types']
    }
  }
});
