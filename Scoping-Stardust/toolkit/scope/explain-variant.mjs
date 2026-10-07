// Per-instance breakdown of one scope variant: for each page, the block's text share held by every
// EDS container (same token method as validate-blocks), plus the scope's screenshot of that instance.
// usage: node explain-variant.mjs <variantId>
import fs from 'node:fs';
import { createRequire } from 'node:module';
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const C = `${ROOT}/catalog`;
const id = process.argv[2];
const state = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
const pages = Array.isArray(state.pages) ? state.pages : Object.values(state.pages);
const norm = (u) => { const p = new URL(u).pathname; return p === '/' ? '/personal.html' : p; };
const byPath = Object.fromEntries(pages.map((p) => [norm(p.url), p]));
const tokens = (s) => new Set((s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9$%]+/g, ' ').split(' ').filter((w) => w.length >= 3));
const pcs = {};
for (const d of fs.readdirSync(`${C}/.pages`)) {
  const f = `${C}/.pages/${d}/page-catalog.json`;
  if (fs.existsSync(f)) { const pc = JSON.parse(fs.readFileSync(f, 'utf8')); pcs[norm(pc.url)] = { d, pc }; }
}
const uses = JSON.parse(fs.readFileSync(`${C}/.blocks/${id}/metadata.json`, 'utf8')).usage.pagesUsing;
for (const u of uses) {
  const p = byPath[norm(u.url)]; const pc = pcs[norm(u.url)];
  const blk = pc?.pc.blocks.find((b) => b.id === u.instanceId);
  const src = cheerio.load(fs.readFileSync(`${ROOT}/stardust/current/pages/${p.slug}.html`, 'utf8'));
  src('script,style,noscript,template,svg').remove();
  let text = '';
  try { text = src(blk.selector).first().text().replace(/\s+/g, ' ').trim(); } catch (e) { /* unresolved */ }
  const words = tokens(text);
  const $ = cheerio.load(fs.readFileSync(`${ROOT}/${p.eds.contentPath}`, 'utf8'));
  const share = {};
  $('body > div, main > div').each((i, sec) => {
    const style = $(sec).children('.section-metadata').text().replace(/\s+/g, ' ').trim().replace(/^style\s*/, '');
    $(sec).children().each((j, el) => {
      const cls = $(el).attr('class');
      if (cls && /^(section-metadata|metadata)$/.test(cls)) return;
      const label = (el.tagName === 'div' && cls ? cls : 'default content') + (style ? ` [${style}]` : '');
      const hit = [...tokens($(el).text())].filter((w) => words.has(w)).length;
      if (hit) share[label] = (share[label] || 0) + hit;
    });
  });
  const tot = Object.values(share).reduce((a, b) => a + b, 0) || 1;
  console.log(`\n${u.url.replace('https://www.rbcroyalbank.com', '')}  [${words.size} words] shot=catalog/.pages/${pc.d}/${blk.screenshot}`);
  console.log(`  text: ${text.slice(0, 160)}`);
  console.log(`  held by: ${Object.entries(share).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${Math.round((v / tot) * 100)}%`).join(' · ') || 'not measured'}`);
}
