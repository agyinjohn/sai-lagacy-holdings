'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TONES, type Tone } from '@/components/ridge-data';

// Three ridge layers between two sections. They are drawn twice as wide as the screen and drift
// sideways at different speeds as the page scrolls, so the transition feels like hills receding.
const LAYER_BACK =
  'M0 70 C300 30 520 90 820 55 C1120 20 1300 80 1440 62 C1700 30 1980 85 2260 50 C2520 20 2700 70 2880 70 L2880 160 L0 160Z';
const LAYER_MID =
  'M0 100 C260 70 560 120 860 92 C1160 64 1340 118 1440 104 C1740 74 2040 122 2300 90 C2560 62 2740 105 2880 100 L2880 160 L0 160Z';
const LAYER_FRONT_LINE =
  'M0 132 C300 110 620 146 900 126 C1180 106 1330 140 1440 130 C1760 108 2080 144 2340 122 C2600 104 2780 134 2880 132';
const LAYER_FRONT = `${LAYER_FRONT_LINE} L2880 160 L0 160Z`;

/** Soft ridge transition between two sections: `from` is the section above, `to` the one below. */
export function RidgeDivider({ from, to, flip = false }: { from: Tone; to: Tone; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xBack = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const xMid = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const xFront = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const draw = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const mix = (pct: number) => `color-mix(in srgb, ${TONES[to]} ${pct}%, ${TONES[from]})`;

  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden" style={{ background: TONES[from], lineHeight: 0 }}>
      <div className="relative h-[clamp(72px,9vw,140px)]" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
        <svg viewBox="0 0 2880 160" preserveAspectRatio="none" focusable="false" className="absolute top-0 h-full w-[200%] max-w-none" style={{ left: '-50%' }}>
          <motion.path d={LAYER_BACK} style={{ fill: mix(30), x: reduce ? 0 : xBack }} />
          <motion.path d={LAYER_MID} style={{ fill: mix(62), x: reduce ? 0 : xMid }} />
          <motion.path d={LAYER_FRONT} style={{ fill: TONES[to], x: reduce ? 0 : xFront }} />
          <motion.path
            d={LAYER_FRONT_LINE}
            fill="none"
            stroke={TONES.gold}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ x: reduce ? 0 : xFront, pathLength: reduce ? 1 : draw }}
          />
        </svg>
      </div>
    </div>
  );
}
