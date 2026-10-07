// Scoping-only pilot analysis: variant inventory, coverage, default-scope mapping (unknowns), templates, and the
// comparison with the full migration. Reads stardust/qa/scope-only/results.json; writes summary.json.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const OUT = `${ROOT}/stardust/qa/scope-only`;
const res = JSON.parse(fs.readFileSync(`${OUT}/results.json`, 'utf8')).filter((p) => !p.error);
const st = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
const pagesBySlug = Object.fromEntries((Array.isArray(st.pages) ? st.pages : Object.values(st.pages)).map((p) => [p.slug, p]));
const catalog = JSON.parse(fs.readFileSync(`${ROOT}/catalog/block-catalog.json`, 'utf8'))['block-catalog'].blockVariants;
const scopeVariants = Array.isArray(catalog) ? catalog : Object.values(catalog);
const scopeType = Object.fromEntries(scopeVariants.map((v) => [v.id, v.type]));
const manual = JSON.parse(fs.readFileSync(`${ROOT}/stardust/qa/unknown-scoping.json`, 'utf8')).decisions;
const templates = JSON.parse(fs.readFileSync(`${ROOT}/catalog/template-catalog.json`, 'utf8')).templates;
const norm = (u) => { const x = new URL(u).pathname; return x === '/' ? '/personal.html' : x; };

// reference pages: their variants are defined by the approved Stardust prototype (its EDS conversion), not by
// matching the live page; read them from the archetype documents
const protoBlocks = (p) => {
  const f = `${ROOT}/${pagesBySlug[p.slug]?.eds?.contentPath}`;
  if (!fs.existsSync(f)) return [];
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  const out = [];
  $('body > div > div[class], main > div > div[class]').each((i, e) => { const c = $(e).attr('class').trim().replace(/\s+/g, ' '); if (!/^(section-metadata|metadata)$/.test(c)) out.push({ kind: 'block', variant: c, source: 'prototype' }); });
  return out;
};
res.filter((p) => p.archetype).forEach((p) => { p.liveItems = p.items; p.items = [...protoBlocks(p), ...p.items.filter((x) => x.kind !== 'block')]; });
const GALLERY = `${ROOT}/stardust/qa/block-gallery`;

// 1. variant inventory
const inv = {};
for (const p of res) {
  for (const it of p.items.filter((x) => x.kind === 'block')) {
    const v = inv[it.variant] = inv[it.variant] || { key: it.variant, block: it.variant.split(' ')[0], instances: 0, pages: new Set(), sample: null };
    v.instances += 1; v.pages.add(p.url);
  }
  (p.samples || []).forEach((s) => { if (inv[s.variant] && !inv[s.variant].sample) inv[s.variant].sample = { file: s.file, url: p.url }; });
}
// prototype-defined variants with no live sample: the prototype render from the block gallery
Object.values(inv).forEach((v) => {
  if (v.sample) return;
  const g = `${GALLERY}/eds/${v.key.replace(/[^a-z0-9]+/g, '-')}-desktop.png`;
  if (fs.existsSync(g)) v.sample = { file: `../block-gallery/eds/${v.key.replace(/[^a-z0-9]+/g, '-')}-desktop.png`, url: [...v.pages][0], prototype: true };
});
const variants = Object.values(inv).sort((a, b) => b.instances - a.instances);
const blocks = [...new Set(variants.map((v) => v.block))];

// 2. coverage
const kept = res.map((p) => p.textKept);
const unassigned = res.flatMap((p) => p.unassigned.map((u) => ({ ...u, url: p.url, slug: p.slug })));

// 3. default scope → classification, per scope variant (majority holder over its instances)
const byScope = {};
for (const p of res) {
  for (const m of p.scopeMap || []) {
    const s = byScope[m.variantId] = byScope[m.variantId] || { id: m.variantId, type: scopeType[m.variantId] || m.type, instances: 0, found: 0, holders: {}, pages: new Set() };
    s.instances += 1; s.pages.add(p.url);
    if (m.found) { s.found += 1; const h = m.holder || 'not recognised'; s.holders[h] = (s.holders[h] || 0) + 1; }
  }
}
const scopeRows = Object.values(byScope).map((s) => {
  const top = Object.entries(s.holders).sort((a, b) => b[1] - a[1])[0];
  return { ...s, pages: [...s.pages], holder: top ? top[0] : 'not found', agree: top ? top[1] / s.found : 0 };
});
const unknowns = scopeRows.filter((s) => s.type === 'unknown');
const resolution = (s) => {
  if (s.holder === 'not found') return 'not found';
  if (s.holder === 'not recognised') return 'not recognised';
  if (s.holder === 'default content') return 'prose';
  return 'block';
};
// agreement with the manual screenshot review (decision targets)
const fam = (k) => (k === 'default content' ? 'prose' : k.split(' ')[0]);
const vsManual = unknowns.map((s) => {
  const d = manual[s.id];
  const target = d ? (d.decision === 'removed' ? 'removed' : d.target) : null;
  const pilot = s.holder;
  const same = target && (target === pilot || (target === 'removed' && ['not recognised', 'default content'].includes(pilot)));
  const sameFamily = target && target !== 'removed' && fam(target) === fam(pilot);
  return { id: s.id, instances: s.instances, pilot, manual: target, decision: d?.decision, same: !!same, sameFamily: !!sameFamily };
});

