import { RidgeDivider } from '@/components/ridge';
import { ActionRows } from '@/components/action-rows';
import { Placeholder, Section } from '@/components/ui';
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
        <ActionRows rows={CONTACT_OPTIONS.map((c) => ({ title: c.title, text: c.text, label: c.label, href: c.href }))} />
        <div className="mt-12 grid gap-4 md:grid-cols-[1.1fr_1.4fr] md:gap-10 md:px-4">
          <h2 className="display-3 !text-[clamp(1.45rem,2.4vw,2.1rem)]">Reach us directly</h2>
          <div className="max-w-[34em]">
            <Placeholder>{PLACEHOLDERS.contactDetails}</Placeholder>
          </div>
        </div>
      </Section>
    </>
  );
}
