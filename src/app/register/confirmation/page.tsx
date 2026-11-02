import { ButtonLink, Section } from '@/components/ui';
import { RidgeDivider } from '@/components/ridge';
import { PATHWAYS, isPathwaySlug } from '@/content/pathways';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Registration received',
  description: 'Thank you. Your registration has been received.',
  path: '/register/confirmation',
  noindex: true,
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ConfirmationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pathway = first(sp.pathway);
  const ref = first(sp.ref);
  const cfg = isPathwaySlug(pathway) ? PATHWAYS[pathway] : null;
  // Only ever echo a reference in our own format.
  const safeRef = ref && /^CBS-[A-Z0-9]{8}$/.test(ref) ? ref : null;

  return (
    <>
      <section className="bg-mist" aria-labelledby="page-title">
        <div className="wrap pb-10 pt-[clamp(40px,6vw,80px)]">
          <p className="eyebrow mb-3 text-gold-ink">Registration received</p>
          <h1 id="page-title" tabIndex={-1} className="display-1" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Thank you
          </h1>
          <p className="lede mt-5" role="status">
            {cfg ? cfg.thanks : 'Your registration has been received.'}
          </p>
          {safeRef && (
            <p className="mt-4">
              Your reference is <strong className="font-semibold tracking-wide">{safeRef}</strong>. Please quote it if you contact us.
            </p>
          )}
        </div>
      </section>
      <RidgeDivider from="mist" to="paper" />
      <Section tone="paper" pad={false} className="pb-[clamp(64px,9vw,120px)] pt-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="display-3 mb-4">What happens in this prototype</h2>
            <ol className="list-decimal space-y-3 pl-5">
              <li>Your details are stored privately for the demonstration. No real email is sent to you or to the team.</li>
              <li>On a live website, you would receive an automatic acknowledgement by email.</li>
              <li>On a live website, the team would be notified and the registration would appear in the team view and its worksheet.</li>
            </ol>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/register" variant="secondary">
              Make another registration
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
