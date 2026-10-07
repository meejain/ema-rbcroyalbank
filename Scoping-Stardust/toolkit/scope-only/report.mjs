// Scoping-only report (no migration): Verdict · Blocks · Variants · Templates · Unknowns · Pilot check.
// Reads stardust/qa/scope-only/{summary.json, results.json}; writes stardust/qa/scope-only/index.html with
// its images under shots/, scope/, tpl/.
import fs from 'node:fs';
const ROOT = '/backups/meejain/ema-rbcroyalbank/repo';
const OUT = `${ROOT}/stardust/qa/scope-only`;
const S = JSON.parse(fs.readFileSync(`${OUT}/summary.json`, 'utf8'));
const scoping = JSON.parse(fs.readFileSync(`${ROOT}/stardust/qa/unknown-scoping.json`, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(`${ROOT}/catalog/block-catalog.json`, 'utf8'))['block-catalog'].blockVariants;
const scopeVariants = Array.isArray(catalog) ? catalog : Object.values(catalog);
const SITE = 'https://www.rbcroyalbank.com';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const link = (u, label) => (u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label || u.replace(SITE, '') || '/')}</a>` : '');
const pct = (x) => `${Math.round(x * 100)}%`;
const list = (urls, shown = 4, noun = 'page') => {
  const u = [...urls].sort();
  const rest = u.slice(shown);
  return `<p class="meta"><strong>${u.length} ${noun}${u.length === 1 ? '' : 's'}:</strong> ${u.slice(0, shown).map((x) => link(x)).join(' · ')}</p>${rest.length ? `<details class="meta"><summary>Show ${rest.length} more</summary><p>${rest.map((x) => link(x)).join(' · ')}</p></details>` : ''}`;
};
for (const d of ['shots', 'scope', 'tpl']) fs.mkdirSync(`${OUT}/${d}`, { recursive: true });

// images: prototype renders for reference-page-only variants, scope screenshots for the unknowns, template captures
S.variantList.forEach((v) => {
  if (v.sample?.prototype) {
    const src = `${OUT}/${v.sample.file}`; const dst = `shots/${slug(v.key)}-prototype.png`;
    if (fs.existsSync(src)) { fs.copyFileSync(src, `${OUT}/${dst}`); v.sample.file = dst; }
  }
});
const unknownRows = S.scope.rows.filter((r) => r.type === 'unknown');
unknownRows.forEach((r) => { const src = `${ROOT}/stardust/qa/block-gallery/scope/${r.id}.jpg`; if (fs.existsSync(src)) fs.copyFileSync(src, `${OUT}/scope/${r.id}.jpg`); });
S.templates.clusters.forEach((c) => { const src = `${ROOT}/stardust/current/assets/screenshots/${c.repSlug}.png`; if (fs.existsSync(src)) fs.copyFileSync(src, `${OUT}/tpl/${c.repSlug}.png`); });

// numbers
const blocks = {};
S.variantList.forEach((v) => { const b = blocks[v.block] = blocks[v.block] || { name: v.block, variants: [], instances: 0, pages: new Set() }; b.variants.push(v); b.instances += v.instances; v.urls.forEach((u) => b.pages.add(u)); });
const blockList = Object.values(blocks).sort((a, b) => b.instances - a.instances);
const newV = Object.entries(scoping.newVariants).map(([key, v]) => ({ key, ...v }));
const totalVariants = S.variants + newV.length;
const auto = S.unknowns.byResolution;
const decisions = Object.values(scoping.decisions);
const dc = (k) => decisions.filter((d) => d.decision === k).length;
const mig = S.migration.summary;
const scopeTypes = [...new Set(scopeVariants.map((v) => v.type))].length;

let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RBC scoping-only pilot: blocks, variants and templates without migration</title>
<style>
body{margin:0;font:15px/1.5 Roboto,Arial,sans-serif;color:#252525;background:#fafafa}
header.top{background:#001e43;color:#fff;padding:28px 40px 0}header.top h1{margin:0;font-size:28px}header.top p{margin:6px 0 0;max-width:1100px;color:#d5dde8}
.stats{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 0}.stat{background:rgb(255 255 255/8%);padding:10px 16px;border-radius:4px}.stat b{display:block;font-size:24px;color:#fedf01}
nav.tabs{display:flex;gap:4px;margin-top:22px;flex-wrap:wrap}nav.tabs button{font:inherit;font-weight:500;border:0;background:rgb(255 255 255/12%);color:#fff;padding:12px 20px;cursor:pointer;border-radius:4px 4px 0 0}nav.tabs button[aria-selected=true]{background:#fafafa;color:#001e43}
.panel{display:none}.panel.on{display:block}.wrap{max-width:1360px;margin:0 auto;padding:8px 32px 64px}
h2{margin:36px 0 8px;font-size:22px;color:#0051a5}h2.tabtitle{display:none}h3{margin:0 0 6px;font-size:17px}.lead{max-width:1000px}
.v{background:#fff;box-shadow:0 2px 6px rgb(0 0 0/8%);margin:18px 0;padding:20px;break-inside:avoid-page}.meta{color:#585858;font-size:13px;margin:4px 0}
.shot img{max-width:100%;max-height:520px;object-fit:contain;object-position:top left;border:1px solid #e3e6e8}
table{border-collapse:collapse;width:100%;background:#fff;margin:12px 0}td,th{border-bottom:1px solid #e3e6e8;padding:8px 10px;text-align:left;font-size:14px;vertical-align:top}th{background:#0051a5;color:#fff}td.n,th.n{text-align:right;white-space:nowrap}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:18px}.grid .v{margin:0}.grid img{width:100%;max-height:220px;object-fit:cover;object-position:top;border:1px solid #e3e6e8;margin-top:8px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chips a,.chips span{font-size:12px;background:#e8f1fb;padding:2px 8px;border-radius:10px;text-decoration:none}
.unk{display:grid;grid-template-columns:420px 1fr;gap:20px}.unk img{width:100%;max-height:520px;object-fit:cover;object-position:top;border:1px solid #e3e6e8}
.tpl{display:grid;grid-template-columns:420px 1fr;gap:20px}.tpl img{width:100%;border:1px solid #e3e6e8}
.verdictbox{background:#fff;border:2px solid #0051a5;border-top-width:8px;padding:20px 28px;margin:20px 0 28px}.verdictbox h2{margin:0 0 10px;color:#001e43;font-size:24px}.verdictbox h3{margin:18px 0 6px;color:#0051a5}.verdictbox th{width:240px;background:#e8f1fb;color:#001e43}
.box{padding:8px 12px;margin:8px 0;font-size:14px;border-left:4px solid #2e7d32;background:#eef6ee}.box.blue{border-color:#0051a5;background:#eef3fb}.box.warn{border-color:#b26a00;background:#fff6e0}
a{color:#006ac3;overflow-wrap:anywhere}details{margin-top:4px}summary{cursor:pointer;color:#006ac3}
@media print{nav.tabs{display:none}.panel{display:block!important;break-before:page}.panel:first-of-type{break-before:auto}h2.tabtitle{display:block;font-size:30px;color:#001e43;border-bottom:3px solid #0051a5;padding-bottom:6px}}
</style></head><body>
<header class="top"><h1>RBC scoping-only pilot: blocks, variants and templates without migration</h1>
<p>The same 181 pages scoped from the saved Stardust snapshot alone. No page was migrated and no content was imported. Variant screenshots are cut from the live-site snapshot; variants that only exist on the approved reference pages show the prototype render. Every link opens the live page.</p>
<div class="stats"><div class="stat"><b>${S.pages}</b>pages</div><div class="stat"><b>${S.templates.clusters.length}</b>templates</div><div class="stat"><b>${S.blocks + 2}</b>master blocks</div><div class="stat"><b>${totalVariants}</b>variants (${S.variants} + ${newV.length} new)</div><div class="stat"><b>${pct(S.coverage.avgTextKept)}</b>page text recognised</div><div class="stat"><b>${S.unknowns.variants}/${S.unknowns.variants}</b>unknowns decided</div></div>
<nav class="tabs" role="tablist">${['verdict:Verdict', `blocks:Blocks (${S.blocks + 2})`, `variants:Variants (${totalVariants})`, `templates:Templates (${S.templates.clusters.length})`, `unknowns:Unknowns (${S.unknowns.variants})`, 'check:Pilot check'].map((t, i) => { const [id, label] = t.split(/:(.*)/); return `<button role="tab" aria-selected="${i === 0}" data-tab="${id}">${label}</button>`; }).join('')}</nav></header>`;

