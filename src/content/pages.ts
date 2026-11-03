import type { ImageId } from '@/content/images';
import { PLACEHOLDERS } from '@/content/site';
import { registerHref } from '@/content/links';
import type { SourceKey } from '@/content/sources';

/**
 * Page copy. Facts come only from the project brief. Anything not built or approved is
 * written as "proposed" or "planned", and missing information is a visible [placeholder].
 */

export interface Cta {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

export type RidgeMood = 'mist' | 'offwhite' | 'sage' | 'dawn';

export type HeroVariant = 'split' | 'split-reverse' | 'full' | 'arch';

export interface StoryPageContent {
  slug: string;
  path: string;
  source: SourceKey;
  metaTitle: string;
  description: string;
  title: string;
  intro: string;
  heading: string;
  body: string[];
  note?: string;
  itemsHeading: string;
  items: { title: string; description: string }[];
  ctas: Cta[];
  imageId: ImageId;
  mood: RidgeMood;
  /** How the page opens. Varied so inner pages do not read as one template. */
  hero: HeroVariant;
  /** CSS object-position for cropping the hero image. */
  focus?: string;
}

export const STORY_PAGES = {
  culture: {
    slug: 'culture',
    path: '/culture',
    source: 'culture',
    metaTitle: 'Culture & Experiences',
    description:
      'Ghanaian creativity is planned to shape how The Courtyard looks, feels and welcomes people: arts, music, gastronomy, heritage and creative workshops.',
    title: 'Culture is the foundation',
    intro: 'Ghanaian creativity will shape how The Courtyard looks, feels and welcomes people.',
    heading: 'Proposed cultural experiences',
    body: [
      'Guests, residents and neighbours will be invited to make, taste, listen and take part. Culture is planned as an essential part of the whole experience.',
    ],
    itemsHeading: 'What is planned',
    items: [
      { title: 'Ghanaian arts', description: 'Art and craftsmanship shaped by Ghanaian creative expression.' },
      { title: 'Music', description: 'Sound and performance as part of life at The Courtyard.' },
      { title: 'Gastronomy', description: 'Food as a way to share Ghanaian culture and heritage.' },
      { title: 'Heritage', description: 'Stories and traditions connected to Ghana’s past and present.' },
      { title: 'Cultural programming', description: 'A proposed programme of activities and experiences.' },
      { title: 'Creative workshops', description: 'Hands-on opportunities to learn and make.' },
      { title: 'Community engagement', description: 'Opportunities for neighbours and local partners to take part.' },
      { title: 'Immersive experiences', description: 'Time to take part, not only observe.' },
    ],
    ctas: [
      { label: 'Get guest updates', href: registerHref('guest-updates', 'culture', 'Culture and experiences'), variant: 'primary' },
      { label: 'Collaborate with us', href: registerHref('contact', 'culture', 'Cultural collaboration'), variant: 'secondary' },
    ],
    imageId: 'culture-feature',
    mood: 'mist',
    hero: 'split',
    focus: '50% 55%',
  },
  hospitality: {
    slug: 'hospitality',
    path: '/hospitality',
    source: 'hospitality',
    metaTitle: 'Hospitality, Nature & Leisure',
    description:
      'A proposed hotel, chalets, dining, leisure facilities, events and nature-based activities in Akuapem. Register for future stays and experiences.',
    title: 'Hospitality, nature, and leisure',
    intro: 'A proposed place to stay, gather, and spend time outdoors in Akuapem.',
    heading: 'Planned for guests',
    body: ['Register for future stays and experiences, and we will keep you updated as the development progresses.'],
    itemsHeading: 'What is proposed',
    items: [
      { title: 'Hotel', description: 'A proposed hotel at the heart of the guest experience.' },
      { title: 'Chalets', description: 'Proposed chalets within the natural setting.' },
      { title: 'Dining experiences', description: 'Proposed dining inspired by the destination’s culture.' },
      { title: 'Leisure facilities', description: 'Proposed spaces for rest and recreation.' },
      { title: 'Events', description: 'Proposed settings for gatherings and celebrations.' },
      { title: 'Nature-based activities', description: 'Proposed ways to enjoy Akuapem’s landscape.' },
    ],
    ctas: [{ label: 'Get guest updates', href: registerHref('guest-updates', 'hospitality'), variant: 'primary' }],
    imageId: 'hospitality-feature',
    mood: 'offwhite',
    hero: 'full',
    focus: '38% 50%',
  },
  wellness: {
    slug: 'wellness',
    path: '/wellness',
    source: 'wellness',
    metaTitle: 'Wellness & Transformation Retreats',
    description:
      'Planned retreats focused on restoration, personal development, wellbeing and reconnection. Join the Transformation Retreat priority waitlist.',
    title: 'Wellness and transformation retreats',
    intro: 'Planned retreats focused on restoration, personal development, wellbeing, and reconnection.',
    heading: 'Our wellness philosophy',
    body: ['Wellness is planned as an immersive experience, closely connected to nature, culture, and community.'],
    itemsHeading: 'What retreats are planned around',
    items: [
      { title: 'Restoration', description: 'Time and space to rest and recover.' },
      { title: 'Personal development', description: 'Experiences that support growth and reflection.' },
      { title: 'Wellbeing', description: 'A focus on the health of body and mind.' },
      { title: 'Reconnection', description: 'Connection with yourself, others, and nature.' },
      { title: 'Immersive experiences', description: 'Retreats designed to be fully lived, not simply attended.' },
    ],
    ctas: [{ label: 'Join the retreat waitlist', href: registerHref('transformation-retreat', 'wellness'), variant: 'primary' }],
    imageId: 'wellness-feature',
    mood: 'mist',
    hero: 'arch',
    focus: '28% 55%',
  },
  'later-life': {
    slug: 'later-life',
    path: '/later-life',
    source: 'later-life',
    metaTitle: 'Longevity & Later-Life Living',
    description:
      'Proposed Retirement Village and Assisted Living communities built around independence, dignity and quality of life. Join a priority waitlist.',
    title: 'Longevity and later-life living',
    intro: 'Proposed retirement and assisted living communities, built around independence, dignity, and quality of life.',
    heading: 'Two proposed communities',
    body: ['Choose the priority waitlist that fits your plans, whether you are registering for yourself or someone you care for.'],
    note: PLACEHOLDERS.laterLife,
    itemsHeading: 'What is proposed',
    items: [
      { title: 'Independent living', description: 'A proposed Retirement Village community.' },
      { title: 'Assisted living', description: 'A proposed community with support for daily life.' },
      { title: 'Wellness', description: 'Wellbeing as part of everyday living.' },
      { title: 'Quality of life and dignity', description: 'A setting that respects each resident’s independence.' },
      { title: 'Community', description: 'Connection with neighbours and the wider destination.' },
    ],
    ctas: [
      { label: 'Retirement Village waitlist', href: registerHref('retirement-village', 'later-life'), variant: 'primary' },
      { label: 'Assisted Living waitlist', href: registerHref('assisted-living', 'later-life'), variant: 'secondary' },
    ],
    imageId: 'later-life-feature',
    mood: 'offwhite',
    hero: 'split-reverse',
    focus: '35% 55%',
  },
  'serviced-plots': {
    slug: 'serviced-plots',
    path: '/serviced-plots',
    source: 'serviced-plots',
    metaTitle: 'Serviced Plots: Phase 3',
    description:
      'Serviced plots are proposed for Phase 3 of The Courtyard by Sai. Register your early interest to receive updates as plans progress.',
    title: 'Serviced Plots: Phase 3',
    intro: 'A proposed future opportunity to become part of The Courtyard’s wider lifestyle vision.',
    heading: 'Register your early interest',
    body: ['Serviced plots are proposed for Phase 3. Share your details to receive updates as plans progress.'],
    note: PLACEHOLDERS.plots,
    itemsHeading: 'What this is',
    items: [
      { title: 'A proposed future phase', description: 'Planned as part of the phased development.' },
      { title: 'A wider lifestyle vision', description: 'Connected to culture, nature, wellness, and community.' },
    ],
    ctas: [{ label: 'Register your interest', href: registerHref('serviced-plots', 'serviced-plots'), variant: 'primary' }],
    imageId: 'plots-feature',
    mood: 'sage',
    hero: 'full',
    focus: '50% 62%',
  },
} as const satisfies Record<string, StoryPageContent>;

export type StoryKey = keyof typeof STORY_PAGES;

export const VISION = {
  title: 'One destination, shaped around shared space',
  intro:
    'The Courtyard by Sai is a proposed 80-acre, multi-phase cultural, wellness, and lifestyle destination in Akuapem, Ghana’s Eastern Region.',
  philosophy: {
    heading: 'Our development philosophy',
    body: [
      'The ambition is an integrated destination that serves changing hospitality, cultural, wellness, and lifestyle needs.',
      'Each part is planned to connect with the others, so culture, nature, wellness, and community remain part of the whole experience.',
    ],
  },
  setting: {
    heading: 'The Akuapem setting',
    body: [
      'Akuapem’s landscape will inform the destination’s character, from its natural setting to the way people move through and experience the site.',
    ],
  },
  phased: {
    heading: 'A phased development',
    body: [
      'The project is in structured pre-development, with planning, partnerships, investment engagement, and technical work progressing. Serviced plots are proposed for Phase 3.',
    ],
    placeholder: PLACEHOLDERS.masterplan,
  },
  concept: {
    heading: 'Rooted on the Ridge',
    body: [
      'Akuapem’s ridges and the shared open courtyard of a Ghanaian compound house inspire the idea behind this site. In a compound house, daily life gathers around a shared courtyard.',
      'Our vision brings that spirit to a multi-phase destination, with culture, nature, wellness, and community at its heart.',
    ],
  },
};

export const INVESTMENT = {
  title: 'Investment opportunities: The Legacy Unit',
  intro: 'Sai Legacy Holdings welcomes enquiries about the proposed Legacy Unit and wider development partnerships.',
  overview: [
    {
      title: 'The developer',
      text: 'Sai Legacy Holdings is developing The Courtyard by Sai, with a vision rooted in Africa and built for generations.',
    },
    {
      title: 'The vision',
      text: 'A proposed 80-acre, multi-phase destination for hospitality, culture, wellness, and later-life living in Akuapem.',
    },
    {
      title: 'Current stage',
      text: 'Structured pre-development, with planning, partnerships, investment engagement, and technical work progressing.',
    },
  ],
  placeholder: PLACEHOLDERS.legacyUnit,
  direct: {
    heading: 'Further information is shared directly',
    body: 'Sensitive investment documents are not published on this website. Submit an enquiry and the team will decide what to share with you.',
  },
  notice:
    'Nothing on this page is an offer, an invitation to invest or financial advice. No returns, prices or timelines are stated because none have been approved for publication.',
};

export const CONTACT_OPTIONS = [
  {
    title: 'Investors',
    text: 'Enquire about the proposed Legacy Unit and investment opportunities.',
    label: 'Start an investor enquiry',
    href: registerHref('legacy-unit', 'contact'),
  },
  {
    title: 'Strategic partners',
    text: 'Explore how your organisation could work with Sai Legacy Holdings.',
    label: 'Discuss a partnership',
    href: registerHref('contact', 'contact', 'Strategic partnership'),
  },
  {
    title: 'Media',
    text: 'Contact the team about press and media enquiries.',
    label: 'Send a media enquiry',
    href: registerHref('contact', 'contact', 'Media'),
  },
  {
    title: 'Cultural collaborators',
    text: 'Share your work and ideas for collaboration.',
    label: 'Propose a collaboration',
    href: registerHref('contact', 'contact', 'Cultural collaboration'),
  },
  {
    title: 'General enquiries',
    text: 'Ask us anything else about The Courtyard by Sai.',
    label: 'Send a general enquiry',
    href: registerHref('contact', 'contact', 'General enquiry'),
  },
];
