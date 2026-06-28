// GET /kit/<slug>/family-vault-builder.md — the "Family Vault Builder" (Edition 4),
// served on-demand so we can attach X-Robots-Tag: noindex (spec §4). Lives
// outside public/; only the fixed slug resolves. Mirrors cheatsheet.md.ts.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_SLUG } from '../../../consts';

export const prerender = false;

let FAMILY_VAULT_BUILDER: string | null = null;
try { FAMILY_VAULT_BUILDER = readFileSync(join(process.cwd(), 'kit-assets', 'family-vault-builder.md'), 'utf8'); } catch { FAMILY_VAULT_BUILDER = null; }

export const GET: APIRoute = ({ params }) => {
  if (params.slug !== KIT_SLUG || FAMILY_VAULT_BUILDER == null) return new Response('Not found', { status: 404 });
  return new Response(FAMILY_VAULT_BUILDER, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