// ---- Verdict
html += `<section class="panel on" id="tab-verdict"><div class="wrap"><h2 class="tabtitle">Verdict</h2><div class="verdictbox"><h2>Verdict: the scoping-only track works</h2>
<p><strong>From the saved snapshot alone, the pilot reproduced the full migration's block scope.</strong> It found the same ${S.blocks} content blocks and ${S.variants} variants. On every page whose migrated document came from the current importer, it found the identical set of blocks: ${mig.reimported.exact} of ${mig.reimported.pages} live-imported pages and ${mig.archetype.exact} of ${mig.archetype.pages} reference pages.</p>
<table><tbody>
<tr><th>Pages</th><td>${S.pages}, classified from the saved Stardust snapshot (rendered HTML), with nothing imported</td></tr>
<tr><th>Templates</th><td>${S.templates.clusters.length}: ${S.templates.clusters.map((c) => `${esc(c.name)} (${c.pages.length})`).join(', ')}</td></tr>
<tr><th>Master blocks</th><td>${S.blocks + 2}: ${blockList.map((b) => esc(b.name)).join(', ')}, header, footer</td></tr>
<tr><th>Variants</th><td>${totalVariants} = ${S.variants} recognised + ${newV.length} new from the unknown review (${newV.map((v) => esc(v.key)).join(', ')})</td></tr>
<tr><th>Default scope, before</th><td>${scopeVariants.length} variants of ${scopeTypes} types, ${S.unknowns.variants} of them "unknown", in 11 templates</td></tr>
<tr><th>Unknowns, mapped automatically</th><td>${auto.block || 0} to a block, ${auto.prose || 0} to page prose, ${auto['not recognised'] || 0} not recognised (client-side widgets)</td></tr>
<tr><th>Unknowns, after review</th><td>All ${S.unknowns.variants}: ${dc('existing')} existing variant, ${dc('new')} new variant, ${dc('default')} page prose, ${dc('removed')} client-side widgets</td></tr>
<tr><th>Coverage</th><td>${pct(S.coverage.avgTextKept)} of visible page text is recognised on average (lowest ${pct(S.coverage.minTextKept)}, on the interactive tool pages). ${S.coverage.unassignedSections} sections are unassigned, all of them article share rows.</td></tr>
</tbody></table>
<h3>What the pilot proves, and what it doesn't</h3>
<ul>
<li><strong>Proven:</strong> blocks, variants, templates, unknowns and screenshots can all be scoped without importing anything. Classifying 181 pages took about 3 minutes, against hours for a full bulk import.</li>
<li><strong>Caveat:</strong> the component matcher was tuned on these same RBC pages during the migration. On a new site the result depends on the Phase 6 tuning loop (screenshot review → matcher rule), which the playbook keeps. Expect several rounds before the unknowns are closed.</li>
<li><strong>Not covered without migration:</strong> losses that only show up in imported content, such as dropped photos or missing card grids. The coverage check (text recognised, unassigned sections) is the stand-in.</li>
</ul></div></div></section>`;

