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

import fs from 'node:fs';
import path from 'node:path';

function serveVaultImages() {
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
  };

  return {
    name: 'serve-vault-images',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/Images/')) {
          const rawName = req.url.replace(/^\/Images\//, '').split('?')[0];
          const imageName = decodeURIComponent(rawName);
          const imagePath = path.resolve(process.cwd(), '..', 'assets', 'Images', imageName);
          if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
            const ext = path.extname(imagePath).toLowerCase();
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            fs.createReadStream(imagePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

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
    plugins: [serveVaultImages()],
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
