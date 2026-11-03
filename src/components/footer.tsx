import Link from 'next/link';
import { CookieSettingsButton } from '@/components/cookie-consent';
import { RidgeGlyph } from '@/components/ridge';
import { DEVELOPMENT_DISCLAIMER, NAV, SITE } from '@/content/site';

const link = 'inline-flex min-h-11 items-center underline-offset-4 hover:text-gold-light hover:underline';

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      {/* A faint ridge silhouette, like the hills behind the courtyard. */}
      <svg aria-hidden="true" focusable="false" viewBox="0 0 1440 260" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full opacity-60">
        <path d="M0 140 C240 80 420 170 700 110 C980 50 1180 150 1440 90 L1440 260 L0 260Z" fill="var(--color-deep)" fillOpacity="0.55" />
        <path d="M0 200 C260 150 520 220 760 175 C1000 130 1220 205 1440 160 L1440 260 L0 260Z" fill="var(--color-deep)" />
      </svg>
      <div className="wrap section-pad relative !pb-10 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-3 font-heading text-[1.9rem] leading-none">
            <RidgeGlyph className="h-7 w-10 text-pale" />
            {SITE.name}
          </p>
          <p className="mt-2 text-gold-light">{SITE.tagline}</p>
          <p className="mt-6 max-w-md text-pale">{DEVELOPMENT_DISCLAIMER}</p>
          <p className="mt-4 max-w-md text-sm text-pale/80">
            This website is a prototype prepared by GTHINK Company Limited to support a proposal. It is not a public launch.
          </p>
        </div>
        <nav aria-label="Explore" className="flex flex-col items-start">
          <p className="eyebrow mb-3 text-gold-light">Explore</p>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={link}>
              {n.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Footer" className="flex flex-col items-start">
          <p className="eyebrow mb-3 text-gold-light">Take part</p>
          <Link href="/register" className={link}>
            Join a waitlist
          </Link>
          <Link href="/register/legacy-unit?from=footer" className={link}>
            Investor enquiry
          </Link>
          <Link href="/contact" className={link}>
            Contact and partnerships
          </Link>
          <p className="eyebrow mb-3 mt-6 text-gold-light">Legal</p>
          <Link href="/privacy" className={link}>
            Privacy notice
          </Link>
          <CookieSettingsButton className={link} />
        </nav>
      </div>
      <div className="wrap relative border-t border-white/15 py-5 text-sm text-pale/80">
        <p>&copy; {new Date().getFullYear()} Sai Legacy Holdings. Prototype content. All rights reserved.</p>
      </div>
    </footer>
  );
}
