// Audit: live `.callout-img` background images (promo callout banners) vs the migrated EDS documents.
// For each one, is the image (by file basename) present in the page's EDS doc, and does the live URL resolve?
import fs from 'node:fs';
import { createRequire } from 'node:module';
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const state = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
const pages = (Array.isArray(state.pages) ? state.pages : Object.values(state.pages)).filter((p) => p.eds);
const rows = [];
for (const p of pages) {
  const f = `${ROOT}/stardust/current/pages/${p.slug}.html`;
  if (!fs.existsSync(f)) continue;
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  const eds = fs.readFileSync(`${ROOT}/${p.eds.contentPath}`, 'utf8');
  const $e = cheerio.load(eds);
  // does the EDS section holding this heading carry any image?
  const sectionHasImg = (h) => {
    if (!h) return null;
    const hit = $e('h1,h2,h3,h4,h5,h6,p,strong').filter((i, x) => $e(x).text().trim() === h).first();
    if (!hit.length) return null;
    const sec = hit.parents('body > div, main > div').last();
    const blockCell = hit.closest('div[class] > div > div');
    const scope = blockCell.length ? blockCell : sec;
    return scope.find('img,picture').length > 0;
  };
  $('.callout-img').each((i, el) => {
    if ($(el).parents('header, nav, [class*="mega"], [class*="nav"]').length) return;
    const raw = $(el).attr('data-img') || (($(el).attr('style') || '').match(/url\(["']?([^"')]+)/) || [])[1];
    if (!raw) return;
    const abs = new URL(raw.replace(/&quot;/g, ''), p.url).href;
    const base = abs.split('/').pop().replace(/\.[a-z]+$/i, '');
    const heading = $(el).parent().find('h2,h3,h4').first().text().trim();
    const near = sectionHasImg(heading);
    rows.push({ url: p.url, heading, img: abs, inEds: eds.includes(base) || near === true, headingFound: near !== null });
  });
}
const uniq = [...new Set(rows.map((r) => r.img))];
const status = {};
for (const u of uniq) {
  const r = await fetch(u, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.rbcroyalbank.com/' } }).catch(() => null);
  status[u] = r ? r.status : 'ERR';
}
rows.forEach((r) => { r.status = status[r.img]; });
fs.writeFileSync(`${ROOT}/stardust/qa/callout-img-audit.json`, JSON.stringify(rows, null, 1));
const missing = rows.filter((r) => !r.inEds);
console.log(`callout images on live pages: ${rows.length} on ${new Set(rows.map((r) => r.url)).size} pages · ${uniq.length} distinct images`);
console.log(`heading not found in migrated doc: ${rows.filter((r) => !r.headingFound).length}`);
console.log(`kept in migrated docs: ${rows.length - missing.length} · missing: ${missing.length} (of which live image resolves 200: ${missing.filter((r) => r.status === 200).length})`);
const byHeading = {};
missing.forEach((r) => { const k = `${r.heading} → ${r.img.split('/').pop()} [${r.status}]`; byHeading[k] = (byHeading[k] || 0) + 1; });
Object.entries(byHeading).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${n}× ${k}`));
