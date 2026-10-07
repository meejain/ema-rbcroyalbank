// Quick look at a scoping-only results file: blocks per page, prose count, samples, unassigned.
import fs from 'node:fs';
const f = process.argv[2] || '/backups/meejain/ema-rbcroyalbank/repo/stardust/qa/scope-only/results-test.json';
for (const p of JSON.parse(fs.readFileSync(f, 'utf8'))) {
  if (p.error) { console.log('ERR', p.slug, p.error); continue; }
  console.log(`== ${p.slug} [${p.type}] text kept ${Math.round(p.textKept * 100)}%`);
  console.log('   blocks:', p.items.filter((i) => i.kind === 'block').map((i) => i.variant + (i.box ? '' : '(no box)')).join(' | '));
  console.log('   prose nodes:', p.items.filter((i) => i.kind === 'prose').length, '· samples:', (p.samples || []).map((s) => s.variant).join(', '), '· unassigned:', p.unassigned.map((u) => `${u.id || u.cls}(${u.words}w)`).join(', '));
}
