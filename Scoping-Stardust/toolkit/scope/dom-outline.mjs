// Condensed DOM outline of the live section holding a text anchor (captured render).
// usage: node dom-outline.mjs <page-url-suffix> "<anchor text>" [depth]
import fs from 'node:fs';
import { createRequire } from 'node:module';
const cheerio = createRequire('/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/')('cheerio');
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const [suffix, anchor, depth = '7'] = process.argv.slice(2);
const st = JSON.parse(fs.readFileSync(`${ROOT}/stardust/state.json`, 'utf8'));
const p = (Array.isArray(st.pages) ? st.pages : Object.values(st.pages)).find((x) => x.url.endsWith(suffix));
const $ = cheerio.load(fs.readFileSync(`${ROOT}/stardust/current/pages/${p.slug}.html`, 'utf8'));
$('script,style,noscript,svg').remove();
const hit = $('h1,h2,h3,h4,h5,p,span,a,div').filter((i, e) => $(e).text().trim().startsWith(anchor) && !$(e).parents('header,nav').length).last();
let sec = hit.closest('section'); if (!sec.length) sec = hit.parent().parent().parent();
const out = (e, d) => {
  if (d > Number(depth)) return;
  const el = $(e); const tag = e.tagName; const cls = (el.attr('class') || '').trim().replace(/\s+/g, '.');
  const st2 = (el.attr('style') || '').match(/background-image[^;]+/); const own = el.contents().filter((i, c) => c.type === 'text').text().trim().slice(0, 50);
  console.log(`${'  '.repeat(d)}${tag}${cls ? `.${cls}` : ''}${el.attr('id') ? `#${el.attr('id')}` : ''}${tag === 'img' ? ` src=${(el.attr('src') || '').split('/').pop().slice(0, 40)}` : ''}${st2 ? ' [bg]' : ''}${el.attr('data-img') ? ' [data-img]' : ''}${own ? ` "${own}"` : ''}`);
  el.children().each((i, c) => out(c, d + 1));
};
console.log(p.url, '→', p.eds.contentPath);
out(sec[0], 0);
