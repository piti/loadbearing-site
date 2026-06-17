// Site-wide constants. AMD-safe: engineer/knowledge framing only.
export const SITE_TITLE = 'Load-Bearing';
export const SITE_URL = 'https://loadbearing.blog';
export const SITE_DESCRIPTION =
  'Building real systems with AI, from first principles. The structural stuff underneath the demos — no hype, no slop.';
export const TAGLINE = 'Building real systems with AI, from first principles.';

// Existing assets (do not rebuild — link only). The opt-in + magnet + library
// live at go.loadbearing.blog and are untouched by this site.
export const GO_URL = 'https://go.loadbearing.blog';
export const LIBRARY_URL = 'https://go.loadbearing.blog/library';
// TODO (Peter, go-live): swap to the Load-Bearing LinkedIn newsletter URL once
// Edition 1 is published (the newsletter is created at launch). Generic-but-valid
// until then so nothing ships broken. The live subscribe action is GO_URL.
export const LINKEDIN_NEWSLETTER_URL = 'https://www.linkedin.com/';

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/subscribe', label: 'Subscribe' },
];
