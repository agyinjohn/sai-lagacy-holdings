import { randomBytes } from 'node:crypto';
import type { LimiterBackend, LimitSnapshot } from '@/lib/rate-limit';

/**
 * Upstash Redis rate-limit backend, using Upstash's REST API directly (no extra dependency).
 *
 * Each key is a sorted set of hit timestamps. A snapshot trims entries older than the window, then
 * reads the count and the oldest remaining hit, all in one pipelined request. Adding a hit is one
 * pipelined ZADD plus an expiry so idle keys clean themselves up.
 *
 * Note: "check then hit" is two round trips, so two simultaneous requests from the same client can
 * both pass the check. That is acceptable for abuse protection on a registration form. It is not a
 * strict quota.
 */

type Fetch = typeof fetch;
type Command = (string | number)[];
type PipelineItem = { result?: unknown; error?: string };

export interface UpstashOptions {
  url: string;
  token: string;
  fetchImpl?: Fetch;
  timeoutMs?: number;
}

export class UpstashBackend implements LimiterBackend {
  private readonly url: string;
  private readonly token: string;
  private readonly fetchImpl: Fetch;
  private readonly timeoutMs: number;
  /** Keys this instance has written, so reset() (tests and tooling) can remove them. */
  private touched = new Set<string>();

  constructor(opts: UpstashOptions) {
    this.url = opts.url.replace(/\/+$/, '');
    this.token = opts.token;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.timeoutMs = opts.timeoutMs ?? 2000;
  }

  private async pipeline(commands: Command[]): Promise<unknown[]> {
    const res = await this.fetchImpl(`${this.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      cache: 'no-store',
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
    const items = (await res.json()) as PipelineItem[];
    if (!Array.isArray(items) || items.length !== commands.length) throw new Error('Unexpected Upstash response');
    return items.map((item) => {
      if (item.error) throw new Error(`Upstash error: ${item.error}`);
      return item.result;
    });
  }

  async snapshot(key: string, now: number, windowMs: number): Promise<LimitSnapshot> {
    const [, count, oldest] = await this.pipeline([
      ['ZREMRANGEBYSCORE', key, 0, now - windowMs],
      ['ZCARD', key],
      ['ZRANGE', key, 0, 0, 'WITHSCORES'],
    ]);
    const first = Array.isArray(oldest) && oldest.length >= 2 ? Number(oldest[1]) : null;
    return { count: Number(count) || 0, oldest: first !== null && Number.isFinite(first) ? first : null };
  }

  async add(key: string, now: number, windowMs: number): Promise<void> {
    // Unique member so two hits in the same millisecond both count.
    const member = `${now}-${randomBytes(4).toString('hex')}`;
    await this.pipeline([
      ['ZADD', key, now, member],
      ['PEXPIRE', key, windowMs],
    ]);
    this.touched.add(key);
  }

  async reset(): Promise<void> {
    const keys = [...this.touched];
    this.touched.clear();
    if (keys.length) await this.pipeline([['DEL', ...keys]]);
  }
}

/** Reads credentials from the names Upstash uses, or those used by Vercel's KV integration. */
export function createUpstashBackendFromEnv(): UpstashBackend | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!/^https:\/\//.test(url)) throw new Error('The Upstash REST URL must start with https://');
  return new UpstashBackend({ url, token });
}
