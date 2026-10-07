// Phase 0 discovery for RBC wave 2: folder-scoped BFS crawl (static HTML links) seeded with the cohort's
// sitemap URLs. Same host, inside the cohort's path prefix, EN only (no /fr/), HTML pages only; records the
// final status and redirect target per URL. Writes inventory/<cohort>.json.
// usage: node folder-crawl.mjs [cohort ...]   (default: all)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = new URL('..', import.meta.url).pathname;
fs.mkdirSync(`${ROOT}inventory`, { recursive: true });
const COHORTS = {
  'customer-service': { start: ['https://www.rbcroyalbank.com/customer-service/'], prefix: ['/customer-service/'], sitemap: '/tmp/w2-rbc-n.txt', sheet: 1 },
  mortgages: { start: ['https://www.rbcroyalbank.com/mortgages/index.html'], prefix: ['/mortgages/'], sitemap: '/tmp/w2-rbc-n.txt', sheet: 149 },
  loans: { start: ['https://www.rbcroyalbank.com/loans-line-of-credit/index.html'], prefix: ['/loans-line-of-credit/'], sitemap: '/tmp/w2-rbc-n.txt', sheet: 46 },
  investments: { start: ['https://www.rbcroyalbank.com/investments/index.html'], prefix: ['/investments/'], sitemap: '/tmp/w2-rbc-n.txt', sheet: 36 },
  'business-commercial': { start: ['https://www.rbcroyalbank.com/business/index.html', 'https://www.rbcroyalbank.com/commercial/index.html'], prefix: ['/business/', '/commercial/'], sitemap: '/tmp/w2-rbc-n.txt', sheet: 252 },
  'direct-investing': { start: ['https://www.rbcdirectinvesting.com/'], prefix: ['/'], sitemap: '/tmp/w2-rbcdirectinvesting.com.txt', sheet: 58 },
  'rbc-bank': { start: ['https://www.rbcbank.com/'], prefix: ['/'], sitemap: '/tmp/w2-rbcbank.com.txt', sheet: 104 },
  'avion-rewards': { start: ['https://www.avionrewards.com/'], prefix: ['/'], sitemap: '/tmp/w2-avionrewards.com.txt', sheet: 31 },
};
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36', Accept: 'text/html' };
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|svg|webp|ico|css|js|json|xml|zip|docx?|xlsx?|pptx?|mp4|mp3|woff2?|ttf)$/i;
const MAX = 1500;
const only = process.argv.slice(2);

function norm(href, base, host) {
  let u;
  try { u = new URL(href, base); } catch (e) { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  u.protocol = 'https:';
  if (u.hostname.replace(/^www\./, '') !== host.replace(/^www\./, '')) return null;
  u.hostname = host; u.hash = ''; u.search = '';
  if (SKIP_EXT.test(u.pathname)) return null;
  return u.href;
}
const inPrefix = (u, prefixes) => { const p = new URL(u).pathname; return !/^\/fr(\/|-|$)/.test(p) && !/\/fr\//.test(p) && prefixes.some((x) => p.startsWith(x)); };

async function crawl(name, c) {
  const host = new URL(c.start[0]).hostname;
  const sm = fs.existsSync(c.sitemap) ? fs.readFileSync(c.sitemap, 'utf8').split('\n').map((l) => norm(l.trim(), c.start[0], host)).filter((u) => u && inPrefix(u, c.prefix)) : [];
  const queue = [...new Set([...c.start, ...sm])];
  const seen = new Set(queue);
  const pages = []; const redirects = []; const errors = [];
  const fromSitemap = new Set(sm);
  while (queue.length && pages.length + redirects.length + errors.length < MAX) {
    const batch = queue.splice(0, 6);
    await Promise.all(batch.map(async (u) => {
      let r; let body = '';
      try { r = await fetch(u, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(25000) }); body = (r.headers.get('content-type') || '').includes('html') ? await r.text() : ''; } catch (e) { errors.push({ url: u, error: String(e).slice(0, 120) }); return; }
      const final = norm(r.url, u, host) || r.url;
      if (r.status >= 400) { errors.push({ url: u, status: r.status }); return; }
      if (final !== u) {
        redirects.push({ url: u, to: final, status: r.status });
        if (!seen.has(final) && inPrefix(final, c.prefix) && final.startsWith('https://')) { seen.add(final); queue.push(final); }
        return;
      }
      if (!body) return;
      const $ = cheerio.load(body);
      const title = $('title').first().text().trim();
      const canonical = $('link[rel=canonical]').attr('href') || null;
      const robots = $('meta[name=robots]').attr('content') || null;
      pages.push({ url: u, status: r.status, title, canonical, robots, inSitemap: fromSitemap.has(u) });
      $('a[href]').each((i, a) => {
        const n = norm($(a).attr('href'), u, host);
        if (n && !seen.has(n) && inPrefix(n, c.prefix)) { seen.add(n); queue.push(n); }
      });
    }));
    await new Promise((res) => setTimeout(res, 150));
    process.stdout.write(`\r${name}: ${pages.length} pages · ${redirects.length} redirects · ${errors.length} errors · queue ${queue.length}   `);
  }
  // canonical/duplicate check: pages whose canonical points at another page in the list
  const urls = new Set(pages.map((p) => p.url));
  const dupes = pages.filter((p) => p.canonical && norm(p.canonical, p.url, host) && norm(p.canonical, p.url, host) !== p.url && urls.has(norm(p.canonical, p.url, host)));
  const out = { cohort: name, host, prefixes: c.prefix, sheetCount: c.sheet, crawledAt: new Date().toISOString(), pages, redirects, errors, canonicalDuplicates: dupes.map((p) => ({ url: p.url, canonical: p.canonical })), capped: queue.length > 0, sitemapUrls: sm.length };
  fs.writeFileSync(`${ROOT}inventory/${name}.json`, JSON.stringify(out, null, 1));
  console.log(`\n${name}: ${pages.length} pages (sheet ${c.sheet}) · in sitemap ${pages.filter((p) => p.inSitemap).length}/${sm.length} · redirects ${redirects.length} · errors ${errors.length} · canonical dupes ${dupes.length}${out.capped ? ' · CAPPED' : ''}`);
}
for (const [name, c] of Object.entries(COHORTS)) if (!only.length || only.includes(name)) await crawl(name, c);
