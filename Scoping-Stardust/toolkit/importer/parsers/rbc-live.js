/* eslint-disable */
/* global WebImporter */
// Live rbcroyalbank.com page → canon-C EDS document (the 176 template siblings).
// Template heads (hero + plate) are parsed per template; everything after them goes through a
// structural walker that maps RBC's component vocabulary (grid-wpr, accordion-panel, card tiles,
// carousels, tables, callouts) onto the shared block library.
import {
  block, sectionMeta, el, txt, abs, img, cta, hr, inline, keyNoun, metadataBlock, localizeLinks,
} from '../rbc/dom.js';

// .cc-sd: statement-definition letter groups (a letter filter shows one at a time; the document carries all)
const ALLOWED_HIDDEN = '.collapse-content, .accordion-panel, .tab-pane, [role=tabpanel], .tabs-content, .legalcontent, section.disclaimer, .carousel-item:not(.slick-cloned), .slick-slide:not(.slick-cloned), .hero-slide, .card-accordion, .cc-sd';
const SKIP = [
  'script', 'style', 'noscript', 'template', 'svg', 'iframe', 'form', 'button', 'input', 'select', 'label', 'nav',
  '#sticky-wrapper', '.sticky-wrapper', '.breadcrumb-wpr', '.compare-tray', '#compare-tray', '[id*=compare-tray]', '.compare-card-button',
  '.modal', '[role=dialog]', '.slick-cloned', '.offscreen', '.sr-only', '.visually-hidden', '.carousel-indicators',
  '.carousel-ctrl', '.slick-dots', '.slick-arrow', '.hero-previews-container', '.hero-mobile-controls', '.hero-a11y-pause-toggle',
  '.card-legal-collapse', '.custom-side-nav.mobile-only', '.cards-showing-container', '.card-filters', '.drawer-content-container',
  '[data-imp-hidden]', '.socials-block .social-links img', '.irs', '.irs-grid', 'input[type=range]',
  '.tab-nav', '.tablesaw-bar', '.tablesaw-advance', '.tablesaw-nav-btn', 'caption',
  // client-side widgets (listing toolbar, article category filter, compare toggles): no static content
  '.app-toolbar', '#categories-filter:not(:has(a[href]:not([href^="javascript:"])))', '.filter-container', 'a[href^="javascript:"]', 'div:has(> ul.cc-sd-letters)', '.card-image-decoration-container',
].join(',');

/* ---------------------------------------------------------------- onLoad (live DOM) -- */
export async function annotate(document) {
  const win = document.defaultView || window;
  const main = document.querySelector('main') || document.body;
  main.querySelectorAll('img[data-src]').forEach((i) => { if (!i.getAttribute('src') || /data:|blank|spacer/.test(i.getAttribute('src'))) i.setAttribute('src', i.getAttribute('data-src')); });
  main.querySelectorAll('*').forEach((n) => {
    const cs = win.getComputedStyle(n);
    if ((cs.display === 'none' || cs.visibility === 'hidden') && !n.closest(ALLOWED_HIDDEN)) n.setAttribute('data-imp-hidden', '1');
    if (cs.backgroundImage && cs.backgroundImage.startsWith('url(') && !n.closest('[data-imp-hidden]')) {
      const m = cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (m && !/gradient|\.svg/.test(m[1])) n.setAttribute('data-imp-bg', m[1]);
    }
    if (n.tagName === 'IMG' && n.naturalWidth) n.setAttribute('data-imp-w', String(n.naturalWidth));
  });
  // source-broken media (404 on the live site itself) is dropped, never shipped as about:error
  const probe = async (u) => { try { const r = await fetch(u, { method: 'HEAD' }); return r.ok; } catch (e) { return true; } };
  const imgs = [...main.querySelectorAll('img[src]')].filter((i) => !i.closest('[data-imp-hidden]'));
  await Promise.all(imgs.map(async (i) => { if (!(await probe(i.src))) i.setAttribute('data-imp-hidden', '1'); }));
  const bgs = [...main.querySelectorAll('[data-imp-bg]')];
  await Promise.all(bgs.map(async (n) => {
    const u = new URL(n.getAttribute('data-imp-bg'), document.baseURI).href;
    if (!(await probe(u))) { n.removeAttribute('data-imp-bg'); const slide = n.closest('.hero-slide'); if (slide) slide.setAttribute('data-imp-badbg', '1'); }
  }));
  // sections painted dark on the source keep a dark ground (white logos, on-dark copy)
  main.querySelectorAll(':scope > section, :scope > div > section').forEach((s) => {
    const probe = [s, ...s.querySelectorAll(':scope > div')].find((x) => { const c = win.getComputedStyle(x).backgroundColor; return c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c); });
    if (!probe) return;
    const m = win.getComputedStyle(probe).backgroundColor.match(/\d+(\.\d+)?/g);
    if (!m) return;
    const [r, g, b] = m.map(Number);
    if ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.35) s.setAttribute('data-imp-dark', '1');
  });
}

/* ----------------------------------------------------------------------- helpers ----- */
const isHeading = (n) => n && /^H[1-6]$/.test(n.tagName);
const words = (s) => (s || '').split(/\s+/).filter(Boolean).length;
const visible = (n) => n && n.nodeType === 1 && !n.matches(SKIP) && !n.closest('[data-imp-hidden]');
const kids = (n) => [...n.children].filter(visible);
// scoping-only trace: nodes emitted while handling source element n remember it (innermost source wins)
const traceFrom = (n, out, from) => { for (let i = from; i < out.length; i += 1) if (out[i] && !out[i].__src) out[i].__src = n; };
const isBtn = (a) => a && a.matches('a.btn, a.button, a[class*=btn-], a.apply-now-container');
const btnKind = (a) => (a.matches('.primary, .btn-primary, .apply-now-container, [id*=apply]') ? 'primary' : 'secondary');