// 4. comparison with the full migration (content/*.plain.html), by importer generation
const logs = `${ROOT}/stardust/.work/import-logs`;
const fresh = new Set(fs.readdirSync(logs).filter((x) => /^reimport3-.*\.log$/.test(x))
  .flatMap((x) => [...fs.readFileSync(`${logs}/${x}`, 'utf8').matchAll(/Saved content to (\S+)/g)].map((m) => `content/${m[1].replace(/\.plain\.html$/, '')}.plain.html`)));
const migVariants = (p) => {
  const f = `${ROOT}/${pagesBySlug[p.slug]?.eds?.contentPath}`;
  if (!fs.existsSync(f)) return null;
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  const out = new Set();
  $('body > div > div[class], main > div > div[class]').each((i, e) => { const c = $(e).attr('class').trim().replace(/\s+/g, ' '); if (!/^(section-metadata|metadata)$/.test(c)) out.add(c); });
  return out;
};
const jac = (a, b) => { const u = new Set([...a, ...b]); return u.size ? [...a].filter((x) => b.has(x)).length / u.size : 1; };
const cmp = { archetype: [], reimported: [], earlier: [] };
const migAll = new Set();
for (const p of res) {
  const m = migVariants(p); if (!m) continue;
  m.forEach((x) => migAll.add(x));
  const mine = new Set(p.items.filter((x) => x.kind === 'block').map((x) => x.variant));
  const gen = p.archetype ? 'archetype' : (fresh.has(pagesBySlug[p.slug].eds.contentPath) ? 'reimported' : 'earlier');
  cmp[gen].push({ slug: p.slug, j: jac(mine, m), onlyPilot: [...mine].filter((x) => !m.has(x)), onlyMig: [...m].filter((x) => !mine.has(x)) });
}
const cmpSummary = Object.fromEntries(Object.entries(cmp).map(([k, rows]) => [k, { pages: rows.length, avgJaccard: rows.length ? Math.round((rows.reduce((s, r) => s + r.j, 0) / rows.length) * 100) / 100 : null, exact: rows.filter((r) => r.j === 1).length }]));

// 5. templates: Stardust page type × page head (the hero family). The body varies page to page and is
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
// against the default scope's templates
const tplOf = {}; templates.forEach((t) => t.urls.forEach((u) => { tplOf[norm(typeof u === 'string' ? u : u.url)] = t.name; }));
const vsScopeTpl = templates.map((t) => {
  const urls = new Set(t.urls.map((u) => norm(typeof u === 'string' ? u : u.url)));
  const dist = {}; clusters.forEach((c) => { const n = c.pages.filter((u) => urls.has(norm(u))).length; if (n) dist[c.name] = n; });
  return { template: t.name, pages: urls.size, clusters: dist };
});

const summary = {
  pages: res.length,
  blocks: blocks.length, variants: variants.length, instances: variants.reduce((s, v) => s + v.instances, 0),
  variantList: variants.map((v) => ({ key: v.key, block: v.block, instances: v.instances, pages: v.pages.size, sample: v.sample, urls: [...v.pages] })),
  coverage: { avgTextKept: Math.round((kept.reduce((a, b) => a + b, 0) / kept.length) * 1000) / 1000, minTextKept: Math.min(...kept), unassignedSections: unassigned.length, unassigned },
  scope: { variants: scopeRows.length, instances: scopeRows.reduce((s, r) => s + r.instances, 0), rows: scopeRows },
  unknowns: { variants: unknowns.length, instances: unknowns.reduce((s, r) => s + r.instances, 0), byResolution: unknowns.reduce((a, s) => { const k = resolution(s); a[k] = (a[k] || 0) + 1; return a; }, {}), vsManual },
  migration: { summary: cmpSummary, pilotOnly: [...new Set(variants.map((v) => v.key))].filter((k) => !migAll.has(k)), migrationOnly: [...migAll].filter((k) => !inv[k]), rows: cmp },
  templates: { stardustTypes: [...new Set(res.map((p) => p.type))].length, clusters, vsScopeTpl },
};
fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 1));
console.log(`pages ${summary.pages} · blocks ${summary.blocks} · variants ${summary.variants} · instances ${summary.instances}`);
console.log(`coverage: avg text kept ${Math.round(summary.coverage.avgTextKept * 100)}% (min ${Math.round(summary.coverage.minTextKept * 100)}%) · unassigned sections ${summary.coverage.unassignedSections}`);
console.log(`unknowns ${summary.unknowns.variants} (${summary.unknowns.instances} inst): ${JSON.stringify(summary.unknowns.byResolution)}`);
console.log(`vs manual review: exact ${vsManual.filter((x) => x.same).length}/${vsManual.length}, same block family ${vsManual.filter((x) => x.same || x.sameFamily).length}/${vsManual.length}`);
console.log('vs migration:', JSON.stringify(cmpSummary), '· pilot-only variants:', summary.migration.pilotOnly.join(', ') || '-', '· migration-only:', summary.migration.migrationOnly.join(', ') || '-');
console.log(`templates: ${clusters.length} (Stardust page type × page head); default scope has ${templates.length}`);
clusters.forEach((c) => console.log(`  ${c.name.padEnd(32)} ${String(c.pages.length).padStart(3)} pages · ref ${c.representative.replace('https://www.rbcroyalbank.com', '')} (${Math.round(c.repCoverage * 100)}%${c.repArchetype ? ', approved reference' : ''}) · ${c.common.join(', ')}`));
vsScopeTpl.forEach((t) => console.log(`  scope ${t.template.padEnd(26)} ${String(t.pages).padStart(3)} → ${JSON.stringify(t.clusters)}`));
