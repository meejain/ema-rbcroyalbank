// Scope variants validate-blocks could not measure (selector did not resolve in the captured DOM):
// read the block's text from the live page with the scope's selector, then measure it against the EDS
// document exactly like validate-blocks does. Patches stardust/qa/scope-block-validation.json in place.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const C = `${ROOT}/catalog`;
const VAL = `${ROOT}/stardust/qa/scope-block-validation.json`;
const val = JSON.parse(fs.readFileSync(VAL, 'utf8'));
const state = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
const pages = Array.isArray(state.pages) ? state.pages : Object.values(state.pages);
const norm = (u) => { const p = new URL(u).pathname; return p === '/' ? '/personal.html' : p; };
const byPath = Object.fromEntries(pages.map((p) => [norm(p.url), p]));
const tokens = (s) => new Set((s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9$%]+/g, ' ').split(' ').filter((w) => w.length >= 3));
function edsContainers(p) {
  const $ = cheerio.load(fs.readFileSync(`${ROOT}/${p.eds.contentPath}`, 'utf8'));
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
  return { containers: out, all };
}
const pageCatalogs = {};
for (const d of fs.readdirSync(`${C}/.pages`)) {
  const f = `${C}/.pages/${d}/page-catalog.json`;
  if (fs.existsSync(f)) { const pc = JSON.parse(fs.readFileSync(f, 'utf8')); pageCatalogs[norm(pc.url)] = pc; }
}
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' });
for (const r of val.filter((x) => x.coverage === null && x.instances > 0)) {
  const uses = JSON.parse(fs.readFileSync(`${C}/.blocks/${r.id}/metadata.json`, 'utf8')).usage?.pagesUsing || [];
  const mapped = {}; let covSum = 0; let n = 0;
  for (const u of uses) {
    const p = byPath[norm(u.url)]; const blk = pageCatalogs[norm(u.url)]?.blocks.find((x) => x.id === u.instanceId);
    if (!p?.eds || !blk) continue;
    const pg = await ctx.newPage();
    await pg.goto(u.url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
    await pg.waitForTimeout(2500);
    // the scope's nth-child selector was taken on its own cleaned DOM; find the element by its recorded
    // bounds instead (best box overlap among block-sized elements)
    const text = await pg.evaluate(([sel, bx]) => {
      const direct = document.querySelector(sel)?.innerText;
      if (direct && direct.trim().length > 20) return direct;
      let best = null; let bestScore = 0;
      document.querySelectorAll('main *, #dvl-wpr *').forEach((el) => {
        const r = el.getBoundingClientRect(); const y = r.top + window.scrollY;
        if (r.height < 40 || r.width < 300) return;
        const ix = Math.max(0, Math.min(r.right, bx.x + bx.width) - Math.max(r.left, bx.x));
        const iy = Math.max(0, Math.min(y + r.height, bx.y + bx.height) - Math.max(y, bx.y));
        const inter = ix * iy; const uni = r.width * r.height + bx.width * bx.height - inter;
        const s = inter / uni;
        if (s > bestScore) { bestScore = s; best = el; }
      });
      return bestScore > 0.5 ? best.innerText : '';
    }, [blk.selector, blk.bounds]).catch(() => '');
    await pg.close();
    const words = tokens(text);
    if (words.size < 3) continue;
    const doc = edsContainers(p);
    const inDoc = [...words].filter((w) => doc.all.has(w)).length / words.size;
    let best = null; let bestHit = 0;
    for (const c of doc.containers) { const hit = [...words].filter((w) => c.words.has(w)).length; if (hit > bestHit) { bestHit = hit; best = c; } }
    const label = best ? best.label + (best.section ? ` [section: ${best.section}]` : '') : 'none';
    mapped[label] = (mapped[label] || 0) + 1; covSum += inDoc; n += 1;
  }
  if (n) Object.assign(r, { measured: n, imageOnly: r.instances - n, coverage: Math.round((covSum / n) * 100) / 100, mappedTo: mapped, measuredFrom: 'live page (selector did not resolve in captured DOM)' });
  console.log(r.id, n ? `${Math.round(r.coverage * 100)}% → ${JSON.stringify(mapped)}` : 'still unmeasured');
}
await b.close();
fs.writeFileSync(VAL, JSON.stringify(val, null, 1));
