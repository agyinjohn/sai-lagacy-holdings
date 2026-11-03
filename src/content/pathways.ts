/**
 * Registration pathways. Single source of truth for the forms, the shared Zod
 * validation, the team view worksheets and the confirmation copy.
 * Option lists come from the approved homepage concept. Edit here, not in components.
 */

export const PATHWAY_SLUGS = [
  'legacy-unit',
  'transformation-retreat',
  'assisted-living',
  'retirement-village',
  'serviced-plots',
  'guest-updates',
  'contact',
] as const;

export type PathwaySlug = (typeof PATHWAY_SLUGS)[number];

export interface PathwayConfig {
  slug: PathwaySlug;
  /** Stored as the record "category" and shown in the team view. */
  category: string;
  /** Short label for chips and navigation. */
  shortLabel: string;
  /** Worksheet name in the team view and Excel export (max 31 characters). */
  sheet: string;
  title: string;
  intro: string;
  detailLabel: string;
  detailOptions: readonly [string, ...string[]];
  /** Whether an optional organisation field is shown. */
  hasOrganisation: boolean;
  messageHint: string;
  action: string;
  /** Confirmation message shown after a successful submission. */
  thanks: string;
  /** Adds a sensitive-information reminder specific to this pathway. */
  sensitiveReminder?: string;
}

export const PATHWAYS: Record<PathwaySlug, PathwayConfig> = {
  'legacy-unit': {
    slug: 'legacy-unit',
    category: 'Legacy Unit investment enquiry',
    shortLabel: 'Legacy Unit investment',
    sheet: 'Investment',
    title: 'Legacy Unit investment enquiry',
    intro: 'Tell us about your interest and the team will respond directly.',
    detailLabel: 'I am enquiring as',
    detailOptions: ['An individual investor', 'An institution or fund', 'A development partner'],
    hasOrganisation: true,
    messageHint: 'Anything you would like the team to know. Please do not include financial account details.',
    action: 'Request investor information',
    thanks: 'Your investment enquiry has been received.',
    sensitiveReminder: 'Please do not enter bank, tax or other financial account details.',
  },
  'transformation-retreat': {
    slug: 'transformation-retreat',
    category: 'Transformation Retreat priority waitlist',
    shortLabel: 'Transformation Retreat',
    sheet: 'Retreats',
    title: 'Transformation Retreat priority waitlist',
    intro: 'Join the priority waitlist for planned retreats at The Courtyard.',
    detailLabel: 'What draws you to a retreat?',
    detailOptions: ['Restoration', 'Personal development', 'Wellbeing', 'Reconnection'],
    hasOrganisation: false,
    messageHint: 'Optional. Please do not include health or medical information.',
    action: 'Join the retreat waitlist',
    thanks: 'You have joined the Transformation Retreat priority waitlist.',
    sensitiveReminder: 'Please do not enter health or medical information.',
  },
  'assisted-living': {
    slug: 'assisted-living',
    category: 'Assisted Living priority waitlist',
    shortLabel: 'Assisted Living',
    sheet: 'Assisted Living',
    title: 'Assisted Living priority waitlist',
    intro: 'Register your interest in the proposed assisted living community.',
    detailLabel: 'I am registering for',
    detailOptions: ['Myself', 'A family member', 'Someone in my care'],
    hasOrganisation: false,
    messageHint: 'Optional. Please do not include health, care or medical details.',
    action: 'Join the Assisted Living waitlist',
    thanks: 'You have joined the Assisted Living priority waitlist.',
    sensitiveReminder: 'Please do not enter health, care or medical information.',
  },
  'retirement-village': {
    slug: 'retirement-village',
    category: 'Retirement Village priority waitlist',
    shortLabel: 'Retirement Village',
    sheet: 'Retirement Village',
    title: 'Retirement Village priority waitlist',
    intro: 'Register your interest in the proposed independent living community.',
    detailLabel: 'I am registering for',
    detailOptions: ['Myself', 'My partner and me', 'A family member'],
    hasOrganisation: false,
    messageHint: 'Optional. Please do not include health or financial details.',
    action: 'Join the Retirement Village waitlist',
    thanks: 'You have joined the Retirement Village priority waitlist.',
  },
  'serviced-plots': {
    slug: 'serviced-plots',
    category: 'Phase 3 Serviced Plots expression of interest',
    shortLabel: 'Phase 3 Serviced Plots',
    sheet: 'Serviced Plots',
    title: 'Phase 3 Serviced Plots expression of interest',
    intro: 'Register your interest in the proposed serviced plots.',
    detailLabel: 'My interest is',
    detailOptions: ['Building a home', 'An investment', 'Not sure yet'],
    hasOrganisation: false,
    messageHint: 'Optional. This is an expression of interest only and creates no commitment.',
    action: 'Register your interest',
    thanks: 'Your expression of interest has been received.',
  },
  'guest-updates': {
    slug: 'guest-updates',
    category: 'Hospitality and future guest updates',
    shortLabel: 'Hospitality and guest updates',
    sheet: 'Guest Updates',
    title: 'Hospitality and future guest updates',
    intro: 'Be among the first to hear about future stays and experiences.',
    detailLabel: 'I am most interested in',
    detailOptions: ['Future stays', 'Dining', 'Events', 'Culture and experiences', 'Nature and recreation'],
    hasOrganisation: false,
    messageHint: 'Optional.',
    action: 'Get guest updates',
    thanks: 'You will receive updates about future stays and experiences.',
  },
  contact: {
    slug: 'contact',
    category: 'Contact and partnership enquiry',
    shortLabel: 'Contact and partnerships',
    sheet: 'Contact',
    title: 'Contact and partnership enquiry',
    intro: 'Tell us how you would like to work with us, or what you would like to know.',
    detailLabel: 'My enquiry is about',
    detailOptions: ['Strategic partnership', 'Media', 'Cultural collaboration', 'General enquiry'],
    hasOrganisation: true,
    messageHint: 'Tell us a little about your enquiry.',
    action: 'Send enquiry',
    thanks: 'Your enquiry has been received.',
  },
};

export const PATHWAY_LIST: PathwayConfig[] = PATHWAY_SLUGS.map((slug) => PATHWAYS[slug]);

export function isPathwaySlug(value: unknown): value is PathwaySlug {
  return typeof value === 'string' && (PATHWAY_SLUGS as readonly string[]).includes(value);
}

/** Version of the consent wording. Stored with every record. */
export const CONSENT_NOTICE_VERSION = 'prototype-0.1';

export const CONSENT_TEXT =
  'I agree that Sai Legacy Holdings may store my details and contact me about this registration.';

/** Worksheet names in team view order. */
export const SHEET_NAMES: string[] = PATHWAY_LIST.map((p) => p.sheet);
