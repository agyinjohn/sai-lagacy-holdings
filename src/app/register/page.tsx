import { ActionRows } from '@/components/action-rows';
import { RidgeDivider } from '@/components/ridge';
import { Section } from '@/components/ui';
import { PATHWAY_LIST } from '@/content/pathways';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Join a waitlist or send an enquiry',
  description: 'Choose the registration that fits: investment enquiry, priority waitlists, serviced plots, guest updates or a partnership enquiry.',
  path: '/register',
});

export default function RegisterHub() {
  return (
    <>
      <section className="bg-mist" aria-labelledby="page-title">
        <div className="wrap pb-10 pt-[clamp(40px,6vw,80px)]">
          <p className="eyebrow mb-3 text-gold-ink">Register</p>
          <h1 id="page-title" className="display-1" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Choose your registration
          </h1>
          <p className="lede mt-5">Each one is a priority list or an enquiry for a proposed part of The Courtyard. None creates a commitment.</p>
        </div>
      </section>
      <RidgeDivider from="mist" to="paper" />
      <Section tone="paper" pad={false} className="pb-[clamp(64px,9vw,120px)] pt-4">
        <ActionRows rows={PATHWAY_LIST.map((p) => ({ title: p.title, text: p.intro, label: p.action, href: `/register/${p.slug}?from=register` }))} />
      </Section>
    </>
  );
}
