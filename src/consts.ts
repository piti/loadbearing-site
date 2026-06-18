// Site-wide constants. AMD-safe: engineer/knowledge framing only.
export const SITE_TITLE = 'Load-Bearing';
export const SITE_URL = 'https://loadbearing.blog';
export const SITE_DESCRIPTION =
  'Building real systems with AI, from first principles. The structural stuff underneath the demos — no hype, no slop.';
export const TAGLINE = 'Building real systems with AI, from first principles.';

// --- The reward kit (spec §4) ---
// Served at a FIXED, non-obvious, NEVER-rotated slug. Emailed links must keep
// working forever — do not change this value. The slug appears ONLY in the
// welcome email and on the hidden /kit/ pages themselves; never on any public
// page (home/blog/post/about/footer). The gate is "unlinked + noindex", not auth.
export const KIT_SLUG = 'cv-7f3a2b';
export const KIT_BASE = `/kit/${KIT_SLUG}`;
export const KIT_LIBRARY_PATH = `${KIT_BASE}/`;
export const KIT_PDF_PATH = `${KIT_BASE}/context-vault.pdf`;
export const KIT_BUILDER_PATH = `${KIT_BASE}/builder.md`;

// Social channel (NOT a reward link). Generic-but-valid placeholder until the
// Load-Bearing LinkedIn newsletter exists at launch.
// TODO (Peter, go-live): swap to the Load-Bearing LinkedIn newsletter URL.
export const LINKEDIN_URL = 'https://www.linkedin.com/';

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/subscribe', label: 'Subscribe' },
];
