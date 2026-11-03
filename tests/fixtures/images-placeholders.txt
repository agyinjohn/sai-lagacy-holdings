/**
 * CENTRAL IMAGE CONFIGURATION AND ASSET REGISTER (single source of truth).
 *
 * No image is copied from the internet. Every slot below is a tasteful placeholder until a
 * licensed, commissioned or approved image is supplied. To add one:
 *   1. Put the file in /public/images/ and set `src`, `width` and `height`.
 *   2. Fill in every `register` field truthfully.
 *   3. If it is AI-generated, set kind to "ai-concept". The component then ALWAYS shows
 *      the caption "Concept for illustration only. Not an approved design or completed facility."
 *   4. Only set approvalStatus to "approved" once Sai Legacy Holdings has signed it off.
 * Run `npm run assets:register` to refresh docs/asset-register.md.
 *
 * This file is deliberately dependency-free so a script can read it.
 */

export type ImageKind = 'placeholder' | 'ai-concept' | 'licensed' | 'commissioned' | 'client-supplied';
export type ApprovalStatus = 'not-supplied' | 'pending-review' | 'approved' | 'rejected';
export type ImageTone = 'dawn' | 'sage' | 'gold' | 'deep' | 'mist';

export interface AssetRegisterEntry {
  /** Where the image came from (photographer, studio, AI tool and prompt reference, or "None"). */
  source: string;
  licence: string;
  /** Where and how it may be used. */
  permittedUse: string;
  approvalStatus: ApprovalStatus;
  approvedBy: string;
  notes: string;
}

export interface SiteImageConfig {
  id: string;
  /** Alt text for the final image. */
  alt: string;
  /** Brief for whoever supplies the image. Shown on the placeholder. */
  brief: string;
  aspect: '16/9' | '4/3' | '3/2' | '4/5' | '21/9';
  kind: ImageKind;
  /** Path under /public, for example "/images/hero.jpg". Null shows the placeholder. */
  src: string | null;
  width: number;
  height: number;
  tone: ImageTone;
  register: AssetRegisterEntry;
}

const none: AssetRegisterEntry = {
  source: 'None. Placeholder only.',
  licence: 'Not applicable',
  permittedUse: 'Not applicable until an image is supplied',
  approvalStatus: 'not-supplied',
  approvedBy: '[Not yet approved]',
  notes: 'Image to be licensed, commissioned or supplied by Sai Legacy Holdings.',
};

