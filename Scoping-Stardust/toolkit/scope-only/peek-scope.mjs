// Quick look at how each default-scope instance on a page maps onto the scoping-only classification.
import fs from 'node:fs';
const f = process.argv[2] || '/backups/meejain/ema-rbcroyalbank/repo/stardust/qa/scope-only/results-test.json';
for (const p of JSON.parse(fs.readFileSync(f, 'utf8'))) {
  console.log(`== ${p.slug}`);
  for (const m of p.scopeMap || []) console.log(`   ${m.type.padEnd(11)} ${m.variantId.padEnd(18)} ${m.found ? `${m.holder} (${Math.round(m.share * 100)}% ${m.via})` : 'NOT FOUND'}`);
}
