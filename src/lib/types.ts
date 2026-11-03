import type { PathwaySlug } from '@/content/pathways';

export interface RegistrationRecord {
  /** Internal unique id (UUID). */
  id: string;
  /** Short reference shown to the visitor, e.g. CBS-7K3M9QXA. */
  ref: string;
  /** ISO timestamp. */
  createdAt: string;
  /** Calendar date (UTC), YYYY-MM-DD. */
  date: string;
  pathway: PathwaySlug;
  category: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  detail: string;
  organisation: string;
  message: string;
  consent: true;
  consentNoticeVersion: string;
  /** Registration source key, see content/sources.ts. */
  source: string;
}