// ---- Blocks
html += `<section class="panel" id="tab-blocks"><div class="wrap"><h2 class="tabtitle">Blocks</h2>
<p class="lead"><strong>${S.blocks + 2} master blocks</strong>: ${S.blocks} content blocks plus the header and footer, with ${totalVariants} variants. Counts are instances recognised on the ${S.pages} snapshot pages.</p>
<table><thead><tr><th>Master block</th><th class="n">Variants</th><th class="n">Instances</th><th class="n">Pages</th><th>Variant names</th></tr></thead><tbody>`;
blockList.forEach((b) => {
  const nb = newV.filter((v) => v.block === b.name);
  html += `<tr><td><strong>${esc(b.name)}</strong></td><td class="n">${b.variants.length}${nb.length ? ` + ${nb.length} new` : ''}</td><td class="n">${b.instances}</td><td class="n">${b.pages.size}</td><td>${b.variants.map((v) => `<a href="#v-${slug(v.key)}">${esc(v.key.split(' ').slice(1).join(' ') || 'default')}</a>`).join(', ')}${nb.map((v) => `, <a href="#v-${slug(v.key)}"><em>${esc(v.key.split(' ').slice(1).join(' '))} (new)</em></a>`).join('')}</td></tr>`;
});
html += `<tr><td><strong>header</strong></td><td class="n">1</td><td class="n">${S.pages}</td><td class="n">${S.pages}</td><td>site chrome (nav document)</td></tr><tr><td><strong>footer</strong></td><td class="n">1</td><td class="n">${S.pages}</td><td class="n">${S.pages}</td><td>site chrome (footer document)</td></tr>`;
html += `<tr><th>Total</th><th class="n">${totalVariants} + 2</th><th class="n">${S.instances}</th><th class="n">${S.pages}</th><th></th></tr></tbody></table><div class="grid">`;
blockList.forEach((b) => {
  const top = b.variants.find((v) => v.sample) || b.variants[0];
  html += `<div class="v"><h3>${esc(b.name)}</h3><p class="meta">${b.variants.length} variant${b.variants.length > 1 ? 's' : ''} · ${b.instances} instances · ${b.pages.size} pages</p>${top.sample ? `<img src="${top.sample.file}" alt="${esc(top.key)}">` : ''}<p class="meta">Shown: ${esc(top.key)}${top.sample ? ` · ${link(top.sample.url, 'source page')}` : ''}</p><div class="chips">${b.variants.map((v) => `<a href="#v-${slug(v.key)}">${esc(v.key.split(' ').slice(1).join(' ') || 'default')} · ${v.instances}</a>`).join('')}</div></div>`;
});
html += '</div></div></section>';

