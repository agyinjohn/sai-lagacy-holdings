import type { CSSProperties } from 'react';

/**
 * The ridge line is the main graphic motif ("Rooted on the Ridge").
 * These are generic, hand-drawn hills. They do not depict the real site.
 */

export const RIDGE_VIEWBOX = '0 0 1440 540';

/** Back to front. Each path closes to the bottom edge. */
export const RIDGE_PATHS = [
  'M0 200 C180 150 300 180 460 130 C620 80 760 150 930 110 C1100 70 1260 120 1440 70 L1440 540 L0 540Z',
  'M0 290 C200 230 340 290 520 240 C700 190 860 260 1040 210 C1200 170 1320 210 1440 180 L1440 540 L0 540Z',
  'M0 370 C220 320 380 380 600 330 C800 285 980 360 1180 315 C1290 290 1370 305 1440 290 L1440 540 L0 540Z',
  'M0 460 C240 410 460 470 720 430 C960 395 1180 465 1440 410 L1440 540 L0 540Z',
] as const;

export const GOLD_LINES = [
  'M0 494 C240 444 460 504 720 464 C960 429 1180 499 1440 444',
  'M0 528 C240 478 460 538 720 498 C960 463 1180 533 1440 478',
] as const;

export const TONES = {
  deep: 'var(--color-deep)',
  mid: 'var(--color-mid)',
  sage: 'var(--color-sage)',
  pale: 'var(--color-pale)',
  mist: 'var(--color-mist)',
  paper: 'var(--color-paper)',
  gold: 'var(--color-gold)',
  goldLight: 'var(--color-gold-light)',
  night: 'var(--color-night)',
  softSage: '#d5e0d4',
} as const;
export type Tone = keyof typeof TONES;

export const MOODS: Record<'mist' | 'offwhite' | 'sage' | 'dawn', { ground: Tone; layers: [Tone, Tone, Tone, Tone]; sunX: number }> = {
  mist: { ground: 'mist', layers: ['pale', 'sage', 'mid', 'deep'], sunX: 1120 },
  offwhite: { ground: 'paper', layers: ['pale', 'sage', 'mid', 'deep'], sunX: 320 },
  sage: { ground: 'mist', layers: ['softSage', 'pale', 'sage', 'deep'], sunX: 1040 },
  dawn: { ground: 'mist', layers: ['pale', 'sage', 'mid', 'deep'], sunX: 720 },
};

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

/** Soft ridge edge between two sections: `from` is the section above, `to` the one below. */
export function RidgeDivider({ from, to, flip = false }: { from: Tone; to: Tone; flip?: boolean }) {
  return (
    <div aria-hidden="true" style={{ background: TONES[from], lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        width="100%"
        height="96"
        style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}
        focusable="false"
      >
        <path
          d="M0 62 C180 28 340 70 540 44 C740 18 900 66 1100 40 C1240 22 1350 44 1440 30 L1440 96 L0 96Z"
          fill={TONES[to]}
        />
        <path
          d="M0 48 C180 14 340 56 540 30 C740 4 900 52 1100 26 C1240 8 1350 30 1440 16"
          fill="none"
          stroke={TONES.gold}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
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
