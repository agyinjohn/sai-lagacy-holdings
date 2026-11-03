import { cookies } from 'next/headers';
import { TEAM_COOKIE, isSameOrigin } from '@/lib/team-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ ok: false }, { status: 403 });
  (await cookies()).delete(TEAM_COOKIE);
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
