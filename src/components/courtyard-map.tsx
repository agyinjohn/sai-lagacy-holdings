'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { RidgeGlyph } from '@/components/ridge';
import { ImageFill } from '@/components/site-image';
import { MAP_ROOMS, type MapRoom } from '@/content/map';
import { registerHref } from '@/content/links';
import { DIAGRAM_NOTE } from '@/content/site';

/* ------------------------------------------------------------------ geometry (plan units) */
const W = 1000;
const H = 780;
const CENTRE = { x: 500, y: 390 };
const TILE = { w: 236, h: 118 };
// Reading and tab order: row by row, skipping the centre.
const POSITIONS = [
  { x: 130, y: 90 }, { x: 500, y: 90 }, { x: 870, y: 90 },
  { x: 130, y: 390 }, { x: 870, y: 390 },
  { x: 130, y: 690 }, { x: 500, y: 690 }, { x: 870, y: 690 },
];
// Row and column of each space in the stacked grid (below lg).
const CELLS = [
  '', '', '', '', '', '', '', '',
];

/** A gently wobbling closed contour, like a line on a topographic map. Deterministic, so server and client agree. */
function contour(rx: number, ry: number, seed: number) {
  const n = 96;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const wob = 1 + 0.035 * Math.sin(3 * t + seed) + 0.02 * Math.sin(5 * t + seed * 2.1);
    pts.push(`${(CENTRE.x + Math.cos(t) * rx * wob).toFixed(1)} ${(CENTRE.y + Math.sin(t) * ry * wob).toFixed(1)}`);
  }
  return `M${pts.join(' L')}Z`;
}
const CONTOURS = [
  contour(250, 195, 0.4), contour(330, 258, 1.3), contour(415, 322, 2.2),
  contour(500, 390, 3.1), contour(585, 455, 4.0), contour(670, 520, 4.9),
];

/** A slightly bent line from a space to the centre of the courtyard. */
function link(from: { x: number; y: number }) {
  const mx = (from.x + CENTRE.x) / 2;
  const my = (from.y + CENTRE.y) / 2;
  const bend = (from.x < CENTRE.x ? -1 : 1) * 26 * (from.y === CENTRE.y ? 0 : from.y < CENTRE.y ? 1 : -1);
  return `M${from.x} ${from.y} Q${mx + bend} ${my - bend * 0.6} ${CENTRE.x} ${CENTRE.y}`;
}

