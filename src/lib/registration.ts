import { randomBytes, randomUUID } from 'node:crypto';
import { PATHWAYS, CONSENT_NOTICE_VERSION, type PathwaySlug } from '@/content/pathways';
import type { RegistrationRecord } from '@/lib/types';
import type { RegistrationInput } from '@/lib/validation';
import { getStore } from '@/lib/storage';
import { buildAcknowledgement, buildTeamNotification, getEmailAdapter } from '@/lib/email';

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeRef(): string {
  const bytes = randomBytes(8);
  let out = '';
  for (const b of bytes) out += REF_ALPHABET[b % REF_ALPHABET.length];
  return `CBS-${out}`;
}

export function buildRecord(pathway: PathwaySlug, input: RegistrationInput, now = new Date()): RegistrationRecord {
  const cfg = PATHWAYS[pathway];
  return {
    id: randomUUID(),
    ref: makeRef(),
    createdAt: now.toISOString(),
    date: now.toISOString().slice(0, 10),
    pathway,
    category: cfg.category,
    name: input.name,
    email: input.email,
    phone: input.phone,
    location: input.location,
    detail: input.detail,
    organisation: input.organisation,
    message: input.message,
    consent: true,
    consentNoticeVersion: CONSENT_NOTICE_VERSION,
    source: input.source,
  };
}

/** Stores the record, then asks the email adapter to acknowledge it. Email failures never lose the record. */
export async function saveRegistration(pathway: PathwaySlug, input: RegistrationInput): Promise<RegistrationRecord> {
  const record = buildRecord(pathway, input);
  await getStore().add(record);
  try {
    const email = getEmailAdapter();
    await email.send(buildAcknowledgement(record));
    await email.send(buildTeamNotification(record));
  } catch (err) {
    console.error('Email adapter failed (record was saved):', err instanceof Error ? err.message : 'unknown error');
  }
  return record;
}