function imageOf(document, n, base) {
  const i = n.matches('img') ? n : n.querySelector('img');
  if (!i || !i.getAttribute('src')) return null;
  const src = i.getAttribute('src');
  if (/ui-chevron|breadcrumb-chevron|icon-close|spacer|pixel|\.gif$/i.test(src)) return null;
  const out = img(document, src, i.getAttribute('alt'), base);
  if (i.getAttribute('data-imp-w')) out.setAttribute('data-imp-w', i.getAttribute('data-imp-w'));
  return out;
}

function headingOut(document, n, base, level) {
  const tag = level || n.tagName.toLowerCase();
  const h = inline(document, n, tag, base);
  return txt(h) ? h : null;
}

/** paragraph: a lone button → CTA; otherwise cleaned inline */
function paraOut(document, n, base) {
  const links = [...n.querySelectorAll('a')].filter(visible);
  if (links.length === 1 && isBtn(links[0]) && txt(n) === txt(links[0])) return cta(document, links[0], btnKind(links[0]), base);
  const p = inline(document, n, 'p', base);
  return txt(p) ? p : null;
}

function listOut(document, n, base) {
  const l = el(document, n.tagName.toLowerCase());
  kids(n).filter((li) => li.matches('li')).forEach((li) => {
    const x = inline(document, li, 'li', base);
    if (txt(x)) l.append(x);
  });
  return l.children.length ? l : null;
}

function tableOut(document, t, base) {
  const rows = [...t.querySelectorAll('tr')].filter((tr) => !tr.closest('[data-imp-hidden]'))
    .map((tr) => [...tr.children].map((c) => {
      const p = inline(document, c, 'p', base);
      return txt(p) ? p : '';
    }));
  if (!rows.length) return null;
  const width = Math.max(...rows.map((r) => r.length));
  rows.forEach((r) => { while (r.length < width) r.push(''); });
  return block(document, 'Table', rows);
}

