import { ButtonLink } from '@/components/ui';
import { RidgeDivider } from '@/components/ridge';
import { registerHref } from '@/content/links';
import type { SourceKey } from '@/content/sources';
import type { Tone } from '@/components/ridge';

/** Final registration call to action. Shown on the homepage and, in a lighter form, on inner pages. */
export function CtaBand({
  from,
  above = 'paper',
  heading = 'Be among the first to hear how The Courtyard takes shape',
  body = 'Choose the registration that fits. Each one is a priority list or an enquiry, with no commitment on either side.',
}: {
  from: SourceKey;
  above?: Tone;
  heading?: string;
  body?: string;
}) {
  return (
    <>
      <RidgeDivider from={above} to="deep" />
      <section aria-labelledby="cta-title" className="on-dark bg-deep text-white">
        <div className="wrap section-pad grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h2 id="cta-title" className="display-2">
              {heading}
            </h2>
            <p className="lede mt-5 text-pale">{body}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <ButtonLink href={registerHref('guest-updates', from)} variant="gold">
              Get guest updates
            </ButtonLink>
            <ButtonLink href={registerHref('transformation-retreat', from)} variant="outline-light">
              Retreat waitlist
            </ButtonLink>
            <ButtonLink href="/register" variant="outline-light">
              All registrations
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