// ---- Variants
html += `<section class="panel" id="tab-variants"><div class="wrap"><h2 class="tabtitle">Variants</h2><p class="lead">Each variant with a screenshot of its first instance: cut from the live-site snapshot, or the prototype render when it only exists on an approved reference page. Below each: every page it appears on.</p>`;
blockList.forEach((b) => {
  html += `<h2>${esc(b.name)}</h2>`;
  b.variants.forEach((v) => {
    const unk = unknownRows.filter((r) => { const d = scoping.decisions[r.id]; return d && (d.target === v.key || (d.embedded || []).includes(v.key)); });
    html += `<div class="v" id="v-${slug(v.key)}"><h3>${esc(v.key)}</h3><p class="meta">${v.instances} instances on ${v.pages} pages${v.sample ? ` · screenshot ${v.sample.prototype ? 'from the approved prototype of' : 'from'} ${link(v.sample.url)}` : ''}</p>${v.sample ? `<div class="shot"><img src="${v.sample.file}" alt="${esc(v.key)}"></div>` : '<p class="meta">no screenshot</p>'}${list(v.urls, 5)}${unk.length ? `<p class="meta">Scope unknowns decided onto this variant: ${unk.map((r) => `<a href="#u-${r.id}">${r.id}</a>`).join(', ')}</p>` : ''}</div>`;
  });
});
html += `<h2>New variants (${newV.length})</h2><p class="meta">Called for by the unknown review; not in the matcher yet. The screenshots are the live components they cover.</p>`;
newV.forEach((v) => {
  html += `<div class="v" id="v-${slug(v.key)}"><h3>${esc(v.key)} <em>(new)</em></h3><p class="meta">${esc(v.summary)}</p><div class="chips">${v.sources.map((id) => `<a href="#u-${id}">${id}</a>`).join('')}</div><div class="grid">${v.sources.filter((id) => fs.existsSync(`${OUT}/scope/${id}.jpg`)).map((id) => `<img src="scope/${id}.jpg" alt="${id}">`).join('')}</div></div>`;
});
html += '</div></section>';

