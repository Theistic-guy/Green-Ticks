// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkLinkResolver } from './src/plugins/remark-link-resolver.mjs';
import { remarkNormalizeCodeLang } from './src/plugins/remark-normalize-code-lang.mjs';
import { remarkRemoveHomeLink } from './src/plugins/remark-remove-home-link.mjs';
import { remarkInlineTags } from './src/plugins/remark-inline-tags.mjs';
import { remarkCollapsible } from './src/plugins/remark-collapsible.mjs';
import { remarkCarousel } from './src/plugins/remark-carousel.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  markdown: {
    // Use the unified processor to support remark/rehype plugins
    processor: unified({
      remarkPlugins: [remarkRemoveHomeLink, remarkInlineTags, remarkCollapsible, remarkCarousel, remarkNormalizeCodeLang, remarkLinkResolver, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'nord',
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
