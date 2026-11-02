import { PageHero } from '@/components/page-hero';
import { SaiLogo } from '@/components/logo';
import { Reveal } from '@/components/reveal';
import { RidgeDivider } from '@/components/ridge';
import { SiteImage } from '@/components/site-image';
import { ButtonLink, Card, Eyebrow, Placeholder, Section } from '@/components/ui';
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
        <div className="grid gap-5 md:grid-cols-3">
          {INVESTMENT.overview.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.07} className="h-full">
              <Card className="h-full text-deep">
                <h3 className="display-3">{o.title}</h3>
                <p className="mt-3">{o.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SaiLogo />
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
