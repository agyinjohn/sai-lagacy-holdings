'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { MAP_ROOMS, type MapRoom } from '@/content/map';
import { registerHref } from '@/content/links';
import { DIAGRAM_NOTE } from '@/content/site';

// Row and column of each room in the 3 x 3 plan (md and up). The centre cell is the courtyard.
const CELLS = [
  'md:col-start-1 md:row-start-1',
  'md:col-start-2 md:row-start-1',
  'md:col-start-3 md:row-start-1',
  'md:col-start-1 md:row-start-2',
  'md:col-start-3 md:row-start-2',
  'md:col-start-1 md:row-start-3',
  'md:col-start-2 md:row-start-3',
  'md:col-start-3 md:row-start-3',
];

/**
 * Interactive courtyard plan. Hover, tap or keyboard focus on a space reveals what is proposed
 * there and how to register. The selection stays put when the pointer leaves, so the links in the
 * courtyard panel can always be reached. Concept diagram only, not the masterplan.
 */
export function CourtyardMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // On phones the details panel sits below the tiles, so bring it into view after a tap.
  const reveal = (id: string) => {
    setActiveId(id);
    if (window.matchMedia('(max-width: 767px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }));
    }
  };
  const active: MapRoom | undefined = MAP_ROOMS.find((r) => r.id === activeId);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {MAP_ROOMS.map((room, i) => {
          const on = room.id === activeId;
          return (
            <button
              key={room.id}
              type="button"
              aria-pressed={on}
              aria-controls={panelId}
              onMouseEnter={() => setActiveId(room.id)}
              onFocus={() => setActiveId(room.id)}
              onClick={() => reveal(room.id)}
              className={`group relative flex min-h-[88px] flex-col justify-start gap-2 overflow-hidden rounded-[2px] border p-4 text-left transition-all duration-200 md:min-h-[140px] md:p-5 ${CELLS[i]} ${
                on
                  ? '-translate-y-0.5 border-gold bg-white shadow-[0_10px_30px_-12px_rgba(18,59,42,0.35)]'
                  : 'border-pale bg-paper hover:border-gold hover:bg-white'
              }`}
            >
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] transition-colors ${on ? 'bg-gold' : 'bg-transparent group-hover:bg-gold-light'}`} />
              <span className="font-heading text-[1.05rem] leading-snug md:text-[1.3rem]">{room.title}</span>
              <span className="hidden text-[0.9rem] leading-snug text-deep/75 md:block">{room.text}</span>
            </button>
          );
        })}

        {/* Courtyard: the centre of the plan and the details panel */}
        <div
          id={panelId}
          ref={panelRef}
          role="region"
          aria-live="polite"
          aria-label="Courtyard details"
          className="on-dark relative order-last col-span-2 min-h-[260px] overflow-hidden rounded-[2px] bg-deep p-6 text-white md:order-none md:col-span-1 md:col-start-2 md:row-start-2 md:p-7"
        >
          <svg aria-hidden="true" viewBox="0 0 200 200" focusable="false" className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 opacity-90">
            <circle cx="100" cy="100" r="34" fill="var(--color-gold-light)" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="var(--color-gold-light)" strokeOpacity="0.4" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="var(--color-gold-light)" strokeOpacity="0.22" />
          </svg>
          {active ? (
            <div className="relative">
              <p className="eyebrow mb-3 text-gold-light">In the courtyard</p>
              <h3 className="display-3 pr-14">{active.title}</h3>
              <p className="mt-3 text-pale">{active.text}</p>
              <ul className="mt-4 flex flex-col">
                <li>
                  <Link href={active.explore.href} className="inline-flex min-h-11 items-center font-medium underline underline-offset-4 hover:text-gold-light">
                    {active.explore.label}
                  </Link>
                </li>
                {active.register.map((r) => (
                  <li key={r.label}>
                    <Link
                      href={registerHref(r.pathway, r.from, r.detail)}
                      className="inline-flex min-h-11 items-center font-medium text-gold-light underline underline-offset-4 hover:text-[#e8cb90]"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="relative">
              <p className="eyebrow mb-3 text-gold-light">The open courtyard</p>
              <h3 className="display-3 pr-14">A proposed 80-acre setting in Akuapem, Eastern Region</h3>
              <p className="mt-3 text-pale">Hover, tap or focus a space to see what is proposed there and how to register.</p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-deep/75">{DIAGRAM_NOTE}</p>
    </div>
  );
}
