import type { Metadata } from 'next';
import { SITE } from '@/content/site';

export function pageMetadata(opts: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${opts.title} | ${SITE.name}`,
      description: opts.description,
      url: opts.path,
      siteName: SITE.name,
      locale: SITE.locale,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: `${opts.title} | ${SITE.name}`, description: opts.description },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
  };
}
