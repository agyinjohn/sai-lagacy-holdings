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

/** Register entry for a slot that has no image yet. Use it when adding a new slot. */
export const none: AssetRegisterEntry = {
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
    alt: 'Concept view of misty forested hills at sunrise',
    brief: 'Wide landscape of the Akuapem ridge at first light. No buildings unless approved.',
    aspect: '21/9',
    kind: 'ai-concept',
    src: '/images/home-hero.jpg',
    width: 1920,
    height: 832,
    tone: 'dawn',
    register: {
      source: 'AI-generated concept image (home-hero.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (home-hero.jpg), named for the slots in docs/image-brief.md. Landscape only, no people or buildings. Cropped by the full-width hero.',
    },
  },
  'vision-setting': {
    id: 'vision-setting',
    alt: 'Concept view of green hillsides with trees and open grassland in soft evening light',
    brief: 'The Akuapem setting: ridges, planting or open land. Approved site photography preferred.',
    aspect: '4/3',
    kind: 'ai-concept',
    src: '/images/vision-setting.jpg',
    width: 1600,
    height: 1200,
    tone: 'sage',
    register: {
      source: 'AI-generated concept image (vision-setting.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (vision-setting.jpg), named for the slots in docs/image-brief.md. Landscape only, no people or buildings.',
    },
  },
  'culture-feature': {
    id: 'culture-feature',
    alt: 'Concept view of handmade baskets, clay pots, wooden bowls and plain cloth beside a window',
    brief: 'People making, cooking, playing or gathering. Real people require signed model releases.',
    aspect: '3/2',
    kind: 'ai-concept',
    src: '/images/culture-feature.jpg',
    width: 1808,
    height: 1200,
    tone: 'gold',
    register: {
      source: 'AI-generated concept image (culture-feature.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (culture-feature.jpg), named for the slots in docs/image-brief.md. Still life with no people. The cloth is plain, with no printed or woven pattern.',
    },
  },
  'hospitality-feature': {
    id: 'hospitality-feature',
    alt: 'Concept view of a lit timber and stone lodge on a wooded ridge at sunrise',
    brief: 'Concept view of proposed hospitality in landscape. AI concept images must carry the concept caption.',
    aspect: '3/2',
    kind: 'ai-concept',
    src: '/images/hospitality-feature.jpg',
    width: 1808,
    height: 1200,
    tone: 'sage',
    register: {
      source: 'AI-generated concept image (hospitality-feature.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (hospitality-feature.jpg), named for the slots in docs/image-brief.md. Shows one generic building: confirm it implies no approved design, room count or facility.',
    },
  },
  'wellness-feature': {
    id: 'wellness-feature',
    alt: 'Concept view of a still water basin and garden terrace overlooking misty hills at sunrise',
    brief: 'Calm outdoor space suggesting restoration and reconnection.',
    aspect: '3/2',
    kind: 'ai-concept',
    src: '/images/wellness-feature.jpg',
    width: 1808,
    height: 1200,
    tone: 'mist',
    register: {
      source: 'AI-generated concept image (wellness-feature.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (wellness-feature.jpg), named for the slots in docs/image-brief.md. Shows a water basin and terrace: confirm it implies no approved design or facility.',
    },
  },
  'later-life-feature': {
    id: 'later-life-feature',
    alt: 'Concept view of a shaded garden with seating, a stone path and low buildings',
    brief: 'Shared outdoor space that suggests independence, dignity and community. Avoid stock clichés.',
    aspect: '3/2',
    kind: 'ai-concept',
    src: '/images/later-life-feature.jpg',
    width: 1808,
    height: 1200,
    tone: 'dawn',
    register: {
      source: 'AI-generated concept image (later-life-feature.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (later-life-feature.jpg), named for the slots in docs/image-brief.md. Shows low buildings and outdoor seating, no people. The cushions carry a small pattern: review against the rule on cultural patterns. Confirm it implies no care facility or service.',
    },
  },
  'plots-feature': {
    id: 'plots-feature',
    alt: 'Concept view of open green land with young trees and a red-earth track at sunset',
    brief: 'Open land in the Phase 3 area, only if approved by Sai Legacy Holdings.',
    aspect: '3/2',
    kind: 'ai-concept',
    src: '/images/plots-feature.jpg',
    width: 1808,
    height: 1200,
    tone: 'deep',
    register: {
      source: 'AI-generated concept image (plots-feature.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (plots-feature.jpg), named for the slots in docs/image-brief.md. Open land with young trees and a red-earth track that was not in the prompt: confirm it does not read as an approved road or layout. Not the Phase 3 site unless Sai Legacy Holdings confirms it is.',
    },
  },
  'investment-feature': {
    id: 'investment-feature',
    alt: 'Concept view of layered forested hills and an open meadow at sunset',
    brief: 'Approved image for investor pages. Must be cleared for investment promotion before use.',
    aspect: '16/9',
    kind: 'ai-concept',
    src: '/images/investment-feature.jpg',
    width: 1920,
    height: 1088,
    tone: 'deep',
    register: {
      source: 'AI-generated concept image (investment-feature.jpg). Tool: Not recorded (supplied from agyinjohn/ghana-through-the-lens, src/assets). Generated: 2026-11-03. Prompt: [prompt reference to be recorded]',
      licence: '[Licence terms of the generating tool to be confirmed for this use]',
      permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
      approvalStatus: 'pending-review',
      approvedBy: '[Not yet approved]',
      notes: 'Supplied via agyinjohn/ghana-through-the-lens (investment-feature.jpg), named for the slots in docs/image-brief.md. Landscape only, no people or buildings. Must be cleared for investment promotion before use.',
    },
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
