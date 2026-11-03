import Link from 'next/link';
import type { ReactNode } from 'react';

export interface ActionRow {
  title: string;
  text: ReactNode;
  label: string;
  href: string;
}

/** Large, open rows with a hairline between them. The whole row is the link, and the arrow slides on hover. */
export function ActionRows({ rows }: { rows: readonly ActionRow[] }) {
  return (
    <ul className="border-b border-deep/25">
      {rows.map((r) => (
        <li key={r.title} className="border-t border-deep/25">
          <Link
            href={r.href}
            className="group grid items-center gap-x-10 gap-y-3 py-7 transition-colors hover:bg-white/60 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_220px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_310px] md:px-4 lg:py-9"
          >
            <span className="display-3 !text-[clamp(1.45rem,2.4vw,2.1rem)]">{r.title}</span>
            <span className="max-w-[34em] text-deep/85">{r.text}</span>
            <span className="inline-flex items-center gap-3 font-medium text-gold-ink group-hover:text-deep md:justify-end md:text-right">
              {r.label}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
