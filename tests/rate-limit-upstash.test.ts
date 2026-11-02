import { afterEach, describe, expect, it, vi } from 'vitest';
import { UpstashBackend, createUpstashBackendFromEnv } from '@/lib/rate-limit-upstash';
import { FallbackBackend, MemoryBackend, RateLimiter, buildLimiters, createBackend, resetLimitersForTests } from '@/lib/rate-limit';
import { POST } from '@/app/api/register/route';
import { postRequest, validPayload } from './helpers';

/** Minimal in-process stand-in for Upstash's REST /pipeline endpoint (sorted-set subset). */
function fakeUpstash(token = 'secret-token') {
  const zsets = new Map<string, { score: number; member: string }[]>();
  const log: unknown[][] = [];
  const state = { down: false, requests: 0 };

  const run = (cmd: (string | number)[]): unknown => {
    const [name, key, ...rest] = cmd as [string, string, ...(string | number)[]];
    const set = zsets.get(key) ?? [];
    switch (name) {
      case 'ZREMRANGEBYSCORE': {
        const [min, max] = rest.map(Number) as [number, number];
        const kept = set.filter((e) => e.score < min || e.score > max);
        zsets.set(key, kept);
        return set.length - kept.length;
      }
      case 'ZCARD':
        return set.length;
      case 'ZRANGE': {
        const sorted = [...set].sort((a, b) => a.score - b.score);
        const first = sorted[0];
        return first ? [first.member, String(first.score)] : [];
      }
      case 'ZADD': {
        const [score, member] = rest as [number, string];
        zsets.set(key, [...set, { score: Number(score), member }]);
        return 1;
      }
      case 'PEXPIRE':
        return set.length ? 1 : 0;
      case 'DEL':
        return [key, ...(rest as string[])].reduce((n, k) => n + (zsets.delete(String(k)) ? 1 : 0), 0);
      default:
        throw new Error(`ERR unknown command '${name}'`);
    }
  };

  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    state.requests++;
    if (state.down) throw new Error('network down');
    const headers = new Headers(init?.headers);
    if (headers.get('authorization') !== `Bearer ${token}`) return new Response('{"error":"Unauthorized"}', { status: 401 });
    expect(String(url)).toMatch(/\/pipeline$/);
    const commands = JSON.parse(String(init?.body)) as (string | number)[][];
    log.push(...commands);
    const out = commands.map((c) => {
      try {
        return { result: run(c) };
      } catch (e) {
        return { error: (e as Error).message };
      }
    });
    return new Response(JSON.stringify(out), { status: 200 });
  }) as typeof fetch;

  return { fetchImpl, zsets, log, state };
}

const W = 600_000;
const backendFor = (fake: ReturnType<typeof fakeUpstash>, token = 'secret-token') =>
  new UpstashBackend({ url: 'https://example.upstash.io/', token, fetchImpl: fake.fetchImpl });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  resetLimitersForTests();
});

describe('UpstashBackend', () => {
  it('counts hits inside the window and reports the oldest', async () => {
    const fake = fakeUpstash();
    const b = backendFor(fake);
    expect(await b.snapshot('k', 1_000_000, W)).toEqual({ count: 0, oldest: null });
    await b.add('k', 1_000_000, W);
    await b.add('k', 1_000_500, W);
    expect(await b.snapshot('k', 1_001_000, W)).toEqual({ count: 2, oldest: 1_000_000 });
  });

  it('slides: hits older than the window stop counting', async () => {
    const b = backendFor(fakeUpstash());
    await b.add('k', 1_000_000, W);
    await b.add('k', 1_300_000, W);
    expect(await b.snapshot('k', 1_000_000 + W + 1, W)).toEqual({ count: 1, oldest: 1_300_000 });
  });

  it('counts two hits in the same millisecond separately', async () => {
    const b = backendFor(fakeUpstash());
    await b.add('k', 5, W);
    await b.add('k', 5, W);
    expect((await b.snapshot('k', 6, W)).count).toBe(2);
  });

  it('sends auth, one pipelined request per operation, and sets an expiry', async () => {
    const fake = fakeUpstash();
    const b = backendFor(fake);
    await b.snapshot('k', 10, W);
    expect(fake.state.requests).toBe(1);
    await b.add('k', 10, W);
    expect(fake.state.requests).toBe(2);
    expect(fake.log.some((c) => c[0] === 'PEXPIRE' && c[2] === W)).toBe(true);
  });

  it('throws on a rejected token, an error reply or a network failure', async () => {
    const fake = fakeUpstash();
    await expect(backendFor(fake, 'wrong').snapshot('k', 1, W)).rejects.toThrow(/401/);
    fake.state.down = true;
    await expect(backendFor(fake).snapshot('k', 1, W)).rejects.toThrow('network down');
  });

  it('reset removes the keys this instance wrote', async () => {
    const fake = fakeUpstash();
    const b = backendFor(fake);
    await b.add('k1', 1, W);
    await b.add('k2', 1, W);
    await b.reset();
    expect(fake.zsets.size).toBe(0);
  });
});