/** content of one unit (card/tile/column) as flat authorable nodes; nested repeats flatten */
function unitNodes(document, n, base, ctx = {}) {
  const out = [];
  const visit = (node) => {
    if (!visible(node)) return;
    if (node.matches('img')) { const i = imageOf(document, node, base); if (i) out.push(i); return; }
    if (isHeading(node)) { const h = headingOut(document, node, base, ctx.keepLevel ? null : (ctx.headLevel || 'h3')); if (h) out.push(h); return; }
    if (node.matches('p')) {
      node.querySelectorAll('img').forEach((i) => { if (visible(i)) { const x = imageOf(document, i, base); if (x) out.push(x); } });
      const p = paraOut(document, node, base); if (p) out.push(p); return;
    }
    if (node.matches('ul, ol')) {
      if (node.querySelector('li img') && !node.querySelector('li p')) { kids(node).forEach(visit); return; }
      const l = listOut(document, node, base); if (l) out.push(l); return;
    }
    if (node.matches('table')) { const t = tableOut(document, node, base); if (t) out.push(t); return; }
    // whole-card link (article hub callouts): keep the card's parts; the heading carries the link
    if (node.matches('a[href]') && node.querySelector('h1, h2, h3, h4, h5')) {
      const start = out.length;
      kids(node).forEach(visit);
      const h = out.slice(start).find(isHeading);
      if (h) { const a = el(document, 'a', [...h.childNodes], { href: abs(node.getAttribute('href'), base) }); h.replaceChildren(a); }
      return;
    }
    if (node.matches('a')) {
      const i = node.querySelector('img');
      if (i && visible(i)) { const x = imageOf(document, i, base); if (x) out.push(x); }
      if (txt(node)) out.push(isBtn(node) ? cta(document, node, btnKind(node), base) : cta(document, node, 'link', base));
      return;
    }
    if (node.matches('.card-details-rate-container, #overview-details, .rates-container')) { const r = ratesOut(document, node, base); if (r) out.push(r); return; }
    if (node.matches('.accordion-panel')) {
      const t = node.querySelector('.collapse-toggle, button');
      if (t && txt(t)) out.push(el(document, 'h4', [txt(t)]));
      const c = node.querySelector('.collapse-content'); if (c) kids(c).forEach(visit);
      return;
    }
    const k = kids(node);
    if (!k.length) {
      const bg = node.getAttribute('data-imp-bg');
      if (bg) out.push(img(document, bg, '', base));
      const t = txt(node);
      if (t && !node.matches('span.tel-no, sup')) out.push(inline(document, node, 'p', base));
      return;
    }
    // mixed inline text + elements (e.g. a div holding text and a <strong>) → one paragraph
    const hasText = [...node.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
    if (hasText && !node.querySelector('p, h1, h2, h3, h4, h5, ul, ol, div, img, table')) { const p = inline(document, node, 'p', base); if (txt(p)) out.push(p); return; }
    k.forEach(visit);
  };
  visit(n);
  return out;
}

function ratesOut(document, n, base) {
  const rows = [...n.querySelectorAll('.split-horizontal-flex, .card-details-rate-item-container, .rate-item')].filter(visible);
  if (rows.length < 2) return null;
  const ul = el(document, 'ul');
  rows.forEach((r) => {
    const label = r.querySelector('.card-details-rate-item-label') || [...r.children].find((c) => !c.matches('.card-detail-value') && !c.querySelector('.card-detail-value'));
    const value = r.querySelector('.card-details-rate-item-value') || [...r.querySelectorAll('.card-detail-value')].find((v) => !v.matches('.hide')) || r.lastElementChild;
    if (!label || !value) return;
    const v = inline(document, value, 'span', base);
    ul.append(el(document, 'li', [el(document, 'strong', [txt(label)]), ' ', ...v.childNodes]));
  });
  return ul.children.length > 1 ? ul : null;
}

/* ------------------------------------------------------------- repeat detection ----- */
const sig = (n) => `${n.tagName}.${(n.className && typeof n.className === 'string' ? n.className : '').split(/\s+/).filter((c) => c && !/^(mar|pad|mob|tab|w|h|eh|text|centered|flex|active|ga|col-\d|clearfix|slick)/.test(c)).sort()[0] || ''}`;
const unitLike = (n) => !!(n.querySelector('img, h2, h3, h4, h5') || words(txt(n)) >= 8 || n.matches('a'));

function repeatGroup(n) {
  if (n.matches('ul, ol') && !n.querySelector(':scope > li img, :scope > li h3, :scope > li h4, :scope > li a.category-button-container')) return null;
  if (n.matches('.accordion, table, p, h1, h2, h3, h4, .tabs, .tab-content')) return null;
  let k = kids(n);
  // slick carousels: the real slides sit in .slick-track
  const track = n.matches('.slick-track') ? n : null;
  if (track) k = k.filter((c) => !c.matches('.slick-cloned'));
  if (k.length < 2) return null;
  if (n.matches('.grid-wpr')) {
    const members = k.filter((c) => /(^| )grid-/.test(c.className));
    if (members.length >= 2) return { members, rest: k.filter((c) => !members.includes(c)), grid: true };
  }
  const groups = {};
  k.forEach((c) => { const s = sig(c); (groups[s] = groups[s] || []).push(c); });
  // largest group of card-like siblings (spacer/separator runs between tiles never win the vote)
  const [best] = Object.values(groups).filter((g) => g.every(unitLike)).sort((a, b) => b.length - a.length);
  if (!best || best.length < 2) return null;
  // units titled by h2 are sub-sections, unless the h2 sits inside a whole-card link (article hub cards)
  const subSection = (c) => [...c.querySelectorAll('h2')].some((h) => !h.closest('a[href]'));
  if (best.every(subSection) || best.some((c) => c.matches('section, .custom-side-nav-item, .tab-pane'))) return null;
  // units holding tables, accordions or tabs are sub-sections: no block may nest another (D2)
  if (best.some((c) => c.querySelector('table, .accordion, .accordion-panel, .tab-pane'))) return null;
  // a run of plain paragraphs or headings is prose, not a repeat
  if (best.every((c) => c.matches('p, li') && !c.querySelector('img'))) return null;
  if (best.length / k.length < 0.5 && best.length < 3) return null;
  return { members: best, rest: k.filter((c) => !best.includes(c)), grid: false };
}

function cardsVariant(units, ctx) {
  const all = (f) => units.every(f);
  const some = (f) => units.some(f);
  const imgs = (u) => u.filter((x) => x.tagName === 'IMG');
  const heads = (u) => u.filter(isHeading);
  const ps = (u) => u.filter((x) => x.tagName === 'P');
  const rates = (u) => u.some((x) => x.tagName === 'UL' && [...x.children].length > 1 && [...x.children].every((li) => li.firstElementChild && li.firstElementChild.tagName === 'STRONG'));
  const small = (i) => /\.svg(\?|$)/i.test(i.getAttribute('src')) || /icon|pictogram/i.test(i.getAttribute('src')) || Number(i.getAttribute('data-imp-w') || 999) <= 120;
  const isCardImg = (i) => /cardData|\/credit-cards\/canada\/|card-art|-card\.|visa|mastercard/i.test(i.getAttribute('src'));
  if (all((u) => !heads(u).length && !ps(u).filter((p) => txt(p)).length && imgs(u).length)) return 'awards';
  if (ctx.category) return 'links';
  if (ctx.articleGrid) return 'articles';
  if (some(rates) && some((u) => imgs(u).some(isCardImg))) return some((u) => u.some((x) => x.tagName === 'P' && x.querySelector('strong > a'))) ? 'offers' : 'compare';
  if (all((u) => /^[\d.,]+\s?(x|%|k)?$/i.test(txt(ps(u)[0] || heads(u)[0])) && words(txt(ps(u)[0] || heads(u)[0])) <= 2)) return 'stats';
  if (all((u) => u.length <= 3 && u.filter((x) => x.querySelector && x.querySelector('a')).length === 1 && words(u.map(txt).join(' ')) <= 8)) return imgs(units[0]).length ? 'links' : 'quick';
  if (some((u) => imgs(u).some((i) => /logo/i.test(i.getAttribute('src') + i.getAttribute('alt'))))) return 'partners';
  if (all((u) => imgs(u).length && imgs(u).every(small))) return 'icons';
  if (all((u) => imgs(u).length && heads(u).length && u.some((x) => x.querySelector && x.querySelector('a'))) && units.length === 3 && ctx.articles) return 'articles';
  if (all((u) => imgs(u).length)) return units.length === 3 ? 'why' : 'tiles';
  return units.length === 4 ? 'list' : 'features';
}

function cardsBlock(document, members, base, ctx = {}) {
  const units = members.map((m) => unitNodes(document, m, base, ctx)).filter((u) => u.length);
  if (!units.length) return null;
  if (units.length === 1) return units[0];
  // split media: two units, one image-only → columns (intro)
  if (units.length === 2 && units.some((u) => u.every((x) => x.tagName === 'IMG'))) {
    const media = units.find((u) => u.every((x) => x.tagName === 'IMG'));
    const text = units.find((u) => u !== media);
    return block(document, 'Columns (intro)', [units[0] === media ? [media, text] : [text, media]]);
  }
  // two prose-heavy halves → two columns
  if (units.length === 2 && units.every((u) => u.filter((x) => isHeading(x) || x.tagName === 'UL').length >= 2)) {
    return block(document, 'Columns', [units]);
  }
  // two image-less text halves of real length (e.g. Emergencies | Submit a Claim) → two columns, not cards
  if (units.length === 2 && units.every((u) => !u.some((x) => x.tagName === 'IMG') && words(u.map(txt).join(' ')) >= 30)) {
    return block(document, 'Columns', [units]);
  }
  const variant = cardsVariant(units, ctx);
  return block(document, `Cards (${variant})`, units.map((u) => [u]));
}

function accordionOut(document, acc, base) {
  const rows = [...acc.querySelectorAll('.accordion-panel')].filter((p) => !p.closest('[data-imp-hidden]')).map((p) => {
    const t = p.querySelector('.collapse-toggle, .accordion-title, button');
    const c = p.querySelector('.collapse-content, .accordion-content');
    const head = [el(document, 'p', [txt(t)])];
    const sub = t && t.querySelector('.sub-title, small, .accordion-sub-title');
    if (sub) { head[0] = el(document, 'p', [txt(t).replace(txt(sub), '').trim()]); head.push(el(document, 'p', [txt(sub)])); }
    const body = c ? unitNodes(document, c, base, { headLevel: 'h4' }) : [];
    return [head, body.length ? body : ''];
  }).filter((r) => txt(r[0][0]));
  if (!rows.length) return null;
  const hasSub = rows.some((r) => r[0].length > 1);
  return block(document, hasSub ? 'Accordion (details)' : 'Accordion', rows);
}

/** media + copy side by side (apply bands, horizontal callouts, app promo) → Columns; null if no media */
function mediaColumns(document, n, base, variant) {
  const parts = kids(n);
  const isMediaPart = (c) => c.matches('[data-imp-bg]') || (!!c.querySelector('img') && !c.querySelector('h1, h2, h3, h4, h5, p'));
  const media = parts.find(isMediaPart);
  if (!media || parts.length < 2) return null;
  const mediaCell = media.matches('[data-imp-bg]') ? [img(document, media.getAttribute('data-imp-bg'), '', base)] : unitNodes(document, media, base);
  const textCell = parts.filter((c) => c !== media).flatMap((c) => unitNodes(document, c, base, { keepLevel: true }));
  if (!mediaCell.length || !textCell.length) return null;
  // callout-reverse paints the image on the right although it comes first in the DOM
  const mediaFirst = parts.indexOf(media) < parts.indexOf(parts.find((c) => c !== media)) && !n.matches('.callout-reverse');
  return block(document, variant ? `Columns (${variant})` : 'Columns', [mediaFirst ? [mediaCell, textCell] : [textCell, mediaCell]]);
}

/** recognised RBC components that map 1:1 onto an existing block variant; null when n is none of them */
function componentOut(document, n, base) {
  if (n.matches('.ssr-cta-template')) return mediaColumns(document, n, base, 'apply');
  if (n.matches('.app-mobile-container')) return mediaColumns(document, n, base, null);
  // a lone horizontal callout is a promo banner; a grid of them (article hub) stays a cards repeat
  if (n.matches('.callout.horizontal') && (n.closest('section') || n.parentElement).querySelectorAll('.callout.horizontal').length < 3) {
    return mediaColumns(document, n, base, n.querySelector('.reward-card-container, .banner-card-img') ? 'apply' : null);
  }
  // product result tiles (cardholder pages' "Our Top Credit Cards…") → Cards (offers), same cell shape as the hub tiles
  const results = kids(n).filter((c) => c.matches('.card-result'));
  if (results.length >= 2) {
    const rows = results.map((t) => {
      const cell = [];
      const im = t.querySelector('img'); if (im && visible(im)) { const x = imageOf(document, im, base); if (x) cell.push(x); }
      const href = t.querySelector('a[href$=".html"]:not(.btn)')?.getAttribute('href');
      const name = [...t.querySelectorAll('p.text-bold, p.font-medium')].find(visible);
      if (name) cell.push(el(document, 'h3', [href ? el(document, 'a', [txt(name)], { href: abs(href, base) }) : txt(name)]));
      const ul = t.querySelector('ul.disc-list');
      if (ul) {
        const snipe = ul.querySelector('.snipe');
        const copy = ul.cloneNode(true); copy.querySelectorAll('li').forEach((li) => li.remove());
        const p = inline(document, copy, 'p', base);
        if (txt(p)) { if (snipe && txt(snipe)) p.prepend(el(document, 'strong', [txt(snipe)]), ' '); cell.push(p); }
      }
      const cols = [...t.querySelectorAll('.row > [class*=col-]')].filter(visible);
      const rates = el(document, 'ul');
      for (let i = 0; i + 1 < cols.length; i += 2) {
        if (txt(cols[i])) rates.append(el(document, 'li', [el(document, 'strong', [txt(cols[i]).replace(/:?\s*$/, ':')]), ' ', ...inline(document, cols[i + 1], 'span', base).childNodes]));
      }
      if (rates.children.length) cell.push(rates);
      const links = [...t.querySelectorAll('.callout-link a[href]')].filter(visible);
      links.filter((a) => isBtn(a)).forEach((a) => cell.push(cta(document, a, 'primary', base)));
      links.filter((a) => !isBtn(a) && txt(a)).forEach((a) => cell.push(cta(document, a, 'link', base)));
      return [cell];
    }).filter((r) => r[0].length);
    return rows.length ? block(document, 'Cards (offers)', rows) : null;
  }
  if (n.matches('.card-awards-container')) {
    const units = kids(n).filter((c) => c.matches('.card-awards-item')).map((c) => unitNodes(document, c, base)).filter((u) => u.length);
    return units.length ? block(document, 'Cards (awards)', units.map((u) => [u])) : null;
  }
  // tool tiles live in two .grid-wpr rows of two; the node holding all of them (and no heading of its own) is the block
  const tools = [...n.querySelectorAll('.card-tools-grid-item, .learn-more-tool')].filter(visible);
  if (tools.length >= 2 && !kids(n).some(isHeading)) {
    const units = tools.map((t) => {
      const u = unitNodes(document, t, base);
      // the cash-back tool tiles paint their illustration as a background
      if (t.getAttribute('data-imp-bg')) u.unshift(img(document, t.getAttribute('data-imp-bg'), '', base));
      const pic = u.filter((x) => x.tagName === 'IMG');
      return [...pic, ...u.filter((x) => x.tagName !== 'IMG')];
    }).filter((u) => u.length);
    return block(document, 'Cards (tools)', units.map((u) => [u]));
  }
  return null;
}

/** structural walker: source subtree → ordered EDS nodes (default content + blocks) */
function walk(document, root, base, out, ctx = {}) {
  // Angular rbc-accordion: question in the component, answer in the hidden sibling #acc-NN panel
  if (root.querySelector(':scope > rbc-accordion')) {
    const rows = [];
    const all = [...root.children];
    all.forEach((n, i) => {
      if (!n.matches('rbc-accordion')) return;
      const nx = all[i + 1];
      const body = nx && nx.matches('[id^="acc-"]') ? [...nx.querySelectorAll('p, li')].map((x) => inline(document, x, 'p', base)).filter((x) => txt(x)) : [];
      if (txt(n)) rows.push([[el(document, 'p', [txt(n)])], body.length ? body : '']);
    });
    all.filter((n) => !n.matches('rbc-accordion, [id^="acc-"]') && visible(n)).forEach((n) => walk(document, el(document, 'div', [n.cloneNode(true)]), base, out, ctx));
    if (rows.length) { out.push(block(document, 'Accordion', rows)); out[out.length - 1].__src = root; }
    return out;
  }
  // hub card product tiles → Cards (offers): image, name, fee, offer box, features, rates, CTAs
  const tiles = [...root.children].filter((c) => c.matches('.card-container') && !c.closest('[data-imp-hidden]'));
  if (tiles.length >= 2) {
    const rows = tiles.map((t) => {
      const cell = [];
      const im = t.querySelector('.card-image-container img.card-image, .card-image-container img:not(.card-image-decoration img)');
      if (im) { const x = imageOf(document, im, base); if (x) cell.push(x); }
      const title = t.querySelector('.card-title');
      const view = [...t.querySelectorAll('.card-view-card a, a.view-card, a[href*=".html"]')].find((a) => !a.matches('.apply-now-container') && !/#/.test(a.getAttribute('href') || '#'));
      if (title) cell.push(el(document, 'h3', [view ? el(document, 'a', [txt(title)], { href: abs(view.getAttribute('href'), base) }) : txt(title)]));
      const fee = t.querySelector('.card-details-annual-fee-container');
      if (fee && txt(fee)) cell.push(el(document, 'p', [txt(fee)]));
      const cap = t.querySelector('.card-details-offer-caption');
      const off = t.querySelector('.card-details-offer-content');
      if (off && txt(off)) { const p = inline(document, off, 'p', base); if (cap && txt(cap)) p.prepend(el(document, 'strong', [txt(cap)]), ' '); cell.push(p); }
      const feats = [...t.querySelectorAll('.card-details-features-container.desktop-only-flex .card-details-features-item, .card-details-features-item')];
      const seen = new Set();
      const ul = el(document, 'ul');
      feats.forEach((f) => { const li = inline(document, f, 'li', base); const k = txt(li); if (k && !seen.has(k)) { seen.add(k); ul.append(li); } });
      if (ul.children.length) cell.push(ul);
      const rates = ratesOut(document, t, base); if (rates) cell.push(rates);
      const apply = t.querySelector('a.apply-now-container, a.btn.primary');
      if (apply) cell.push(cta(document, apply, 'primary', base));
      if (view) cell.push(cta(document, view, 'link', base));
      return [cell];
    });
    out.push(block(document, 'Cards (offers)', rows)); out[out.length - 1].__src = root;
    [...root.children].filter((c) => !tiles.includes(c) && visible(c)).forEach((c) => walk(document, el(document, 'div', [c.cloneNode(true)]), base, out, ctx));
    return out;
  }
  const step = (n) => {
    // article share row: label + one link per network (same shape as the approved article)
    if (n.matches('.socials-block')) {
      const label = n.querySelector('p, .h5');
      if (label && txt(label)) out.push(el(document, 'p', [txt(label)]));
      const ul = el(document, 'ul');
      n.querySelectorAll('a[href]').forEach((a) => {
        const first = a.querySelector('span');
        const name = (txt(first) || txt(a)).replace(/\s*\((opens|s'ouvre|ouvre)[^)]*\)\s*$/i, '').replace(/^click to /i, '').replace(/^cliquez pour /i, '');
        if (name) ul.append(el(document, 'li', [el(document, 'a', [name.charAt(0).toUpperCase() + name.slice(1)], { href: abs(a.getAttribute('href'), base) })]));
      });
      if (ul.children.length) out.push(ul);
      return;
    }
    // tabs: the tab bar is dropped; every pane becomes its own titled sub-section (pane title → h2)
    if (n.matches('.tabs')) {
      [...n.querySelectorAll('.tab-pane')].forEach((pane) => {
        const before = out.length;
        walk(document, pane, base, out, ctx);
        const first = out.slice(before).find((x) => isHeading(x));
        if (first && first.tagName !== 'H2') {
          const h2 = document.createElement('h2');
          h2.append(...first.childNodes);
          out[out.indexOf(first)] = h2;
        }
      });
      return;
    }
    const comp = componentOut(document, n, base);
    if (comp) { out.push(comp); return; }
    if (n.matches('.accordion') || (n.querySelector(':scope > .grid-wpr > .grid-half > .accordion-panel, :scope > .accordion-panel'))) { const a = accordionOut(document, n, base); if (a) out.push(a); return; }
    if (n.matches('table')) { const t = tableOut(document, n, base); if (t) out.push(t); return; }
    if (isHeading(n)) { const h = headingOut(document, n, base, n.tagName === 'H1' && !ctx.keepH1 ? 'h2' : null); if (h) out.push(h); return; }
    if (n.matches('p')) {
      n.querySelectorAll('img').forEach((i) => { if (visible(i)) { const x = imageOf(document, i, base); if (x) out.push(x); } });
      const p = paraOut(document, n, base); if (p) out.push(p); return;
    }
    if (n.matches('img')) { const i = imageOf(document, n, base); if (i) out.push(i); return; }
    if (n.matches('a')) { if (txt(n)) out.push(cta(document, n, isBtn(n) ? btnKind(n) : 'link', base)); return; }
    const rep = repeatGroup(n);
    if (rep) {
      const before = []; const after = [];
      let seen = false;
      kids(n).forEach((c) => { if (rep.members.includes(c)) seen = true; else if (!seen) before.push(c); else after.push(c); });
      before.forEach((c) => walk(document, el(document, 'div', [c]), base, out, ctx));
      const b = cardsBlock(document, rep.members, base, { ...ctx, category: n.matches('.category-button-grid'), articles: ctx.articles || n.matches('.advices-container, [id*=article]') || !!n.querySelector('[id*=article]'), articleGrid: n.matches('.article-grid-container') || !!n.closest('#read-next-articles') });
      if (Array.isArray(b)) out.push(...b); else if (b) out.push(b);
      after.forEach((c) => walk(document, el(document, 'div', [c]), base, out, ctx));
      return;
    }
    if (n.matches('ul, ol')) { const l = listOut(document, n, base); if (l) out.push(l); return; }
    const k = kids(n);
    if (!k.length) {
      // an empty element painted with a photo (callout-img and similar) carries that photo as content
      const bg = n.getAttribute('data-imp-bg');
      if (bg) out.push(img(document, bg, '', base));
      const t = txt(n);
      if (t && !n.matches('sup, span.tel-no')) { const p = inline(document, n, 'p', base); if (txt(p)) out.push(p); }
      return;
    }
    const hasText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
    if (hasText && !n.querySelector('p, h1, h2, h3, h4, h5, ul, ol, div, img, table')) { const p = inline(document, n, 'p', base); if (txt(p)) out.push(p); return; }
    walk(document, n, base, out, ctx);
  };
  kids(root).forEach((n) => { const from = out.length; step(n); traceFrom(n, out, from); });
  return out;
}

/** split a node list into EDS sections at each <h2> */
function splitAtH2(nodes) {
  const sections = [];
  let cur = [];
  nodes.forEach((n) => {
    if (n.tagName === 'H2' && cur.length) { sections.push(cur); cur = []; }
    cur.push(n);
  });
  if (cur.length) sections.push(cur);
  return sections;
}

/* --------------------------------------------------------------- template heads ----- */
function crumbsOut(document, main, base) {
  const ol = main.querySelector('#breadcrumb-wpr ol, .breadcrumb-wpr ol');
  if (!ol) return null;
  const ul = el(document, 'ul');
  ol.querySelectorAll(':scope > li').forEach((li) => {
    const a = [...li.querySelectorAll('a')].find((x) => txt(x) && txt(x) !== '...');
    const label = a ? txt(a) : txt(li.querySelector('span:not([aria-hidden])') || li);
    if (!label) return;
    ul.append(el(document, 'li', [a ? el(document, 'a', [label], { href: abs(a.getAttribute('href'), base) }) : label]));
  });
  return ul.children.length ? ul : null;
}

function bannerImage(document, banner, base) {
  if (!banner) return null;
  const withBg = [banner, ...banner.querySelectorAll('[data-imp-bg]')].find((n) => n.getAttribute && n.getAttribute('data-imp-bg'));
  if (withBg) return img(document, withBg.getAttribute('data-imp-bg'), '', base);
  const i = [...banner.querySelectorAll('.banner-img img, img.banner-img, .hero-img img')].find(visible);
  return i ? imageOf(document, i, base) : null;
}

function heroFrom(document, { main, banner, base, h1Text, variant, intro }) {
  const cell = [];
  const crumbs = crumbsOut(document, main, base);
  if (crumbs) cell.push(crumbs);
  const bg = variant === 'typeled' ? null : bannerImage(document, banner, base);
  if (bg) cell.push(bg);
  const art = banner ? [...banner.querySelectorAll('img.banner-card-img, img.custom-banner-card-img')].find((i) => !i.closest('[data-imp-hidden]')) : null;
  if (art && variant === 'card') cell.push(imageOf(document, art, base));
  else if (!art && variant === 'card' && !banner) {
    const card = main.querySelector('.ssr-card-template img.cta-img, .reward-card-container img');
    if (card) cell.push(imageOf(document, card, base));
  }
  if (h1Text) cell.push(el(document, 'h1', [h1Text]));
  if (banner) {
    const scope = banner.querySelector('.banner-text, .banner-content, .banner-wpr, .section-inner') || banner;
    const heads = [...scope.querySelectorAll('h1, h2')].filter(visible);
    heads.forEach((h) => {
      if (txt(h) === h1Text) return;
      const o = headingOut(document, h, base, h1Text ? 'h2' : 'h1');
      if (o) { if (!h1Text) h1Text = txt(o); o.querySelectorAll('strong').length || markGoldNumber(document, o); cell.push(o); }
    });
    const CTA = 'a.btn, a.button, a[class*=standalone-link]';
    [...scope.querySelectorAll('p')].filter((p) => visible(p) && !p.querySelector(CTA) && !p.closest('h1, h2')).forEach((p) => { const x = paraOut(document, p, base); if (x) cell.push(x); });
    [...scope.querySelectorAll(CTA)].filter((a) => visible(a) && txt(a)).forEach((a, i) => cell.push(cta(document, a, i === 0 ? 'primary' : 'secondary', base)));
  } else if (intro) {
    intro.forEach((n) => cell.push(n));
  }
  let v = variant;
  if (variant === 'card' && !banner) v = 'card, typeled';
  else if (variant === 'card' && !art) v = null;
  return block(document, v ? `Hero (${v})` : 'Hero', [[cell]]);
}

/** gold numeral in an offer heading: the first figure ("70,000", "$1,500") becomes <strong> */
function markGoldNumber(document, h) {
  const walker = document.createTreeWalker(h, 4);
  let node;
  while ((node = walker.nextNode())) {
    const m = node.textContent.match(/\$?\d[\d,.]*(\s?(points|pts|%))?/i);
    if (m && m[0].length >= 3 && !node.parentElement.closest('a')) {
      const after = node.splitText(m.index); after.splitText(m[0].length);
      const s = document.createElement('strong'); after.replaceWith(s); s.append(after);
      return;
    }
  }
}

function cardHighlightsFrom(document, tpl, base) {
  const cell = [];
  const card = tpl.querySelector('img.cta-img, .reward-card-container img');
  if (card) cell.push(imageOf(document, card, base));
  const offer = tpl.querySelector('.card-details-offer-content');
  if (offer) {
    const c = offer.cloneNode(true);
    c.querySelectorAll('.card-details-offer-additional').forEach((x) => x.remove());
    const full = inline(document, c, 'h2', base);
    // "Apply by …" deadline becomes the badge; the rest stays the offer headline
    const text = full.textContent;
    const m = text.match(/(Apply by|Faites votre demande d’ici|Présentez une demande d’ici|Demandez-la d’ici)[^.]*\.?/i);
    if (m) {
      const walker = document.createTreeWalker(full, 4); let node;
      while ((node = walker.nextNode())) { const i = node.textContent.indexOf(m[0]); if (i >= 0) { node.textContent = node.textContent.slice(0, i); break; } }
    }
    if (txt(full)) cell.push(full);
    const bullets = offer.querySelector('.card-details-offer-additional ul');
    if (bullets) { const l = listOut(document, bullets, base); if (l) cell.push(l); }
    if (m) cell.push(el(document, 'p', [el(document, 'strong', [m[0].trim()])]));
  }
  const rates = ratesOut(document, tpl.querySelector('#overview-details') || tpl, base);
  if (rates) cell.push(rates);
  [...tpl.querySelectorAll('#overview-details p.p-sm, .card-details-note, p.p-sm')].filter(visible).forEach((p) => { const x = paraOut(document, p, base); if (x) cell.push(x); });
  [...tpl.querySelectorAll('a.btn')].filter(visible).slice(0, 1).forEach((a) => cell.push(cta(document, a, 'primary', base)));
  return block(document, 'Card Highlights', [[cell]]);
}

function legalOut(document, sec, base) {
  const inner = sec.querySelector('.legalcontent, .collapse-content, .collapse-inner') || sec;
  const items = [];
  const rows = [...inner.querySelectorAll('.table-row')];
  if (rows.length) {
    rows.forEach((r) => {
      const cells = [...r.querySelectorAll(':scope > .table-cell')];
      const textCell = cells[cells.length - 1] || r;
      const marker = cells.length > 1 ? txt(cells[0]) : '';
      const li = inline(document, textCell, 'li', base);
      if (marker && txt(li)) li.prepend(`${marker} `);
      if (txt(li)) items.push(li);
    });
  } else {
    inner.querySelectorAll('p, li').forEach((p) => {
      if (p.closest('button') || p.querySelector('button')) return;
      const li = inline(document, p, 'li', base);
      if (txt(li)) items.push(li);
    });
  }
  if (!items.length) return null;
  // the toggle carries both states ("View … / Hide …") — the first state is the label
  const btn = sec.querySelector('button.collapse-toggle');
  const leaf = btn ? [...btn.querySelectorAll('*')].find((c) => !c.children.length && txt(c)) : null;
  const ownTextNode = btn ? [...btn.childNodes].find((c) => c.nodeType === 3 && c.textContent.trim()) : null;
  let label = (ownTextNode ? ownTextNode.textContent.replace(/\s+/g, ' ').trim() : txt(leaf || btn)) || 'View Legal Disclaimers';
  // collapsed both-state labels ("ShowHide", "XX") → the first state
  label = label.replace(/^(.+?)\s*(Hide|Cacher|Masquer)\b.*$/i, '$1').trim();
  const half = label.length / 2;
  if (Number.isInteger(half) && label.slice(0, half) === label.slice(half)) label = label.slice(0, half).trim();
  return block(document, 'Accordion (legal)', [[[el(document, 'p', [label])], [el(document, 'ol', items)]]]);
}

/* -------------------------------------------------------------------- page ----- */
export function liveToEds(document, url, template) {
  const base = url;
  const main = document.querySelector('main') || document.body;
  const out = document.createElement('div');
  const h1El = main.querySelector('h1#page-title, h1.nav-location') || main.querySelector('h1');
  let h1Text = h1El ? txt(h1El) : '';
  const sections = kids(main).filter((s) => !s.matches('#sticky-wrapper, .sticky-wrapper'));
  const used = new Set();
  const edsSections = []; // { nodes, style }

  // ---- hero
  let banner = sections.find((s) => s.matches('section.banner, section[id*=banner], .banner-container, section.bg-highlight') || s.querySelector(':scope > .banner, :scope > div > .banner-wpr'));
  if (banner && sections.indexOf(banner) > 1) banner = null;
  if (template === 'landing') {
    const allSlides = [...main.querySelectorAll('.hero-slide, .hero-slides > div')].filter((x) => !x.matches('.slick-cloned'));
    const slide = allSlides.find((x) => !x.matches('[data-imp-badbg]') && (x.matches('[data-imp-bg]') || x.querySelector('[data-imp-bg]'))) || allSlides[0];
    const cell = [];
    if (slide) {
      const bg = bannerImage(document, slide, base); if (bg) cell.push(bg);
      const sigEl = [...slide.querySelectorAll('p, div')].find((p) => visible(p) && /script|handwrit|cursive|tagline/i.test(p.className));
      if (sigEl) cell.push(el(document, 'p', [inline(document, sigEl, 'em', base)]));
      [...slide.querySelectorAll('h1, h2')].filter(visible).slice(0, 1).forEach((h) => { const o = headingOut(document, h, base, 'h2'); markGoldNumber(document, o); cell.push(o); });
      [...slide.querySelectorAll('p')].filter((p) => visible(p) && p !== sigEl && !p.querySelector('a.btn')).forEach((p) => { const x = paraOut(document, p, base); if (x) cell.push(x); });
      [...slide.querySelectorAll('a.btn')].filter(visible).forEach((a, i) => cell.push(cta(document, a, i === 0 ? 'primary' : 'secondary', base)));
    }
    edsSections.push({ nodes: [Object.assign(block(document, 'Hero (home)', [[cell]]), { __src: slide || banner })], style: null });
    used.add(banner);
    // remaining slides → promo cards
    const slides = allSlides.filter((x) => x !== slide);
    if (slides.length) {
      const units = slides.map((s) => unitNodes(document, s, base, { headLevel: 'h3' }).filter((x) => !(x.tagName === 'P' && x.querySelector('em > a')))).filter((u) => u.length);
      if (units.length) edsSections.push({ nodes: [Object.assign(block(document, 'Cards (promo)', units.map((u) => [u])), { __src: slides[0].parentElement })], style: 'band' });
    }
  } else {
    const variant = template === 'program' ? 'card' : (template === 'static' || !bannerImage(document, banner, base) ? 'typeled' : null);
    // product pages without a campaign banner: the overview's lead heading + line become the offer
    let intro = null;
    if (template === 'program' && !banner) {
      const h = [...main.querySelectorAll('#overview h2, #sts-text h2')].find((x) => visible(x) && !x.closest('.ssr-card-template'));
      if (h) {
        intro = [headingOut(document, h, base, 'h2')];
        const nx = h.nextElementSibling;
        if (nx && nx.matches('p') && visible(nx)) { intro.push(paraOut(document, nx, base)); nx.setAttribute('data-imp-hidden', '1'); }
        h.setAttribute('data-imp-hidden', '1');
        intro = intro.filter(Boolean);
      }
    }
    edsSections.push({ nodes: [Object.assign(heroFrom(document, { main, banner, base, h1Text, variant, intro }), { __src: banner || h1El })], style: null });
    if (banner) used.add(banner);
  }

  // ---- plate
  if (template === 'landing') {
    const welcome = sections.find((s) => !used.has(s) && s.querySelector('h1'));
    if (welcome) { edsSections.push({ nodes: walk(document, welcome, base, [], { keepH1: true }), style: 'plate' }); used.add(welcome); }
  }
  if (template === 'program') {
    const tpl = main.querySelector('.ssr-card-template');
    if (tpl) {
      edsSections.push({ nodes: [Object.assign(cardHighlightsFrom(document, tpl, base), { __src: tpl })], style: 'plate' });
      tpl.setAttribute('data-imp-hidden', '1');
    }
  }
  if (template === 'listing') {
    const cat = main.querySelector('#category-buttons, section:has(.category-button-grid)');
    if (cat && sections.indexOf(cat) <= 2) {
      edsSections.push({ nodes: walk(document, cat, base, [], {}), style: 'plate' });
      used.add(cat);
    }
  }
  if (template === 'article') {
    const left = main.querySelector('.advice-left-contents');
    const tocList = main.querySelector('.advice-right-table-of-contents ul, .custom-dropdown-nav-items');
    if (left) {
      const nodes = walk(document, left, base, [], { headLevel: 'h3' });
      // key takeaways / TL;DR = first h2 + its list → the plate
      const firstH2 = nodes.findIndex((n) => n.tagName === 'H2');
      const nextH2 = nodes.findIndex((n, i) => i > firstH2 && n.tagName === 'H2');
      if (firstH2 >= 0 && /takeaway|tl;?dr|tlpl|points clés|principaux points|à retenir/i.test(txt(nodes[firstH2]))) {
        edsSections.push({ nodes: nodes.slice(firstH2, nextH2 < 0 ? undefined : nextH2), style: 'takeaways' });
        nodes.splice(firstH2, (nextH2 < 0 ? nodes.length : nextH2) - firstH2);
      }
      const art = [];
      if (tocList) {
        const ul = el(document, 'ul');
        tocList.querySelectorAll('a').forEach((a) => {
          const label = txt(a);
          const id = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          ul.append(el(document, 'li', [el(document, 'a', [label], { href: `#${id}` })]));
        });
        const label = txt(main.querySelector('.custom-dropdown-nav-btn')) || (chromeLang(url) === 'fr' ? 'Sur cette page' : 'On this page');
        art.push(Object.assign(block(document, 'Toc', [[[el(document, 'p', [label]), ul]]]), { __src: tocList }));
      }
      nodes.forEach((n) => art.push(n));
      edsSections.push({ nodes: art, style: 'article' });
      main.querySelector('.advices-container')?.setAttribute('data-imp-hidden', '1');
      main.querySelector('.custom-side-nav')?.setAttribute('data-imp-hidden', '1');
    }
  }

  // ---- body
  let band = false;
  sections.forEach((s) => {
    if (used.has(s) || s.closest('[data-imp-hidden]') || s.matches('[data-imp-hidden]')) return;
    if (s.matches('section.disclaimer, .disclaimer')) { const l = legalOut(document, s, base); if (l) { l.__src = s; edsSections.push({ nodes: [l], style: 'legal' }); } return; }
    const nodes = walk(document, s, base, [], { articles: template === 'article' || template === 'landing' });
    const dark = s.matches('[data-imp-dark]');
    splitAtH2(nodes).forEach((chunk) => {
      if (!chunk.length) return;
      // a heading-less chunk continues the previous body section (a grid under the last section title)
      const prev = edsSections[edsSections.length - 1];
      // (a block that carries its own h2, like the apply band, is a titled section of its own)
      const titled = chunk.some((x) => x.tagName === 'H2' || (x.tagName === 'DIV' && x.querySelector('h2')));
      if (!titled && prev && prev.body && !dark) { prev.nodes.push(...chunk); return; }
      edsSections.push({ nodes: chunk, style: dark ? 'dark' : (band ? 'band' : null), body: true });
      band = !band;
    });
  });

  // ---- emit
  edsSections.forEach(({ nodes, style }, i) => {
    if (!nodes.length) return;
    if (i > 0) out.append(hr(document));
    nodes.forEach((n) => { if (isHeading(n) && n.tagName === 'H2' && style !== 'legal') keyNoun(document, n); out.append(n); });
    if (style) out.append(sectionMeta(document, style));
  });
  localizeLinks(out);
  out.append(hr(document));
  out.append(metadataBlock(document, {
    title: document.title,
    description: document.querySelector('meta[name=description]')?.getAttribute('content'),
    template,
    url,
    image: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
  }));
  return out;
}

function chromeLang(url) { return new URL(url).pathname.startsWith('/fr/') ? 'fr' : 'en'; }
