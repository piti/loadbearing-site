import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical home of Load-Bearing is the apex domain. Even though DNS
// cutover is Peter's manual go-live step, canonical tags / sitemap / RSS
// must point at the canonical origin (spec §5, §7).
export default defineConfig({
  site: 'https://loadbearing.blog',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
