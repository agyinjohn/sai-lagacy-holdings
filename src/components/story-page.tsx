import { CtaBand } from '@/components/cta-band';
import { OpenList } from '@/components/open-list';
import { Reveal } from '@/components/reveal';
import { RidgeDivider } from '@/components/ridge';
import { StoryHero } from '@/components/story-hero';
import { Placeholder, Section } from '@/components/ui';
import type { StoryPageContent } from '@/content/pages';

/** Inner page: a varied opening, a deep statement section, an open editorial list, then the registration call to action. */
export function StoryPage({ page }: { page: StoryPageContent }) {
  const arch = page.hero === 'arch';
  return (
    <>
      <StoryHero
        variant={page.hero}
        title={page.title}
        intro={page.intro}
        ctas={page.ctas}
        imageId={page.imageId}
        objectPosition={page.focus}
      />

      <section aria-labelledby="story-heading" className="on-dark bg-deep text-white">
        <div className={`wrap pb-[clamp(72px,10vw,130px)] ${arch ? 'pt-[clamp(150px,22vw,300px)]' : 'pt-[clamp(72px,10vw,130px)]'}`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <h2 id="story-heading" className="display-2">
                {page.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5">
                {page.body.map((p) => (
                  <p key={p} className="lede max-w-[30em] text-white">
                    {p}
                  </p>
                ))}
              </div>
              {page.note && (
                <div className="mt-6 max-w-[34em]">
                  <Placeholder onDark>{page.note}</Placeholder>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <RidgeDivider from="deep" to="paper" />

      <Section tone="paper" labelledBy="items-heading">
        <Reveal>
          <h2 id="items-heading" className="display-2 mb-12 max-w-[14em]">
            {page.itemsHeading}
          </h2>
        </Reveal>
        <Reveal>
          <OpenList items={page.items} />
        </Reveal>
      </Section>

      <CtaBand from={page.source} above="paper" />
    </>
  );
}
