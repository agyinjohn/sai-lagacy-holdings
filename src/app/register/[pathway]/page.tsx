import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RegistrationForm } from '@/components/registration-form';
import { RidgeDivider } from '@/components/ridge';
import { Section } from '@/components/ui';
import { PATHWAY_LIST, PATHWAYS, isPathwaySlug } from '@/content/pathways';
import { isSourceKey } from '@/content/sources';
import { pageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

type Props = { params: Promise<{ pathway: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pathway } = await params;
  if (!isPathwaySlug(pathway)) return {};
  const cfg = PATHWAYS[pathway];
  return pageMetadata({ title: cfg.title, description: cfg.intro, path: `/register/${pathway}` });
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function RegisterPathwayPage({ params, searchParams }: Props) {
  const { pathway } = await params;
  if (!isPathwaySlug(pathway)) notFound();
  const cfg = PATHWAYS[pathway];
  const sp = await searchParams;
  const from = first(sp.from);
  const source = isSourceKey(from) ? from : 'direct';
  const detail = first(sp.detail);

  return (
    <>
      <section className="bg-mist" aria-labelledby="page-title">
        <div className="wrap pb-10 pt-[clamp(40px,6vw,80px)]">
          <p className="eyebrow mb-3 text-gold-ink">Registration</p>
          <h1 id="page-title" className="display-1" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)', maxWidth: '16em' }}>
            {cfg.title}
          </h1>
          <p className="lede mt-5">{cfg.intro}</p>
        </div>
      </section>
      <RidgeDivider from="mist" to="paper" />
      <Section tone="paper" pad={false} className="pb-[clamp(64px,9vw,120px)] pt-6">
        <div className="grid items-start gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
          <nav aria-label="Choose a registration" className="lg:sticky lg:top-24">
            <h2 className="display-3 mb-3">Other registrations</h2>
            <ul className="flex flex-col">
              {PATHWAY_LIST.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/register/${p.slug}?from=${source}`}
                    aria-current={p.slug === pathway ? 'page' : undefined}
                    className="flex min-h-11 items-center border-l-2 border-pale py-1 pl-4 hover:border-gold aria-[current=page]:border-deep aria-[current=page]:font-semibold"
                  >
                    {p.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <RegistrationForm key={pathway} pathway={pathway} source={source} initialDetail={detail} />
        </div>
      </Section>
    </>
  );
}
