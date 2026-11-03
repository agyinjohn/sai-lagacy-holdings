import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Team area authentication.
 * Credentials and the signing secret live ONLY in environment variables.
 * The area is disabled (never open) until all three are set.
 */
export const TEAM_COOKIE = 'cbs_team';
export const SESSION_SECONDS = 8 * 60 * 60;

export function teamConfig() {
  const username = process.env.TEAM_USERNAME ?? '';
  const password = process.env.TEAM_PASSWORD ?? '';
  const secret = process.env.TEAM_SESSION_SECRET ?? '';
  const configured = username.length > 0 && password.length >= 8 && secret.length >= 32;
  return { configured, username, password, secret };
}

const sha = (v: string) => createHash('sha256').update(v).digest();

/** Constant-time comparison of two strings of any length. */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha(a), sha(b));
}

export function verifyCredentials(username: string, password: string): boolean {
  const cfg = teamConfig();
  if (!cfg.configured) return false;
  // Evaluate both so timing does not reveal which was wrong.
  const u = safeEqual(username, cfg.username);
  const p = safeEqual(password, cfg.password);
  return u && p;
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(nowMs = Date.now()): string | null {
  const cfg = teamConfig();
  if (!cfg.configured) return null;
  const exp = Math.floor(nowMs / 1000) + SESSION_SECONDS;
  const payload = `v1.${exp}`;
  return `${payload}.${sign(payload, cfg.secret)}`;
}

export function verifySessionToken(token: string | undefined | null, nowMs = Date.now()): boolean {
  const cfg = teamConfig();
  if (!cfg.configured || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;
  const [version, expRaw, sig] = parts as [string, string, string];
  const exp = Number(expRaw);
  if (!Number.isInteger(exp) || exp * 1000 < nowMs) return false;
  return safeEqual(sig, sign(`${version}.${expRaw}`, cfg.secret));
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return undefined;
}

export function isAuthenticatedRequest(request: Request): boolean {
  return verifySessionToken(readCookie(request.headers.get('cookie'), TEAM_COOKIE));
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_SECONDS,
  };
}

/** Same-origin check for state-changing requests. Browsers always send Origin on POST. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return process.env.NODE_ENV === 'test'; // non-browser clients are rejected outside tests
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}
