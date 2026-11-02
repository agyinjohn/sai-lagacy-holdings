import type { PathwaySlug } from '@/content/pathways';
import type { SourceKey } from '@/content/sources';

export function registerHref(pathway: PathwaySlug, from?: SourceKey, detail?: string): string {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (detail) params.set('detail', detail);
  const qs = params.toString();
  return `/register/${pathway}${qs ? `?${qs}` : ''}`;
}
