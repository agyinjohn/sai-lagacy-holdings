import type { ReactNode } from 'react';
import { Parallax } from '@/components/parallax';
import { RidgeEdge } from '@/components/ridge';
import { ConceptPill, ImageFill } from '@/components/site-image';
import { ButtonLink } from '@/components/ui';
import { IMAGES, type ImageId, type SiteImageConfig } from '@/content/images';
import type { Cta } from '@/content/pages';

export type HeroVariant = 'split' | 'split-reverse' | 'full' | 'arch';

function Actions({ ctas, onDark }: { ctas: readonly Cta[]; onDark?: boolean }) {
  if (!ctas.length) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {ctas.map((c) => (
        <ButtonLink key={c.href + c.label} href={c.href} variant={onDark ? (c.variant === 'primary' ? 'gold' : 'outline-light') : c.variant}>
          {c.label}
        </ButtonLink>
      ))}
    </div>
  );
}

function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 id="page-title" className={`display-1 ${className}`} style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.75rem)' }}>
      {children}
    </h1>
  );
}

/**
 * The opening of an inner page. Four treatments keep the pages from feeling like one template:
 *  - split / split-reverse: text beside an image whose top edge follows a ridge line
 *  - full: a full-bleed photograph with the title set low, ridges softening into the next section
 *  - arch: centred title, with the image in an arch that rises over the next section
 * Every variant ends in (or overlaps) the deep section that follows.
 */
export function StoryHero({
  variant,
  title,
  intro,
  ctas,
  imageId,
  objectPosition,
}: {
  variant: HeroVariant;
  title: string;
  intro: string;
  ctas: readonly Cta[];
  imageId: ImageId;
  objectPosition?: string;
}) {
  const cfg: SiteImageConfig = IMAGES[imageId];
  const concept = cfg.kind === 'ai-concept';

  if (variant === 'full') {
    return (
      <section aria-labelledby="page-title" className="on-dark relative isolate flex min-h-[86svh] items-end overflow-hidden bg-night text-white">
        <Parallax>
          <ImageFill id={imageId} caption={false} objectPosition={objectPosition} priority sizes="100vw" />
        </Parallax>
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-gradient-to-t from-night/90 via-night/55 to-night/20" />
        <RidgeEdge edge="bottom" tone="deep" />
        <div className="wrap relative z-10 pb-[clamp(110px,15vw,200px)] pt-[clamp(120px,16vw,200px)]">
          <Title className="max-w-[12em]">{title}</Title>
          <p className="lede mt-6 text-mist">{intro}</p>
          <Actions ctas={ctas} onDark />
        </div>
        {concept && <ConceptPill className="absolute bottom-[clamp(64px,9vw,130px)] right-3 z-10" />}
      </section>
    );
  }

  if (variant === 'arch') {
    return (
      <section
        aria-labelledby="page-title"
        className="relative z-10 text-deep"
        // The paper background stops where the arch begins to overlap the next section, so the arch rises into the green.
        style={{ background: 'linear-gradient(to bottom, var(--color-paper) calc(100% - clamp(70px, 11vw, 160px)), transparent 0)' }}
      >
        <div className="wrap pt-[clamp(48px,8vw,104px)] text-center">
          <Title className="mx-auto max-w-[13em]">{title}</Title>
          <p className="lede mx-auto mt-6 text-center">{intro}</p>
          <div className="flex justify-center">
            <Actions ctas={ctas} />
          </div>
        </div>
        <div className="relative z-10 mx-auto mb-[calc(-1*clamp(70px,11vw,160px))] mt-12 aspect-[3/4] w-[min(88%,440px)] overflow-hidden shadow-[0_40px_80px_-40px_rgba(14,46,33,0.7)]" style={{ borderRadius: '999px 999px 0 0' }}>
          <ImageFill id={imageId} caption={false} objectPosition={objectPosition} priority sizes="(min-width: 640px) 440px, 90vw" />
          {concept && <ConceptPill className="absolute bottom-3 left-1/2 w-[min(92%,24rem)] -translate-x-1/2 justify-center" />}
        </div>
      </section>
    );
  }

  // split and split-reverse
  const reverse = variant === 'split-reverse';
  const clipId = reverse ? 'ridge-clip-reverse' : 'ridge-clip';
  return (
    <section aria-labelledby="page-title" className="bg-mist text-deep">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <clipPath id="ridge-clip" clipPathUnits="objectBoundingBox">
            <path d="M0 0.1 C0.18 0.02 0.36 0.13 0.54 0.065 C0.72 0 0.88 0.07 1 0.03 L1 1 L0 1Z" />
          </clipPath>
          <clipPath id="ridge-clip-reverse" clipPathUnits="objectBoundingBox">
            <path d="M1 0.1 C0.82 0.02 0.64 0.13 0.46 0.065 C0.28 0 0.12 0.07 0 0.03 L0 1 L1 1Z" />
          </clipPath>
        </defs>
      </svg>
      <div className={`wrap grid items-end gap-10 pt-[clamp(48px,8vw,104px)] lg:gap-16 ${reverse ? 'lg:grid-cols-[0.95fr_1.05fr]' : 'lg:grid-cols-[1.05fr_0.95fr]'}`}>
        <div className={`pb-4 lg:pb-[clamp(56px,8vw,110px)] ${reverse ? 'lg:order-2' : ''}`}>
          <Title>{title}</Title>
          <p className="lede mt-6">{intro}</p>
          <Actions ctas={ctas} />
        </div>
        <div className={`relative aspect-[4/3] w-full lg:aspect-[4/5] ${reverse ? 'lg:order-1' : ''}`} style={{ clipPath: `url(#${clipId})` }}>
          <ImageFill id={imageId} caption={false} objectPosition={objectPosition} priority sizes="(min-width: 1024px) 560px, 100vw" />
          {concept && <ConceptPill className="absolute bottom-3 left-3" />}
        </div>
      </div>
    </section>
  );
}
