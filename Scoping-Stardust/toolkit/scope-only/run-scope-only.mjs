// Scoping-only pilot: classify every saved Stardust snapshot page (stardust/current/pages/<slug>.html) into
// block variants / page prose with the live matcher, without importing anything. Writes
// stardust/qa/scope-only/{results.json, shots/*.jpg, unassigned/*.jpg}.
// usage: node run-scope-only.mjs [--only slug,slug] [--workers 3]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const OUT = `${ROOT}/stardust/qa/scope-only`;
const HELIX = fs.readFileSync('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts/static/inject/helix-importer.js', 'utf8');
const BUNDLE = fs.readFileSync(`${ROOT}/tools/importer/scope-classify.bundle.js`, 'utf8');
for (const d of ['shots', 'unassigned']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true });
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const WORKERS = args.includes('--workers') ? Number(args[args.indexOf('--workers') + 1]) : 3;
const TPL = { landing: 'landing', program: 'program', listing: 'listing', static: 'static', article: 'article', unique: 'tool' };
const st = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
let pages = (Array.isArray(st.pages) ? st.pages : Object.values(st.pages)).filter((p) => fs.existsSync(`${ROOT}/stardust/current/pages/${p.slug}.html`));
if (only) pages = pages.filter((p) => only.includes(p.slug));
// approved reference pages first, so each variant's sample comes from an archetype when it has one
pages.sort((a, b) => (b.eds?.importTemplate === 'archetype') - (a.eds?.importTemplate === 'archetype'));

const fileOf = (k) => k.replace(/[^a-z0-9]+/g, '-');
// default-scope block instances per page (catalog/.pages/*/page-catalog.json): mapped onto what the classifier recognised
const norm = (u) => { const x = new URL(u).pathname; return x === '/' ? '/personal.html' : x; };
const scopeByPath = {};
for (const d of fs.readdirSync(`${ROOT}/catalog/.pages`)) {
  const f = `${ROOT}/catalog/.pages/${d}/page-catalog.json`;
  if (!fs.existsSync(f)) continue;
  const pc = JSON.parse(fs.readFileSync(f, 'utf8'));
  scopeByPath[norm(pc.url)] = (pc.blocks || []).map((x) => ({ id: x.id, variantId: x.variantId, type: x.type, selector: x.selector, bounds: x.bounds }));
}
const sampled = new Set();
const results = [];

async function load(ctx, p) {
  // floating overlays captured with the page (compare tray, consent, app banner, feedback tab) stay out of crops;
  // the rule goes into the HTML itself (page scripts are off, so an injected style tag never reports loaded)
  const hide = '<style>#compare-tray,.compare-tray,[id*=compare-tray],[class*=compare-popup],.compare-card-popup,.feedback-tab,#onetrust-consent-sdk,#smart-bnr-rbcapp,.smart-bnr-wpr{display:none!important}</style>';
  const html = fs.readFileSync(`${ROOT}/stardust/current/pages/${p.slug}.html`, 'utf8').replace(/<head([^>]*)>/i, `<head$1><base href="${p.url}">${hide}`);
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(400);
  return page;
}

