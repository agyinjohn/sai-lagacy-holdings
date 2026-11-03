import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { PATHWAYS } from '@/content/pathways';
import { buildRecord } from '@/lib/registration';
import { filterRecords, neutraliseCell, toCsv, toXlsx, EXPORT_COLUMNS } from '@/lib/export';
import { schemaFor } from '@/lib/validation';
import { getStore } from '@/lib/storage';
import { GET as exportGET } from '@/app/api/team/export/route';
import { createSessionToken, verifyCredentials, verifySessionToken, SESSION_SECONDS, TEAM_COOKIE } from '@/lib/team-auth';
import { validPayload } from './helpers';

function record(overrides: Record<string, unknown> = {}, slug: keyof typeof PATHWAYS = 'contact') {
  const input = schemaFor(slug).parse(validPayload(slug, overrides));
  return buildRecord(slug, input, new Date('2026-11-02T10:00:00Z'));
}

describe('spreadsheet formula injection', () => {
  it.each(['=1+1', '+233241234567', '-2+3', '@SUM(A1)', '\t=cmd', '\r=cmd', '  =HYPERLINK("http://x")', '\n=1'])(
    'neutralises %j',
    (value) => {
      expect(neutraliseCell(value).startsWith("'")).toBe(true);
    },
  );

  it.each(['Ama Mensah', 'Accra, Ghana', '', 'a=b', 'Email me at x@y.com'])('leaves %j alone', (value) => {
    expect(neutraliseCell(value)).toBe(value);
  });
});

