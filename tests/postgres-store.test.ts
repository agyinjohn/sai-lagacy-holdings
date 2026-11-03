import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { newDb } from 'pg-mem';
import { PostgresStore, type Queryable } from '@/lib/storage/postgres';
import { REGISTRATIONS_SCHEMA } from '@/lib/storage/schema';
import { buildRecord } from '@/lib/registration';
import { schemaFor } from '@/lib/validation';
import { PATHWAY_SLUGS, PATHWAYS } from '@/content/pathways';
import { toCsv } from '@/lib/export';
import { validPayload } from './helpers';

function memoryPg(): Queryable & { calls: { text: string; values?: unknown[] }[] } {
  const { Client } = newDb().adapters.createPg();
  const client = new Client();
  const ready = client.connect();
  const calls: { text: string; values?: unknown[] }[] = [];
  return {
    calls,
    async query(text, values) {
      await ready;
      calls.push({ text, values });
      return client.query(text, values as unknown[]);
    },
  };
}

const record = (slug: (typeof PATHWAY_SLUGS)[number], overrides: Record<string, unknown> = {}, at = new Date('2026-11-02T10:00:00Z')) =>
  buildRecord(slug, schemaFor(slug).parse(validPayload(slug, overrides)), at);

describe('PostgresStore', () => {
  it('creates the schema on first use and round-trips every field for every pathway', async () => {
    const store = new PostgresStore(memoryPg());
    const written = PATHWAY_SLUGS.map((s, i) => record(s, { name: `Person ${i}` }, new Date(Date.UTC(2026, 10, 2, 10, i))));
    for (const r of written) await store.add(r);
    const read = await store.list();
    expect(read).toEqual(written);
    expect(read.map((r) => r.category)).toEqual(PATHWAY_SLUGS.map((s) => PATHWAYS[s].category));
  });

  it('keeps timestamps and the calendar date exactly as written', async () => {
    const store = new PostgresStore(memoryPg());
    const r = record('contact', {}, new Date('2026-12-31T23:59:59.123Z'));
    await store.add(r);
    const [back] = await store.list();
    expect(back?.createdAt).toBe('2026-12-31T23:59:59.123Z');
    expect(back?.date).toBe('2026-12-31');
  });

  it('treats hostile input as data, never as SQL', async () => {
    const db = memoryPg();
    const store = new PostgresStore(db);
    const evil = `Robert'); DROP TABLE registrations;--`;
    await store.add(record('contact', { name: evil, message: `'; DELETE FROM registrations; --` }));
    await store.add(record('guest-updates'));
    const rows = await store.list();
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.name === evil)).toBeTruthy();
    const insert = db.calls.find((c) => c.text.startsWith('INSERT'));
    expect(insert?.text).not.toContain('DROP');
    expect(insert?.text).toMatch(/\$16/);
  });

  it('rejects a duplicate reference and a missing consent at the database level', async () => {
    const store = new PostgresStore(memoryPg());
    const r = record('contact');
    await store.add(r);
    await expect(store.add({ ...r, id: crypto.randomUUID() })).rejects.toThrow();
    await expect(store.add({ ...record('contact'), consent: false as unknown as true })).rejects.toThrow();
    expect(await store.list()).toHaveLength(1);
  });

  it('applies the schema once, and retries after a failed attempt', async () => {
    const db = memoryPg();
    const store = new PostgresStore(db);
    await store.add(record('contact'));
    await store.list();
    expect(db.calls.filter((c) => c.text.startsWith('CREATE TABLE')).length).toBe(1);

    // Fresh database for the retry scenario (pg-mem cannot re-run the multi-statement schema).
    const db2 = memoryPg();
    let fail = true;
    const flaky: Queryable = {
      async query(text, values) {
        if (fail && text.startsWith('CREATE TABLE')) throw new Error('connection refused');
        return db2.query(text, values);
      },
    };
    const retrying = new PostgresStore(flaky);
    await expect(retrying.list()).rejects.toThrow('connection refused');
    fail = false;
    await expect(retrying.list()).resolves.toBeDefined();
  });

  it('skips migration when autoMigrate is off', async () => {
    const db = memoryPg();
    await db.query(REGISTRATIONS_SCHEMA);
    db.calls.length = 0;
    const store = new PostgresStore(db, { autoMigrate: false });
    await store.add(record('contact'));
    expect(db.calls.some((c) => c.text.startsWith('CREATE TABLE'))).toBe(false);
  });

  it('feeds the exports exactly like the other adapters', async () => {
    const store = new PostgresStore(memoryPg());
    await store.add(record('legacy-unit', { name: '=HYPERLINK("http://x")' }));
    const csv = toCsv(await store.list());
    expect(csv).toContain(`"'=HYPERLINK(""http://x"")"`);
  });

  it('keeps db/schema.sql identical to the schema the code applies', () => {
    const sql = readFileSync(path.resolve(__dirname, '../db/schema.sql'), 'utf8');
    expect(sql).toContain(REGISTRATIONS_SCHEMA.trim());
  });
});
