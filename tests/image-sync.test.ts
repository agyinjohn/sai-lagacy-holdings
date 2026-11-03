import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { aiRegister, applyImage, imageAspect, imageIds } from '../scripts/image-sync.mjs';

const source = readFileSync(path.resolve(__dirname, 'fixtures/images-placeholders.txt'), 'utf8');
const info = (over = {}) => ({
  kind: 'ai-concept', src: '/images/culture-feature.jpg', width: 1800, height: 1200,
  register: aiRegister({ tool: "Tool's v1", date: '2026-11-02', file: 'culture-feature.jpg' }), ...over,
});

// Uses a fixed snapshot of the all-placeholder config so the tests do not depend on which real images are wired in.
describe('image sync', () => {
  it('finds all eight slots and their aspect ratios', () => {
    expect(imageIds(source)).toHaveLength(8);
    expect(imageAspect(source, 'culture-feature')).toBeCloseTo(1.5);
    expect(imageAspect(source, 'home-hero')).toBeCloseTo(21 / 9);
  });

  it('wires one slot and leaves the others untouched', () => {
    const out = applyImage(source, 'culture-feature', info());
    expect(out).toContain("src: '/images/culture-feature.jpg'");
    expect(out.match(/src: null/g)).toHaveLength(7);
    expect(out).toContain("kind: 'ai-concept'");
    expect(out).toContain("approvalStatus: 'pending-review'");
    expect(out).toContain("Tool\\'s v1");
    expect(imageIds(out)).toEqual(imageIds(source));
  });

  it('produces a file that still type-parses as a module (balanced braces, ends the same)', () => {
    const out = applyImage(applyImage(source, 'culture-feature', info()), 'home-hero', info({ src: '/images/home-hero.jpg', width: 2400, height: 1028 }));
    const count = (s: string, c: string) => s.split(c).length - 1;
    expect(count(out, '{')).toBe(count(out, '}'));
    expect(out.trimEnd().endsWith(source.trimEnd().slice(-40))).toBe(true);
  });

  it('is idempotent and never resets an approved entry', () => {
    const once = applyImage(source, 'culture-feature', info());
    const approved = once.replace(/(culture-feature'[\s\S]*?approvalStatus: )'pending-review'/, "$1'approved'").replace(/(culture-feature'[\s\S]*?approvedBy: )'\[Not yet approved\]'/, "$1'A. Approver'");
    const again = applyImage(approved, 'culture-feature', info({ width: 2400, height: 1600 }));
    expect(again).toContain("approvedBy: 'A. Approver'");
    expect(again).toContain('width: 2400');
    expect(applyImage(once, 'culture-feature', info())).toBe(once);
  });

  it('rejects an unknown slot', () => {
    expect(() => applyImage(source, 'nope', info())).toThrow(/not in src\/content\/images.ts/);
  });
});
