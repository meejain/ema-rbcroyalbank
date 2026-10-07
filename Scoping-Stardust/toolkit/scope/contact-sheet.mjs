// Contact sheet of scope screenshots for a list of variant ids → /tmp/sheet-<n>.png (2 columns, labelled)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const G = '/backups/meejain/ema-rbcroyalbank/repo/stardust/qa/block-gallery';
const [name, ...ids] = process.argv.slice(2);
const cells = ids.map((id) => `<figure><figcaption>${id}</figcaption><img src="data:image/jpeg;base64,${fs.readFileSync(`${G}/scope/${id}.jpg`).toString('base64')}"></figure>`).join('');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.setContent(`<style>body{margin:0;font:16px Arial;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px}figure{margin:0;border:2px solid #333}figcaption{background:#333;color:#fff;padding:4px 8px;font-weight:bold}img{width:100%;max-height:520px;object-fit:contain;object-position:top;display:block}</style>${cells}`);
await p.screenshot({ path: `/tmp/sheet-${name}.png`, fullPage: true });
await b.close();
