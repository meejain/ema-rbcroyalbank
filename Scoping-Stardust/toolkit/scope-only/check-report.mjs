// Sanity check of the scoping-only report: broken images, dangling anchors, one screenshot per tab (/tmp/so-<tab>.png).
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const G = '/backups/meejain/ema-rbcroyalbank/repo/stardust/qa/scope-only';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(`file://${G}/index.html`, { waitUntil: 'load' });
console.log(JSON.stringify(await p.evaluate(() => ({
  imgs: document.images.length,
  broken: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')),
  dangling: [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1)))].filter((h) => !document.getElementById(h)),
}))));
for (const t of ['verdict', 'blocks', 'variants', 'templates', 'unknowns', 'check']) {
  await p.click(`nav.tabs button[data-tab="${t}"]`);
  await p.waitForTimeout(200);
  await p.screenshot({ path: `/tmp/so-${t}.png` });
}
await b.close();
