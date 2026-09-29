// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkLinkResolver } from './src/plugins/remark-link-resolver.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  markdown: {
    // Use the unified processor to support remark/rehype plugins
    processor: unified({
      remarkPlugins: [remarkLinkResolver, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'one-dark-pro',
      },
      wrap: true,
    },
  },

  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
