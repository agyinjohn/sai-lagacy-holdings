import { CtaBand } from '@/components/cta-band';
import { PageHero } from '@/components/page-hero';
import { RidgeDivider } from '@/components/ridge';
import { Reveal } from '@/components/reveal';
import { SiteImage } from '@/components/site-image';
import { Card, Placeholder, Section } from '@/components/ui';
import type { StoryPageContent } from '@/content/pages';

export function StoryPage({ page }: { page: StoryPageContent }) {
  return (
    <>
      <PageHero title={page.title} intro={page.intro} ctas={page.ctas} mood={page.mood} />

      <Section tone="deep" labelledBy="story-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <h2 id="story-heading" className="display-2">
              {page.heading}
            </h2>
            <div className="mt-6 space-y-5 text-[1.125rem]">
              {page.body.map((p) => (
                <p key={p} className="max-w-[34em]">
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
          <Reveal delay={0.1}>
            <SiteImage id={page.imageId} />
          </Reveal>
        </div>
      </Section>

      <RidgeDivider from="deep" to="paper" />

      <Section tone="paper" labelledBy="items-heading">
        <Reveal>
          <h2 id="items-heading" className="display-3 mb-8 !text-[1.9rem]">
            {page.itemsHeading}
          </h2>
        </Reveal>
        <ul className="flex flex-wrap gap-5">
          {page.items.map((item, i) => (
            <li key={item.title} className="min-w-[min(100%,280px)] flex-[1_1_calc((100%-2.5rem)/3)]">
              <Reveal delay={Math.min(i, 5) * 0.05} className="h-full">
                <Card className="h-full !p-6">
                  <h3 className="display-3">{item.title}</h3>
                  <p className="mt-3 text-deep/85">{item.description}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand from={page.source} above="paper" />
    </>
  );
}
