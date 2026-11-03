// Wires image files dropped in public/images/ into the image config and asset register.
//   Name each file after its slot id, e.g. public/images/home-hero.jpg (jpg, jpeg, png, webp or avif).
//   npm run images:add -- --tool="Name and version of the AI tool" [--date=2026-11-02] [--kind=ai-concept] [--dry]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import sharp from 'sharp';
import { aiRegister, applyImage, imageAspect, imageIds } from './image-sync.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, ...v] = a.replace(/^--/, '').split('=');
  return [k, v.length ? v.join('=') : true];
}));
const kind = args.kind ?? 'ai-concept';
if (!['ai-concept', 'licensed', 'commissioned', 'client-supplied'].includes(kind)) {
  console.error(`Unknown --kind "${kind}"`); process.exit(1);
}

const root = new URL('..', import.meta.url).pathname;
const configPath = path.join(root, 'src/content/images.ts');
const dir = path.join(root, 'public/images');
let source = readFileSync(configPath, 'utf8');
const ids = imageIds(source);
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));

let changed = 0;
for (const file of files) {
  const id = file.replace(/\.[^.]+$/, '');
  if (!ids.includes(id)) { console.warn(`skip   ${file}: no slot called "${id}". Slots: ${ids.join(', ')}`); continue; }
  const meta = await sharp(path.join(dir, file)).metadata();
  if (!meta.width || !meta.height) { console.warn(`skip   ${file}: could not read its size`); continue; }

  const want = imageAspect(source, id);
  const got = meta.width / meta.height;
  if (want && Math.abs(got - want) / want > 0.06) {
    console.warn(`warn   ${file}: ratio ${got.toFixed(2)} differs from the slot's ${want.toFixed(2)}. It will be cropped to fit.`);
  }
  if (meta.width < 1200) console.warn(`warn   ${file}: only ${meta.width}px wide. Aim for 1600px or more.`);

  const register = kind === 'ai-concept'
    ? aiRegister({ tool: typeof args.tool === 'string' ? args.tool : '', date: typeof args.date === 'string' ? args.date : '', file })
    : { source: '[Source to be recorded]', licence: '[Licence to be recorded]', permittedUse: '[Permitted use to be recorded]', approvalStatus: 'pending-review', approvedBy: '[Not yet approved]', notes: '' };

  source = applyImage(source, id, { kind, src: `/images/${file}`, width: meta.width, height: meta.height, register });
  changed++;
  console.log(`wired  ${file} -> ${id} (${meta.width} x ${meta.height}, ${kind})`);
}

if (!changed) { console.log('Nothing to do. Put files named after a slot id in public/images/.'); process.exit(0); }
if (args.dry) { console.log('Dry run: no files changed.'); process.exit(0); }
writeFileSync(configPath, source);
execFileSync(process.execPath, [path.join(root, 'scripts/generate-asset-register.mjs')], { stdio: 'inherit' });
console.log('\nNext: fill in the tool, date and prompt in each register entry, then set approvalStatus once Sai Legacy Holdings approves.');
