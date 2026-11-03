import type { RegistrationRecord } from '@/lib/types';
import { PATHWAYS } from '@/content/pathways';

/**
 * Email abstraction. The prototype NEVER sends real email. The "console" adapter only
 * records that an email would have been sent (no body, no recipient address in logs).
 *
 * To go live, implement EmailAdapter with an approved provider (for example Resend,
 * Postmark or AWS SES), and select it in getEmailAdapter().
 */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  kind: 'acknowledgement' | 'team-notification';
}

export interface EmailAdapter {
  send(message: EmailMessage): Promise<void>;
}

export class ConsoleEmailAdapter implements EmailAdapter {
  /** Last few suppressed messages, kept in memory for tests and the demo. Never logged in full. */
  readonly outbox: EmailMessage[] = [];

  async send(message: EmailMessage) {
    this.outbox.push(message);
    if (this.outbox.length > 50) this.outbox.shift();
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[email suppressed: prototype] kind=${message.kind} subject="${message.subject}"`);
    }
  }
}

const g = globalThis as unknown as { __cbsEmail?: EmailAdapter };

export function getEmailAdapter(): EmailAdapter {
  const driver = process.env.EMAIL_DRIVER ?? 'console';
  if (driver !== 'console') {
    throw new Error(`EMAIL_DRIVER "${driver}" has no adapter. The prototype only supports "console".`);
  }
  g.__cbsEmail ??= new ConsoleEmailAdapter();
  return g.__cbsEmail;
}

export const TEAM_INBOX_PLACEHOLDER = '[team inbox address to be supplied]';

export function buildAcknowledgement(record: RegistrationRecord): EmailMessage {
  const cfg = PATHWAYS[record.pathway];
  const first = record.name.split(/\s+/)[0] ?? record.name;
  return {
    kind: 'acknowledgement',
    to: record.email,
    subject: `${cfg.title}: we have your details`,
    text: [
      `Dear ${first},`,
      '',
      cfg.thanks,
      `Your reference is ${record.ref}.`,
      '',
      'This message comes from a prototype website. No commitment has been made on either side.',
      '',
      'The Courtyard by Sai, a development by Sai Legacy Holdings',
    ].join('\n'),
  };
}

export function buildTeamNotification(record: RegistrationRecord): EmailMessage {
  return {
    kind: 'team-notification',
    to: process.env.TEAM_NOTIFICATION_EMAIL ?? TEAM_INBOX_PLACEHOLDER,
    subject: `New registration: ${record.category} (${record.ref})`,
    text: [
      `Category: ${record.category}`,
      `Reference: ${record.ref}`,
      `Received: ${record.createdAt}`,
      'Open the team view to see the full record.',
    ].join('\n'),
  };
}
