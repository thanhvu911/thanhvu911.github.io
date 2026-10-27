// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages user site. If you deploy to a project repo instead,
  // also set `base: '/<repo-name>'`.
  site: 'https://thanhvu911.github.io',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});
