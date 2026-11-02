import type { RegistrationRecord } from '@/lib/types';
import { PATHWAY_LIST } from '@/content/pathways';
import { sourceLabel } from '@/content/sources';

export interface RecordFilter {
  /** Worksheet name (PathwayConfig.sheet) or "All". */
  category?: string;
  q?: string;
}

export function filterRecords(records: RegistrationRecord[], filter: RecordFilter): RegistrationRecord[] {
  const sheet = filter.category && filter.category !== 'All' ? filter.category : null;
  const q = filter.q?.trim().toLowerCase();
  return records.filter((r) => {
    if (sheet) {
      const p = PATHWAY_LIST.find((x) => x.sheet === sheet);
      if (!p || r.pathway !== p.slug) return false;
    }
    if (!q) return true;
    return [r.name, r.email, r.phone, r.location, r.detail, r.organisation, r.message, r.category, r.ref, sourceLabel(r.source)]
      .join('\n')
      .toLowerCase()
      .includes(q);
  });
}
