import type { MetadataRoute } from 'next';
import { PATHWAY_SLUGS } from '@/content/pathways';
import { SITE } from '@/content/site';

const PAGES = ['/', '/vision', '/culture', '/hospitality', '/wellness', '/later-life', '/serviced-plots', '/investment', '/journal', '/contact', '/privacy', '/register'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');
  const lastModified = new Date();
  return [...PAGES, ...PATHWAY_SLUGS.map((s) => `/register/${s}`)].map((path) => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.startsWith('/register/') ? 0.4 : 0.7,
  }));
}