/* ------------------------------------------------------------------ details panel */
function Panel({ active }: { active: MapRoom | undefined }) {
  return (
    <div className="on-dark flex h-full flex-col overflow-hidden rounded-[2px] bg-deep text-white shadow-[0_30px_60px_-30px_rgba(14,46,33,0.7)]">
      {active ? (
        <>
          <div className="relative aspect-[16/9] shrink-0 lg:aspect-[5/2]">
            {active.imageId ? (
              <ImageFill id={active.imageId} sizes="(min-width: 1024px) 460px, 100vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-mid">
                <RidgeGlyph className="h-16 w-24 text-deep" />
              </div>
            )}
          </div>
          <div className="p-5 sm:p-6 lg:p-5">
            <p className="eyebrow mb-2 text-gold-light">In the courtyard</p>
            <h3 className="display-3">{active.title}</h3>
            <p className="mt-2 text-[0.95rem] text-pale">{active.text}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6">
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
        </>
      ) : (
        <div className="relative flex flex-1 flex-col justify-center p-6 sm:p-8">
          <svg aria-hidden="true" viewBox="0 0 200 200" focusable="false" className="pointer-events-none absolute -right-12 -top-12 h-52 w-52">
            <circle cx="100" cy="100" r="34" fill="var(--color-gold-light)" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="var(--color-gold-light)" strokeOpacity="0.4" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="var(--color-gold-light)" strokeOpacity="0.22" />
          </svg>
          <p className="eyebrow mb-3 text-gold-light">The open courtyard</p>
          <h3 className="display-3 pr-16">A proposed 80-acre setting in Akuapem, Eastern Region</h3>
          <p className="mt-3 text-pale">Hover, tap or focus a space to see what is proposed there and how to register.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive courtyard plan. Hover, tap or keyboard focus on a space reveals what is proposed there
 * and how to register. The selection stays put when the pointer leaves, so the links in the courtyard
 * panel can always be reached. A concept diagram only, not the masterplan.
 */
export function CourtyardMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelId = useId();
  const stackedPanel = useRef<HTMLDivElement>(null);
  const active: MapRoom | undefined = MAP_ROOMS.find((r) => r.id === activeId);

  // On phones and tablets the panel sits below the tiles, so bring it into view after a tap.
  const reveal = (id: string) => {
    setActiveId(id);
    if (window.matchMedia('(max-width: 1023px)').matches) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      requestAnimationFrame(() => stackedPanel.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }));
    }
  };

  const select = {
    onMouseEnter: (id: string) => () => setActiveId(id),
    onFocus: (id: string) => () => setActiveId(id),
    onClick: (id: string) => () => reveal(id),
  };

  return (
    <div>
      {/* ---------- Plan layout (large screens) ---------- */}
      <div className="relative mx-auto hidden w-full lg:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full">
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--color-gold)" strokeOpacity={0.34 - i * 0.04} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          {MAP_ROOMS.map((room, i) => {
            const pos = POSITIONS[i]!;
            return (
              <g key={room.id}>
                <path d={link(pos)} fill="none" stroke="var(--color-sage)" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="3 7" vectorEffect="non-scaling-stroke" />
                <path
                  d={link(pos)}
                  pathLength={1}
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeDasharray: 1, strokeDashoffset: activeId === room.id ? 0 : 1, transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }}
                />
                <circle cx={pos.x} cy={pos.y} r="5" fill="var(--color-gold)" fillOpacity={activeId === room.id ? 1 : 0.35} />
              </g>
            );
          })}
        </svg>

        {MAP_ROOMS.map((room, i) => {
          const pos = POSITIONS[i]!;
          const on = room.id === activeId;
          return (
            <button
              key={room.id}
              type="button"
              aria-pressed={on}
              aria-controls={`${panelId}-plan`}
              onMouseEnter={select.onMouseEnter(room.id)}
              onFocus={select.onFocus(room.id)}
              onClick={select.onClick(room.id)}
              style={{ left: `${((pos.x - TILE.w / 2) / W) * 100}%`, top: `${((pos.y - TILE.h / 2) / H) * 100}%`, width: `${(TILE.w / W) * 100}%`, height: `${(TILE.h / H) * 100}%` }}
              className={`group absolute z-10 flex flex-col items-start justify-between overflow-hidden rounded-[2px] border p-4 text-left transition-all duration-300 ${
                on ? 'z-20 -translate-y-1 border-gold bg-white shadow-[0_18px_40px_-18px_rgba(18,59,42,0.5)]' : 'border-pale bg-white shadow-[0_8px_24px_-16px_rgba(18,59,42,0.35)] hover:-translate-y-0.5 hover:border-gold'
              }`}
            >
              <span className="eyebrow text-gold-ink">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-heading text-[1.2rem] leading-snug">{room.title}</span>
              <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[3px] origin-left transition-transform duration-500 ${on ? 'scale-x-100 bg-gold' : 'scale-x-0 bg-gold-light group-hover:scale-x-100'}`} />
            </button>
          );
        })}

        <div id={`${panelId}-plan`} role="region" aria-live="polite" aria-label="Courtyard details" className="absolute z-30 w-[42%]" style={{ left: '29%', top: '50%', transform: 'translateY(-50%)' }}>
          <Panel active={active} />
        </div>
      </div>

      {/* ---------- Stacked layout (below lg) ---------- */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {MAP_ROOMS.map((room, i) => {
            const on = room.id === activeId;
            return (
              <button
                key={room.id}
                type="button"
                aria-pressed={on}
                aria-controls={panelId}
                onMouseEnter={select.onMouseEnter(room.id)}
                onFocus={select.onFocus(room.id)}
                onClick={select.onClick(room.id)}
                className={`group relative flex min-h-[88px] flex-col justify-start gap-2 overflow-hidden rounded-[2px] border p-4 text-left transition-all duration-200 md:min-h-[120px] md:p-5 ${CELLS[i]} ${
                  on ? '-translate-y-0.5 border-gold bg-white shadow-[0_10px_30px_-12px_rgba(18,59,42,0.35)]' : 'border-pale bg-paper hover:border-gold hover:bg-white'
                }`}
              >
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] transition-colors ${on ? 'bg-gold' : 'bg-transparent group-hover:bg-gold-light'}`} />
                <span className="font-heading text-[1.05rem] leading-snug md:text-[1.25rem]">{room.title}</span>
                <span className="hidden text-[0.9rem] leading-snug text-deep/75 md:block">{room.text}</span>
              </button>
            );
          })}

          <div
            id={panelId}
            ref={stackedPanel}
            role="region"
            aria-live="polite"
            aria-label="Courtyard details"
            className="order-last col-span-2 mt-2 md:col-span-3 md:mx-auto md:w-full md:max-w-[620px]"
          >
            <Panel active={active} />
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-deep/75">{DIAGRAM_NOTE}</p>
    </div>
  );
}
