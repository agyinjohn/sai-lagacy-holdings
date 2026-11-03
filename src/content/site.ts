/** Site-wide content. Move to a CMS later by replacing these exports with fetchers. */

export const SITE = {
  name: 'The Courtyard by Sai',
  developer: 'Sai Legacy Holdings',
  tagline: 'Rooted on the Ridge',
  description:
    'A proposed 80-acre, multi-phase cultural, wellness and lifestyle destination in Akuapem, Eastern Region, Ghana, developed by Sai Legacy Holdings.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'en_GB',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: 'Vision', href: '/vision' },
  { label: 'Culture', href: '/culture' },
  { label: 'Hospitality', href: '/hospitality' },
  { label: 'Wellness', href: '/wellness' },
  { label: 'Later living', href: '/later-life' },
  { label: 'Plots', href: '/serviced-plots' },
  { label: 'Invest', href: '/investment' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_LINKS: NavItem[] = [
  { label: 'Privacy notice', href: '/privacy' },
  { label: 'Contact', href: '/contact' },
  { label: 'Join a waitlist', href: '/register' },
];

export const PROTOTYPE_FORM_NOTICE =
  'This is a prototype. Do not enter sensitive personal, health or financial information. Details you submit are kept only for the demonstration and no emails are sent.';

export const DEVELOPMENT_DISCLAIMER =
  'A development by Sai Legacy Holdings. All facilities, experiences and images shown are proposed or conceptual and may change.';

/** Must appear on every AI-generated concept image. Enforced in <SiteImage>. */
export const CONCEPT_CAPTION = 'Concept for illustration only. Not an approved design or completed facility.';

export const CONCEPT_ILLUSTRATION_NOTE = 'Concept illustration. Not an approved design.';

export const DIAGRAM_NOTE = 'Concept diagram only. Not the approved masterplan or site layout.';

/** Bracketed placeholders for information still to be supplied. Shown visibly on the site. */
export const PLACEHOLDERS = {
  masterplan: '[Approved masterplan, phase dates and site images to be supplied by Sai Legacy Holdings.]',
  legacyUnit: '[Approved Legacy Unit overview and legal disclaimer to be supplied by Sai Legacy Holdings.]',
  contactDetails: '[Telephone, email and address to be supplied by Sai Legacy Holdings.]',
  laterLife: '[Community details and timing to be supplied by Sai Legacy Holdings.]',
  plots: '[Plot details, pricing and timing to be supplied by Sai Legacy Holdings.]',
  privacy: '[Final privacy and cookie wording to be approved by the legal adviser to Sai Legacy Holdings.]',
  article: '[Sample layout. Article to be supplied or approved by Sai Legacy Holdings.]',
} as const;
