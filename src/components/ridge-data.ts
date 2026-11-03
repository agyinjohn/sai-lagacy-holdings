/** Ridge geometry and brand tone tokens shared by the ridge components. */

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

