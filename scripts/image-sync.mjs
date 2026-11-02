// Pure helpers for wiring image files into src/content/images.ts. Used by add-images.mjs and tested.

const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export function imageIds(source) {
  const start = source.indexOf('export const IMAGES');
  const end = source.indexOf('} as const satisfies');
  return [...source.slice(start, end).matchAll(/^ {2}'([a-z0-9-]+)': \{/gm)].map((m) => m[1]);
}

export function imageAspect(source, id) {
  const block = findBlock(source, id);
  const m = source.slice(block.start, block.end).match(/aspect: '(\d+)\/(\d+)'/);
  return m ? Number(m[1]) / Number(m[2]) : null;
}

function findBlock(source, id) {
  const head = `  '${id}': {\n`;
  const start = source.indexOf(head);
  if (start === -1) throw new Error(`Image id "${id}" is not in src/content/images.ts`);
  const end = source.indexOf('\n  },\n', start);
  if (end === -1) throw new Error(`Could not find the end of the "${id}" entry`);
  return { start, end };
}

/**
 * Points an image entry at a real file. If the entry is already approved, its register is left
 * alone so a re-run can never reset an approval.
 */
export function applyImage(source, id, info) {
  const { start, end } = findBlock(source, id);
  let block = source.slice(start, end);
  const approved = /approvalStatus: 'approved'/.test(block);

  block = block
    .replace(/kind: '[^']*',/, `kind: ${q(info.kind)},`)
    .replace(/src: (null|'[^']*'),/, `src: ${q(info.src)},`)
    .replace(/width: \d+,/, `width: ${info.width},`)
    .replace(/height: \d+,/, `height: ${info.height},`);

  if (!approved) {
    const r = info.register;
    const registerText = `    register: {
      source: ${q(r.source)},
      licence: ${q(r.licence)},
      permittedUse: ${q(r.permittedUse)},
      approvalStatus: ${q(r.approvalStatus)},
      approvedBy: ${q(r.approvedBy)},
      notes: ${q(r.notes)},
    },`;
    const idx = block.indexOf('\n    register:');
    if (idx === -1) throw new Error(`No register found in the "${id}" entry`);
    block = block.slice(0, idx) + '\n' + registerText.replace(/\n$/, '');
    // Trailing comma already included in registerText.
  }
  return source.slice(0, start) + block + source.slice(end);
}

export function aiRegister({ tool, date, file }) {
  return {
    source: `AI-generated concept image (${file}). Tool: ${tool || '[tool and version to be recorded]'}. Generated: ${date || '[date to be recorded]'}. Prompt: [prompt reference to be recorded]`,
    licence: '[Licence terms of the generating tool to be confirmed for this use]',
    permittedUse: 'Concept illustration on this prototype only, always with the concept caption. Not an approved design or completed facility.',
    approvalStatus: 'pending-review',
    approvedBy: '[Not yet approved]',
    notes: 'Awaiting review by Sai Legacy Holdings. Check it implies no unapproved buildings, numbers, people or cultural patterns.',
  };
}
