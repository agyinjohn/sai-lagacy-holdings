import type { ReactNode } from 'react';
import { Parallax } from '@/components/parallax';
import { RidgeEdge, type Tone } from '@/components/ridge';
import { ConceptPill, ImageFill } from '@/components/site-image';
import { IMAGES, type ImageId, type SiteImageConfig } from '@/content/images';

/**
 * An edge-to-edge image moment with one large line of text. Ridge-shaped edges pick up the colour of the
 * neighbouring sections so the picture appears to rise from the hills. The concept caption is always shown.
 */
export function FullBleed({
  imageId,
  children,
  topRidge,
  bottomRidge,
  objectPosition,
  align = 'left',
  className = '',
}: {
  imageId: ImageId;
  children: ReactNode;
  topRidge?: Tone;
  bottomRidge?: Tone;
  objectPosition?: string;
  align?: 'left' | 'right';
  className?: string;
}) {
  const cfg: SiteImageConfig = IMAGES[imageId];
  return (
    <section className={`on-dark relative isolate flex min-h-[78svh] items-center overflow-hidden bg-night text-white ${className}`}>
      <Parallax>
        <ImageFill id={imageId} caption={false} objectPosition={objectPosition} sizes="100vw" />
      </Parallax>
      <div aria-hidden="true" className={`absolute inset-0 z-[1] ${align === 'left' ? 'bg-gradient-to-r from-night/80 via-night/35 to-transparent' : 'bg-gradient-to-l from-night/80 via-night/35 to-transparent'}`} />
      {topRidge && <RidgeEdge edge="top" tone={topRidge} />}
      {bottomRidge && <RidgeEdge edge="bottom" tone={bottomRidge} />}
      <div className={`wrap relative z-10 py-[clamp(120px,16vw,200px)] ${align === 'right' ? 'flex justify-end text-right' : ''}`}>
        <div className="max-w-[min(100%,40rem)]">{children}</div>
      </div>
      {cfg.kind === 'ai-concept' && <ConceptPill className={`absolute z-10 ${bottomRidge ? 'bottom-[clamp(64px,9vw,130px)]' : 'bottom-3'} right-3`} />}
    </section>
  );
}
