// GET /kit/<slug>/loading-guide.pdf — the Edition 2 reward PDF (the human-readable
// half of the Loader), served on-demand so we can attach an X-Robots-Tag: noindex
// header (spec §4). The file lives outside public/ so it is never served un-gated.
// Only the fixed slug resolves. Mirrors context-vault.pdf.ts.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_SLUG } from '../../../consts';

export const prerender = false;

// Read once at server start. cwd is the app root (/app in the container,
// the project dir in `astro preview`), where kit-assets/ is copied.
let PDF: Buffer | null = null;
try { PDF = readFileSync(join(process.cwd(), 'kit-assets', 'loading-guide.pdf')); } catch { PDF = null; }

export const GET: APIRoute = ({ params }) => {
  if (params.slug !== KIT_SLUG || !PDF) return new Response('Not found', { status: 404 });
  return new Response(PDF, {
    headers: {
      'Content-Type': 'application/pdf',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Disposition': 'inline; filename="the-context-vault-loading-guide.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
