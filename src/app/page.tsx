import { CourtyardMap } from '@/components/courtyard-map';
import { CtaBand } from '@/components/cta-band';
import { FullBleed } from '@/components/full-bleed';
import { Hero } from '@/components/hero';
import { SaiLogo } from '@/components/logo';
import { PullLine } from '@/components/open-list';
import { Reveal } from '@/components/reveal';
import { RidgeDivider } from '@/components/ridge';
import { SiteImage } from '@/components/site-image';
import { ButtonLink, Eyebrow, Section, TextLink } from '@/components/ui';
import { registerHref } from '@/content/links';
import { STORY_PAGES } from '@/content/pages';
import { IMAGES, type SiteImageConfig } from '@/content/images';

export default function HomePage() {
  const culture = STORY_PAGES.culture;
  const heroCfg: SiteImageConfig = IMAGES['home-hero'];
  return (
    <>
      <Hero image={heroCfg.src ? { src: heroCfg.src, alt: heroCfg.alt, concept: heroCfg.kind === 'ai-concept' } : null} />

      {/* 2. Courtyard vision story */}
      <Section tone="deep" labelledBy="story-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal>
            <Eyebrow onDark>Rooted on the Ridge</Eyebrow>
            <h2 id="story-title" className="display-2">
              Planned around an open courtyard
            </h2>
            <p className="mt-8 max-w-[30em] text-pale">
              The Courtyard by Sai is in structured pre-development, with planning, partnerships, investment engagement, and technical work
              progressing.
            </p>
            <TextLink href="/vision" onDark className="mt-4">
              Explore the vision and masterplan
            </TextLink>
          </Reveal>
          <Reveal delay={0.1} className="self-center">
            <PullLine onDark>
              In a Ghanaian compound house, daily life gathers around a shared courtyard.
            </PullLine>
            <p className="mt-8 max-w-[34em] pl-8 text-[1.125rem] text-pale">
              Our vision brings that spirit to a multi-phase destination, with culture, nature, wellness, and community at its heart.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Full-bleed moment: the landscape that informs the destination. */}
      <FullBleed imageId="vision-setting" topRidge="deep" bottomRidge="mist" objectPosition="50% 60%">
        <p className="eyebrow mb-4 text-gold-light">The Akuapem setting</p>
        <h2 className="display-1" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.25rem)' }}>
          Akuapem’s landscape will inform the destination’s character.
        </h2>
        <div className="mt-8">
          <ButtonLink href="/vision" variant="outline-light">
            See the vision
          </ButtonLink>
        </div>
      </FullBleed>

      {/* 3. Culture */}
      <Section tone="mist" labelledBy="culture-title">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Culture</Eyebrow>
            <h2 id="culture-title" className="display-2">
              Culture is the foundation
            </h2>
            <p className="lede mt-6">
              Ghanaian creativity will shape how The Courtyard looks, feels, and welcomes people. Guests, residents, and neighbours will be invited
              to make, taste, listen, and take part.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/culture">Discover culture and experiences</ButtonLink>
              <ButtonLink href={registerHref('guest-updates', 'home', 'Culture and experiences')} variant="secondary">
                Get guest updates
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {['Ghanaian arts', 'Music', 'Gastronomy', 'Heritage', 'Creative workshops', 'Community engagement'].map((t, i) => (
                <li key={t} className="border-t border-gold py-6">
                  <span className="font-heading text-[2rem] leading-none text-gold-ink">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display-3 mt-3 block">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="mt-14 lg:mt-20">
          <SiteImage id={culture.imageId} ratio="aspect-[3/2] md:aspect-[2/1]" sizes="(min-width: 1296px) 1152px, 100vw" />
        </Reveal>
      </Section>

      <RidgeDivider from="mist" to="paper" flip />

      {/* 4. Interactive courtyard map */}
      <Section tone="paper" labelledBy="map-title">
        <Reveal className="mb-12 max-w-2xl">
          <Eyebrow>The destination</Eyebrow>
          <h2 id="map-title" className="display-2">
            Find your place at The Courtyard
          </h2>
          <p className="lede mt-5">
            Each part of the proposed destination opens onto the same shared space. Choose where you would like to begin.
          </p>
        </Reveal>
        <CourtyardMap />
      </Section>

      <RidgeDivider from="paper" to="mist" />

      {/* 5. Investment */}
      <Section tone="mist" labelledBy="invest-title">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Investment</Eyebrow>
            <h2 id="invest-title" className="display-2">
              Invest in what comes next
            </h2>
            <p className="lede mt-6">
              Sai Legacy Holdings welcomes enquiries about the proposed Legacy Unit and wider development partnerships.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/investment">Explore the Legacy Unit</ButtonLink>
              <ButtonLink href={registerHref('legacy-unit', 'home-invest')} variant="secondary">
                Request investor information
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SaiLogo />
          </Reveal>
        </div>
      </Section>

      {/* Full-bleed moment: the developer's tagline, then the final registration call to action. */}
      <FullBleed imageId="investment-feature" topRidge="mist" bottomRidge="deep" objectPosition="50% 55%" align="right" className="min-h-[70svh]">
        <h2 className="display-1" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.25rem)' }}>
          Rooted in Africa. Building for Generations.
        </h2>
        <p className="mt-5 text-mist">Sai Legacy Holdings</p>
      </FullBleed>

      {/* 6. Final registration call to action */}
      <CtaBand from="home-cta" divider={false} />
    </>
  );
}
