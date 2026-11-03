import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { RegistrationRecord } from '@/lib/types';
import { createPostgresStoreFromEnv } from '@/lib/storage/postgres';

/**
 * Storage abstraction. The prototype ships two adapters:
 *  - "postgres": a Postgres database via DATABASE_URL (use this on Vercel and any serverless host).
 *  - "file":   a private JSON file (default). Fine for a demo on a single server.
 *  - "memory": lost on restart. Used by tests.
 *
 * Other databases: implement RegistrationStore and return it from getStore(). Nothing else changes.
 */
export interface RegistrationStore {
  add(record: RegistrationRecord): Promise<void>;
  list(): Promise<RegistrationRecord[]>;
}

export class MemoryStore implements RegistrationStore {
  private records: RegistrationRecord[] = [];
  async add(record: RegistrationRecord) {
    this.records.push(structuredClone(record));
  }
  async list() {
    return structuredClone(this.records);
  }
}

export class FileStore implements RegistrationStore {
  private chain: Promise<unknown> = Promise.resolve();
  private readonly file: string;

  constructor(private readonly dir: string) {
    this.file = path.join(dir, 'registrations.json');
  }

  private async read(): Promise<RegistrationRecord[]> {
    try {
      const raw = await fs.readFile(this.file, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as RegistrationRecord[]) : [];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw err;
    }
  }

  /** Serialises writes so concurrent submissions cannot overwrite each other. */
  add(record: RegistrationRecord): Promise<void> {
    const run = async () => {
      await fs.mkdir(this.dir, { recursive: true, mode: 0o700 });
      const all = await this.read();
      all.push(record);
      const tmp = `${this.file}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(all, null, 2), { mode: 0o600 });
      await fs.rename(tmp, this.file);
    };
    const next = this.chain.then(run, run);
    this.chain = next.catch(() => undefined);
    return next as Promise<void>;
  }

  async list() {
    await this.chain;
    return this.read();
  }
}

type StoreCache = { key: string; store: RegistrationStore };
const g = globalThis as unknown as { __cbsStore?: StoreCache };

export function getStore(): RegistrationStore {
  const driver = process.env.STORAGE_DRIVER ?? 'file';
  // Resolved at runtime on purpose: the data directory is private and must never be traced into the bundle.
  const dir = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.DATA_DIR ?? '.data');
  const key = `${driver}:${dir}:${driver === 'postgres' ? process.env.DATABASE_URL ?? '' : ''}`;
  if (g.__cbsStore?.key === key) return g.__cbsStore.store;

  let store: RegistrationStore;
  if (driver === 'memory') store = new MemoryStore();
  else if (driver === 'file') store = new FileStore(dir);
  else if (driver === 'postgres') store = createPostgresStoreFromEnv();
  else throw new Error(`Unknown STORAGE_DRIVER "${driver}". Use "postgres", "file" or "memory".`);

  g.__cbsStore = { key, store };
  return store;
}

export function resetStoreForTests() {
  g.__cbsStore = undefined;
}
