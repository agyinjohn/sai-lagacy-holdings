import Image from 'next/image';
import { IMAGES, type ImageId, type ImageTone, type SiteImageConfig } from '@/content/images';
import { CONCEPT_CAPTION } from '@/content/site';
import { TONES, RIDGE_PATHS, RIDGE_VIEWBOX, GOLD_LINES, type Tone } from '@/components/ridge';

const TONE_LAYERS: Record<ImageTone, { sky: Tone; layers: [Tone, Tone, Tone, Tone] }> = {
  dawn: { sky: 'mist', layers: ['pale', 'sage', 'mid', 'deep'] },
  sage: { sky: 'paper', layers: ['pale', 'sage', 'mid', 'deep'] },
  gold: { sky: 'mist', layers: ['pale', 'goldLight', 'mid', 'deep'] },
  deep: { sky: 'pale', layers: ['sage', 'mid', 'deep', 'night'] },
  mist: { sky: 'paper', layers: ['softSage', 'pale', 'sage', 'mid'] },
};

/**
 * Renders an image from the central config (src/content/images.ts).
 *  - No src: a tasteful ridge placeholder that states what is needed.
 *  - AI-generated concept: the concept caption is ALWAYS rendered, in the image and as text.
 */
export function SiteImage({
  id,
  priority = false,
  className = '',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  ratio,
}: {
  id: ImageId;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** Tailwind aspect classes that override the configured shape, for example 'aspect-[3/2] md:aspect-[2/1]'. */
  ratio?: string;
}) {
  const cfg: SiteImageConfig = IMAGES[id];
  const configured = { '16/9': 'aspect-[16/9]', '4/3': 'aspect-[4/3]', '3/2': 'aspect-[3/2]', '4/5': 'aspect-[4/5]', '21/9': 'aspect-[21/9]' }[cfg.aspect];
  const aspect = ratio ?? configured;
  const isConcept = cfg.kind === 'ai-concept';
  const t = TONE_LAYERS[cfg.tone];

  return (
    <figure className={className}>
      <div className={`relative w-full overflow-hidden rounded-[2px] ${aspect}`} style={{ background: TONES[t.sky] }}>
        {cfg.src ? (
          <Image src={cfg.src} alt={cfg.alt} fill sizes={sizes} priority={priority} className="object-cover" />
        ) : (
          <>
            <svg viewBox={RIDGE_VIEWBOX} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full">
              <circle cx="1100" cy="150" r="80" fill={TONES.goldLight} />
              {RIDGE_PATHS.map((d, i) => (
                <path key={i} d={d} fill={TONES[t.layers[i] as Tone]} />
              ))}
              {GOLD_LINES.map((d, i) => (
                <path key={i} d={d} fill="none" stroke={TONES.goldLight} strokeOpacity="0.4" />
              ))}
            </svg>
            <span className="absolute left-3 top-3 rounded-[2px] bg-white/85 px-2.5 py-1 text-xs font-semibold text-deep">
              [Image to be supplied]
            </span>
          </>
        )}
        {isConcept && (
          <span className="absolute inset-x-0 bottom-0 bg-night/85 px-3 py-2 text-xs text-white">{CONCEPT_CAPTION}</span>
        )}
      </div>
      <figcaption className="mt-2 text-sm text-deep/75">
        {isConcept ? cfg.alt : cfg.src ? cfg.alt : cfg.brief}
      </figcaption>
    </figure>
  );
}
