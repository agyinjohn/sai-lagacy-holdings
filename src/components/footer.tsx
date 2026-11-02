import Link from 'next/link';
import { DEVELOPMENT_DISCLAIMER, FOOTER_LINKS, SITE } from '@/content/site';
import { CookieSettingsButton } from '@/components/cookie-consent';
import { RidgeGlyph } from '@/components/ridge';

export function Footer() {
  return (
    <footer className="on-dark bg-night text-white">
      <div className="wrap section-pad !pb-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="flex items-center gap-3 font-heading text-2xl">
            <RidgeGlyph className="h-6 w-9 text-pale" />
            {SITE.name}
          </p>
          <p className="mt-4 max-w-xl text-pale">{DEVELOPMENT_DISCLAIMER}</p>
          <p className="mt-4 max-w-xl text-sm text-pale/80">
            This website is a prototype prepared by GTHINK Company Limited to support a proposal. It is not a public launch.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col items-start">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-gold-light">
              {l.label}
            </Link>
          ))}
          <CookieSettingsButton className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-gold-light" />
        </nav>
      </div>
      <div className="wrap border-t border-white/15 py-5 text-sm text-pale/80">
        <p>&copy; {new Date().getFullYear()} Sai Legacy Holdings. Prototype content. All rights reserved.</p>
      </div>
    </footer>
  );
}
