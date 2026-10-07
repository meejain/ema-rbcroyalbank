// Final scoping decision for every scope "unknown" (screenshot review against the Stardust block set).
// decision: existing (an existing Stardust variant) | new (a new variant of an existing block) |
//           default (page prose, authored without a block) | removed (client-side widget, not content).
// embedded: components inside a prose variant that get their own variant.
// Writes stardust/qa/unknown-scoping.json.
import fs from 'node:fs';
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const val = JSON.parse(fs.readFileSync(`${ROOT}/stardust/qa/scope-block-validation.json`, 'utf8'));
const D = (decision, target, note, embedded) => ({ decision, target, note, ...(embedded ? { embedded } : {}) });
const decisions = {
  // existing variants, corrected by the review
  v_3f36606afa9c: D('existing', 'columns apply', 'Apply band: card art, heading, one line, Apply Now. Same variant as the Avion archetype.'),
  v_7d58cc18fd3c: D('existing', 'columns apply', 'Apply band inside articles: card art, best-offer pill, Apply Now.'),
  v_824ce0b8439d: D('existing', 'cards tools', 'Four illustrated tool tiles on the awards page; the hub variant.'),
  'v_824ce0b8439d-1': D('existing', 'cards tools', 'Four illustrated tool tiles (Help Me Choose, Compare, Cash Back, Rewards); the hub variant.'),
  v_4c212f55612a: D('existing', 'cards tools', 'Cash back "Tools and Calculators" tiles; the illustrations are CSS backgrounds and must be carried as images.'),
  v_70ee1c9fba9e: D('existing', 'columns', 'Promo callouts on 13 pages (heading, one line, button, photo): text | photo. The 2 homepage instances are My Money Matters: Cards (articles featured).'),
  v_374d390bc93d: D('existing', 'columns', 'Promo callout with photo (Discover More Ways to Save with Avion Rewards): text | photo.'),
  v_19fd63195c88: D('existing', 'columns', 'Apple Pay callout: photo | heading, line, Apply button, App Store badge.'),
  v_522ef8c958fc: D('existing', 'columns', 'Mobile app promo: phone image | heading, line, store badges, rating.'),
  'v_ac76e87637ce-1': D('existing', 'columns', 'Two text columns: Emergency assistance | Submit a claim.'),
  v_17cfc590e1e5: D('existing', 'columns', 'Data-sharing steps: label | numbered steps and button, per channel.'),
  v_5f96de5597a1: D('existing', 'columns', 'Three promo panels (app, awards, NOMI) in two columns.'),
  v_e244230efd25: D('existing', 'columns intro', 'Card image | heading with three headed paragraphs. Image-led split, not a card repeat.'),
  v_f2b81d564755: D('existing', 'columns intro', 'Partner logo wall | More Rewards copy on a dark band.'),
  'v_1485444c2d08-1': D('existing', 'cards offers', 'Three product offer tiles: image, name, offer copy, rates, Apply and details links. The hub variant.'),
  v_3b9dcf103ab2: D('existing', 'cards awards', 'Award seals, each with its caption link.'),
  'v_3b9dcf103ab2-1': D('existing', 'cards awards', 'Award seals with captions (sibling page).'),
  v_3b301f6c2dad: D('existing', 'cards articles', '"Read This Next" article cards: image and title link.'),
  v_c7940b140842: D('existing', 'cards links', '"Still Not Sure?" icon links.'),
  'v_c7940b140842-1': D('existing', 'cards links', '"Pas encore convaincu ?" icon links.'),
  v_e74ee53f1e59: D('existing', 'cards links', 'Category icon navigation (All Cards, Travel, …).'),
  v_6256761c78a1: D('existing', 'cards icons', 'Cash back rate tiles (icon, 3% / 1%, category) and the redeem note.'),
  v_b2590a35ea3f: D('existing', 'cards icons', 'Icon-led question rows (What is a low interest rate card?, …).'),
  v_42300e8a4652: D('existing', 'cards icons', 'How to apply: three icon steps with buttons.'),
  v_68e1de4e2201: D('existing', 'cards icons', 'Icon-led explainer rows.'),
  v_cc8446d2311a: D('existing', 'cards icons', 'Contactless how-to steps and the two icon notes.'),
  v_e90777a88dd1: D('existing', 'cards icons', 'Four optional-protection tiles with icons and links.'),
  v_058232a34b3d: D('existing', 'cards icons', 'Avion Rewards: five icon tiles.'),
  v_236d6f09f8e8: D('existing', 'cards features', 'Ticked feature line (Roadside Assistance, Towing and More) in a features run.'),
  v_2a8cc5489592: D('existing', 'cards partners', 'Partner offers with brand logos.'),
  v_42446be820dd: D('existing', 'cards recognition', 'RBC awards and recognition panel.'),
  v_9824dd466344: D('existing', 'cards tiles', 'Card-type tiles: illustration, name, line, benefits list, link.'),
  v_bd6417e2b305: D('existing', 'cards tiles', 'Benefits panel: photo tile and illustrated text tile.'),
  v_97d085fe0529: D('existing', 'cards why', 'Three illustrated benefit cards.'),
  v_d1a119baa551: D('existing', 'accordion legal', '"View Legal Disclaimers" toggle.'),
  // new variants (existing blocks)
  v_a5c45d96ab8b: D('new', 'columns tip', '"To sum it up" note: bulb icon | heading and line on a tint. Same shape as the article Tip / Pro tip boxes.'),
  v_8fa95da9fe6b: D('new', 'columns cta', '"Need Help Deciding?" prompt with one button.'),
  v_1485444c2d08: D('new', 'cards checklist', 'Eligibility: heading, one line and a 2×2 list of ticked criteria with info tips.'),
  // prose: authored without a block, with any embedded boxes as their own variant
  v_69d3877a6553: D('default', 'default content', 'Article prose (earning travel points).', ['columns tip']),
  v_847be70cfa8f: D('default', 'default content', 'Article prose (student guide).', ['columns tip', 'columns cta']),
  v_3166eb231e79: D('default', 'default content', 'Article prose with an illustration and a bullet list.'),
  v_385568610b4d: D('default', 'default content', 'Page intro: heading and paragraph (the legal toggle is the legal accordion).'),
  v_2ddbecb8a96a: D('default', 'default content', 'Article body; its short headed runs are Cards (features), the rest prose.'),
  v_aa6cd8a9b595: D('default', 'default content', 'Not a component: a single sentence or bullet the scope cut out of a longer list (mostly key-takeaway lists). It goes wherever its list goes.'),
  // client-side widgets
  v_b25574a76eae: D('removed', 'none', 'Listing toolbar (Showing N cards · Card Filters · Sort by): client-side filter/sort of the dynamic card listing.'),
  v_a98d14b950b8: D('removed', 'none', 'Article category filter chips (script-only links).'),
  v_81120c754c54: D('removed', 'none', 'Card category filter chips (script-only links).'),
  v_4ad0c4e5ded0: D('removed', 'none', 'A–Z letter filter on statement definitions; every letter group is content, the buttons are not.'),
  v_2581a597dd86: D('removed', 'none', 'Statement page tab bar and letter filter; the definition groups themselves are content.'),
};
const out = {};
for (const r of val.filter((x) => x.type === 'unknown')) {
  if (decisions[r.id]) out[r.id] = decisions[r.id];
  else if (r.id.startsWith('v_5a1baf680bb1')) out[r.id] = D('existing', 'hero typeled', 'Sticky breadcrumb and page title bar: the type-led hero (breadcrumb + H1).');
  else throw new Error(`no decision for ${r.id}`);
}
const newVariants = {
  'columns tip': { block: 'columns', summary: 'Icon-led note on a tint: bulb icon | label (Tip, Pro tip, To sum it up) and one or two lines.', sources: ['v_a5c45d96ab8b', 'v_69d3877a6553', 'v_847be70cfa8f'] },
  'columns cta': { block: 'columns', summary: 'Decision prompt: question and one line | one or two buttons (Help Me Choose, Student Credit Cards, Compare).', sources: ['v_8fa95da9fe6b', 'v_847be70cfa8f'] },
  'cards checklist': { block: 'cards', summary: 'Ticked criteria grid (eligibility): one short criterion per card, optional info tip.', sources: ['v_1485444c2d08'] },
};
fs.writeFileSync(`${ROOT}/stardust/qa/unknown-scoping.json`, JSON.stringify({ _about: 'Final scoping decision per scope "unknown" (screenshot review, 2026-10-05). See write-scoping.mjs for the decision vocabulary.', newVariants, decisions: out }, null, 1));
const count = {}; Object.values(out).forEach((d) => { count[d.decision] = (count[d.decision] || 0) + 1; });
console.log(Object.keys(out).length, 'decisions', JSON.stringify(count));
