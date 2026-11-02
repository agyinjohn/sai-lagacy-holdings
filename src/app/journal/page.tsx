import { JournalList } from '@/components/journal-list';
import { RidgeDivider } from '@/components/ridge';
import { Section } from '@/components/ui';
import { JOURNAL_CATEGORIES, type JournalCategory } from '@/content/journal';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Journal & Development Updates',
  description: 'Project progress, announcements, cultural stories, wellness insights, tourism commentary and media coverage.',
  path: '/journal',
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function JournalPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const initial = (JOURNAL_CATEGORIES as readonly string[]).includes(raw ?? '') ? (raw as JournalCategory) : 'All';

  return (
    <>
      <section className="bg-mist" aria-labelledby="page-title">
        <div className="wrap pb-10 pt-[clamp(40px,6vw,80px)]">
          <p className="eyebrow mb-3 text-gold-ink">Journal</p>
          <h1 id="page-title" className="display-1" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', maxWidth: '14em' }}>
            Journal and development updates
          </h1>
          <p className="lede mt-5">Project progress, announcements, cultural stories, wellness insights, tourism commentary, and media coverage.</p>
        </div>
      </section>
      <RidgeDivider from="mist" to="paper" />
      <Section tone="paper" pad={false} className="pb-[clamp(64px,9vw,120px)] pt-6">
        <JournalList initial={initial} />
      </Section>
    </>
  );
}
