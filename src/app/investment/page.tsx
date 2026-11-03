import { PageHero } from '@/components/page-hero';
import { SaiLogo } from '@/components/logo';
import { Reveal } from '@/components/reveal';
import { RidgeDivider } from '@/components/ridge';
import { SiteImage } from '@/components/site-image';
import { ButtonLink, Eyebrow, Placeholder, Section } from '@/components/ui';
import { registerHref } from '@/content/links';
import { INVESTMENT } from '@/content/pages';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Investment Opportunities: The Legacy Unit',
  description: 'Sai Legacy Holdings welcomes enquiries about the proposed Legacy Unit and wider development partnerships at The Courtyard by Sai.',
  path: '/investment',
});

export default function InvestmentPage() {
  return (
    <>
      <PageHero
        title={INVESTMENT.title}
        intro={INVESTMENT.intro}
        mood="mist"
        eyebrow="Investment"
        ctas={[{ label: 'Request investor information', href: registerHref('legacy-unit', 'investment'), variant: 'primary' }]}
      />

      <Section tone="deep" labelledBy="overview-title">
        <Reveal>
          <h2 id="overview-title" className="display-2 mb-10">
            Investment overview
          </h2>
        </Reveal>
        <div className="grid gap-x-12 gap-y-2 md:grid-cols-3">
          {INVESTMENT.overview.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.07} className="h-full">
              <div className="h-full border-t border-gold-light/70 pb-8 pt-6">
                <span aria-hidden="true" className="block font-heading text-[2.75rem] leading-none text-gold-light">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display-3 mt-4">{o.title}</h3>
                <p className="mt-3 max-w-[26em] text-pale">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <SaiLogo className="flex items-center lg:aspect-[16/9]" />
          <SiteImage id="investment-feature" />
        </div>
      </Section>

      <RidgeDivider from="deep" to="paper" />

      <Section tone="paper" labelledBy="legacy-title">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>The Legacy Unit</Eyebrow>
            <h2 id="legacy-title" className="display-2">
              Overview and legal disclaimer
            </h2>
            <div className="mt-6 max-w-[34em]">
              <Placeholder>{INVESTMENT.placeholder}</Placeholder>
            </div>
            <p className="mt-5 max-w-[34em] text-deep/85">{INVESTMENT.notice}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-2">{INVESTMENT.direct.heading}</h2>
            <p className="mt-6 max-w-[34em]">{INVESTMENT.direct.body}</p>
            <div className="mt-8">
              <ButtonLink href={registerHref('legacy-unit', 'investment')}>Start an investor enquiry</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
