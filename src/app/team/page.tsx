import { cookies } from 'next/headers';
import { TeamDashboard } from '@/components/team-dashboard';
import { TeamLogin } from '@/components/team-login';
import { Section } from '@/components/ui';
import { getStore } from '@/lib/storage';
import { TEAM_COOKIE, teamConfig, verifySessionToken } from '@/lib/team-auth';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';
export const metadata = pageMetadata({ title: 'Team view', description: 'Private team area.', path: '/team', noindex: true });

export default async function TeamPage() {
  const cfg = teamConfig();
  const authed = cfg.configured && verifySessionToken((await cookies()).get(TEAM_COOKIE)?.value);
  // Records are only read, and only serialised into the page, after the session is verified.
  const records = authed ? (await getStore().list()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];

  return (
    <Section tone="mist">
      <p className="eyebrow mb-3 text-gold-ink">Team view (prototype)</p>
      <h1 className="display-1" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)' }}>
        Registration tracker
      </h1>
      <p className="lede mb-10 mt-5">
        Registrations by category, with search and export. This area is private, is not linked from the public site and is excluded from search engines.
      </p>
      {!cfg.configured ? (
        <div className="max-w-xl rounded-[2px] border border-pale bg-white p-6">
          <h2 className="display-3">Team area not configured</h2>
          <p className="mt-3">
            Set TEAM_USERNAME, TEAM_PASSWORD (8 characters or more) and TEAM_SESSION_SECRET (32 characters or more) in the server environment to
            enable it. It stays closed until then.
          </p>
        </div>
      ) : authed ? (
        <TeamDashboard records={records} />
      ) : (
        <TeamLogin />
      )}
    </Section>
  );
}
