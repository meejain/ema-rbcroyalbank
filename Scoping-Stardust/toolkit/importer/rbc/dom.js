/* eslint-disable */
/* global WebImporter */
// Shared helpers for the RBC import scripts (browser context, helix-importer).

import { SCOPE } from './scope.js';

export const LIVE = 'https://www.rbcroyalbank.com';

/** delivered path for a source pathname (decision #14: extensionless, folder index → trailing slash) */
export function deliveredPath(pathname) {
  if (pathname === '/personal.html' || pathname === '/') return '/';
  if (pathname === '/fr/personal.html' || pathname === '/fr/') return '/fr/';
  if (pathname.endsWith('/index.html')) return pathname.slice(0, -'index.html'.length);
  if (pathname.endsWith('/')) return pathname;
  return pathname.replace(/\.html?$/, '');
}

/** rewrite links to pages inside the migration to root-relative delivered paths */
export function localizeLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    let u;
    try { u = new URL(a.getAttribute('href')); } catch (e) { return; }
    if (!/^(www\.)?rbcroyalbank\.com$/.test(u.hostname)) return;
    const p = decodeURIComponent(u.pathname);
    const hit = SCOPE.has(p) ? p : (SCOPE.has(`${p}index.html`) ? `${p}index.html` : null);
    if (!hit) return;
    a.setAttribute('href', `${deliveredPath(hit)}${u.search}${u.hash}`);
  });
}

export function block(document, name, cells) {
  return WebImporter.Blocks.createBlock(document, { name, cells });
}

export function sectionMeta(document, style) {
  return block(document, 'Section Metadata', { style });
}

export function el(document, tag, children = [], attrs = {}) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => { if (v !== undefined && v !== null) e.setAttribute(k, v); });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return e;
}

export const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : '');

