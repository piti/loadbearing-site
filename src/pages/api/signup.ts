// POST /api/signup — capture + welcome-email. Ported VERBATIM in behavior from
// the proven magnet service (landing/server.js): envClean(), the honeypot
// `company` short-circuit, POST /audiences/{SEGMENT_ID}/contacts, POST /emails,
// and the welcome email HTML+text. No SDK — node https talks to the Resend REST
// API directly (the SDK's contacts/segments methods mis-map params).
//
// Secrets are read from runtime env, SERVER-SIDE ONLY. Astro keeps this file out
// of the client bundle; nothing here is ever shipped to the browser.
import type { APIRoute } from 'astro';
import https from 'node:https';
import { KIT_PDF_PATH, KIT_LIBRARY_PATH } from '../../consts';

export const prerender = false;

// Tolerate injected env that carries an inline "# comment" or stray whitespace
// (a polluted RESEND_SEGMENT_ID once built a broken /audiences/<uuid>%20%23.../contacts path).
const envClean = (v?: string) => (v || '').split('#')[0].trim();

const RESEND_API_KEY = envClean(process.env.RESEND_API_KEY);
const SEGMENT_ID = envClean(process.env.RESEND_SEGMENT_ID);
const NEWSLETTER_FROM = (process.env.NEWSLETTER_FROM || 'Load-Bearing <hello@loadbearing.blog>').trim();
// SITE_ORIGIN + the kit slug build the asset URLs (spec §8). Defaults to the
// canonical apex; point it at the live host during pre-cutover verification.
const SITE_ORIGIN = (envClean(process.env.SITE_ORIGIN) || 'https://loadbearing.blog').replace(/\/+$/, '');
const PDF_PUBLIC_URL = `${SITE_ORIGIN}${KIT_PDF_PATH}`;
const LIBRARY_URL = `${SITE_ORIGIN}${KIT_LIBRARY_PATH}`;

// Welcome email — copy unchanged from the magnet; links repointed to /kit/<slug>/
// and recolored to signal #2E6BF0 (spec §3/§6 retired the old link color).
const EMAIL_HTML = (pdf: string, lib: string) => `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:520px">
  <p>Welcome &mdash; you're in.</p>
  <p>Here's the kit you asked for, the file-based memory structure I actually use, scrubbed and ready to copy:</p>
  <p><a href="${pdf}" style="color:#2E6BF0;font-weight:600">Download The Context Vault (PDF) &rarr;</a></p>
  <p>It also lives in your <a href="${lib}" style="color:#2E6BF0;font-weight:600">Load-Bearing library</a> &mdash; along with a <b>builder file you can hand to your AI</b> (it interviews you and sets the vault up with you) and a <b>loader</b> that fills the vault with the knowledge you already have, scattered across old chats, notes, and repos. Bookmark that library link: new kits get added there and I'll give you a heads-up when they do. No need to sign up again.</p>
  <p>More soon &mdash; that's what Load-Bearing is for.</p>
  <p>&mdash; Peter</p>
  <p style="font-size:13px;color:#8a8a8a;margin-top:18px">P.S. If this landed in spam or Promotions, drag it to your inbox &mdash; it helps the next edition reach you.</p>
</div>`;

const EMAIL_TEXT = (pdf: string, lib: string) => `Welcome — you're in.

Here's the kit you asked for — the file-based memory structure I actually use, scrubbed and ready to copy:

Download The Context Vault (PDF): ${pdf}

It also lives in your Load-Bearing library — along with a builder file you can hand to your AI (it interviews you and sets the vault up with you) and a loader that fills the vault with the knowledge you already have, scattered across old chats, notes, and repos:
${lib}

Bookmark that link — new kits get added there and I'll give you a heads-up when they do. No need to sign up again.

More soon — that's what Load-Bearing is for.

— Peter

P.S. If this landed in spam or Promotions, drag it to your inbox — it helps the next edition reach you.`;

const isEmail = (s?: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');
const json = (code: number, obj: unknown) =>
  new Response(JSON.stringify(obj), { status: code, headers: { 'Content-Type': 'application/json' } });

// Minimal Resend REST client (node https; no SDK).
function resend(apiPath: string, payload: unknown): Promise<{ status?: number; body: any }> {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(payload));
    const req = https.request(
      {
        hostname: 'api.resend.com',
        path: apiPath,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      },
      (r) => {
        let body = '';
        r.on('data', (c) => (body += c));
        r.on('end', () => {
          let parsed;
          try { parsed = body ? JSON.parse(body) : {}; } catch { parsed = { raw: body }; }
          resolve({ status: r.statusCode, body: parsed });
        });
      },
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function addToList(email: string) {
  if (!SEGMENT_ID) return;
  // POST /audiences/{id}/contacts — the segment id is valid here (verified against the live API).
  try {
    const { status, body } = await resend(`/audiences/${SEGMENT_ID}/contacts`, { email, unsubscribed: false });
    if (status && status >= 400 && !/exist/i.test(JSON.stringify(body))) console.error('add contact', status, body);
  } catch (e: any) { console.error('add contact', e?.message || e); }
}

async function sendMagnet(email: string) {
  const { status, body } = await resend('/emails', {
    from: NEWSLETTER_FROM,
    to: [email],
    subject: 'Your Context Vault + the Load-Bearing library',
    html: EMAIL_HTML(PDF_PUBLIC_URL, LIBRARY_URL),
    text: EMAIL_TEXT(PDF_PUBLIC_URL, LIBRARY_URL),
  });
  if (status && status >= 400) throw new Error('resend send ' + status + ': ' + JSON.stringify(body));
  return body && body.id;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    let d: any = {};
    try { d = await request.json(); } catch { d = {}; }
    if (d.company) return json(200, { ok: true });          // honeypot
    if (!isEmail(d.email)) return json(400, { error: 'invalid email' });
    const email = String(d.email).trim();
    await addToList(email);
    await sendMagnet(email);
    return json(200, { ok: true });
  } catch (e) {
    console.error(e);
    return json(500, { error: 'send failed' });
  }
};
