'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PATHWAY_LIST } from '@/content/pathways';
import { sourceLabel } from '@/content/sources';
import { filterRecords } from '@/lib/filter';
import type { RegistrationRecord } from '@/lib/types';

export function TeamDashboard({ records }: { records: RegistrationRecord[] }) {
  const router = useRouter();
  const [sheet, setSheet] = useState('All');
  const [q, setQ] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: records.length };
    for (const p of PATHWAY_LIST) c[p.sheet] = records.filter((r) => r.pathway === p.slug).length;
    return c;
  }, [records]);

  const rows = useMemo(() => filterRecords(records, { category: sheet, q }), [records, sheet, q]);

  const exportHref = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams({ format });
    if (sheet !== 'All') params.set('category', sheet);
    if (q.trim()) params.set('q', q.trim());
    return `/api/team/export?${params.toString()}`;
  };

  async function logout() {
    await fetch('/api/team/logout', { method: 'POST' });
    router.refresh();
  }

  const btn = 'inline-flex min-h-11 items-center rounded-[2px] border border-deep px-4 text-[0.95rem] font-medium transition-colors';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-deep/80">
          Showing {rows.length} of {records.length} registration{records.length === 1 ? '' : 's'}
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={exportHref('csv')} download className={`${btn} bg-deep text-white hover:bg-mid`}>
            Export CSV
          </a>
          <a href={exportHref('xlsx')} download className={`${btn} bg-deep text-white hover:bg-mid`}>
            Export Excel
          </a>
          <button type="button" onClick={logout} className={`${btn} hover:bg-deep/10`}>
            Sign out
          </button>
        </div>
      </div>

      <div role="group" aria-label="Worksheets" className="mt-6 flex flex-wrap gap-2">
        {['All', ...PATHWAY_LIST.map((p) => p.sheet)].map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={sheet === name}
            onClick={() => setSheet(name)}
            className={`${btn} ${sheet === name ? 'bg-deep text-white' : 'hover:bg-deep/10'}`}
          >
            {name} ({counts[name] ?? 0})
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-md">
        <label htmlFor="team-search" className="font-medium">
          Search registrations
        </label>
        <input
          id="team-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name, email, location, message, reference"
          className="mt-1.5 min-h-[48px] w-full rounded-[2px] border border-deep bg-white px-3"
        />
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-[2px] border border-pale bg-white p-8">
          <p className="display-3">{records.length === 0 ? 'No registrations yet' : 'No registrations match'}</p>
          <p className="mt-2 text-deep/80">
            {records.length === 0 ? 'Complete a registration form on the site and it will appear here.' : 'Try another worksheet or clear the search.'}
          </p>
        </div>
      ) : (
        <div role="region" aria-label="Registrations table" tabIndex={0} className="mt-8 overflow-x-auto rounded-[2px] border border-pale bg-white">
          <table className="w-full min-w-[1100px] border-collapse text-left text-[0.95rem]">
            <caption className="sr-only">Registrations for {sheet === 'All' ? 'all categories' : sheet}</caption>
            <thead>
              <tr className="bg-mist">
                {['Date', 'Category', 'Name', 'Contact details', 'Location', 'Detail', 'Message', 'Source', 'Ref'].map((h) => (
                  <th key={h} scope="col" className="border-b border-pale px-3 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="align-top odd:bg-white even:bg-paper">
                  <td className="whitespace-nowrap border-b border-pale px-3 py-3">{r.date}</td>
                  <td className="border-b border-pale px-3 py-3">{r.category}</td>
                  <td className="border-b border-pale px-3 py-3">
                    {r.name}
                    {r.organisation && <span className="block text-sm text-deep/70">{r.organisation}</span>}
                  </td>
                  <td className="border-b border-pale px-3 py-3 break-words">
                    {r.email}
                    {r.phone && <span className="block text-sm text-deep/70">{r.phone}</span>}
                  </td>
                  <td className="border-b border-pale px-3 py-3">{r.location}</td>
                  <td className="border-b border-pale px-3 py-3">{r.detail}</td>
                  <td className="max-w-[22rem] border-b border-pale px-3 py-3 break-words">{r.message || <span className="text-deep/75">None</span>}</td>
                  <td className="border-b border-pale px-3 py-3">{sourceLabel(r.source)}</td>
                  <td className="whitespace-nowrap border-b border-pale px-3 py-3 font-mono text-sm">{r.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-sm text-deep/70">Exports follow the current worksheet and search. Text that could run as a spreadsheet formula is neutralised in every export.</p>
    </div>
  );
}
