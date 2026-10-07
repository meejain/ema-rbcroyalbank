// Scoping-only report → single standalone HTML with every image embedded (re-encoded JPEG) + print PDF.
// Writes stardust/qa/scope-only/{scope-only-standalone.html, scope-only-standalone.zip, scope-only.pdf}.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright');
const G = '/backups/meejain/ema-rbcroyalbank/repo/stardust/qa/scope-only';
let html = fs.readFileSync(`${G}/index.html`, 'utf8');
const refs = [...new Set([...html.matchAll(/src="((?:shots|scope|tpl|unassigned)\/[^"]+)"/g)].map((m) => m[1]))];
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent('<html><body></body></html>');
for (const ref of refs) {
  if (!fs.existsSync(`${G}/${ref}`)) continue;
  const raw = fs.readFileSync(`${G}/${ref}`).toString('base64');
  const kind = ref.split('/')[0];
  const data = await p.evaluate(async ([src, k]) => {
    const im = new Image(); im.src = src; await im.decode();
    const max = { tpl: 640, scope: 700 }[k] || 1300;
    const s = Math.min(1, max / im.naturalWidth);
    const c = document.createElement('canvas');
    c.width = Math.round(im.naturalWidth * s); c.height = Math.min(Math.round(im.naturalHeight * s), 16000);
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, Math.round(im.naturalHeight * s));
    return c.toDataURL('image/jpeg', k === 'tpl' ? 0.6 : 0.72);
  }, [`data:image/${ref.endsWith('.png') ? 'png' : 'jpeg'};base64,${raw}`, kind]).catch(async () => {
    // too large to decode from a data URI: scale it with a browser screenshot of the file at the target width
    const w = { tpl: 640, scope: 700 }[kind] || 1300;
    const s = await b.newPage({ viewport: { width: w, height: 900 } });
    await s.goto(`file://${G}/${ref}`);
    await s.addStyleTag({ content: `body{margin:0}img{width:${w}px;height:auto;display:block}` });
    const buf = await s.screenshot({ fullPage: true, type: 'jpeg', quality: 60 });
    await s.close();
    console.log('scaled by screenshot:', ref);
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  });
  html = html.split(`src="${ref}"`).join(`src="${data}"`);
}
fs.writeFileSync(`${G}/scope-only-standalone.html`, html);
console.log('standalone', (html.length / 1048576).toFixed(1), 'MB ·', refs.length, 'images');
const q = await b.newPage({ viewport: { width: 1440, height: 900 } });
await q.goto(`file://${G}/scope-only-standalone.html`, { waitUntil: 'load' });
await q.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
await q.pdf({ path: `${G}/scope-only.pdf`, width: '1440px', height: '2000px', printBackground: true, margin: { top: '24px', bottom: '24px' } });
await b.close();
execFileSync('python3', ['-c', `import zipfile;z=zipfile.ZipFile('${G}/scope-only-standalone.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9);z.write('${G}/scope-only-standalone.html','scope-only-standalone.html');z.close()`]);
console.log('pdf', (fs.statSync(`${G}/scope-only.pdf`).size / 1048576).toFixed(1), 'MB · zip', (fs.statSync(`${G}/scope-only-standalone.zip`).size / 1048576).toFixed(1), 'MB');
