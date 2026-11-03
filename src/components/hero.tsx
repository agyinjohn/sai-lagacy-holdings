'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { GOLD_LINES, RIDGE_PATHS, RIDGE_VIEWBOX, TONES, type Tone } from '@/components/ridge';
import { ButtonLink, TextLink } from '@/components/ui';
import { CONCEPT_CAPTION, CONCEPT_ILLUSTRATION_NOTE } from '@/content/site';

// Back to front. A touch of parallax makes the ridges feel layered. Disabled for reduced motion.
const LAYERS: { d: string; fill: Tone; travel: number }[] = [
  { d: RIDGE_PATHS[0], fill: 'pale', travel: 90 },
  { d: RIDGE_PATHS[1], fill: 'sage', travel: 56 },
  { d: RIDGE_PATHS[2], fill: 'mid', travel: 28 },
  { d: RIDGE_PATHS[3], fill: 'deep', travel: 0 },
];

export interface HeroImage {
  src: string;
  alt: string;
  /** True for AI-generated concept images: the concept caption is then always shown. */
  concept: boolean;
}

export function Hero({ image }: { image?: HeroImage | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const l0 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : LAYERS[0]!.travel]);
  const l1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : LAYERS[1]!.travel]);
  const l2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : LAYERS[2]!.travel]);
  const ys = [l0, l1, l2, undefined];

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="on-dark relative isolate -mt-[64px] flex min-h-[100svh] flex-col overflow-hidden bg-deep text-white"
      style={{ background: 'linear-gradient(180deg, #0e2e21 0%, #123b2a 34%, #2c5a45 66%, #7ca088 100%)' }}
    >
      {image && (
        <>
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="z-0 object-cover object-[78%_35%] md:object-[50%_30%]" />
          {/* Keeps white text readable on any photograph: strong on the text side, lighter where the sky shows. */}
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-r from-night/90 via-night/70 to-night/50 md:via-night/45 md:to-night/10" />
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-b from-night/70 via-transparent to-transparent" style={{ backgroundSize: '100% 45%', backgroundRepeat: 'no-repeat' }} />
        </>
      )}

      {/* Sun and glow (the drawn sun is replaced by the image when one is supplied) */}
      <motion.div
        aria-hidden="true"
        style={{ y: sunY, bottom: 'clamp(120px, 24svh, 260px)' }}
        hidden={!!image}
        className="pointer-events-none absolute right-[9%] z-0 aspect-square w-[clamp(96px,15vw,210px)] rounded-full"
      >
        <div className="absolute -inset-[60%] rounded-full bg-[radial-gradient(circle,rgba(217,178,103,0.38)_0%,rgba(217,178,103,0)_62%)]" />
        <div className="absolute inset-0 rounded-full bg-gold-light" />
      </motion.div>

      {/* Ridges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]" style={{ height: 'clamp(190px, 28svh, 320px)' }}>
        {LAYERS.map((layer, i) => (
          <motion.svg
            key={i}
            viewBox={RIDGE_VIEWBOX}
            preserveAspectRatio="xMidYMax slice"
            focusable="false"
            className="absolute inset-0 h-full w-full"
            style={ys[i] ? { y: ys[i] } : undefined}
          >
            <path d={layer.d} fill={TONES[layer.fill]} />
            {i === 3 &&
              GOLD_LINES.map((d, j) => (
                <path key={j} d={d} fill="none" stroke={TONES.goldLight} strokeOpacity={j === 0 ? 0.45 : 0.3} />
              ))}
          </motion.svg>
        ))}
      </div>

      <div className="wrap relative z-10 flex flex-1 flex-col justify-start pb-[clamp(210px,31svh,340px)] pt-[clamp(104px,17svh,170px)]">
        <p className="eyebrow mb-5 text-gold-light">A proposed 80-acre destination in Akuapem</p>
        <h1 id="hero-title" className="display-1 max-w-[11.5em]" style={{ fontSize: 'clamp(2.5rem, min(6.4vw, 11svh), 5.75rem)' }}>
          Ghana’s next cultural and wellness destination
        </h1>
        <p className="lede mt-6 text-mist">
          Bringing together hospitality, African arts and culture, gastronomy, nature, wellness and later-life living, planned around a shared open courtyard.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <ButtonLink href="/vision" variant="gold">
            Explore the destination
          </ButtonLink>
          <ButtonLink href="/investment" variant="outline-light">
            View the investment opportunity
          </ButtonLink>
          <TextLink href="/register" onDark className="px-1">
            Join a waitlist
          </TextLink>
        </div>
      </div>

      <p className="absolute bottom-2.5 left-[clamp(20px,5vw,72px)] right-[clamp(20px,5vw,72px)] z-10 text-right text-[0.8125rem] text-mist">{image?.concept ? CONCEPT_CAPTION : CONCEPT_ILLUSTRATION_NOTE}</p>
    </section>
  );
}