export const IMAGES = {
  'home-hero': {
    id: 'home-hero',
    alt: 'Layered ridges of Akuapem at first light',
    brief: 'Wide landscape of the Akuapem ridge at first light. No buildings unless approved.',
    aspect: '21/9',
    kind: 'placeholder',
    src: null,
    width: 2400,
    height: 1028,
    tone: 'dawn',
    register: { ...none, notes: 'The hero currently uses the illustrated ridge motif. An approved photograph may sit beneath it.' },
  },
  'vision-setting': {
    id: 'vision-setting',
    alt: 'The Akuapem landscape',
    brief: 'The Akuapem setting: ridges, planting or open land. Approved site photography preferred.',
    aspect: '4/3',
    kind: 'placeholder',
    src: null,
    width: 1600,
    height: 1200,
    tone: 'sage',
    register: none,
  },
  'culture-feature': {
    id: 'culture-feature',
    alt: 'Ghanaian arts and craft in the making',
    brief: 'People making, cooking, playing or gathering. Real people require signed model releases.',
    aspect: '3/2',
    kind: 'placeholder',
    src: null,
    width: 1800,
    height: 1200,
    tone: 'gold',
    register: none,
  },
  'hospitality-feature': {
    id: 'hospitality-feature',
    alt: 'A proposed place to stay in a natural setting',
    brief: 'Concept view of proposed hospitality in landscape. AI concept images must carry the concept caption.',
    aspect: '3/2',
    kind: 'placeholder',
    src: null,
    width: 1800,
    height: 1200,
    tone: 'sage',
    register: none,
  },
  'wellness-feature': {
    id: 'wellness-feature',
    alt: 'A quiet outdoor space for restoration',
    brief: 'Calm outdoor space suggesting restoration and reconnection.',
    aspect: '3/2',
    kind: 'placeholder',
    src: null,
    width: 1800,
    height: 1200,
    tone: 'mist',
    register: none,
  },
  'later-life-feature': {
    id: 'later-life-feature',
    alt: 'A shared garden for later-life living',
    brief: 'Shared outdoor space that suggests independence, dignity and community. Avoid stock clichés.',
    aspect: '3/2',
    kind: 'placeholder',
    src: null,
    width: 1800,
    height: 1200,
    tone: 'dawn',
    register: none,
  },
  'plots-feature': {
    id: 'plots-feature',
    alt: 'Open land proposed for serviced plots',
    brief: 'Open land in the Phase 3 area, only if approved by Sai Legacy Holdings.',
    aspect: '3/2',
    kind: 'placeholder',
    src: null,
    width: 1800,
    height: 1200,
    tone: 'deep',
    register: none,
  },
  'investment-feature': {
    id: 'investment-feature',
    alt: 'The Courtyard by Sai in its landscape',
    brief: 'Approved image for investor pages. Must be cleared for investment promotion before use.',
    aspect: '16/9',
    kind: 'placeholder',
    src: null,
    width: 1920,
    height: 1080,
    tone: 'deep',
    register: none,
  },
} as const satisfies Record<string, SiteImageConfig>;

export type ImageId = keyof typeof IMAGES;

/** Non-photographic assets, recorded so the register is complete. */
export interface OtherAsset extends AssetRegisterEntry {
  id: string;
  type: 'logo' | 'font' | 'illustration';
  file: string;
}

export const OTHER_ASSETS: OtherAsset[] = [
  {
    id: 'sai-legacy-holdings-logo',
    type: 'logo',
    file: '/brand/sai-legacy-holdings-logo.png',
    source: 'Supplied by the client (Sai Legacy Holdings) with the project brief',
    licence: 'Owned by Sai Legacy Holdings',
    permittedUse: 'Representing Sai Legacy Holdings on this site. Never recoloured, cropped or reproportioned.',
    approvalStatus: 'approved',
    approvedBy: 'Supplied by the client',
    notes: 'Used unaltered (1000 x 307 px). Displayed on a white panel because the supplied file has an opaque white background.',
  },
  {
    id: 'font-marcellus',
    type: 'font',
    file: 'src/app/fonts/Marcellus-latin.woff2',
    source: 'Google Fonts (Marcellus)',
    licence: 'SIL Open Font License 1.1',
    permittedUse: 'Headings. Self-hosted.',
    approvalStatus: 'approved',
    approvedBy: 'Specified in the brief',
    notes: 'Latin subset only.',
  },
  {
    id: 'font-hanken-grotesk',
    type: 'font',
    file: 'src/app/fonts/HankenGrotesk-latin-variable.woff2',
    source: 'Google Fonts (Hanken Grotesk)',
    licence: 'SIL Open Font License 1.1',
    permittedUse: 'Body text. Self-hosted.',
    approvalStatus: 'approved',
    approvedBy: 'Specified in the brief',
    notes: 'Latin subset, variable weight.',
  },
  {
    id: 'ridge-illustrations',
    type: 'illustration',
    file: 'src/components/ridge.tsx',
    source: 'Drawn in code for this prototype (generic hills, not a depiction of the actual site)',
    licence: 'Created for this project',
    permittedUse: 'Graphic motif across the site',
    approvalStatus: 'pending-review',
    approvedBy: '[To be confirmed by Sai Legacy Holdings]',
    notes: 'Abstract motif only. Contains no kente, Adinkra or other cultural patterns.',
  },
];
