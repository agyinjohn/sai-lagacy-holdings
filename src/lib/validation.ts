import { z } from 'zod';
import { PATHWAYS, PATHWAY_SLUGS, type PathwaySlug } from '@/content/pathways';

/**
 * Shared validation. The same schemas run in the browser (instant feedback) and on
 * the server (the only trusted check). Never rely on the client run.
 */

// Strips control characters (keeps tab and newline) so stored values and exports stay clean.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value: string): string {
  return value.normalize('NFC').replace(CONTROL_CHARS, '');
}

const clean = (v: unknown) => (typeof v === 'string' ? cleanText(v) : v);

const text = (min: number, max: number, requiredMsg: string, tooLongMsg: string) =>
  z.preprocess(clean, z.string().trim().min(min, requiredMsg).max(max, tooLongMsg));

const optionalText = (max: number, tooLongMsg: string) =>
  z.preprocess((v) => (v == null ? '' : clean(v)), z.string().trim().max(max, tooLongMsg));

export const SOURCE_PATTERN = /^[a-z0-9-]{1,40}$/;

const baseShape = {
  name: text(2, 120, 'Enter your full name', 'Keep your name under 120 characters'),
  email: z.preprocess(
    clean,
    z.string().trim().min(1, 'Enter your email address').max(254, 'Email address is too long').pipe(z.email('Enter a valid email address')),
  ),
  phone: z.preprocess(
    (v) => (v == null ? '' : clean(v)),
    z
      .string()
      .trim()
      .max(30, 'Phone number is too long')
      .refine((v) => v === '' || /^\+?[0-9()\s.-]{6,30}$/.test(v), 'Enter a valid phone number, or leave it blank'),
  ),
  location: text(2, 120, 'Enter your country or city', 'Keep your location under 120 characters'),
  message: optionalText(2000, 'Keep your message under 2,000 characters'),
  consent: z.literal(true, { error: 'You need to agree before we can store your details' }),
  source: z.preprocess((v) => (v == null || v === '' ? 'direct' : v), z.string().regex(SOURCE_PATTERN, 'Invalid source')),
};

function buildSchema(slug: PathwaySlug) {
  const cfg = PATHWAYS[slug];
  return z.object({
    ...baseShape,
    detail: z.enum(cfg.detailOptions, { error: `Choose an option for "${cfg.detailLabel}"` }),
    organisation: cfg.hasOrganisation
      ? optionalText(160, 'Keep the organisation name under 160 characters')
      : z.preprocess(() => '', z.string()),
  });
}

export const pathwaySchemas = Object.fromEntries(PATHWAY_SLUGS.map((s) => [s, buildSchema(s)])) as {
  [K in PathwaySlug]: ReturnType<typeof buildSchema>;
};

export type RegistrationInput = z.output<ReturnType<typeof buildSchema>>;

export function schemaFor(slug: PathwaySlug) {
  return pathwaySchemas[slug];
}

/** Flattens Zod issues into { field: firstMessage }. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export const teamLoginSchema = z.object({
  username: z.string().min(1).max(200),
  password: z.string().min(1).max(500),
});

export const exportQuerySchema = z.object({
  format: z.enum(['csv', 'xlsx']),
  category: z.string().max(60).optional(),
  q: z.string().max(200).optional(),
});
