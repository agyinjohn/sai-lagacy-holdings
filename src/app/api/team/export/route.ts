import { filterRecords, toCsv, toXlsx } from '@/lib/export';
import { getStore } from '@/lib/storage';
import { isAuthenticatedRequest } from '@/lib/team-auth';
import { exportQuerySchema } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow' };

export async function GET(request: Request) {
  // Unauthenticated callers learn nothing, not even that the route exists.
  if (!isAuthenticatedRequest(request)) return new Response('Not found', { status: 404, headers: noStore });

  const url = new URL(request.url);
  const parsed = exportQuerySchema.safeParse({
    format: url.searchParams.get('format') ?? undefined,
    category: url.searchParams.get('category') ?? undefined,
    q: url.searchParams.get('q') ?? undefined,
  });
  if (!parsed.success) return new Response('Bad request', { status: 400, headers: noStore });

  const all = await getStore().list();
  const rows = filterRecords(all, { category: parsed.data.category, q: parsed.data.q }).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const stamp = new Date().toISOString().slice(0, 10);

  if (parsed.data.format === 'csv') {
    return new Response(toCsv(rows), {
      headers: {
        ...noStore,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="courtyard-registrations-${stamp}.csv"`,
      },
    });
  }

  const buffer = await toXlsx(rows);
  return new Response(new Uint8Array(buffer), {
    headers: {
      ...noStore,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="courtyard-registrations-${stamp}.xlsx"`,
    },
  });
}
