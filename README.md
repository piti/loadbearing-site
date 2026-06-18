# loadbearing-site

The main website + blog for **Load-Bearing** at the apex `loadbearing.blog`. Astro
static site, TypeScript, content collections. Sister to `loadbearing-magnet` (the
opt-in/magnet/library service at `go.loadbearing.blog`) — this is the brand + blog
home; the two subdomains stay cleanly separated.

## Architecture

- **Astro** (static output), minimal JS. Built on the locked **v2 identity**
  (`projects/newsletter/brand/IDENTITY.md`): navy `#0B1730` + one accent, signal
  blue `#2E6BF0`; self-hosted Bricolage Grotesque / Inter / JetBrains Mono variable
  fonts; the LB lettermark; and a class-based **light/dark toggle (default dark)**
  with a no-flash inline script. The retired charcoal/amber "strata" identity is gone.
- **Blog source of truth is the vault**: `projects/newsletter/blog/*.md`.
  `scripts/sync-content.mjs` distills each file into a clean content-collection entry
  under `src/content/blog/` (committed), applying:
  - the **publish contract** — only frontmatter `publish: true` is emitted;
  - the **body boundary** — only the `## The actual article` body ships; the
    production-notes / guardrail-check / alt-hook scaffolding is stripped;
  - the **slug** — filename minus the `NN-` prefix and a trailing `-blog`.

To resync after editing the vault posts:

```bash
npm run sync-content   # regenerates src/content/blog/ from ../blog/*.md
npm run build
```

## Pages

`/` · `/blog` · `/blog/<slug>` · `/about` · `/subscribe` · `/rss.xml` · `/sitemap-index.xml`

## Deploy

Dockerfile build → Caddy serves `dist/` on `:80`. Deployed as the Coolify app
`loadbearing-site` on the same VPS as the magnet. **Apex DNS cutover and go-live are
Peter's manual steps** — the build is verified at the Coolify app URL, not the apex.

## TODO at go-live (Peter)

- Point the LinkedIn links (`src/consts.ts` `LINKEDIN_NEWSLETTER_URL`, footer,
  subscribe page) at the real LinkedIn newsletter once Edition 1 publishes.
- Add surname + any personal links on `/about`.
- Point the apex `loadbearing.blog` A record at the VPS.
