/**
 * Sliding-window rate limiter held in memory.
 *
 * Good enough for a single-instance prototype. In production, replace the Map with a
 * shared store (for example Redis or Upstash) so limits hold across instances and restarts.
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: () => number,
    private readonly windowMs: () => number,
  ) {}

  private recent(key: string, now: number): number[] {
    const cutoff = now - this.windowMs();
    const list = (this.hits.get(key) ?? []).filter((t) => t > cutoff);
    if (list.length) this.hits.set(key, list);
    else this.hits.delete(key);
    return list;
  }

  /** Non-consuming check. */
  check(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
    const list = this.recent(key, now);
    if (list.length < this.max()) return { allowed: true, retryAfterSeconds: 0 };
    const oldest = list[0] ?? now;
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + this.windowMs() - now) / 1000)) };
  }

  /** Records one hit. */
  hit(key: string, now = Date.now()) {
    const list = this.recent(key, now);
    list.push(now);
    this.hits.set(key, list);
    // Keep memory bounded.
    if (this.hits.size > 10_000) {
      const first = this.hits.keys().next().value;
      if (first !== undefined) this.hits.delete(first);
    }
  }

  reset() {
    this.hits.clear();
  }
}

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const g = globalThis as unknown as {
  __cbsLimiters?: { submit: RateLimiter; attempts: RateLimiter; login: RateLimiter };
};

export function limiters() {
  g.__cbsLimiters ??= {
    // Successful or honeypot-flagged submissions per client.
    submit: new RateLimiter(
      () => num(process.env.RATE_LIMIT_MAX, 5),
      () => num(process.env.RATE_LIMIT_WINDOW_SECONDS, 600) * 1000,
    ),
    // Every request, including invalid ones, to blunt cheap abuse.
    attempts: new RateLimiter(
      () => num(process.env.RATE_LIMIT_MAX, 5) * 10,
      () => num(process.env.RATE_LIMIT_WINDOW_SECONDS, 600) * 1000,
    ),
    // Team login attempts.
    login: new RateLimiter(
      () => 5,
      () => 15 * 60 * 1000,
    ),
  };
  return g.__cbsLimiters;
}

/** Best-effort client IP. Behind a trusted proxy (for example Vercel) x-forwarded-for is set by the platform. */
export function clientKey(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  const first = fwd?.split(',')[0]?.trim();
  return first || headers.get('x-real-ip') || 'unknown';
}
