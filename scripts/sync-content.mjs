#!/usr/bin/env node
/*
 * sync-content.mjs — vault → Astro content collection.
 *
 * The vault's projects/newsletter/blog/*.md files are the author's source of
 * truth. They carry messy authoring frontmatter plus production-notes /
 * guardrail-check / alt-hook scaffolding that must NEVER reach the page.
 * This script distills each file into a clean content-collection entry:
 *
 *   - publish contract:  only files with frontmatter `publish: true` are emitted.
 *   - body boundary:     only the "## The actual article" body is published;
 *                        everything from the first notes/guardrail/alt-hook
 *                        section onward is dropped.
 *   - slug:              filename, minus the NN- prefix and a trailing -blog.
 *
 * Output is committed into src/content/blog/ so the Coolify build (which only
 * has the repo, not the vault) can build without the vault present.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '..', '..', 'blog');           // vault blog source
const OUT_DIR = join(__dirname, '..', 'src', 'content', 'blog'); // collection target

// Headings that mark the end of the publishable article body.
const STOP_HEADINGS = [
  '## Production notes',
  '## Architecture-diagram',
  '## Guardrail check',
  '## Alt-hook',
];

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return { fm, body: m[2] };
}

function deriveSlug(filename) {
  return basename(filename, '.md')
    .replace(/^\d+-/, '')   // drop the NN- ordering prefix
    .replace(/-blog$/, ''); // drop the companion-file -blog suffix
}

function extractTitle(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function extractDek(body) {
  // First H2 after the H1 — the article's subtitle line.
  const m = body.match(/^#\s+.+$\n+##\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function extractArticleBody(body) {
  const startIdx = body.indexOf('## The actual article');
  if (startIdx === -1) return null;
  let slice = body.slice(startIdx + '## The actual article'.length);

  // Cut at the first scaffolding heading.
  let cut = slice.length;
  for (const h of STOP_HEADINGS) {
    const i = slice.indexOf('\n' + h);
    if (i !== -1 && i < cut) cut = i;
  }
  slice = slice.slice(0, cut);

  // Trim wrapping horizontal rules / whitespace.
  return slice.replace(/^\s*(---\s*)?/, '').replace(/\s*(---\s*)?$/, '').trim();
}

function yamlEscape(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// Clean output dir so unpublished/removed posts never linger.
if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => f.endsWith('.md'));
let emitted = 0;
const skipped = [];

for (const file of files) {
  const raw = readFileSync(join(SRC_DIR, file), 'utf8');
  const { fm, body } = parseFrontmatter(raw);

  if (String(fm.publish).toLowerCase() !== 'true') {
    skipped.push(`${file} (publish != true)`);
    continue;
  }

  const title = extractTitle(body);
  const dek = fm.description || extractDek(body);
  const article = extractArticleBody(body);
  const slug = deriveSlug(file);

  if (!title || !article) {
    skipped.push(`${file} (missing title or article body)`);
    continue;
  }

  const created = fm.created || fm.date || '';
  const updated = fm.updated || created;

  const out = [
    '---',
    `title: ${yamlEscape(title)}`,
    `description: ${yamlEscape(dek || title)}`,
    `pubDate: ${created}`,
    `updatedDate: ${updated}`,
    `publish: true`,
    '---',
    '',
    article,
    '',
  ].join('\n');

  writeFileSync(join(OUT_DIR, `${slug}.md`), out, 'utf8');
  emitted++;
  console.log(`emitted: ${slug}.md  ←  ${file}`);
}

console.log(`\n${emitted} published post(s); ${skipped.length} skipped.`);
for (const s of skipped) console.log(`  skip: ${s}`);
