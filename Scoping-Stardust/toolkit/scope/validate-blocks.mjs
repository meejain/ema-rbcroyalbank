// Validate the scoping block catalog (catalog/) against what the stardust EDS import produced (content/).
// For every scoped block instance: take its text from the captured source DOM (stardust/current/pages),
// measure how much of it survives in the page's EDS document, and which EDS block/section holds it.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const C = `${ROOT}/catalog`;
const state = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
const pages = Array.isArray(state.pages) ? state.pages : Object.values(state.pages);
const norm = (u) => { const p = new URL(u).pathname; return p === '/' ? '/personal.html' : p; };
const byPath = Object.fromEntries(pages.map((p) => [norm(p.url), p]));

const tokens = (s) => new Set((s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9$%]+/g, ' ').split(' ').filter((w) => w.length >= 3));

// EDS document → containers [{ label, words }]
const docCache = {};
function edsContainers(p) {
  if (docCache[p.slug]) return docCache[p.slug];
  const file = `${ROOT}/${p.eds.contentPath}`;
  if (!fs.existsSync(file)) return (docCache[p.slug] = null);
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const out = [];
  $('body > div, main > div').each((i, sec) => {
    const meta = $(sec).children('.section-metadata').text().replace(/\s+/g, ' ').trim().replace(/^style\s*/, '');
    $(sec).children().each((j, el) => {
      if (el.tagName === 'div' && $(el).attr('class')) {
        const cls = $(el).attr('class');
        if (/^(section-metadata|metadata)$/.test(cls)) return;
        out.push({ label: cls.replace(/\s+/g, ' (') + (cls.includes(' ') ? ')' : ''), section: meta, words: tokens($(el).text()) });
      } else {
        const last = out[out.length - 1];
        if (last && last.label === 'default content' && last.sectionIdx === i) { tokens($(el).text()).forEach((w) => last.words.add(w)); return; }
        out.push({ label: 'default content', section: meta, sectionIdx: i, words: tokens($(el).text()) });
      }
    });
  });
  const all = new Set(); out.forEach((c) => c.words.forEach((w) => all.add(w)));
  return (docCache[p.slug] = { containers: out, all });
}

const srcCache = {};
function srcDoc(p) {
  if (srcCache[p.slug]) return srcCache[p.slug];
  const f = `${ROOT}/stardust/current/pages/${p.slug}.html`;
  if (!fs.existsSync(f)) return null;
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  $('script,style,noscript,template,svg').remove();
  return (srcCache[p.slug] = $);
}

const catalog = JSON.parse(fs.readFileSync(`${C}/block-catalog.json`, 'utf8'))['block-catalog'].blockVariants; const catalogList = Array.isArray(catalog) ? catalog : Object.values(catalog);
const pageCatalogs = {};
for (const d of fs.readdirSync(`${C}/.pages`)) {
  const f = `${C}/.pages/${d}/page-catalog.json`;
  if (!fs.existsSync(f)) continue;
  const pc = JSON.parse(fs.readFileSync(f, 'utf8'));
  pageCatalogs[norm(pc.url)] = { dir: d, pc };
}

const results = [];
for (const v of catalogList) {
  if (/^(header|footer)-global$/.test(v.id)) {
    results.push({ id: v.id, type: v.type, instances: 1, pages: 1, coverage: 1, mappedTo: { [`chrome: ${v.type} block + /nav,/footer documents`]: 1 }, misses: [], screenshot: `catalog/${v.screenshots?.[0] || ''}` });
    continue;
  }
  const meta = JSON.parse(fs.readFileSync(`${C}/.blocks/${v.id}/metadata.json`, 'utf8'));
  const uses = meta.usage?.pagesUsing || [];
  const mapped = {}; const misses = []; let covSum = 0; let n = 0; let noText = 0;
  for (const u of uses) {
    const pth = norm(u.url); const p = byPath[pth]; const pcat = pageCatalogs[pth];
    if (!p || !pcat) continue;
    const blk = pcat.pc.blocks.find((b) => b.id === u.instanceId);
    const $ = srcDoc(p); const doc = edsContainers(p);
    if (!blk || !$ || !doc) continue;
    let el = null;
    try { el = $(blk.selector).first(); } catch (e) { el = null; }
    const words = el && el.length ? tokens(el.text()) : new Set();
    if (blk.selector === '#sticky-wrapper') { mapped['hero (breadcrumb + H1)'] = (mapped['hero (breadcrumb + H1)'] || 0) + 1; covSum += 1; n += 1; continue; }
    if (words.size < 3) { noText += 1; continue; }
    const inDoc = [...words].filter((w) => doc.all.has(w)).length / words.size;
    let best = null; let bestHit = 0;
    for (const c of doc.containers) {
      const hit = [...words].filter((w) => c.words.has(w)).length;
      if (hit > bestHit) { bestHit = hit; best = c; }
    }
    const label = best ? best.label + (best.section ? ` [section: ${best.section}]` : '') : 'none';
    mapped[label] = (mapped[label] || 0) + 1;
    covSum += inDoc; n += 1;
    if (inDoc < 0.6) misses.push({ url: u.url, coverage: Math.round(inDoc * 100), sample: [...words].slice(0, 12).join(' '), screenshot: `catalog/.pages/${pcat.dir}/${blk.screenshot}` });
  }
  results.push({
    id: v.id, type: v.type, model: v.canonicalModel, pages: v.pagesFound, instances: uses.length, measured: n, imageOnly: noText,
    coverage: n ? Math.round((covSum / n) * 100) / 100 : null, mappedTo: mapped, misses,
    screenshot: meta.usage?.pagesUsing?.[0]?.screenshot ? `catalog/${meta.usage.pagesUsing[0].screenshot}` : null,
    description: v.description,
  });
}
fs.writeFileSync(`${ROOT}/stardust/qa/scope-block-validation.json`, JSON.stringify(results, null, 1));

// roll-up by scoped type
const byType = {};
for (const r of results) {
  const t = byType[r.type] = byType[r.type] || { variants: 0, instances: 0, measured: 0, cov: 0, covN: 0, misses: 0, mapped: {} };
  t.variants += 1; t.instances += r.instances; t.measured += r.measured || 0; t.misses += r.misses.length;
  if (r.coverage !== null) { t.cov += r.coverage * (r.measured || 1); t.covN += (r.measured || 1); }
  Object.entries(r.mappedTo).forEach(([k, c]) => { const key = k.replace(/ \[section:.*$/, ''); t.mapped[key] = (t.mapped[key] || 0) + c; });
}
for (const [t, s] of Object.entries(byType).sort((a, b) => b[1].instances - a[1].instances)) {
  const top = Object.entries(s.mapped).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, c]) => `${k}×${c}`).join(', ');
  console.log(`${t.padEnd(12)} variants ${String(s.variants).padStart(3)} · instances ${String(s.instances).padStart(4)} · text kept ${s.covN ? Math.round((s.cov / s.covN) * 100) : '-'}% · low-coverage ${s.misses} → ${top}`);
}
const allMiss = results.flatMap((r) => r.misses.map((m) => ({ ...m, type: r.type, id: r.id })));
console.log(`\ninstances below 60% text kept: ${allMiss.length}`);
allMiss.sort((a, b) => a.coverage - b.coverage).slice(0, 25).forEach((m) => console.log(`  ${m.coverage}% ${m.type} ${m.url.replace('https://www.rbcroyalbank.com', '')} :: ${m.sample.slice(0, 80)}`));
