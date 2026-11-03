// Regenerates docs/asset-register.md from src/content/images.ts (the single source of truth).
// Run with: npm run assets:register
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const src = readFileSync(new URL('../src/content/images.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { IMAGES, OTHER_ASSETS } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

const esc = (v) => String(v).replace(/\|/g, '\\|');
const rows = [
  ...Object.values(IMAGES).map((i) => [i.id, i.kind, i.src ?? '(placeholder)', i.register.source, i.register.licence, i.register.permittedUse, i.register.approvalStatus, i.register.approvedBy]),
  ...OTHER_ASSETS.map((a) => [a.id, a.type, a.file, a.source, a.licence, a.permittedUse, a.approvalStatus, a.approvedBy]),
];
const md = `# Asset register

Generated from \`src/content/images.ts\`. Do not edit by hand. Run \`npm run assets:register\`.

Every AI-generated concept image must show: "Concept for illustration only. Not an approved design or completed facility." The \`SiteImage\` component enforces this.

| ID | Kind | File | Source | Licence | Permitted use | Approval status | Approved by |
|---|---|---|---|---|---|---|---|
${rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n')}
`;
writeFileSync(new URL('../docs/asset-register.md', import.meta.url), md);
console.log(`Wrote docs/asset-register.md (${rows.length} assets)`);
