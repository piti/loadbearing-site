import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// v3 — single consolidated app (spec §2). The site runs as a Node server
// (@astrojs/node, standalone): public pages are prerendered (output: 'static'),
// while the signup endpoint and the hidden /kit/ asset routes opt into
// on-demand rendering via `export const prerender = false`.
//
// Canonical home is the apex (spec §5/§7). DNS cutover to the apex is Peter's
// manual go-live step, but canonical tags / sitemap / RSS must point at the
// canonical origin regardless.
export default defineConfig({
  site: 'https://loadbearing.blog',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // The reward kit lives at non-obvious, noindex, unlinked paths (spec §4) —
  // keep every /kit/* URL out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/kit/') })],
});
