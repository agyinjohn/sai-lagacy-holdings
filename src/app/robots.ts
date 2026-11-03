import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/team', '/api/', '/register/confirmation'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
