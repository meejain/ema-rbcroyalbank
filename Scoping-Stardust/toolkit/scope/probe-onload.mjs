// Run a bundle's onLoad on a live page, then evaluate an expression in the annotated DOM.
// usage: node probe-onload.mjs <bundle> <url> "<js expression>"
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const S = '/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts';
const [bundle, url, expr] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
const helix = fs.readFileSync(`${S}/static/inject/helix-importer.js`, 'utf8');
await p.evaluate((s) => { const d = window.define; if (d) delete window.define; const e = document.createElement('script'); e.textContent = s; document.head.appendChild(e); if (d) window.define = d; }, helix);
await p.evaluate((s) => { const e = document.createElement('script'); e.textContent = s; document.head.appendChild(e); }, fs.readFileSync(bundle, 'utf8'));
const r = await p.evaluate(async (x) => { const cfg = window.CustomImportScript.default; if (cfg.onLoad) await cfg.onLoad({ document }); return eval(x); }, expr);
console.log(JSON.stringify(r, null, 1));
await b.close();
