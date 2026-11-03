import { afterEach, describe, expect, it } from 'vitest';
import { getStore, resetStoreForTests } from '@/lib/storage';

const saved = { driver: process.env.STORAGE_DRIVER, url: process.env.DATABASE_URL };
afterEach(() => {
  process.env.STORAGE_DRIVER = saved.driver;
  if (saved.url === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = saved.url;
  resetStoreForTests();
});

describe('STORAGE_DRIVER=postgres', () => {
  it('refuses to start without DATABASE_URL, with a clear message', () => {
    process.env.STORAGE_DRIVER = 'postgres';
    delete process.env.DATABASE_URL;
    expect(() => getStore()).toThrow(/DATABASE_URL/);
  });

  it('builds a store lazily without connecting until first use', () => {
    process.env.STORAGE_DRIVER = 'postgres';
    process.env.DATABASE_URL = 'postgres://user:pass@127.0.0.1:1/none';
    expect(getStore()).toBeTruthy();
  });

  it('still rejects unknown drivers', () => {
    process.env.STORAGE_DRIVER = 'mongo';
    expect(() => getStore()).toThrow(/Unknown STORAGE_DRIVER/);
  });
});
