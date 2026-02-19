import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vue from '@astrojs/vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  integrations: [
    tailwind(),
    vue(),
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
