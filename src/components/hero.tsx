'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { TONES, type Tone } from '@/components/ridge';
import { ButtonLink, TextLink } from '@/components/ui';
import { CONCEPT_CAPTION, CONCEPT_ILLUSTRATION_NOTE } from '@/content/site';

export interface HeroImage {
  src: string;
  alt: string;
  /** True for AI-generated concept images: the concept caption is then always shown. */
  concept: boolean;
}

// Four ridges drawn for the hero band (viewBox 1440 x 360), back to front. Every curve sits inside the
// band, so there are no hard edges. Over a photograph they become layers of atmosphere: the far hills are a
// light veil of deep green and the near hills are solid, so photo and illustration read as one place.
// Without a photograph they are the full-colour illustration.
const HERO_VIEWBOX = '0 0 1440 360';
const LAYERS: { d: string; fill: Tone; veil: number; travel: number }[] = [
  { d: 'M0 74 C200 32 380 92 620 56 C860 20 1060 82 1240 46 C1340 28 1400 40 1440 30', fill: 'pale', veil: 0.2, travel: 90 },
  { d: 'M0 146 C240 104 420 164 680 124 C940 84 1160 154 1440 108', fill: 'sage', veil: 0.4, travel: 56 },
  { d: 'M0 220 C260 176 500 240 760 200 C1000 164 1220 224 1440 184', fill: 'mid', veil: 0.66, travel: 28 },
  { d: 'M0 288 C240 248 480 304 740 272 C980 242 1200 298 1440 258', fill: 'deep', veil: 1, travel: 0 },
];
const closed = (d: string) => `${d} L1440 360 L0 360Z`;

export function Hero({ image }: { image?: HeroImage | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
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
          <motion.div aria-hidden={false} style={{ y: photoY }} className="absolute inset-x-0 inset-y-[-6%] z-0">
            <div className="kenburns absolute inset-0">
              <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover object-[78%_35%] md:object-[50%_30%]" />
            </div>
          </motion.div>
          {/* Keeps white text readable on any photograph: strong on the text side, lighter where the sky shows. */}
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-r from-night/90 via-night/70 to-night/50 md:via-night/45 md:to-night/10" />
          <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-b from-night/70 via-transparent to-transparent" style={{ backgroundSize: '100% 45%', backgroundRepeat: 'no-repeat' }} />
        </>
      )}

      {/* The drawn sun belongs to the illustration, so it is replaced by the photograph's own light when one is supplied. */}
      {!image && (
        <motion.div
          aria-hidden="true"
          style={{ y: sunY, bottom: 'clamp(120px, 24svh, 260px)' }}
          className="pointer-events-none absolute right-[9%] z-0 aspect-square w-[clamp(96px,15vw,210px)] rounded-full"
        >
          <div className="absolute -inset-[60%] rounded-full bg-[radial-gradient(circle,rgba(217,178,103,0.38)_0%,rgba(217,178,103,0)_62%)]" />
          <div className="absolute inset-0 rounded-full bg-gold-light" />
        </motion.div>
      )}

      {/* Ridges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]" style={{ height: 'clamp(210px, 32svh, 360px)' }}>
        {LAYERS.map((layer, i) => (
          <motion.svg key={i} viewBox={HERO_VIEWBOX} preserveAspectRatio="none" focusable="false" className="absolute inset-0 h-full w-full" style={ys[i] ? { y: ys[i] } : undefined}>
            <path d={closed(layer.d)} fill={image ? TONES.deep : TONES[layer.fill]} fillOpacity={image ? layer.veil : 1} />
            <path d={layer.d} fill="none" stroke={TONES.goldLight} strokeOpacity={image ? 0.14 + i * 0.1 : 0.2 + i * 0.1} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </motion.svg>
        ))}
      </div>

      <motion.div style={{ y: textY }} className="wrap relative z-10 flex flex-1 flex-col justify-start pb-[clamp(230px,34svh,380px)] pt-[clamp(104px,17svh,170px)]">
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
      </motion.div>

      <p className="absolute bottom-2.5 left-[clamp(20px,5vw,72px)] right-[clamp(20px,5vw,72px)] z-10 text-right text-[0.8125rem] text-mist">
        {image?.concept ? CONCEPT_CAPTION : CONCEPT_ILLUSTRATION_NOTE}
      </p>
    </section>
  );
}
