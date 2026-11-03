import { createHash } from 'node:crypto';
import { createUpstashBackendFromEnv } from '@/lib/rate-limit-upstash';

/**
 * Sliding-window rate limiting with a pluggable backend:
 *  - MemoryBackend: per server instance. Fine locally and for a single-instance demo.
 *  - UpstashBackend: shared across instances (see rate-limit-upstash.ts). Use on Vercel.
 * Select with RATE_LIMIT_DRIVER=memory|upstash. If unset, Upstash is used when its credentials exist.
 */

export interface LimitSnapshot {
  count: number;
  /** Timestamp (ms) of the oldest hit still inside the window, or null when there are none. */
  oldest: number | null;
}

export interface LimiterBackend {
  snapshot(key: string, now: number, windowMs: number): Promise<LimitSnapshot>;
  add(key: string, now: number, windowMs: number): Promise<void>;
  reset(): Promise<void>;
}

export class MemoryBackend implements LimiterBackend {
  private hits = new Map<string, number[]>();

  private recent(key: string, now: number, windowMs: number): number[] {
    const cutoff = now - windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > cutoff);
    if (list.length) this.hits.set(key, list);
    else this.hits.delete(key);
    return list;
  }

  async snapshot(key: string, now: number, windowMs: number) {
    const list = this.recent(key, now, windowMs);
    return { count: list.length, oldest: list[0] ?? null };
  }

  async add(key: string, now: number, windowMs: number) {
    const list = this.recent(key, now, windowMs);
    list.push(now);
    this.hits.set(key, list);
    if (this.hits.size > 10_000) {
      const first = this.hits.keys().next().value;
      if (first !== undefined) this.hits.delete(first);
    }
  }

  async reset() {
    this.hits.clear();
  }
}

/**
 * Uses `primary`, and on any error logs once per failure and answers from `fallback` instead.
 * A limiter outage must never block genuine visitors, and the fallback still gives per-instance protection.
 */
export class FallbackBackend implements LimiterBackend {
  constructor(
    private readonly primary: LimiterBackend,
    private readonly fallback: LimiterBackend,
  ) {}

  private async run<T>(op: string, withBackend: (b: LimiterBackend) => Promise<T>): Promise<T> {
    try {
      return await withBackend(this.primary);
    } catch (err) {
      console.error(`Rate limit backend failed on ${op}, using in-memory fallback:`, err instanceof Error ? err.message : 'unknown error');
      return withBackend(this.fallback);
    }
  }

  snapshot(key: string, now: number, windowMs: number) {
    return this.run('snapshot', (b) => b.snapshot(key, now, windowMs));
  }
  add(key: string, now: number, windowMs: number) {
    return this.run('add', (b) => b.add(key, now, windowMs));
  }
  async reset() {
    await Promise.allSettled([this.primary.reset(), this.fallback.reset()]);
  }
}

export class RateLimiter {
  constructor(
    private readonly name: string,
    private readonly max: () => number,
    private readonly windowMs: () => number,
    private readonly backend: LimiterBackend,
  ) {}

  /** Client identifiers (IP addresses) are hashed so they are never stored or sent in the clear. */
  private key(raw: string) {
    return `cbs:rl:${this.name}:${createHash('sha256').update(raw).digest('hex').slice(0, 32)}`;
  }

  /** Non-consuming check. */
  async check(raw: string, now = Date.now()): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
    const snap = await this.backend.snapshot(this.key(raw), now, this.windowMs());
    if (snap.count < this.max()) return { allowed: true, retryAfterSeconds: 0 };
    const oldest = snap.oldest ?? now;
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + this.windowMs() - now) / 1000)) };
  }

  /** Records one hit. */
  async hit(raw: string, now = Date.now()): Promise<void> {
    await this.backend.add(this.key(raw), now, this.windowMs());
  }

  reset(): Promise<void> {
    return this.backend.reset();
  }
}

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function createBackend(): LimiterBackend {
  const driver = process.env.RATE_LIMIT_DRIVER;
  if (driver && driver !== 'memory' && driver !== 'upstash') {
    throw new Error(`Unknown RATE_LIMIT_DRIVER "${driver}". Use "upstash" or "memory".`);
  }
  if (driver === 'memory') return new MemoryBackend();
  const upstash = createUpstashBackendFromEnv();
  if (upstash) return new FallbackBackend(upstash, new MemoryBackend());
  if (driver === 'upstash') {
    throw new Error('RATE_LIMIT_DRIVER=upstash needs UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN).');
  }
  return new MemoryBackend();
}

type Limiters = { submit: RateLimiter; attempts: RateLimiter; login: RateLimiter };
const g = globalThis as unknown as { __cbsLimiters?: Limiters };

export function buildLimiters(backend: LimiterBackend): Limiters {
  const windowMs = () => num(process.env.RATE_LIMIT_WINDOW_SECONDS, 600) * 1000;
  return {
    // Successful or honeypot-flagged submissions per client.
    submit: new RateLimiter('submit', () => num(process.env.RATE_LIMIT_MAX, 5), windowMs, backend),
    // Every request, including invalid ones, to blunt cheap abuse.
    attempts: new RateLimiter('attempts', () => num(process.env.RATE_LIMIT_MAX, 5) * 10, windowMs, backend),
    // Team login attempts.
    login: new RateLimiter('login', () => 5, () => 15 * 60 * 1000, backend),
  };
}

export function limiters(): Limiters {
  g.__cbsLimiters ??= buildLimiters(createBackend());
  return g.__cbsLimiters;
}

export function resetLimitersForTests(next?: Limiters) {
  g.__cbsLimiters = next;
}

/** Best-effort client IP. Behind a trusted proxy (for example Vercel) x-forwarded-for is set by the platform. */
export function clientKey(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  const first = fwd?.split(',')[0]?.trim();
  return first || headers.get('x-real-ip') || 'unknown';
}
