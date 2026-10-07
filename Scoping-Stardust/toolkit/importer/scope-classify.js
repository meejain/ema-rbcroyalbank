/* eslint-disable */
/* global WebImporter */
// Scoping-only classifier: runs the live matcher on a page and reports what it recognised (block variant,
// page prose, section) with the source element of each, without producing an import document.
// Used by stardust/.work/scope-only/run-scope-only.mjs on the saved Stardust snapshot.
import { annotate, liveToEds } from './parsers/rbc-live.js';

// block table name → the class list EDS renders: "Hero (card, typeled)" → "hero card typeled", "Card Highlights" → "card-highlights"
const key = (name) => {
  const m = name.trim().match(/^([^(]+)(?:\((.*)\))?\s*$/) || [null, name, ''];
  const blockName = m[1].trim().toLowerCase().replace(/\s+/g, '-');
  const vars = (m[2] || '').split(',').map((v) => v.replace(/[()]/g, ' ').trim().toLowerCase().replace(/\s+/g, ' ')).filter(Boolean);
  return [blockName, ...vars].join(' ');
};
const sidOf = (n) => {
  const e = n && n.nodeType === 1 ? n : null;
  if (!e) return null;
  const s = e.closest ? e.closest('[data-sid]') : null;
  return s ? s.getAttribute('data-sid') : (e.getAttribute && e.getAttribute('data-sid'));
};
const words = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9$%]+/g, ' ').split(' ').filter((w) => w.length >= 3);

function classify(document, url, template) {
  const out = liveToEds(document, url, template);
  const items = [];
  let section = 0;
  let style = null;
  const pending = [];
  [...out.children].forEach((n) => {
    if (n.tagName === 'HR') { pending.forEach((x) => { x.style = style; }); pending.length = 0; style = null; section += 1; return; }
    const head = n.tagName === 'TABLE' ? (n.querySelector('tr th, tr td')?.textContent || '') : '';
    if (/^section metadata$/i.test(head.trim())) { style = n.querySelectorAll('tr')[1]?.children[1]?.textContent.trim() || null; return; }
    if (/^metadata$/i.test(head.trim())) return;
    const item = head
      ? { kind: 'block', variant: key(head), sid: sidOf(n.__src), section, words: words(n.textContent).length }
      : { kind: 'prose', tag: n.tagName.toLowerCase(), sid: sidOf(n.__src), section, words: words(n.textContent).length };
    items.push(item); pending.push(item);
  });
  pending.forEach((x) => { x.style = style; });
  return { items, outWords: [...new Set(words(out.textContent))] };
}

export default {
  onLoad: async ({ document }) => { await annotate(document); },
  transform: () => [],
  classify,
};
