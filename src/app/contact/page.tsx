import { RidgeDivider } from '@/components/ridge';
import { ButtonLink, Placeholder, Section } from '@/components/ui';
import { CONTACT_OPTIONS } from '@/content/pages';
import { PLACEHOLDERS } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Contact & Partnerships',
  description: 'Choose the option that fits and your enquiry will reach the right person: investors, strategic partners, media, cultural collaborators or general enquiries.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-mist" aria-labelledby="page-title">
        <div className="wrap pb-10 pt-[clamp(40px,6vw,80px)]">
          <p className="eyebrow mb-3 text-gold-ink">Contact</p>
          <h1 id="page-title" className="display-1" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', maxWidth: '14em' }}>
            Contact and partnerships
          </h1>
          <p className="lede mt-5">Choose the option that fits, and your enquiry will reach the right person.</p>
        </div>
      </section>
      <RidgeDivider from="mist" to="paper" />
      <Section tone="paper" pad={false} className="pb-[clamp(64px,9vw,120px)] pt-6">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_OPTIONS.map((c) => (
            <li key={c.title} className="flex flex-col rounded-[2px] border border-pale bg-white p-6">
              <h2 className="display-3">{c.title}</h2>
              <p className="mt-3 text-deep/85">{c.text}</p>
              <div className="mt-auto pt-6">
                <ButtonLink href={c.href} variant="secondary">
                  {c.label}
                </ButtonLink>
              </div>
            </li>
          ))}
          <li className="flex flex-col rounded-[2px] border border-pale bg-white p-6">
            <h2 className="display-3">Reach us directly</h2>
            <div className="mt-3">
              <Placeholder>{PLACEHOLDERS.contactDetails}</Placeholder>
            </div>
          </li>
        </ul>
      </Section>
    </>
  );
}
