import type { PathwaySlug } from '@/content/pathways';
import type { SourceKey } from '@/content/sources';
import type { ImageId } from '@/content/images';

export interface MapLink {
  label: string;
  href: string;
}

export interface MapRoom {
  id: string;
  title: string;
  text: string;
  /** Page for this component. */
  explore: MapLink;
  /** Image shown in the courtyard panel when this space is selected. */
  imageId?: ImageId;
  /** Registration routes for this component. */
  register: { label: string; pathway: PathwaySlug; from: SourceKey; detail?: string }[];
}

/**
 * The proposed destination components, laid out around the open courtyard.
 * Order is the reading and tab order: row by row, skipping the centre.
 */
export const MAP_ROOMS: MapRoom[] = [
  {
    id: 'culture',
    imageId: 'culture-feature',
    title: 'Culture & Experiences',
    text: 'Arts, music, food, heritage and creative programmes for every visitor.',
    explore: { label: 'Explore culture', href: '/culture' },
    register: [{ label: 'Get guest updates', pathway: 'guest-updates', from: 'home-map', detail: 'Culture and experiences' }],
  },
  {
    id: 'hospitality',
    imageId: 'hospitality-feature',
    title: 'Hospitality, Nature & Leisure',
    text: 'A proposed hotel, chalets, dining, events, recreation and time outdoors.',
    explore: { label: 'Explore hospitality', href: '/hospitality' },
    register: [{ label: 'Get guest updates', pathway: 'guest-updates', from: 'home-map' }],
  },
  {
    id: 'wellness',
    imageId: 'wellness-feature',
    title: 'Wellness & Transformation Retreats',
    text: 'Planned retreats for restoration, wellbeing, reconnection and personal growth.',
    explore: { label: 'Explore wellness', href: '/wellness' },
    register: [{ label: 'Join the retreat waitlist', pathway: 'transformation-retreat', from: 'home-map' }],
  },
  {
    id: 'plots',
    imageId: 'plots-feature',
    title: 'Serviced Plots: Phase 3',
    text: 'A proposed future opportunity to become part of the wider lifestyle vision.',
    explore: { label: 'Explore serviced plots', href: '/serviced-plots' },
    register: [{ label: 'Register your interest', pathway: 'serviced-plots', from: 'home-map' }],
  },
  {
    id: 'later-life',
    imageId: 'later-life-feature',
    title: 'Longevity & Later-Life Living',
    text: 'Proposed communities built around independence, dignity and quality of life.',
    explore: { label: 'Explore later-life living', href: '/later-life' },
    register: [
      { label: 'Retirement Village waitlist', pathway: 'retirement-village', from: 'home-map' },
      { label: 'Assisted Living waitlist', pathway: 'assisted-living', from: 'home-map' },
    ],
  },
  {
    id: 'investment',
    imageId: 'investment-feature',
    title: 'Investment: The Legacy Unit',
    text: 'Explore the proposed Legacy Unit and wider development partnerships.',
    explore: { label: 'Explore the Legacy Unit', href: '/investment' },
    register: [{ label: 'Enquire about investing', pathway: 'legacy-unit', from: 'home-map' }],
  },
  {
    id: 'journal',
    title: 'Journal & Updates',
    text: 'Project progress, cultural stories, wellness insights and media coverage.',
    explore: { label: 'Read the Journal', href: '/journal' },
    register: [{ label: 'Get guest updates', pathway: 'guest-updates', from: 'home-map' }],
  },
  {
    id: 'contact',
    title: 'Contact & Partnerships',
    text: 'For strategic partners, media, cultural collaborators and general enquiries.',
    explore: { label: 'Contact our team', href: '/contact' },
    register: [{ label: 'Send an enquiry', pathway: 'contact', from: 'home-map' }],
  },
];
