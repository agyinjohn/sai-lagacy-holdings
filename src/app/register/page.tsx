import Link from 'next/link';
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
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PATHWAY_LIST.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/register/${p.slug}?from=register`}
                className="group flex h-full flex-col rounded-[2px] border border-pale bg-white p-6 transition hover:border-gold hover:shadow-[0_10px_30px_-14px_rgba(18,59,42,0.35)]"
              >
                <span className="display-3">{p.title}</span>
                <span className="mt-3 text-deep/85">{p.intro}</span>
                <span className="mt-6 font-medium text-gold-ink underline underline-offset-4 group-hover:text-deep">{p.action}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
