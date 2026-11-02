import { PLACEHOLDERS } from '@/content/site';

export const JOURNAL_CATEGORIES = [
  'Development progress',
  'Project announcements',
  'Cultural stories',
  'Wellness insights',
  'Tourism commentary',
  'Media coverage',
] as const;

export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];

export interface JournalEntry {
  id: string;
  category: JournalCategory;
  title: string;
  summary: string;
  /** Placeholder entries are layout samples only and are labelled as such on the page. */
  placeholder: boolean;
  date: string;
}

/**
 * No articles exist yet. These are layout samples so the filters can be reviewed.
 * Replace with approved articles (or a CMS feed) before launch.
 */
export const JOURNAL_ENTRIES: JournalEntry[] = JOURNAL_CATEGORIES.map((category, i) => ({
  id: `sample-${i + 1}`,
  category,
  title: '[Article title]',
  summary: PLACEHOLDERS.article,
  placeholder: true,
  date: '[Date]',
}));