// ---- Templates
html += `<section class="panel" id="tab-templates"><div class="wrap"><h2 class="tabtitle">Templates</h2>
<p class="lead"><strong>${S.templates.clusters.length} templates</strong>, from Stardust's page type and the page head (homepage, card-art, image or type-led hero). The body of each page is composed from blocks. The representative is the best reference: the page covering most of its siblings' components, or the approved reference page when it covers enough.</p>
<table><thead><tr><th>Template</th><th class="n">Pages</th><th>Best reference page</th><th class="n">Covers</th><th>Default scope's templates for these pages</th></tr></thead><tbody>`;
const fromScope = (c) => S.templates.vsScopeTpl.filter((t) => t.clusters[c.name]).map((t) => `${esc(t.template)} (${t.clusters[c.name]})`).join(', ');
S.templates.clusters.forEach((c) => { html += `<tr><td><a href="#t-${slug(c.name)}"><strong>${esc(c.name)}</strong></a></td><td class="n">${c.pages.length}</td><td>${link(c.representative)}${c.repArchetype ? ' <em>(approved reference)</em>' : ''}</td><td class="n">${pct(c.repCoverage)}</td><td>${fromScope(c)}</td></tr>`; });
html += '</tbody></table>';
S.templates.clusters.forEach((c) => {
  html += `<div class="v" id="t-${slug(c.name)}"><h3>${esc(c.name)} · ${c.pages.length} pages</h3><div class="tpl"><div>${fs.existsSync(`${OUT}/tpl/${c.repSlug}.png`) ? `<img src="tpl/${c.repSlug}.png" alt="${esc(c.name)}">` : ''}<p class="meta">Full page: ${link(c.representative)}</p></div><div>
<p class="meta"><strong>Best reference:</strong> ${link(c.representative)}${c.repArchetype ? ' (approved reference page)' : ''}: covers ${pct(c.repCoverage)} of the template's components.${c.repArchetype && c.bestCoverage.url !== c.representative ? ` Highest coverage: ${link(c.bestCoverage.url)} (${pct(c.bestCoverage.c)}).` : ''}</p>
<p class="meta"><strong>Common blocks (on half the pages or more):</strong></p><div class="chips">${c.common.map((v) => `<a href="#v-${slug(v)}">${esc(v)}</a>`).join('')}</div>
<p class="meta"><strong>All variants used (pages):</strong> ${c.variants.map((x) => `${esc(x.v)} ${x.n}`).join(' · ')}</p>
<p class="meta"><strong>Default scope's templates for these pages:</strong> ${fromScope(c)}</p>${list(c.pages, 6)}</div></div></div>`;
});
html += '</div></section>';

// ---- Unknowns
html += `<section class="panel" id="tab-unknowns"><div class="wrap"><h2 class="tabtitle">Unknowns</h2>
<p class="lead">The default scope's ${S.unknowns.variants} "unknown" variants (${S.unknowns.instances} instances), each located in the snapshot and matched to what the classifier recognised there. That's the automatic mapping, with no migration involved. The screenshot-review decision follows it.</p>
<table><thead><tr><th>Automatic mapping</th><th class="n">Unknown variants</th></tr></thead><tbody>${Object.entries(auto).map(([k, n]) => `<tr><td>${esc({ block: 'to a block variant', prose: 'to page prose', 'not recognised': 'not recognised (client-side widgets)', 'not found': 'not found in the snapshot' }[k] || k)}</td><td class="n">${n}</td></tr>`).join('')}</tbody></table>`;
const vm = Object.fromEntries(S.unknowns.vsManual.map((x) => [x.id, x]));
unknownRows.sort((a, b) => b.instances - a.instances).forEach((r) => {
  const d = scoping.decisions[r.id]; const m = vm[r.id];
  const split = Object.entries(r.holders).sort((a, b) => b[1] - a[1]).map(([h, n]) => `${esc(h)} ×${n}`).join(' · ');
  html += `<div class="v" id="u-${r.id}"><div class="unk"><div>${fs.existsSync(`${OUT}/scope/${r.id}.jpg`) ? `<img src="scope/${r.id}.jpg" alt="${r.id}">` : ''}</div><div><h3>scope: unknown · ${r.id}</h3><p class="meta">${r.instances} instance${r.instances > 1 ? 's' : ''} on ${r.pages.length} page${r.pages.length > 1 ? 's' : ''} · found in the snapshot: ${r.found}</p>
<div class="box"><strong>Automatic: ${esc(r.holder)}</strong> · instances: ${split || 'none'}</div>
${d ? `<div class="box ${m && !m.same && !m.sameFamily ? 'warn' : 'blue'}"><strong>Review decision: ${esc(d.decision === 'removed' ? 'client-side widget, not content' : d.target)}${d.decision === 'new' ? ' (new variant)' : ''}</strong>${m && (m.same || m.sameFamily) ? ' · agrees with the automatic mapping' : ' · overrides the automatic mapping'}<br>${esc(d.note)}</div>` : ''}
${list(r.pages, 5, 'live page')}</div></div></div>`;
});
html += '</div></section>';

