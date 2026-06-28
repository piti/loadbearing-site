// GET /kit/<slug>/cheatsheet.md — the "Use It Anywhere" cheat-sheet (Edition 3),
// served on-demand so we can attach X-Robots-Tag: noindex (spec §4). Lives
// outside public/; only the fixed slug resolves. Mirrors loader.md.ts.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_SLUG } from '../../../consts';

export const prerender = false;

let CHEATSHEET: string | null = null;
try { CHEATSHEET = readFileSync(join(process.cwd(), 'kit-assets', 'cheatsheet.md'), 'utf8'); } catch { CHEATSHEET = null; }

export const GET: APIRoute = ({ params }) => {
  if (params.slug !== KIT_SLUG || CHEATSHEET == null) return new Response('Not found', { status: 404 });
  return new Response(CHEATSHEET, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
