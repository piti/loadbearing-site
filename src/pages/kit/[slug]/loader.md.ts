// GET /kit/<slug>/loader.md — the Loader you hand to your AI (Edition 2), served
// on-demand so we can attach X-Robots-Tag: noindex (spec §4). Lives outside
// public/; only the fixed slug resolves. Mirrors builder.md.ts.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_SLUG } from '../../../consts';

export const prerender = false;

let LOADER: string | null = null;
try { LOADER = readFileSync(join(process.cwd(), 'kit-assets', 'loader.md'), 'utf8'); } catch { LOADER = null; }

export const GET: APIRoute = ({ params }) => {
  if (params.slug !== KIT_SLUG || LOADER == null) return new Response('Not found', { status: 404 });
  return new Response(LOADER, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
