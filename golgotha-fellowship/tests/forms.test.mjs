import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle, validate } from '../functions/api/forms.ts';

const env = { RESEND_API_KEY: 'k', FORMS_FROM: 'website@example.org', CONTACT_TO: 'c@example.org', PRAYER_TO: 'p@example.org', INVOLVED_TO: 'i@example.org' };
const form = (fields) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) (Array.isArray(v) ? v : [v]).forEach((x) => fd.append(k, x));
  return fd;
};
const req = (fields, headers = { Accept: 'application/json' }) =>
  new Request('https://www.golgothafellowship.org/api/forms', { method: 'POST', body: form(fields), headers });
const okFetch = (calls) => async (url, init) => { calls.push({ url, init }); return new Response('{"id":"1"}', { status: 200 }); };
const good = { form: 'prayer', name: 'Jane Doe', email: 'jane@example.com', message: 'Please pray for my family.' };

test('valid prayer request is emailed to the prayer inbox with reply-to', async () => {
  const calls = [];
  const res = await handle(req(good), env, okFetch(calls));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  const body = JSON.parse(calls[0].init.body);
  assert.deepEqual(body.to, ['p@example.org']);
  assert.equal(body.reply_to, 'jane@example.com');
  assert.match(body.text, /Please pray for my family\./);
});

test('no-JS submission redirects to /thanks', async () => {
  const res = await handle(req(good, {}), env, okFetch([]));
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('Location'), '/thanks');
});

test('validation rejects missing name, bad email, empty message', () => {
  assert.equal(validate(form({ ...good, form: 'contact', name: '' })).ok, false);
  assert.equal(validate(form({ ...good, email: 'nope' })).ok, false);
  assert.equal(validate(form({ ...good, message: '' })).ok, false);
  assert.equal(validate(form({ ...good, form: 'other' })).ok, false);
});

test('get-involved accepts areas without a message, rejects neither', () => {
  const base = { form: 'involved', name: 'Sam Lee', email: 'sam@example.com' };
  assert.equal(validate(form({ ...base, areas: ['Greeters', 'Worship'] })).ok, true);
  assert.equal(validate(form(base)).ok, false);
});

test('header injection in name is neutralised', async () => {
  const calls = [];
  await handle(req({ ...good, name: 'Eve\r\nBcc: x@evil.test' }), env, okFetch(calls));
  assert.doesNotMatch(JSON.parse(calls[0].init.body).subject, /[\r\n]/);
});

test('honeypot submissions are accepted silently and never emailed', async () => {
  const calls = [];
  const res = await handle(req({ ...good, website: 'http://spam.test' }), env, okFetch(calls));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('cross-origin posts are refused', async () => {
  const res = await handle(req(good, { Accept: 'application/json', Origin: 'https://evil.test' }), env, okFetch([]));
  assert.equal(res.status, 403);
});

test('unconfigured delivery tells the visitor to call or email (never a silent drop)', async () => {
  const res = await handle(req(good), {}, okFetch([]));
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.match(body.error, /208-572-3317/);
});

test('email provider failure is reported to the visitor', async () => {
  const res = await handle(req(good), env, async () => new Response('no', { status: 500 }));
  assert.equal(res.status, 502);
});

test('failed Turnstile check blocks the submission', async () => {
  const calls = [];
  const f = async (url, init) => { calls.push(url); return new Response(JSON.stringify({ success: false })); };
  const res = await handle(req(good), { ...env, TURNSTILE_SECRET_KEY: 's' }, f);
  assert.equal(res.status, 403);
  assert.equal(calls.length, 1);
});

test('plan-a-visit needs a service and goes to the greeter inbox (or contact inbox)', async () => {
  const base = { form: 'visit', name: 'New Family', email: 'new@example.com' };
  assert.equal(validate(form(base)).ok, false);
  const calls = [];
  const res = await handle(req({ ...base, service: 'Sunday 10:30 AM', kids: '2' }), env, okFetch(calls));
  assert.equal(res.status, 200);
  const body = JSON.parse(calls[0].init.body);
  assert.deepEqual(body.to, ['c@example.org']);
  assert.match(body.text, /Planning to attend: Sunday 10:30 AM/);
  assert.match(body.text, /Children coming: 2/);
  const calls2 = [];
  await handle(req({ ...base, service: 'Sunday 8:30 AM' }), { ...env, VISIT_TO: 'greeters@example.org' }, okFetch(calls2));
  assert.deepEqual(JSON.parse(calls2[0].init.body).to, ['greeters@example.org']);
});

test('prayer requests can be anonymous, and record who may see them', async () => {
  const calls = [];
  const res = await handle(req({ form: 'prayer', name: '', email: '', message: 'Please pray for my mother.', share: 'Pastors and the prayer team' }), env, okFetch(calls));
  assert.equal(res.status, 200);
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.reply_to, undefined);
  assert.match(body.subject, /Anonymous/);
  assert.match(body.text, /Who may see this: Pastors and the prayer team/);
  assert.match(body.text, /reach out: No/);
});
test('prayer: asking for contact needs an email or phone; bad email still rejected', () => {
  assert.equal(validate(form({ form: 'prayer', message: 'Pray for me', contact_me: 'yes' })).ok, false);
  assert.equal(validate(form({ form: 'prayer', message: 'Pray for me', contact_me: 'yes', phone: '208-555-0100' })).ok, true);
  assert.equal(validate(form({ form: 'prayer', message: 'Pray for me', email: 'not-an-email' })).ok, false);
  assert.equal(validate(form({ form: 'prayer', message: '' })).ok, false);
});