describe('CSV export', () => {
  it('has a BOM, CRLF rows, a header row and quotes every field', () => {
    const csv = toCsv([record()]);
    expect(csv.startsWith('﻿')).toBe(true);
    const lines = csv.trimEnd().split('\r\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.replace('\uFEFF', '')).toBe(EXPORT_COLUMNS.map((c) => `"${c}"`).join(','));
    expect(lines[1]).toContain('"Ama Mensah"');
    expect(lines[1]).toContain('"Contact and partnership enquiry"');
  });

  it('captures date, category, name, contact, location, detail, message, consent and source', () => {
    const [, row] = toCsv([record()]).trimEnd().split('\r\n');
    for (const expected of ['2026-11-02', 'Ama Mensah', 'ama@example.com', 'Accra, Ghana', 'Strategic partnership', 'Hello, please keep me informed.', '"Yes"', 'Home: courtyard map']) {
      expect(row).toContain(expected);
    }
  });

  it('escapes quotes and keeps embedded newlines inside one quoted field', () => {
    const csv = toCsv([record({ message: 'She said "hello"\nsecond line' })]);
    expect(csv).toContain('"She said ""hello""\nsecond line"');
  });

  it('prefixes formula payloads in every text field', () => {
    const csv = toCsv([record({ name: '=HYPERLINK("http://evil.example","x")', message: '@SUM(1+1)', location: '+1-1', organisation: '-cmd' })]);
    expect(csv).toContain(`"'=HYPERLINK(""http://evil.example"",""x"")"`);
    expect(csv).toContain(`"'@SUM(1+1)"`);
    expect(csv).toContain(`"'+1-1"`);
    expect(csv).toContain(`"'-cmd"`);
    expect(csv).not.toMatch(/,"=/);
  });

  it('preserves non-ASCII text', () => {
    expect(toCsv([record({ name: 'Akosua Owusu-Ansah, Kumasi é' })])).toContain('Akosua Owusu-Ansah, Kumasi é');
  });
});

describe('Excel export', () => {
  it('writes an All sheet plus one worksheet per category, with no formula cells', async () => {
    const records = [
      record({ name: '=1+1' }),
      record({}, 'legacy-unit'),
      record({}, 'transformation-retreat'),
    ];
    const buf = await toXlsx(records);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf as unknown as ArrayBuffer);

    expect(wb.worksheets.map((w) => w.name)).toEqual(['All', ...Object.values(PATHWAYS).map((p) => p.sheet)]);
    expect(wb.getWorksheet('All')?.rowCount).toBe(4);
    expect(wb.getWorksheet('Investment')?.rowCount).toBe(2);
    expect(wb.getWorksheet('Retreats')?.rowCount).toBe(2);
    expect(wb.getWorksheet('Guest Updates')?.rowCount).toBe(1);

    const cell = wb.getWorksheet('All')?.getRow(2).getCell(3);
    expect(cell?.value).toBe("'=1+1");
    wb.eachSheet((ws) =>
      ws.eachRow((row) =>
        row.eachCell((c) => {
          expect(typeof c.value === 'object' && c.value !== null && 'formula' in c.value).toBe(false);
        }),
      ),
    );
  });
});

describe('filtering', () => {
  const records = [record({ name: 'Ama Mensah' }), record({ name: 'Kojo Annan' }, 'legacy-unit')];
  it('filters by worksheet and by search text', () => {
    expect(filterRecords(records, { category: 'Investment' })).toHaveLength(1);
    expect(filterRecords(records, { category: 'All' })).toHaveLength(2);
    expect(filterRecords(records, { q: 'kojo' })).toHaveLength(1);
    expect(filterRecords(records, { q: 'EXAMPLE.COM' })).toHaveLength(2);
    expect(filterRecords(records, { category: 'Investment', q: 'mensah' })).toHaveLength(0);
  });
});

describe('team authentication and export route', () => {
  it('verifies credentials in constant time and rejects wrong ones', () => {
    expect(verifyCredentials('team-demo', 'correct-horse-battery')).toBe(true);
    expect(verifyCredentials('team-demo', 'wrong')).toBe(false);
    expect(verifyCredentials('someone', 'correct-horse-battery')).toBe(false);
  });

  it('issues signed tokens that expire and reject tampering', () => {
    const now = 1_800_000_000_000;
    const token = createSessionToken(now)!;
    expect(verifySessionToken(token, now + 1000)).toBe(true);
    expect(verifySessionToken(token, now + (SESSION_SECONDS + 5) * 1000)).toBe(false);
    expect(verifySessionToken(token.replace(/.$/, (c) => (c === 'a' ? 'b' : 'a')), now)).toBe(false);
    const [v, , sig] = token.split('.');
    expect(verifySessionToken(`${v}.${Number.MAX_SAFE_INTEGER}.${sig}`, now)).toBe(false);
    expect(verifySessionToken('garbage', now)).toBe(false);
    expect(verifySessionToken(undefined, now)).toBe(false);
  });

  it('is disabled when not configured', () => {
    const saved = process.env.TEAM_SESSION_SECRET;
    process.env.TEAM_SESSION_SECRET = 'short';
    expect(createSessionToken()).toBeNull();
    expect(verifyCredentials('team-demo', 'correct-horse-battery')).toBe(false);
    process.env.TEAM_SESSION_SECRET = saved;
  });

  it('hides the export route from unauthenticated callers', async () => {
    const res = await exportGET(new Request('http://localhost:3000/api/team/export?format=csv'));
    expect(res.status).toBe(404);
    expect(await res.text()).not.toContain('Ama');
  });

  it('returns filtered CSV and XLSX to an authenticated team member', async () => {
    await getStore().add(record({ name: 'Ama Mensah' }));
    await getStore().add(record({ name: 'Kojo Annan' }, 'legacy-unit'));
    const cookie = `${TEAM_COOKIE}=${createSessionToken()}`;

    const csvRes = await exportGET(new Request('http://localhost:3000/api/team/export?format=csv&category=Investment', { headers: { cookie } }));
    expect(csvRes.status).toBe(200);
    expect(csvRes.headers.get('content-type')).toContain('text/csv');
    expect(csvRes.headers.get('content-disposition')).toContain('attachment');
    expect(csvRes.headers.get('cache-control')).toContain('no-store');
    const text = await csvRes.text();
    expect(text).toContain('Kojo Annan');
    expect(text).not.toContain('Ama Mensah');

    const xlsxRes = await exportGET(new Request('http://localhost:3000/api/team/export?format=xlsx', { headers: { cookie } }));
    expect(xlsxRes.status).toBe(200);
    expect(xlsxRes.headers.get('content-type')).toContain('spreadsheetml');
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await xlsxRes.arrayBuffer());
    expect(wb.getWorksheet('All')?.rowCount).toBe(3);

    const bad = await exportGET(new Request('http://localhost:3000/api/team/export?format=pdf', { headers: { cookie } }));
    expect(bad.status).toBe(400);
  });
});
