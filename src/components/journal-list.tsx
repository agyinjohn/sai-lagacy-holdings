'use client';

import { useState } from 'react';
import { JOURNAL_CATEGORIES, JOURNAL_ENTRIES, type JournalCategory } from '@/content/journal';

type Filter = 'All' | JournalCategory;

export function JournalList({ initial }: { initial: Filter }) {
  const [filter, setFilter] = useState<Filter>(initial);
  const entries = JOURNAL_ENTRIES.filter((e) => filter === 'All' || e.category === filter);

  const choose = (next: Filter) => {
    setFilter(next);
    // Keep the filter shareable without a navigation.
    const url = new URL(window.location.href);
    if (next === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', next);
    window.history.replaceState(null, '', url);
  };

  return (
    <div>
      <div role="group" aria-label="Filter articles by category" className="flex flex-wrap gap-2">
        {(['All', ...JOURNAL_CATEGORIES] as Filter[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => choose(c)}
            className={`min-h-11 rounded-[2px] border border-deep px-4 text-[0.95rem] transition-colors ${
              filter === c ? 'bg-deep text-white' : 'bg-transparent text-deep hover:bg-deep/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-deep/80" role="status" aria-live="polite">
        Showing {entries.length} sample {entries.length === 1 ? 'article layout' : 'article layouts'}
        {filter === 'All' ? '' : ` in ${filter}`}.
      </p>
      <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <li key={e.id}>
            <article className="flex h-full flex-col border-t border-gold-ink/60 pb-8 pt-5">
              <p className="eyebrow text-gold-ink">{e.category}</p>
              <h2 className="display-3 mt-4 !text-[1.9rem]">{e.title}</h2>
              <p className="mt-3 text-deep/85">{e.summary}</p>
              <p className="mt-auto pt-5 text-sm text-deep/70">{e.date}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
