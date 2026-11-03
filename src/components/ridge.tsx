import type { CSSProperties } from 'react';
import { GOLD_LINES, MOODS, RIDGE_PATHS, RIDGE_VIEWBOX, TONES, type Tone } from '@/components/ridge-data';

/**
 * The ridge line is the main graphic motif ("Rooted on the Ridge").
 * These are generic, hand-drawn hills. They do not depict the real site.
 */

export * from '@/components/ridge-data';

/** A layered ridge illustration with a gold sun. Decorative, so hidden from assistive tech. */
export function RidgeScene({
  mood = 'mist',
  className,
  style,
}: {
  mood?: keyof typeof MOODS;
  className?: string;
  style?: CSSProperties;
}) {
  const m = MOODS[mood];
  return (
    <svg
      viewBox={RIDGE_VIEWBOX}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      <circle cx={m.sunX} cy="130" r="92" fill={TONES.goldLight} />
      {RIDGE_PATHS.map((d, i) => (
        <path key={i} d={d} fill={TONES[m.layers[i] as Tone]} />
      ))}
      {GOLD_LINES.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={TONES.goldLight} strokeOpacity={i === 0 ? 0.45 : 0.3} strokeWidth="1" />
      ))}
    </svg>
  );
}

/** Small ridge glyph used beside the wordmark and as the favicon motif. */
export function RidgeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" aria-hidden="true" focusable="false" className={className}>
      <circle cx="29" cy="7" r="4" fill="var(--color-gold)" />
      <path d="M0 22 C6 14 11 18 17 11 C23 5 29 14 40 8 L40 28 L0 28Z" fill="currentColor" opacity="0.45" />
      <path d="M0 26 C8 19 14 24 22 18 C29 13 34 19 40 15 L40 28 L0 28Z" fill="currentColor" />
    </svg>
  );
}

export { RidgeDivider } from '@/components/ridge-transition';

/**
 * A ridge-shaped edge laid over the top or bottom of an image section, filled with the colour of
 * the neighbouring section so the image appears to rise from (or settle into) the hills.
 */
export function RidgeEdge({ edge, tone, className = '' }: { edge: 'top' | 'bottom'; tone: Tone; className?: string }) {
  const top = edge === 'top';
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-x-0 z-[5] block h-[clamp(56px,8vw,120px)] w-full ${top ? 'top-0' : 'bottom-0'} ${className}`}
      style={top ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path d="M0 78 C220 38 420 96 680 60 C940 24 1180 84 1440 46 L1440 120 L0 120Z" fill={TONES[tone]} />
      <path d="M0 78 C220 38 420 96 680 60 C940 24 1180 84 1440 46" fill="none" stroke={TONES.gold} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
