// Contact sheet of migrated (EDS) variant desktop shots → /tmp/eds-sheet-<name>.png
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const G = '/backups/meejain/ema-rbcroyalbank/repo/stardust/qa/block-gallery';
const [name, ...keys] = process.argv.slice(2);
const cells = keys.map((k) => { const f = `${G}/eds/${k}-desktop.png`; return `<figure><figcaption>${k}</figcaption>${fs.existsSync(f) ? `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}">` : 'missing'}</figure>`; }).join('');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.setContent(`<style>body{margin:0;font:16px Arial;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px}figure{margin:0;border:2px solid #333}figcaption{background:#0051a5;color:#fff;padding:4px 8px;font-weight:bold}img{width:100%;max-height:420px;object-fit:contain;object-position:top;display:block}</style>${cells}`);
await p.screenshot({ path: `/tmp/eds-sheet-${name}.png`, fullPage: true });
await b.close();
