/**
 * Registration sources. Every link into a form carries `?from=<key>` so the team
 * can see which part of the site prompted the registration.
 */
export const SOURCES = {
  direct: 'Direct visit',
  home: 'Home',
  'home-hero': 'Home: hero',
  'home-map': 'Home: courtyard map',
  'home-invest': 'Home: investment section',
  'home-cta': 'Home: final call to action',
  vision: 'Vision and masterplan',
  culture: 'Culture and experiences',
  hospitality: 'Hospitality, nature and leisure',
  wellness: 'Wellness and retreats',
  'later-life': 'Longevity and later-life living',
  'serviced-plots': 'Serviced plots',
  investment: 'Investment opportunities',
  journal: 'Journal and updates',
  contact: 'Contact and partnerships',
  register: 'Registration hub',
  privacy: 'Privacy notice',
  footer: 'Site footer',
  header: 'Site header',
} as const;

export type SourceKey = keyof typeof SOURCES;

export function isSourceKey(value: unknown): value is SourceKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(SOURCES, value);
}

export function sourceLabel(key: string): string {
  return isSourceKey(key) ? SOURCES[key] : key;
}
