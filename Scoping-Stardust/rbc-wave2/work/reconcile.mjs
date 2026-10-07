// Phase 0 reconciliation: discovered pages per cohort vs the customer's sheet, with the reasons behind each
// difference (stale sitemap URLs, redirects, canonical duplicates, folder breakdown). Writes
// inventory/RECONCILIATION.md and inventory/urls-<cohort>.txt (the candidate list for Gate 0).
import fs from 'node:fs';
const ROOT = new URL('..', import.meta.url).pathname;
const I = `${ROOT}inventory`;
const order = ['customer-service', 'mortgages', 'loans', 'investments', 'business-commercial', 'direct-investing', 'rbc-bank', 'avion-rewards'];
const label = { 'customer-service': 'Customer Service', mortgages: 'Mortgages', loans: 'Personal Loans', investments: 'Investments', 'business-commercial': 'Business + Commercial', 'direct-investing': 'Direct Investing', 'rbc-bank': 'RBC Bank (US)', 'avion-rewards': 'Avion Rewards' };
const rows = []; let md = '# RBC wave 2: page inventory reconciliation (Phase 0)\n\nEN only. Discovered by a folder-scoped crawl seeded with the sitemap, then a rendered-browser pass that collects script-built links. Every URL listed was fetched: pages returned 200; redirects and 404s are listed separately.\n\n';
const detail = [];
for (const c of order) {
  const f = `${I}/${c}.json`; if (!fs.existsSync(f)) continue;
  const inv = JSON.parse(fs.readFileSync(f, 'utf8'));
  const dup = new Set(inv.canonicalDuplicates.map((d) => d.url));
  const live = inv.pages.filter((p) => !dup.has(p.url));
  const p = (u) => u.replace(/^https:\/\/[^/]+/, '');
  fs.writeFileSync(`${I}/urls-${c}.txt`, `${live.map((x) => x.url).sort().join('\n')}\n`);
  const folders = {}; live.forEach((x) => { const seg = p(x.url).split('/').filter(Boolean); const k = seg.length > (inv.prefixes[0] === '/' ? 1 : 2) ? `/${seg.slice(0, inv.prefixes[0] === '/' ? 1 : 2).join('/')}/` : '(top level)'; folders[k] = (folders[k] || 0) + 1; });
  const err404 = inv.errors.filter((e) => e.status === 404).length;
  const diff = live.length - inv.sheetCount;
  rows.push(`| ${label[c]} | ${inv.sheetCount} | ${live.length} | ${diff > 0 ? '+' : ''}${diff} | ${inv.sitemapUrls} | ${err404} | ${inv.redirects.length} | ${dup.size} | ${inv.rendered ? `+${inv.rendered.newPages}` : 'not run'} |`);
  detail.push(`## ${label[c]} (${inv.host}${inv.prefixes.join(' + ')})\n\n- **Live pages:** ${live.length} (sheet: ${inv.sheetCount})\n- **Sitemap:** ${inv.sitemapUrls} URLs in the folder, ${inv.pages.filter((x) => x.inSitemap).length} of them live; ${err404} discovered URLs return 404\n- **Redirects:** ${inv.redirects.length}; **canonical duplicates** (a page pointing to another listed page as canonical): ${dup.size}\n- **Found only by the rendered pass:** ${inv.pages.filter((x) => x.foundBy === 'rendered').length}\n\n| Folder | Pages |\n|---|---|\n${Object.entries(folders).sort((a, b) => b[1] - a[1]).map(([k, n]) => `| ${k} | ${n} |`).join('\n')}\n`);
}
md += `| Cohort | Sheet (EN) | Live pages found | Difference | Sitemap URLs | 404s | Redirects | Canonical duplicates | Rendered pass |\n|---|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n${detail.join('\n')}`;
fs.writeFileSync(`${I}/RECONCILIATION.md`, md);
console.log(rows.join('\n'));
