import { limiters, clientKey } from '@/lib/rate-limit';
import { TEAM_COOKIE, createSessionToken, isSameOrigin, sessionCookieOptions, teamConfig, verifyCredentials } from '@/lib/team-auth';
import { teamLoginSchema } from '@/lib/validation';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: 'forbidden' }, 403);
  if (!teamConfig().configured) return json({ ok: false, error: 'not_configured' }, 503);

  const { login } = limiters();
  const key = clientKey(request.headers);
  const gate = login.check(key);
  if (!gate.allowed) {
    return json({ ok: false, error: 'rate_limited', retryAfterSeconds: gate.retryAfterSeconds }, 429, {
      'Retry-After': String(gate.retryAfterSeconds),
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  const parsed = teamLoginSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: 'invalid' }, 400);

  if (!verifyCredentials(parsed.data.username, parsed.data.password)) {
    login.hit(key);
    return json({ ok: false, error: 'invalid_credentials' }, 401);
  }

  const token = createSessionToken();
  if (!token) return json({ ok: false, error: 'not_configured' }, 503);
  (await cookies()).set(TEAM_COOKIE, token, sessionCookieOptions());
  return json({ ok: true }, 200);
}
