import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { IMAGES, OTHER_ASSETS } from '@/content/images';
import { CONCEPT_CAPTION, PLACEHOLDERS } from '@/content/site';
import { PATHWAYS } from '@/content/pathways';

const root = path.resolve(__dirname, '..');
function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|md|css)$/.test(f)) out.push(p);
  }
  return out;
}
const files = [...walk(path.join(root, 'src')), path.join(root, 'README.md'), ...walk(path.join(root, 'docs'))];

describe('content rules', () => {
  it('uses no em dashes anywhere in source or docs', () => {
    const offenders = files.filter((f) => readFileSync(f, 'utf8').includes('—'));
    expect(offenders).toEqual([]);
  });

  it('does not use cultural patterns that have not been supplied', () => {
    const offenders = files.filter((f) => !f.includes('images.ts') && !f.endsWith('README.md') && /\b(kente|adinkra)\b/i.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('shows the required concept caption wording', () => {
    expect(CONCEPT_CAPTION).toBe('Concept for illustration only. Not an approved design or completed facility.');
  });

  it('has bracketed placeholders for missing information', () => {
    for (const value of Object.values(PLACEHOLDERS)) expect(value).toMatch(/^\[.*\]$/);
    expect(PLACEHOLDERS.legacyUnit).toContain('Legacy Unit overview and legal disclaimer');
  });

  it('keeps worksheet names within the Excel 31 character limit', () => {
    for (const p of Object.values(PATHWAYS)) expect(p.sheet.length).toBeLessThanOrEqual(31);
  });
});

describe('image configuration and asset register', () => {
  it('records source, licence, permitted use and approval status for every image', () => {
    for (const img of Object.values(IMAGES)) {
      expect(img.register.source, img.id).toBeTruthy();
      expect(img.register.licence, img.id).toBeTruthy();
      expect(img.register.permittedUse, img.id).toBeTruthy();
      expect(img.register.approvalStatus, img.id).toBeTruthy();
    }
    for (const a of OTHER_ASSETS) expect(a.licence, a.id).toBeTruthy();
  });

  it('never marks an image approved without an approver, and never ships an unregistered placeholder as supplied', () => {
    for (const img of Object.values(IMAGES) as { id: string; src: string | null; kind: string; register: { approvalStatus: string; approvedBy: string } }[]) {
      if (img.register.approvalStatus === 'approved') expect(img.register.approvedBy).not.toMatch(/Not yet/);
      if (img.src === null) expect(img.register.approvalStatus).toBe('not-supplied');
    }
  });

  it('keeps the logo file byte-identical to the supplied asset dimensions', () => {
    const buf = readFileSync(path.join(root, 'public/brand/sai-legacy-holdings-logo.png'));
    expect(buf.readUInt32BE(16)).toBe(1000);
    expect(buf.readUInt32BE(20)).toBe(307);
  });
});
