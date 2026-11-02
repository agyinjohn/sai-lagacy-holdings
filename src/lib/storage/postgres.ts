import type { RegistrationRecord } from '@/lib/types';
import type { PathwaySlug } from '@/content/pathways';
import type { RegistrationStore } from '@/lib/storage';
import { REGISTRATIONS_SCHEMA } from '@/lib/storage/schema';

/** The only part of a Postgres client the adapter needs. `pg.Pool` satisfies it. */
export interface Queryable {
  query(text: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}

const COLUMNS = [
  'id', 'ref', 'created_at', 'date', 'pathway', 'category', 'name', 'email', 'phone',
  'location', 'detail', 'organisation', 'message', 'consent', 'consent_notice_version', 'source',
] as const;

function toRecord(row: Record<string, unknown>): RegistrationRecord {
  const created = row.created_at;
  return {
    id: String(row.id),
    ref: String(row.ref),
    createdAt: created instanceof Date ? created.toISOString() : new Date(String(created)).toISOString(),
    date: String(row.date),
    pathway: row.pathway as PathwaySlug,
    category: String(row.category),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone ?? ''),
    location: String(row.location),
    detail: String(row.detail),
    organisation: String(row.organisation ?? ''),
    message: String(row.message ?? ''),
    consent: true,
    consentNoticeVersion: String(row.consent_notice_version),
    source: String(row.source),
  };
}

/**
 * Postgres-backed registration store. Works with any Postgres that accepts a connection string
 * (Neon, Supabase, Vercel Marketplace databases, RDS and so on). All values are passed as query
 * parameters, never concatenated into SQL.
 */
export class PostgresStore implements RegistrationStore {
  private ready: Promise<void> | null = null;

  constructor(
    private readonly db: Queryable,
    private readonly options: { autoMigrate?: boolean } = {},
  ) {}

  /** Creates the table once per process. A failed attempt is retried on the next call. */
  private ensureSchema(): Promise<void> {
    if (this.options.autoMigrate === false) return Promise.resolve();
    this.ready ??= this.db.query(REGISTRATIONS_SCHEMA).then(
      () => undefined,
      (err) => {
        this.ready = null;
        throw err;
      },
    );
    return this.ready;
  }

  async add(r: RegistrationRecord): Promise<void> {
    await this.ensureSchema();
    const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(', ');
    await this.db.query(`INSERT INTO registrations (${COLUMNS.join(', ')}) VALUES (${placeholders})`, [
      r.id, r.ref, r.createdAt, r.date, r.pathway, r.category, r.name, r.email, r.phone,
      r.location, r.detail, r.organisation, r.message, r.consent, r.consentNoticeVersion, r.source,
    ]);
  }

  async list(): Promise<RegistrationRecord[]> {
    await this.ensureSchema();
    const { rows } = await this.db.query(`SELECT ${COLUMNS.join(', ')} FROM registrations ORDER BY created_at ASC, ref ASC`);
    return rows.map(toRecord);
  }
}

/** Builds a pooled client from DATABASE_URL. `pg` is loaded only when this driver is selected. */
export function createPostgresStoreFromEnv(): PostgresStore {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('STORAGE_DRIVER=postgres needs DATABASE_URL (a Postgres connection string).');

  let pool: Queryable | null = null;
  const lazy: Queryable = {
    async query(text, values) {
      if (!pool) {
        const { Pool } = await import('pg');
        // Small pool: each serverless instance holds its own connections.
        const created = new Pool({
          connectionString: url,
          max: Number(process.env.PG_POOL_MAX ?? 3) || 3,
          idleTimeoutMillis: 10_000,
          connectionTimeoutMillis: 8_000,
        });
        // Idle clients can error (for example when the database restarts). Log and let the pool recover.
        created.on('error', (err) => console.error('Postgres pool error:', err.message));
        pool = created as unknown as Queryable;
      }
      return pool.query(text, values);
    },
  };
  return new PostgresStore(lazy, { autoMigrate: process.env.DATABASE_AUTO_MIGRATE !== 'false' });
}
