import type { ReactNode } from 'react';
import { MOODS, RidgeScene, TONES } from '@/components/ridge';
import { ButtonLink } from '@/components/ui';
import type { Cta, RidgeMood } from '@/content/pages';
import { CONCEPT_ILLUSTRATION_NOTE } from '@/content/site';


/** Opening block for inner pages: title, intro, calls to action and a layered ridge band that flows into the next (deep) section. */
export function PageHero({
  title,
  intro,
  ctas,
  mood,
  eyebrow,
  children,
}: {
  title: string;
  intro: string;
  ctas?: readonly Cta[];
  mood: RidgeMood;
  eyebrow?: string;
  children?: ReactNode;
}) {
  const m = MOODS[mood];
  return (
    <section aria-labelledby="page-title" style={{ background: TONES[m.ground] }} className="relative text-deep">
      <div className="wrap pb-6 pt-[clamp(48px,8vw,104px)]">
        {eyebrow && <p className="eyebrow mb-4 text-gold-ink">{eyebrow}</p>}
        <h1 id="page-title" className="display-1 max-w-[12em]" style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
          {title}
        </h1>
        <p className="lede mt-6">{intro}</p>
        {ctas && ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {ctas.map((c) => (
              <ButtonLink key={c.href + c.label} href={c.href} variant={c.variant}>
                {c.label}
              </ButtonLink>
            ))}
          </div>
        )}
        {children}
      </div>
      <div className="relative">
        <RidgeScene mood={mood} className="block w-full" style={{ height: 'clamp(150px, 24vw, 320px)' }} />
        <p className="absolute bottom-2 right-[clamp(20px,5vw,72px)] text-[0.8125rem] text-mist">{CONCEPT_ILLUSTRATION_NOTE}</p>
      </div>
    </section>
  );
}