export function abs(href, base) {
  if (!href) return href;
  if (/^(mailto:|tel:|#|javascript:)/i.test(href)) return href;
  try { return new URL(href, base).href; } catch (e) { return href; }
}

/** an <img> with an absolute src (the importer's adjustImageUrls would do it too) */
export function img(document, src, alt, base) {
  const i = document.createElement('img');
  i.setAttribute('src', src && src.startsWith('/') && !src.startsWith('//') && /\/stardust\//.test(src) ? src : abs(src, base));
  i.alt = alt || '';
  return i;
}

/** CTA paragraph: kind = 'primary' | 'secondary' | 'link' */
export function cta(document, a, kind, base) {
  const link = el(document, 'a', [txt(a)], { href: abs(a.getAttribute('href'), base) });
  if (kind === 'primary') return el(document, 'p', [el(document, 'strong', [link])]);
  if (kind === 'secondary') return el(document, 'p', [el(document, 'em', [link])]);
  return el(document, 'p', [link]);
}

/** Section break: helix-importer turns <hr> into a section delimiter */
export const hr = (document) => document.createElement('hr');

/**
 * Inline-clean a node's children into a new element of `tag`: keeps text, <a> (absolute href),
 * <strong>/<b>, <em>/<i>, <br>; legal superscripts become plain marker links; spans unwrap.
 */
export function inline(document, src, tag, base, opts = {}) {
  const out = document.createElement(tag);
  const walk = (node, parent) => {
    node.childNodes.forEach((c) => {
      if (c.nodeType === 3) { parent.append(document.createTextNode(c.textContent.replace(/\s+/g, ' '))); return; }
      if (c.nodeType !== 1) return;
      const t = c.tagName.toLowerCase();
      if (c.matches('.offscreen, .sr-only, .visually-hidden, .hide, .display-none, [data-imp-hidden], .irs, script, style, svg, button.collapse-toggle .icon')) return;
      if (t === 'a') {
        const href = c.getAttribute('href');
        if (!href || /^javascript:/i.test(href) || (href === '#' && !txt(c))) { walk(c, parent); return; }
        // script-driven legal bugs (href="#") point at the page's legal notes
        const target = href === '#' ? `${String(base).split('#')[0]}#legal` : abs(href, base);
        const a = el(document, 'a', [], { href: target });
        walk(c, a);
        if (txt(a)) parent.append(a);
        return;
      }
      if (t === 'strong' || t === 'b') { const s = document.createElement('strong'); walk(c, s); if (txt(s)) parent.append(s); return; }
      if ((t === 'em' || t === 'i') && !opts.noEm) { const s = document.createElement('em'); walk(c, s); if (txt(s)) parent.append(s); return; }
      if (t === 'br') { parent.append(document.createElement('br')); return; }
      if (t === 'img') return;
      walk(c, parent);
    });
  };
  walk(src, out);
  // trim
  while (out.firstChild && out.firstChild.nodeType === 3 && !out.firstChild.textContent.trim()) out.firstChild.remove();
  while (out.lastChild && out.lastChild.nodeType === 3 && !out.lastChild.textContent.trim()) out.lastChild.remove();
  if (out.firstChild && out.firstChild.nodeType === 3) out.firstChild.textContent = out.firstChild.textContent.replace(/^\s+/, '');
  if (out.lastChild && out.lastChild.nodeType === 3) out.lastChild.textContent = out.lastChild.textContent.replace(/\s+$/, '');
  out.querySelectorAll('br + br').forEach((b) => b.remove());
  return out;
}

/** Gold key-noun underline: wrap one key noun in a section heading with <em> (canon move #3) */
const NO_UNDERLINE = /^(faq|faqs|frequently asked|questions fréquentes|foire aux questions|tools|outils|read this next|related|lisez|à lire|tl;?dr|tlpl|introduction|key takeaways|points clés|principaux points|bottom line|conclusion|share|partager)/i;
const KEY_NOUNS = [
  'credit cards', 'credit card', 'cartes de crédit', 'carte de crédit', 'cash back', 'remise en argent', 'remises en argent',
  'Avion points', 'points Avion', 'Avion Points', 'Avion', 'WestJet points', 'points WestJet', 'Avios', 'Moi points', 'points Moi', 'points',
  'rewards', 'récompenses', 'travel', 'voyage', 'voyages', 'benefits', 'avantages', 'insurance', 'assurance', 'offers', 'offres',
  'interest', 'intérêt', 'fees', 'frais', 'security', 'sécurité', 'fraud', 'fraude', 'app', 'application', 'card', 'carte',
  'help', 'aide', 'statement', 'relevé', 'questions', 'savings', 'économies', 'flights', 'vols', 'students', 'étudiants', 'Visa', 'Mastercard',
];
export function keyNoun(document, h, explicit) {
  if (!h || h.querySelector('em')) return h;
  const t = txt(h);
  if (!t || NO_UNDERLINE.test(t)) return h;
  const pick = explicit || KEY_NOUNS.find((k) => t.toLowerCase().includes(k.toLowerCase()));
  if (!pick) return h;
  // find the text node holding the noun (last occurrence reads best)
  const walker = document.createTreeWalker(h, 4);
  let node; let hit = null;
  while ((node = walker.nextNode())) {
    const i = node.textContent.toLowerCase().lastIndexOf(pick.toLowerCase());
    if (i >= 0) hit = { node, i };
  }
  if (!hit) return h;
  const { node: n, i } = hit;
  const after = n.splitText(i);
  after.splitText(pick.length);
  const em = document.createElement('em');
  after.replaceWith(em);
  em.append(after);
  return h;
}

/** Output path for a source URL (decision #14) */
export function docPath(url) {
  const u = new URL(url);
  let p = u.pathname;
  if (p === '/personal.html' || p === '/') return '/index';
  if (p === '/fr/personal.html' || p === '/fr/') return '/fr/index';
  p = p.replace(/\/$/, '/index').replace(/\.html?$/, '');
  return WebImporter.FileUtils.sanitizePath(p);
}

export function chromePaths(url) {
  const p = new URL(url).pathname;
  const fr = p.startsWith('/fr/');
  const cc = /^\/(fr\/)?(credit-cards|cartes)\//.test(p);
  const base = `${fr ? '/fr' : ''}${cc ? (fr ? '/cartes' : '/credit-cards') : ''}`;
  return { nav: `${base}/nav`, footer: `${base}/footer`, lang: fr ? 'fr' : 'en' };
}

export function metadataBlock(document, { title, description, template, url, image }) {
  const { nav, footer } = chromePaths(url);
  const cells = { Title: title, Description: description || '', Template: template };
  if (nav !== '/nav') cells.nav = nav;
  if (footer !== '/footer') cells.footer = footer;
  if (image) cells.Image = image;
  return block(document, 'Metadata', cells);
}
