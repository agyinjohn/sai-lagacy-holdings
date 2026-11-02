import { describe, expect, it } from 'vitest';
import { PATHWAY_SLUGS, PATHWAYS } from '@/content/pathways';
import { POST, GET } from '@/app/api/register/route';
import { getStore } from '@/lib/storage';
import { getEmailAdapter, ConsoleEmailAdapter } from '@/lib/email';
import { limiters } from '@/lib/rate-limit';
import { postRequest, validPayload } from './helpers';

describe('registration pathways (server validation and storage)', () => {
  it('defines exactly the seven required pathways', () => {
    expect(PATHWAY_SLUGS).toHaveLength(7);
  });

  describe.each(PATHWAY_SLUGS)('%s', (slug) => {
    const cfg = PATHWAYS[slug];

    it('stores a valid registration with every required field', async () => {
      const res = await POST(postRequest(validPayload(slug)));
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(body.ref).toMatch(/^CBS-[A-Z0-9]{8}$/);

      const [record] = await getStore().list();
      expect(record).toMatchObject({
        pathway: slug,
        category: cfg.category,
        name: 'Ama Mensah',
        email: 'ama@example.com',
        phone: '+233 24 000 0000',
        location: 'Accra, Ghana',
        detail: cfg.detailOptions[0],
        message: 'Hello, please keep me informed.',
        consent: true,
        source: 'home-map',
      });
      expect(record?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record?.createdAt).toBeTruthy();
      expect(record?.organisation).toBe(cfg.hasOrganisation ? 'Example Ltd' : '');
    });

    it('accepts every option listed for the pathway-specific detail', async () => {
      for (const option of cfg.detailOptions) {
        await limiters().submit.reset();
        await limiters().attempts.reset();
        const res = await POST(postRequest(validPayload(slug, { detail: option })));
        expect(res.status, option).toBe(201);
      }
    });

    it('rejects an invalid pathway-specific detail', async () => {
      const res = await POST(postRequest(validPayload(slug, { detail: 'Something else' })));
      expect(res.status).toBe(422);
      expect((await res.json()).fieldErrors.detail).toBeTruthy();
      expect(await getStore().list()).toHaveLength(0);
    });

    it('requires consent', async () => {
      const res = await POST(postRequest(validPayload(slug, { consent: false })));
      expect(res.status).toBe(422);
      expect((await res.json()).fieldErrors.consent).toBeTruthy();
    });

    it('requires name, a valid email and a location', async () => {
      const res = await POST(postRequest(validPayload(slug, { name: '', email: 'not-an-email', location: '' })));
      expect(res.status).toBe(422);
      const { fieldErrors } = await res.json();
      expect(Object.keys(fieldErrors).sort()).toEqual(['email', 'location', 'name']);
    });

    it('treats the honeypot as success but stores nothing', async () => {
      const res = await POST(postRequest(validPayload(slug, { website: 'https://spam.example' })));
      expect(res.status).toBe(201);
      expect(await getStore().list()).toHaveLength(0);
    });

    it('sends an acknowledgement and team notification only to the suppressed console adapter', async () => {
      await POST(postRequest(validPayload(slug)));
      const adapter = getEmailAdapter() as ConsoleEmailAdapter;
      const kinds = adapter.outbox.slice(-2).map((m) => m.kind);
      expect(kinds).toEqual(['acknowledgement', 'team-notification']);
    });
  });

  it('strips unknown fields and control characters', async () => {
    await POST(postRequest(validPayload('contact', { name: 'Kofi\u0000 Boateng', admin: true })));
    const [record] = await getStore().list();
    expect(record?.name).toBe('Kofi Boateng');
    expect(record).not.toHaveProperty('admin');
  });

  it('defaults an absent source to "direct" and rejects malformed sources', async () => {
    await POST(postRequest(validPayload('contact', { source: undefined })));
    expect((await getStore().list())[0]?.source).toBe('direct');
    const bad = await POST(postRequest(validPayload('contact', { source: '<script>' })));
    expect(bad.status).toBe(422);
  });

  it('rejects an unknown pathway, bad JSON, wrong content type and cross-origin posts', async () => {
    expect((await POST(postRequest({ ...validPayload('contact'), pathway: 'nope' }))).status).toBe(422);
    expect((await POST(postRequest('{not json'))).status).toBe(400);
    expect((await POST(postRequest(validPayload('contact'), { 'content-type': 'text/plain' }))).status).toBe(415);
    expect((await POST(postRequest(validPayload('contact'), { origin: 'https://evil.example', host: 'localhost:3000' }))).status).toBe(403);
    expect((await POST(postRequest(validPayload('contact'), { origin: 'http://localhost:3000', host: 'localhost:3000' }))).status).toBe(201);
  });

  it('rate limits repeated submissions from one client and sets Retry-After', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await POST(postRequest(validPayload('guest-updates')))).status).toBe(201);
    }
    const blocked = await POST(postRequest(validPayload('guest-updates')));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
    // A different client is unaffected.
    const other = await POST(postRequest(validPayload('guest-updates'), { 'x-forwarded-for': '198.51.100.9' }));
    expect(other.status).toBe(201);
  });

  it('only allows POST', async () => {
    expect(GET().status).toBe(405);
  });
});
