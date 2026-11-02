import { PATHWAYS, type PathwaySlug } from '@/content/pathways';

export function validPayload(pathway: PathwaySlug, overrides: Record<string, unknown> = {}) {
  const cfg = PATHWAYS[pathway];
  return {
    pathway,
    name: 'Ama Mensah',
    email: 'ama@example.com',
    phone: '+233 24 000 0000',
    location: 'Accra, Ghana',
    detail: cfg.detailOptions[0],
    organisation: cfg.hasOrganisation ? 'Example Ltd' : '',
    message: 'Hello, please keep me informed.',
    consent: true,
    source: 'home-map',
    website: '',
    ...overrides,
  };
}

export function postRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
