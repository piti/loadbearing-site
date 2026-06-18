// GET /kit/<slug>/builder.md — the builder file you hand to your AI, served
// on-demand so we can attach X-Robots-Tag: noindex (spec §4). Lives outside
// public/; only the fixed slug resolves.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_SLUG } from '../../../consts';

export const prerender = false;

let BUILDER: string | null = null;
try { BUILDER = readFileSync(join(process.cwd(), 'kit-assets', 'builder.md'), 'utf8'); } catch { BUILDER = null; }

export const GET: APIRoute = ({ params }) => {
  if (params.slug !== KIT_SLUG || BUILDER == null) return new Response('Not found', { status: 404 });
  return new Response(BUILDER, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
