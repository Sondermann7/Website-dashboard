/**
 * Cloudflare Pages Function: POST /api/forms
 *
 * Receives the contact, prayer and get-involved forms, validates them on the server,
 * filters spam, and emails the submission to a church-controlled inbox through Resend.
 *
 * - Nothing is stored. Message contents are never written to logs or analytics.
 * - If delivery is not configured the visitor is told to call or email instead:
 *   a submission is never silently dropped.
 *
 * Secrets (Cloudflare Pages > Settings > Variables and Secrets):
 *   RESEND_API_KEY, FORMS_FROM, CONTACT_TO, PRAYER_TO, INVOLVED_TO, TURNSTILE_SECRET_KEY (optional)
 */

export interface Env {
  RESEND_API_KEY?: string;
  FORMS_FROM?: string;
  CONTACT_TO?: string;
  PRAYER_TO?: string;
  INVOLVED_TO?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const FORMS = {
  contact: { to: 'CONTACT_TO', subject: 'Website: question or message', messageRequired: true },
  prayer: { to: 'PRAYER_TO', subject: 'Website: prayer request', messageRequired: true },
  involved: { to: 'INVOLVED_TO', subject: 'Website: get involved', messageRequired: false },
} as const;
type FormType = keyof typeof FORMS;

const FALLBACK = 'Please call 208-572-3317 or email info@golgothafellowship.org instead.';
const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;

const clean = (v: unknown, max: number) =>
  (typeof v === 'string' ? v : '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
/** Header-safe single line (prevents header / subject injection). */
const line = (v: unknown, max: number) => clean(v, max).replace(/[\r\n]+/g, ' ');

export interface Submission {
  type: FormType;
  name: string;
  email: string;
  phone: string;
  message: string;
  areas: string[];
}

export function validate(data: FormData): { ok: true; value: Submission } | { ok: false; error: string } {
  const type = line(data.get('form'), 20) as FormType;
  if (!(type in FORMS)) return { ok: false, error: 'Unknown form.' };
  const name = line(data.get('name'), 120);
  const email = line(data.get('email'), 200);
  const phone = line(data.get('phone'), 40);
  const message = clean(data.get('message'), 5000);
  const areas = data.getAll('areas').map((a) => line(a, 60)).filter(Boolean).slice(0, 30);
  if (name.length < 2) return { ok: false, error: 'Please enter your name.' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address so we can reply.' };
  if (FORMS[type].messageRequired && message.length < 3) return { ok: false, error: 'Please write a short message.' };
  if (type === 'involved' && areas.length === 0 && message.length < 3)
    return { ok: false, error: 'Please choose at least one area, or write a short message.' };
  return { ok: true, value: { type, name, email, phone, message, areas } };
}

export function buildEmail(s: Submission): string {
  return [
    `Form: ${s.type}`,
    `Name: ${s.name}`,
    `Email: ${s.email}`,
    s.phone && `Phone: ${s.phone}`,
    s.areas.length > 0 && `Areas of interest: ${s.areas.join(', ')}`,
    '',
    s.message || '(no message)',
    '',
    '--',
    'Sent from the Golgotha Fellowship website. Reply directly to this email to answer.',
  ]
    .filter((l): l is string => typeof l === 'string')
    .join('\n');
}

function respond(request: Request, status: number, body: { ok: boolean; error?: string }): Response {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  // No-JavaScript submissions: redirect on success, plain message on failure.
  if (body.ok) return new Response(null, { status: 303, headers: { Location: '/thanks' } });
  return new Response(`${body.error ?? 'Something went wrong.'}\n\nUse your browser's Back button to return to the form.`, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function handle(request: Request, env: Env, fetchImpl: typeof fetch = fetch): Promise<Response> {
  // Same-origin only.
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return respond(request, 403, { ok: false, error: 'This form can only be submitted from our website.' });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, error: 'The form could not be read. Please try again.' });
  }

  // Honeypot: bots fill the hidden field. Pretend success so they do not retry.
  if (clean(data.get('website'), 200) !== '') return respond(request, 200, { ok: true });

  const result = validate(data);
  if (!result.ok) return respond(request, 422, { ok: false, error: result.error });
  const s = result.value;

  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(data.get('cf-turnstile-response'), 4096);
    const body = new FormData();
    body.set('secret', env.TURNSTILE_SECRET_KEY);
    body.set('response', token);
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) body.set('remoteip', ip);
    let passed = false;
    try {
      const r = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
      passed = ((await r.json()) as { success?: boolean }).success === true;
    } catch {
      passed = false;
    }
    if (!passed) return respond(request, 403, { ok: false, error: `We could not confirm you are not a robot. Please try again. ${FALLBACK}` });
  }

  const to = env[FORMS[s.type].to];
  if (!env.RESEND_API_KEY || !env.FORMS_FROM || !to) {
    console.error(`[forms] Delivery is not configured for "${s.type}".`); // no personal data
    return respond(request, 503, { ok: false, error: `Sorry, this form is not available right now. ${FALLBACK}` });
  }

  let sent = false;
  try {
    const r = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Golgotha Fellowship Website <${env.FORMS_FROM}>`,
        to: to.split(',').map((x) => x.trim()).filter(Boolean),
        reply_to: s.email,
        subject: `${FORMS[s.type].subject} — ${s.name}`,
        text: buildEmail(s),
      }),
    });
    sent = r.ok;
    if (!r.ok) console.error(`[forms] Email provider returned ${r.status} for "${s.type}".`);
  } catch {
    console.error(`[forms] Email provider unreachable for "${s.type}".`);
  }
  if (!sent) return respond(request, 502, { ok: false, error: `Sorry, your message could not be sent. ${FALLBACK}` });
  return respond(request, 200, { ok: true });
}

export const onRequestPost = (context: { request: Request; env: Env }) => handle(context.request, context.env);
export const onRequest = () => new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
