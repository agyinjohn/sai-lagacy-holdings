import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SITE } from '@/content/site';
import { MotionProvider } from '@/components/reveal';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CookieConsent } from '@/components/cookie-consent';

const marcellus = localFont({
  src: './fonts/Marcellus-latin.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-marcellus',
  display: 'swap',
});

const hanken = localFont({
  src: './fonts/HankenGrotesk-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Ghana’s next cultural and wellness destination`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: 'website' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#123B2A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${marcellus.variable} ${hanken.variable}`}>
      <body>
        <a
          href="#main"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-[2px] bg-gold-light px-4 py-3 font-medium text-deep focus:translate-y-0"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </MotionProvider>
      </body>
    </html>
  );
}