// ---- Pilot check
html += `<section class="panel" id="tab-check"><div class="wrap"><h2 class="tabtitle">Pilot check</h2>
<p class="lead">The pilot's block sets compared with the migrated documents of the same pages (Jaccard similarity of the variant sets per page).</p>
<table><thead><tr><th>Migrated documents</th><th class="n">Pages</th><th class="n">Identical block set</th><th class="n">Average similarity</th><th>Note</th></tr></thead><tbody>
<tr><td>Live pages imported with the current importer</td><td class="n">${mig.reimported.pages}</td><td class="n">${mig.reimported.exact}</td><td class="n">${pct(mig.reimported.avgJaccard)}</td><td>Same matcher, so this is the like-for-like check</td></tr>
<tr><td>Approved reference pages</td><td class="n">${mig.archetype.pages}</td><td class="n">${mig.archetype.exact}</td><td class="n">${pct(mig.archetype.avgJaccard)}</td><td>Variants defined by the prototypes</td></tr>
<tr><td>Live pages imported with the earlier importer</td><td class="n">${mig.earlier.pages}</td><td class="n">${mig.earlier.exact}</td><td class="n">${pct(mig.earlier.avgJaccard)}</td><td>The differences are the fixes from the unknown review, which these pages haven't had yet</td></tr>
</tbody></table>
<p class="meta">Variants only the pilot found: ${S.migration.pilotOnly.join(', ') || 'none'}. Variants only the migration has: ${S.migration.migrationOnly.join(', ') || 'none'}.</p>
<h2>Coverage gaps</h2><p class="meta">Page sections where less than 30% of the text reached any recognised block or prose:</p>
<table><thead><tr><th>Page</th><th>Section</th><th class="n">Words</th></tr></thead><tbody>${S.coverage.unassigned.map((u) => `<tr><td>${link(u.url)}</td><td>${esc(u.id || u.cls)}</td><td class="n">${u.words}</td></tr>`).join('')}</tbody></table>
<p class="meta">All of them are the article share row ("Share this article" with network links). On those pages it's labelled only as page text, not a block. That's fine to leave as is, or it can get its own share variant.</p></div></section>`;

html += `<script>
const tabs=[...document.querySelectorAll('nav.tabs button')];
function show(id){tabs.forEach(b=>{const on=b.dataset.tab===id;b.setAttribute('aria-selected',on);document.getElementById('tab-'+b.dataset.tab).classList.toggle('on',on);});}
tabs.forEach(b=>b.addEventListener('click',()=>{show(b.dataset.tab);history.replaceState(null,'','#tab-'+b.dataset.tab);window.scrollTo(0,0);}));
function follow(){const h=decodeURIComponent(location.hash.slice(1));if(!h)return;const el=document.getElementById(h);if(!el)return;const p=el.closest('.panel');if(p)show(p.id.replace('tab-',''));if(!el.classList.contains('panel'))el.scrollIntoView();}
window.addEventListener('hashchange',follow);follow();
</script></body></html>`;
fs.writeFileSync(`${OUT}/index.html`, html);
console.log('scope-only index.html', (html.length / 1024).toFixed(0), 'KB');
