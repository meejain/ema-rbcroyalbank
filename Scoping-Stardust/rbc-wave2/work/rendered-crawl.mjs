// Phase 0, second pass: render each known page of a cohort in a real browser and collect the links it shows
// (script-built lists, tabs, "load more" grids are invisible to the static crawl). New in-prefix links are
// verified and rendered in turn until nothing new appears. Updates inventory/<cohort>.json (adds `rendered`).
// usage: node rendered-crawl.mjs <cohort> [...]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const ROOT = new URL('..', import.meta.url).pathname;
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|svg|webp|ico|css|js|json|xml|zip|docx?|xlsx?|pptx?|mp4|mp3|woff2?|ttf)$/i;
const b = await chromium.launch();
for (const name of process.argv.slice(2)) {
  const f = `${ROOT}inventory/${name}.json`;
  const inv = JSON.parse(fs.readFileSync(f, 'utf8'));
  const host = inv.host;
  const inPrefix = (u) => { const p = new URL(u).pathname; return !/^\/fr(\/|-|$)/.test(p) && !/\/fr\//.test(p) && inv.prefixes.some((x) => p.startsWith(x)); };
  const norm = (h) => { try { const u = new URL(h); if (u.hostname.replace(/^www\./, '') !== host.replace(/^www\./, '')) return null; u.protocol = 'https:'; u.hostname = host; u.hash = ''; u.search = ''; return SKIP_EXT.test(u.pathname) ? null : u.href; } catch (e) { return null; } };
  const known = new Set([...inv.pages.map((p) => p.url), ...inv.redirects.map((r) => r.url), ...inv.errors.map((e) => e.url)]);
  // resumable: pages already rendered are kept in inv.renderedUrls and skipped on restart
  inv.renderedUrls = inv.renderedUrls || [];
  const doneSet = new Set(inv.renderedUrls);
  const toRender = inv.pages.map((p) => p.url).filter((u) => !doneSet.has(u));
  const added = [];
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-CA', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
  let done = 0;
  while (toRender.length) {
    const batch = toRender.splice(0, Number(process.env.BATCH || 4));
    await Promise.all(batch.map(async (u) => {
      const p = await ctx.newPage();
      // FAST=1: load + short settle instead of network idle (big cohorts whose static crawl already matched the sheet)
      const resp = await p.goto(u, { waitUntil: process.env.FAST ? 'load' : 'networkidle', timeout: 45000 }).catch(() => null);
      if (process.env.FAST) await p.waitForTimeout(1200);
      await p.evaluate(async () => { for (let i = 1; i <= 4; i += 1) { window.scrollTo(0, (document.body.scrollHeight * i) / 4); await new Promise((r) => setTimeout(r, 250)); } }).catch(() => {});
      // open tabs / "load more" so script-built lists render their links
      for (const sel of ['[role=tab]', 'button:has-text("Load more")', 'button:has-text("Show more")', 'button:has-text("See more")']) {
        const els = await p.locator(sel).all().catch(() => []);
        for (const el of els.slice(0, 8)) await el.click({ timeout: 1500 }).catch(() => {});
      }
      await p.waitForTimeout(600);
      const hrefs = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href)).catch(() => []);
      await p.close();
      if (resp && resp.status() < 400) {
        for (const h of hrefs) {
          const n = norm(h); if (!n || known.has(n) || !inPrefix(n)) continue;
          known.add(n);
          const r = await fetch(n, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126' }, redirect: 'follow', signal: AbortSignal.timeout(20000) }).catch(() => null);
          if (!r) continue;
          const fin = norm(r.url) || r.url;
          if (r.status >= 400) { inv.errors.push({ url: n, status: r.status, foundBy: 'rendered' }); continue; }
          if (fin !== n) { inv.redirects.push({ url: n, to: fin, status: r.status, foundBy: 'rendered' }); if (!known.has(fin) && inPrefix(fin)) { known.add(fin); added.push(fin); toRender.push(fin); inv.pages.push({ url: fin, status: 200, foundBy: 'rendered' }); } continue; }
          added.push(n); toRender.push(n); inv.pages.push({ url: n, status: r.status, foundBy: 'rendered', from: u });
        }
      }
      done += 1; inv.renderedUrls.push(u);
    }));
    fs.writeFileSync(f, JSON.stringify(inv, null, 1));
    process.stdout.write(`\r${name}: rendered ${done} · new pages ${added.length} · queue ${toRender.length}   `);
  }
  await ctx.close();
  inv.rendered = { at: new Date().toISOString(), newPages: added.length };
  fs.writeFileSync(f, JSON.stringify(inv, null, 1));
  console.log(`\n${name}: ${inv.pages.length} pages after rendered pass (+${added.length}) · sheet ${inv.sheetCount}`);
}
await b.close();
