# Templates in the scoping-only analysis: Stardust page type × page head (hero family). The representative
# is the "best reference": the page covering most of its siblings' components (frequency-weighted), with an
# approved reference page preferred when it covers enough.
f = '/backups/meejain/ema-rbcroyalbank/repo/stardust/.work/scope-only/analyze.mjs'
s = open(f).read()
start = s.index('// 5. templates:')
end = s.index('// against the default scope\'s templates')
new = r"""// 5. templates: Stardust page type × page head (the hero family). The body varies page to page and is
// composed from blocks; what makes a template is the page type and its head.
const sig = (p) => new Set(p.items.filter((x) => x.kind === 'block').map((x) => x.variant));
const headOf = (p) => {
  const h = [...sig(p)].find((v) => v.startsWith('hero')) || '';
  if (h.startsWith('hero home')) return 'home';
  if (h.startsWith('hero card')) return 'card';
  if (h === 'hero' || h.startsWith('hero back')) return 'image';
  if (h.includes('typeled')) return 'type';
  return 'none';
};
const NAMES = {
  'landing|home': 'Homepage', 'program|card': 'Credit card product page', 'program|image': 'Campaign page',
  'static|type': 'Help and service page', 'article|image': 'Advice article', 'article|type': 'Cardholder how-to article',
  'listing|image': 'Category hub', 'listing|type': 'Card listing and resource index', 'unique|type': 'Tool page',
};
const groups = {};
res.forEach((p) => { const k = `${p.type}|${headOf(p)}`; (groups[k] = groups[k] || []).push(p); });
const clusters = Object.entries(groups).map(([k, ps]) => {
  const freq = {}; ps.forEach((p) => sig(p).forEach((v) => { freq[v] = (freq[v] || 0) + 1; }));
  const total = Object.values(freq).reduce((a, b) => a + b, 0);
  const coverage = (p) => [...sig(p)].reduce((t, v) => t + (freq[v] || 0), 0) / total;
  const ranked = ps.map((p) => ({ p, c: coverage(p) })).sort((a, b) => b.c - a.c);
  const arch = ranked.find((x) => x.p.archetype);
  const rep = arch && arch.c >= 0.6 * ranked[0].c ? arch : ranked[0];
  return {
    key: k, name: NAMES[k] || k.replace('|', ' · '), type: k.split('|')[0], head: k.split('|')[1],
    pages: ps.map((p) => p.url), representative: rep.p.url, repSlug: rep.p.slug, repArchetype: !!rep.p.archetype, repCoverage: Math.round(rep.c * 100) / 100,
    bestCoverage: { url: ranked[0].p.url, c: Math.round(ranked[0].c * 100) / 100 },
    common: Object.entries(freq).filter(([, n]) => n / ps.length >= 0.5).sort((a, b) => b[1] - a[1]).map(([v]) => v),
    variants: Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([v, n]) => ({ v, n })),
  };
}).sort((a, b) => b.pages.length - a.pages.length);
"""
s = s[:start] + new + s[end:]
s = s.replace("console.log(`templates: ${summary.templates.stardustTypes} Stardust page types → ${clusters.length} structural clusters; scope has ${templates.length}`);\nclusters.forEach((c) => console.log(`  ${c.name.padEnd(12)} ${String(c.pages.length).padStart(3)} pages · ${c.common.join(', ')}`));",
              "console.log(`templates: ${clusters.length} (Stardust page type × page head); default scope has ${templates.length}`);\nclusters.forEach((c) => console.log(`  ${c.name.padEnd(32)} ${String(c.pages.length).padStart(3)} pages · ref ${c.representative.replace('https://www.rbcroyalbank.com', '')} (${Math.round(c.repCoverage * 100)}%${c.repArchetype ? ', approved reference' : ''}) · ${c.common.join(', ')}`));")
s = s.replace("const dist = {}; clusters.forEach((c) => { const n = c.pages.filter((u) => urls.has(norm(u))).length; if (n) dist[c.name] = n; });",
              "const dist = {}; clusters.forEach((c) => { const n = c.pages.filter((u) => urls.has(norm(u))).length; if (n) dist[c.name] = n; });")
open(f, 'w').write(s)
print('ok')
