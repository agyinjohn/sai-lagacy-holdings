import { isPathwaySlug } from '@/content/pathways';
import { limiters, clientKey } from '@/lib/rate-limit';
import { saveRegistration } from '@/lib/registration';
import { isSameOrigin } from '@/lib/team-auth';
import { fieldErrorsFrom, schemaFor } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 20_000;

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: 'forbidden' }, 403);

  const type = request.headers.get('content-type') ?? '';
  if (!type.toLowerCase().startsWith('application/json')) return json({ ok: false, error: 'unsupported_media_type' }, 415);

  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);

  const { submit, attempts } = limiters();
  const key = clientKey(request.headers);

  const [gate, quota] = await Promise.all([attempts.check(key), submit.check(key)]);
  if (!gate.allowed || !quota.allowed) {
    const retry = Math.max(gate.retryAfterSeconds, quota.retryAfterSeconds);
    return json({ ok: false, error: 'rate_limited', retryAfterSeconds: retry }, 429, { 'Retry-After': String(retry) });
  }
  await attempts.hit(key);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'too_large' }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return json({ ok: false, error: 'bad_request' }, 400);
  const payload = body as Record<string, unknown>;

  if (!isPathwaySlug(payload.pathway)) return json({ ok: false, error: 'unknown_pathway' }, 422);
  const pathway = payload.pathway;

  // Honeypot: real people never see or fill this field. Pretend success, store nothing, and count the hit.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    await submit.hit(key);
    return json({ ok: true, ref: 'CBS-RECEIVED', pathway }, 201);
  }

  const parsed = schemaFor(pathway).safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: 'validation', fieldErrors: fieldErrorsFrom(parsed.error) }, 422);
  }

  try {
    const record = await saveRegistration(pathway, parsed.data);
    await submit.hit(key);
    return json({ ok: true, ref: record.ref, pathway }, 201);
  } catch (err) {
    console.error('Registration failed:', err instanceof Error ? err.message : 'unknown error');
    return json({ ok: false, error: 'server_error' }, 500);
  }
}

export function GET() {
  return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
}