async function one(ctx, p) {
  const t0 = Date.now();
  const page = await load(ctx, p);
  const res = await page.evaluate(async ([helix, bundle, url, template, scope]) => {
    const main = document.querySelector('main') || document.body;
    const boxes = {};
    let i = 0;
    main.querySelectorAll('*').forEach((e) => {
      const sid = `s${i += 1}`;
      e.setAttribute('data-sid', sid);
      const r = e.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) boxes[sid] = [Math.round(r.left + window.scrollX), Math.round(r.top + window.scrollY), Math.round(r.width), Math.round(r.height)];
    });
    const words = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9$%]+/g, ' ').split(' ').filter((w) => w.length >= 3);
    // top-level page sections (for the coverage check): main's children, or the sections inside a wrapper
    const tops = [];
    [...main.children].forEach((c) => { const inner = [...c.querySelectorAll(':scope > section')]; (inner.length ? inner : [c]).forEach((x) => tops.push(x)); });
    const sections = tops.filter((x) => boxes[x.getAttribute('data-sid')] && !x.matches('#sticky-wrapper, .sticky-wrapper, script, style'))
      .map((x) => ({ sid: x.getAttribute('data-sid'), id: x.id || null, cls: String(x.className || '').slice(0, 60), words: [...new Set(words(x.innerText))] }));
    const srcWords = [...new Set(words(main.innerText))];
    // scope instances: selector first, else the element best overlapping the scope's recorded bounds
    const scoped = scope.map((x) => {
      let e = null;
      try { e = document.querySelector(x.selector); } catch (err) { e = null; }
      if (!e || (e.innerText || '').trim().length < 3) {
        const bx = x.bounds; let best = null; let bestS = 0;
        if (bx) main.querySelectorAll('[data-sid]').forEach((c) => {
          const b = boxes[c.getAttribute('data-sid')]; if (!b || b[3] < 30 || b[2] < 200) return;
          const ix = Math.max(0, Math.min(b[0] + b[2], bx.x + bx.width) - Math.max(b[0], bx.x));
          const iy = Math.max(0, Math.min(b[1] + b[3], bx.y + bx.height) - Math.max(b[1], bx.y));
          const sc = (ix * iy) / (b[2] * b[3] + bx.width * bx.height - ix * iy); if (sc > bestS) { bestS = sc; best = c; }
        });
        e = bestS > 0.4 ? best : null;
      }
      if (!e || !e.getAttribute('data-sid')) return { ...x, found: false };
      const inside = new Set([e.getAttribute('data-sid'), ...[...e.querySelectorAll('[data-sid]')].map((c) => c.getAttribute('data-sid'))]);
      const up = []; let a = e.parentElement; while (a && a !== main) { if (a.getAttribute('data-sid')) up.push(a.getAttribute('data-sid')); a = a.parentElement; }
      return { ...x, found: true, sid: e.getAttribute('data-sid'), inside, up };
    });
    const d = window.define; if (d) delete window.define;
    (0, eval)(helix);
    if (d) window.define = d;
    (0, eval)(bundle);
    const cfg = window.CustomImportScript.default;
    await cfg.onLoad({ document });
    const r = cfg.classify(document, url, template);
    // which recognised items hold each scope instance: items emitted from inside it (by text weight), else the
    // nearest recognised container around it
    const scopeMap = scoped.map((x) => {
      if (!x.found) return { id: x.id, variantId: x.variantId, type: x.type, found: false };
      const w = {};
      r.items.forEach((it) => { if (it.sid && x.inside.has(it.sid)) { const k = it.kind === 'block' ? it.variant : 'default content'; w[k] = (w[k] || 0) + Math.max(1, it.words); } });
      let via = 'inside';
      // the sticky breadcrumb + title bar is what the hero carries (the matcher reads crumbs and H1 from it)
      const bar = document.querySelector(`[data-sid="${x.sid}"]`);
      if (!Object.keys(w).length && bar && bar.matches('#sticky-wrapper, .sticky-wrapper, #sticky-wrapper *')) {
        const hero = r.items.find((it) => it.kind === 'block' && it.variant.startsWith('hero'));
        if (hero) { w[hero.variant] = 1; via = 'title bar'; }
      }
      if (!Object.keys(w).length) {
        const holder = x.up.map((sid) => r.items.find((it) => it.sid === sid)).find(Boolean);
        if (holder) { w[holder.kind === 'block' ? holder.variant : 'default content'] = 1; via = 'container'; }
      }
      const tot = Object.values(w).reduce((a, b) => a + b, 0);
      const top = Object.entries(w).sort((a, b) => b[1] - a[1])[0];
      return { id: x.id, variantId: x.variantId, type: x.type, found: true, sid: x.sid, via, holder: top ? top[0] : null, share: top ? Math.round((top[1] / tot) * 100) / 100 : 0, split: w };
    });
    r.scopeMap = scopeMap;
    scoped.filter((x) => x.found).forEach((x) => { r.items.push({ kind: 'scope', sid: x.sid }); });
    const sids = new Set([...r.items.map((x) => x.sid), ...sections.map((x) => x.sid)]);
    const keep = {}; sids.forEach((s) => { if (s && boxes[s]) keep[s] = boxes[s]; });
    return { ...r, sections, srcWords, boxes: keep };
  }, [HELIX, BUNDLE, p.url, TPL[p.type] || 'static', scopeByPath[norm(p.url)] || []]).catch((e) => ({ error: String(e).slice(0, 300) }));
  await page.close();
  if (res.error) { results.push({ slug: p.slug, url: p.url, type: p.type, error: res.error }); console.log('ERR', p.slug, res.error); return; }

  const out = new Set(res.outWords);
  const kept = res.srcWords.filter((w) => out.has(w)).length / Math.max(1, res.srcWords.length);
  // a section is unassigned when little of its text reaches any recognised block or prose
  const unassigned = res.sections.filter((s) => s.words.length >= 6 && s.words.filter((w) => out.has(w)).length / s.words.length < 0.3)
    .map((s) => ({ sid: s.sid, id: s.id, cls: s.cls, words: s.words.length, box: res.boxes[s.sid] }));
  const items = res.items.filter((x) => x.kind !== 'scope').map((x) => ({ ...x, box: res.boxes[x.sid] || null }));
  const scopeMap = (res.scopeMap || []).map((m) => ({ ...m, box: m.sid ? res.boxes[m.sid] || null : null }));
  const rec = { slug: p.slug, url: p.url, type: p.type, archetype: p.eds?.importTemplate === 'archetype', textKept: Math.round(kept * 1000) / 1000, items, unassigned, scopeMap, ms: Date.now() - t0 };
  results.push(rec);

  // screenshots: the first good instance of each variant, and every unassigned section
  const shots = [];
  for (const it of items) {
    if (it.kind !== 'block' || !it.box || it.box[3] < 30 || sampled.has(it.variant)) continue;
    sampled.add(it.variant);
    shots.push({ file: `shots/${fileOf(it.variant)}.jpg`, box: it.box, variant: it.variant });
  }
  unassigned.forEach((u) => { if (u.box) shots.push({ file: `unassigned/${p.slug}-${u.sid}.jpg`, box: u.box }); });
  if (shots.length) {
    const pg = await load(ctx, p);
    for (const s of shots) {
      const [x, y, w, h] = s.box;
      await pg.screenshot({ path: `${OUT}/${s.file}`, type: 'jpeg', quality: 80, fullPage: true, clip: { x: Math.max(0, x), y: Math.max(0, y), width: Math.min(w, 1440), height: Math.min(h, 1800) } }).catch((e) => console.log('shot fail', s.file, String(e).slice(0, 120)));
      if (s.variant) rec.samples = [...(rec.samples || []), { variant: s.variant, file: s.file }];
    }
    await pg.close();
  }
  console.log(`${results.length}/${pages.length} ${p.slug} · ${items.filter((x) => x.kind === 'block').length} blocks · text kept ${Math.round(kept * 100)}% · unassigned ${unassigned.length} · ${Math.round((Date.now() - t0) / 1000)}s`);
}

const b = await chromium.launch();
const queue = [...pages];
await Promise.all(Array.from({ length: WORKERS }, async () => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  while (queue.length) { const p = queue.shift(); await one(ctx, p).catch((e) => console.log('FAIL', p.slug, String(e).slice(0, 200))); }
  await ctx.close();
}));
await b.close();
fs.writeFileSync(`${OUT}/results${only ? '-test' : ''}.json`, JSON.stringify(results, null, 1));
console.log('done', results.length, 'pages');
