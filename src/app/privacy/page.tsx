import { RidgeDivider } from '@/components/ridge';
import { ButtonLink, Placeholder, Section } from '@/components/ui';
import { CONSENT_NOTICE_VERSION } from '@/content/pathways';
import { PLACEHOLDERS } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Privacy Notice',
  description: 'How this prototype website uses the details you submit and how cookies and analytics are handled.',
  path: '/privacy',
});

const FIELDS = ['Date of registration', 'Registration category', 'Name', 'Email address', 'Phone number (optional)', 'Country or city', 'The option you choose for that registration', 'Organisation (optional, some forms only)', 'Message (optional)', 'Your consent and the version of the wording you agreed to', 'Which page you registered from'];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-mist" aria-labelledby="page-title">
        <div className="wrap pb-10 pt-[clamp(40px,6vw,80px)]">
          <p className="eyebrow mb-3 text-gold-ink">Draft for legal review</p>
          <h1 id="page-title" className="display-1" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Privacy notice
          </h1>
          <p className="lede mt-5">
            Your details would be used to respond to your registration or enquiry, and to keep you informed about the area you selected.
          </p>
        </div>
      </section>
      <RidgeDivider from="mist" to="paper" />
      <Section tone="paper" pad={false} className="pb-[clamp(64px,9vw,120px)] pt-6">
        <div className="max-w-[44rem] space-y-10">
          <Placeholder>{PLACEHOLDERS.privacy}</Placeholder>

          <div>
            <h2 className="display-3 mb-3">This is a prototype</h2>
            <p>
              This website is a prototype prepared by GTHINK Company Limited to support a proposal. Please do not enter real sensitive information,
              such as health, financial or identity details. No emails are sent from this prototype.
            </p>
          </div>

          <div>
            <h2 className="display-3 mb-3">What each registration records</h2>
            <ul className="list-disc space-y-1 pl-5 sm:columns-2 sm:gap-10 [&>li]:break-inside-avoid">
              {FIELDS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-deep/75">Consent wording version: {CONSENT_NOTICE_VERSION}</p>
          </div>

          <div>
            <h2 className="display-3 mb-3">Who can see it</h2>
            <p>
              Registrations are held in a private store and shown only in a password-protected team area. They are not published and are never
              shown to other visitors.
            </p>
          </div>

          <div>
            <h2 className="display-3 mb-3">Cookies and analytics</h2>
            <p>
              The site remembers only your cookie choice, in your browser. Analytics stays switched off unless you accept it, and this prototype
              does not load any analytics service yet. You can change your choice at any time with “Cookie settings” in the footer.
            </p>
          </div>

          <div>
            <h2 className="display-3 mb-3">To be confirmed before launch</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>[Legal basis, retention period and deletion process]</li>
              <li>[Your rights and how to exercise them]</li>
              <li>[Data controller details and contact for privacy requests]</li>
              <li>[Applicable data protection law and any registration requirements]</li>
              <li>[Any service providers who will process data, and where]</li>
            </ul>
          </div>

          <ButtonLink href="/register" variant="secondary">
            Back to registration
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
