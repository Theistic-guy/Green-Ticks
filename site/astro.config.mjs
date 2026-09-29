// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkLinkResolver } from './src/plugins/remark-link-resolver.mjs';
import { remarkNormalizeCodeLang } from './src/plugins/remark-normalize-code-lang.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  markdown: {
    // Use the unified processor to support remark/rehype plugins
    processor: unified({
      remarkPlugins: [remarkNormalizeCodeLang, remarkLinkResolver, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'one-dark-pro',
      },
      langAlias: {
        Python: 'python',
        py: 'python',
        'C++': 'cpp',
        'c++': 'cpp',
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