describe('RateLimiter with Upstash', () => {
  it('blocks at the limit, reports Retry-After, and recovers as the window slides', async () => {
    const limiter = new RateLimiter('submit', () => 3, () => W, backendFor(fakeUpstash()));
    const t0 = 2_000_000;
    for (let i = 0; i < 3; i++) {
      expect((await limiter.check('1.2.3.4', t0 + i)).allowed).toBe(true);
      await limiter.hit('1.2.3.4', t0 + i);
    }
    const blocked = await limiter.check('1.2.3.4', t0 + 1000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(Math.ceil((t0 + W - (t0 + 1000)) / 1000));
    expect((await limiter.check('9.9.9.9', t0 + 1000)).allowed).toBe(true);
    expect((await limiter.check('1.2.3.4', t0 + W + 5)).allowed).toBe(true);
  });

  it('never sends the raw IP address to Redis', async () => {
    const fake = fakeUpstash();
    const limiter = new RateLimiter('submit', () => 3, () => W, backendFor(fake));
    await limiter.hit('203.0.113.77');
    await limiter.check('203.0.113.77');
    const sent = JSON.stringify(fake.log);
    expect(sent).not.toContain('203.0.113.77');
    expect(sent).toMatch(/cbs:rl:submit:[0-9a-f]{32}/);
  });

  it('keeps separate limiters in separate key spaces', async () => {
    const backend = backendFor(fakeUpstash());
    const a = new RateLimiter('submit', () => 1, () => W, backend);
    const b = new RateLimiter('login', () => 1, () => W, backend);
    await a.hit('ip');
    expect((await a.check('ip')).allowed).toBe(false);
    expect((await b.check('ip')).allowed).toBe(true);
  });
});

describe('FallbackBackend', () => {
  it('uses Upstash when healthy and the in-memory backend when it fails, without throwing', async () => {
    const fake = fakeUpstash();
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const limiter = new RateLimiter('submit', () => 2, () => W, new FallbackBackend(backendFor(fake), new MemoryBackend()));
    await limiter.hit('ip');
    expect(fake.zsets.size).toBe(1);

    fake.state.down = true;
    await expect(limiter.check('ip2')).resolves.toMatchObject({ allowed: true });
    await limiter.hit('ip2');
    await limiter.hit('ip2');
    expect((await limiter.check('ip2')).allowed).toBe(false); // still protected during the outage
    expect(err).toHaveBeenCalled();
    expect(String(err.mock.calls[0]?.[1])).not.toContain('secret-token');
  });
});

describe('backend selection from the environment', () => {
  it('defaults to memory with no credentials', () => {
    vi.stubEnv('RATE_LIMIT_DRIVER', '');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('KV_REST_API_URL', '');
    expect(createBackend()).toBeInstanceOf(MemoryBackend);
  });

  it('uses Upstash (with fallback) when credentials exist, under either naming', () => {
    vi.stubEnv('RATE_LIMIT_DRIVER', '');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://x.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 't');
    expect(createBackend()).toBeInstanceOf(FallbackBackend);
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('KV_REST_API_URL', 'https://y.upstash.io');
    vi.stubEnv('KV_REST_API_TOKEN', 't');
    expect(createBackend()).toBeInstanceOf(FallbackBackend);
  });

  it('fails loudly when upstash is requested without credentials, over http, or with an unknown driver', () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('KV_REST_API_URL', '');
    vi.stubEnv('RATE_LIMIT_DRIVER', 'upstash');
    expect(() => createBackend()).toThrow(/UPSTASH_REDIS_REST_URL/);
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'http://insecure.example');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 't');
    expect(() => createUpstashBackendFromEnv()).toThrow(/https/);
    vi.stubEnv('RATE_LIMIT_DRIVER', 'redis');
    expect(() => createBackend()).toThrow(/Unknown RATE_LIMIT_DRIVER/);
  });

  it('enforces the registration limit end to end through the route, backed by Upstash', async () => {
    const fake = fakeUpstash();
    resetLimitersForTests(buildLimiters(backendFor(fake)));
    for (let i = 0; i < 5; i++) expect((await POST(postRequest(validPayload('guest-updates')))).status).toBe(201);
    const blocked = await POST(postRequest(validPayload('guest-updates')));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
    // A different client is unaffected, and the shared store holds the counts.
    expect((await POST(postRequest(validPayload('guest-updates'), { 'x-forwarded-for': '198.51.100.9' }))).status).toBe(201);
    expect(fake.zsets.size).toBeGreaterThan(0);
  });
});
