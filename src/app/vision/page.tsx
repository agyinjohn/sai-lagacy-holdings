import { CtaBand } from '@/components/cta-band';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { RidgeDivider } from '@/components/ridge';
import { SiteImage } from '@/components/site-image';
import { Eyebrow, Placeholder, Section, TextLink } from '@/components/ui';
import { VISION } from '@/content/pages';
import { DIAGRAM_NOTE } from '@/content/site';
import { MAP_ROOMS } from '@/content/map';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Our Vision & Masterplan',
  description:
    'The Courtyard by Sai is a proposed 80-acre, multi-phase cultural, wellness and lifestyle destination in Akuapem, Ghana’s Eastern Region.',
  path: '/vision',
});

export default function VisionPage() {
  return (
    <>
      <PageHero title={VISION.title} intro={VISION.intro} mood="dawn" eyebrow="Our vision and masterplan" />

      <Section tone="deep" labelledBy="philosophy">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 id="philosophy" className="display-2">
              {VISION.philosophy.heading}
            </h2>
            <div className="mt-6 space-y-5 text-[1.125rem]">
              {VISION.philosophy.body.map((p) => (
                <p key={p} className="max-w-[34em]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <figure>
              <div className="overflow-hidden rounded-[2px] bg-mist p-4 sm:p-6">
                <ConceptDiagram />
              </div>
              <figcaption className="mt-2 text-sm text-pale">{DIAGRAM_NOTE}</figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      <RidgeDivider from="deep" to="paper" />

      <Section tone="paper" labelledBy="concept-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>The idea</Eyebrow>
            <h2 id="concept-title" className="display-2">
              {VISION.concept.heading}
            </h2>
            <div className="mt-6 space-y-5">
              {VISION.concept.body.map((p) => (
                <p key={p} className="max-w-[34em]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="display-3 mb-4">Components planned around the courtyard</h3>
            <ul className="divide-y divide-pale border-y border-pale">
              {MAP_ROOMS.filter((r) => ['culture', 'hospitality', 'wellness', 'later-life', 'plots', 'investment'].includes(r.id)).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3">
                  <span>{r.title}</span>
                  <TextLink href={r.explore.href}>{r.explore.label}</TextLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <RidgeDivider from="paper" to="mist" />

      <Section tone="mist" labelledBy="setting-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 id="setting-title" className="display-2">
              {VISION.setting.heading}
            </h2>
            <p className="mt-6 max-w-[34em]">{VISION.setting.body[0]}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-2">{VISION.phased.heading}</h2>
            <p className="mt-6 max-w-[34em]">{VISION.phased.body[0]}</p>
            <div className="mt-6 max-w-[34em]">
              <Placeholder>{VISION.phased.placeholder}</Placeholder>
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-14 lg:mt-20">
          <SiteImage id="vision-setting" ratio="aspect-[3/2] md:aspect-[2.2/1]" sizes="(min-width: 1296px) 1152px, 100vw" />
        </Reveal>
      </Section>

      <CtaBand from="vision" above="mist" />
    </>
  );
}

/** Abstract plan of a courtyard surrounded by rooms. Not a site layout. */
function ConceptDiagram() {
  return (
    <svg viewBox="0 0 480 360" role="img" aria-label="Abstract diagram: eight spaces arranged around an open central courtyard" className="h-auto w-full">
      <rect width="480" height="360" fill="var(--color-mist)" />
      {[
        [20, 20], [170, 20], [320, 20],
        [20, 130], [320, 130],
        [20, 240], [170, 240], [320, 240],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="140" height="100" rx="2" fill={i % 2 ? 'var(--color-pale)' : 'var(--color-sage)'} />
      ))}
      <rect x="170" y="130" width="140" height="100" fill="var(--color-deep)" />
      <circle cx="240" cy="180" r="22" fill="var(--color-gold-light)" />
      <circle cx="240" cy="180" r="36" fill="none" stroke="var(--color-gold-light)" strokeOpacity="0.5" />
    </svg>
  );
}


