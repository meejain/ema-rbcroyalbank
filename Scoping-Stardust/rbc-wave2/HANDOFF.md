# RBC scoping: handoff for the next session

**Start here in a new session.** This file holds:
- where the work stands;
- the wave-1 baseline that must be preserved (credit cards + homepage);
- what to do next, step by step.

Read it with:
- `Scoping-Stardust/rbc-wave2/STRATEGY.md` (the wave-2 plan);
- `Scoping-Stardust/SCOPING-PLAYBOOK.md` (the method; wave 2 runs **Track B: scoping only, no import**).

Last updated: 2026-10-07.

---

## 0. Ground rules (learned the hard way)

1. **No content import in wave 2.** Classify from the Stardust snapshot (Track B). Never hand-write files
   under `content/`; they are wave-1 output.
2. **Keep everything isolated per site.**
   - Wave-2 data lives only under `Scoping-Stardust/rbc-wave2/`.
   - The site-scope setup (`setup-catalog-project.js`) **deletes any `catalog/` in its working folder**, and
     `WORKSPACE_PATH` is empty, so it uses the current folder.
   - Always `cd` into the cohort folder before running it.
   - **Never run it at the repo root**: `/backups/meejain/ema-rbcroyalbank/repo/catalog` is the wave-1 scope
     and must stay intact.
3. **Background jobs die when the user interrupts a turn.**
   - Launch long jobs with `setsid nohup … < /dev/null &`.
   - Make them resumable (`work/rendered-crawl.mjs` now checkpoints after every batch).
   - Check them in short polls (≤ 2–3 min) and report progress to the user each time; they asked for
     regular status.
4. **Tooling:**
   - Never `npm i` and never `npx playwright install`.
   - Load Playwright with `createRequire('/home/node/.excat-marketplaces/excat-extended/stardust/node_modules/')('playwright')`.
   - Load cheerio from `/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-url-discovery/scripts/`.
5. **Sandbox:** inline shell commands containing regex-like `/…/` paths are often blocked. Write a script with
   the editor and run that instead.
6. **Consent and credentials:**
   - No commits, publishing or DA uploads without an explicit request.
   - Credentials are never taken from chat. DA uploads use the injected credentials.
7. **Design hook:** the warnings about Roboto and the two fallback fonts in `styles/styles.css` are
   brand-intentional. Don't change or suppress them without the user's confirmation.

---

## 1. Wave-1 baseline: keep intact

Homepage EN + FR plus 179 credit card pages (89 EN, 90 FR): **181 pages**.

### 1a. Final scope (customer-facing)

| | Count |
|---|---|
| Master blocks | **11**: cards, accordion, hero, columns, table, card-highlights, toc, search, earn-calculator, header, footer |
| Variants | **44** = 41 built + 3 new (`columns tip`, `columns cta`, `cards checklist`) |
| Templates (Stardust: page type × page head) | **9** |
| Default scope, before | 220 variants of 14 types, **58 unknown**, 11 templates |
| Unknowns resolved | **58/58**: 44 existing variant, 3 new variant, 6 page prose, 5 client-side widgets |

### 1b. The 41 built variants (instances / pages, from the scoping-only pilot)

| Block | Variants |
|---|---|
| cards (20) | features 121/88 · why 67/49 · icons 60/48 · tiles 54/42 · partners 38/38 · list 28/25 · tools 26/26 · links 24/24 · offers 24/24 · articles 21/21 · stats 17/13 · awards 8/8 · quick 6/3 · promo 2/2 · families 1/1 · products 1/1 · articles featured 1/1 · recognition 1/1 · flights 1/1 · compare 1/1 |
| accordion (4) | default 138/97 · legal 83/83 · moments 1/1 · details 1/1 |
| hero (6) | typeled 92/92 · default 53/53 · card typeled 32/32 · home 2/2 · back 1/1 · card 1/1 |
| columns (5) | default 75/53 · intro 43/22 · apply 30/30 · actions 1/1 · split 1/1 |
| table (1) | default 66/40 |
| card-highlights (1) | default 32/32 |
| toc (1) | default 28/28 |
| search (2) | default 1/1 · branch 1/1 |
| earn-calculator (1) | default 1/1 |

**Total: 41 variants, 1,185 instances.**

New variants, not built yet, defined in `Scoping-Stardust/rbc-wave1/stardust-scope/unknown-scoping.json` → `newVariants`:
- `columns tip`: icon-led note box ("Tip", "Pro tip", "To sum it up");
- `columns cta`: a prompt with buttons ("Need Help Deciding?");
- `cards checklist`: ticked eligibility criteria.

### 1c. Templates

**Stardust (9):**

| Template | Pages | Best reference |
|---|---|---|
| Help and service page | 55 | rbc-additional-travel-insurance (79%) |
| Credit card product page | 33 | **rbc-avion-visa-infinite (approved)** |
| Advice article | 28 | how-do-travel-credit-cards-work (96%) |
| Category hub | 24 | **credit-cards/index (approved)** |
| Cardholder how-to article | 15 | how-do-cashback-credit-cards-work |
| Tool page | 14 | calculatrice-de-remise-en-argent |
| Card listing and resource index | 8 | cardholders |
| Homepage | 2 | **personal.html (approved)** |
| Campaign page | 2 | balanceprotector |

**Default scope (11), for comparison:** credit-card-content-page 136 · advice-article 32 · card-activation 2 ·
awards-showcase 2 · insurance-campaign 2 · points-calculator 2 · homepage 1 · homepage-localized 1 ·
category-landing 1 · advice-article-tldr 1 · advice-article-guide 1.

### 1d. Approved design and reference pages

- **Canon:** variant C (Home C Cinematic), the RBC brand-faithful canon. Its CSS and design files were deleted in the clean-up; the decision is recorded here. A wave-2 uplift that needs the canon as reference re-extracts it from the live site, or uses the wave-1 pilot PDF as the visual record.
- **Archetypes (approved prototypes):**
  - program: Avion Visa Infinite;
  - listing: `/credit-cards/index`;
  - article: what-is-a-credit-card;
  - static: lost-or-stolen-credit-card;
  - landing: homepage.

### 1e. Where the wave-1 artefacts live (after the 2026-10-07 clean-up)

The repo was reduced to the **EDS boilerplate as originally committed**, plus the repo settings and
`Scoping-Stardust/`. Everything else was deleted at the user's request: the RBC site build (the wave-1
blocks, styles and fonts), the Stardust snapshot and prototypes, the catalogs, the import scripts and the
migration state. The scoping record and the toolkit were kept:

| What | Path now |
|---|---|
| Unknown decisions (58/58), new-variant definitions | `Scoping-Stardust/rbc-wave1/stardust-scope/unknown-scoping.json` (plus `unknown-review.json`) |
| Scope-vs-Stardust validation per scope variant | `Scoping-Stardust/rbc-wave1/stardust-scope/scope-block-validation.json` |
| Built-variant inventory (41) with sample and source URLs | `Scoping-Stardust/rbc-wave1/stardust-scope/gallery.json` · templates: `templates.json` |
| Wave-1 page list, types, archetypes | `Scoping-Stardust/rbc-wave1/stardust-scope/stardust-state.json` · dynamic features: `dynamic-features.md` |
| Default scope (wave 1) | `Scoping-Stardust/rbc-wave1/default-scope/` (`template-catalog.json`, `block-catalog.json`, `summary.json`, `urls-grouped.json`) |
| Scoping-only pilot | `Scoping-Stardust/rbc-wave1/pilot/`: `scope-only.pdf`, `scope-only-standalone.zip`, `scope-only-summary.json`, `scope-only-results.json` |
| Migration gallery + verdict | DA only: `/drafts/block-gallery.pdf`, `/drafts/block-gallery-standalone.zip` |
| Component matcher + scoping scripts | `Scoping-Stardust/toolkit/` (see its `README.md`). Paths inside are still the old wave-1 ones; re-point them before use. |
| Block code, canon CSS, prototypes, Stardust snapshot | **Deleted.** The names and counts above are the record. Rebuild from the canon only when a migration is commissioned. |

---

## 2. Wave 2: status (Phase 0, discovery, in progress)

**Decisions taken with the user:**
- **EN only.** French is noted as having the same templates and blocks.
- **All 412 Direct Investing `/learn/` articles are in scope.**
- **Finish discovery first,** then the default scope and the snapshot in parallel.
- **The uplift runs** for Direct Investing, RBC Bank and Avion. The rbcroyalbank.com cohorts reuse canon C.

**What the discovery probe found:**
- All sites (rbcroyalbank.com sections, rbcdirectinvesting.com, rbcbank.com, avionrewards.com) run on the
  **same RBC DVL design system**: `/dvl/v1.0/`, `grid-wpr`.
- The sitemaps are incomplete or stale:
  - the RBC sitemap has 842 URLs, 623 of them `http://`, with no loans, investments or commercial URLs;
  - 50 of its 79 mortgage URLs return 404.

**Discovery results so far** (`inventory/RECONCILIATION.md`, `inventory/<cohort>.json`, `inventory/urls-<cohort>.txt`):

| Cohort | Sheet (EN) | Found | Rendered pass |
|---|---|---|---|
| Customer Service | 1 | 2 | to do |
| Mortgages | 149 | 104 | **done** (+13) |
| Personal Loans | 46 | 22 | **done** (+7) |
| Investments | 36 | 47 | to do (resumable, 0/47 rendered) |
| Business + Commercial | 252 | 260 (268 incl. 8 canonical duplicates) | to do (0/268) |
| Direct Investing | 58 | 478 (412 /learn) | to do (0/488) |
| RBC Bank (US) | 104 | 58 | to do (0/59) |
| Avion Rewards | 31 | 29 | to do (0/33) |
| **Total** | **677** | **~1,000** | |

Search Results (`/search-public/*`, ~1,200 dynamic FAQs) are a dynamic feature, not pages: one search
template.

**Open for the customer (Gate 0):**
- Mortgages −45, Loans −24 and RBC Bank −46 against the sheet. Are some pages in other folders, legacy URLs,
  or counted from analytics?
- Direct Investing: the sheet says 58, the earlier count says 129 with 33 templates, and we found 478.
  Confirm that `/learn` stays in.

---

## 3. Next steps, in order

### Step 1: finish discovery (resumable)

```bash
cd /backups/meejain/ema-rbcroyalbank/repo/Scoping-Stardust/rbc-wave2
for g in "investments customer-service" "rbc-bank avion-rewards" "business-commercial" "direct-investing"; do
  n=$(echo $g | cut -d' ' -f1)
  FAST=1 BATCH=10 setsid nohup node work/rendered-crawl.mjs $g > rc-$n.log 2>&1 < /dev/null &
done
# poll every 2–3 min:  for f in rc-*.log; do tr '\r' '\n' < $f | grep -v '^$' | tail -1; done
# progress also lives in inventory/<cohort>.json → renderedUrls (survives restarts; rerun the same command)
node work/reconcile.mjs      # when all are done → inventory/RECONCILIATION.md + urls-<cohort>.txt
```

**Gate 0:** show the user the reconciliation table and get the URL lists confirmed.

### Step 2: default scope per cohort (Phase 1, isolated folders)

For each cohort, from **inside** its own folder:

```bash
mkdir -p Scoping-Stardust/rbc-wave2/<site>/<cohort> && cd $_
cp ../../inventory/urls-<cohort>.txt urls.txt
P=/home/node/.excat-marketplaces/excat-marketplace/excat
node $P/skills/excat-site-catalog/scripts/setup-catalog-project.js urls.txt   # list mode
```

Then follow the site-scope skill with `inputType=list`:
- `parse-url-input.js`;
- `catalog-batch-analyze.js`, driven by `run-analysis-relay.js` until it exits 0;
- consolidate fingerprints;
- `python3 -m cluster.template_pages`;
- name the templates (`.decisions.json` → `apply_naming.py`);
- `catalog-block-rollup.js`;
- `emit-page-templates.js` and `build-visual-trees.js` with outputs inside the cohort folder;
- `generate-summary.js`, then `present-completion-summary.js`.

Small cohorts (customer service, loans, investments, mortgages) can share one rbcroyalbank catalog folder
with a combined list. Run concurrently with Step 3.

### Step 3: Stardust snapshot (Phase 2, no import)

One snapshot per origin, in `Scoping-Stardust/rbc-wave2/<site>/stardust/current`:

```bash
cd "$EXCAT_MARKETPLACES_DIR/excat-extended/stardust"   # run the bundled crawler from the plugin tree
setsid nohup node skills/extract/scripts/crawl.mjs --url <origin> --pages "<comma list>" --max 2000 --concurrency 4 \
  --out /backups/meejain/ema-rbcroyalbank/repo/Scoping-Stardust/rbc-wave2/<site>/stardust/current > <log> 2>&1 < /dev/null &
```

- Expect about 4–5 pages a minute.
- Pages that navigate away mid-capture (language redirects) need a fresh-context retry.
- For the rbcroyalbank.com cohorts, **reuse canon C** as the design decision. The canon files are no longer in the repo; see § 1d.

### Step 4: classify (Phase 3, Track B)

Generalise `Scoping-Stardust/toolkit/scope-only/run-scope-only.mjs`:
1. Point `ROOT` / snapshot dir / output at the wave-2 site folder.
2. **Infer the matcher template per page** from the DOM, since wave 2 has no `state.json` page types:
   - `.ssr-card-template` → program;
   - `.advice-left-contents` → article;
   - `.category-button-grid` → listing;
   - hero slides → landing;
   - otherwise static.
3. Rebundle `Scoping-Stardust/toolkit/importer/scope-classify.js` after any matcher change: `aem-import-bundle.sh --importjs <path>`. The matcher lives next to it in `toolkit/importer/parsers/rbc-live.js`.
4. Keep the overlay-hiding `<style>` injected into the HTML. `addStyleTag` hangs with JS disabled.

### Step 5: reuse check (Phase 4)

Write `work/reuse-matrix.mjs`:
- variant × cohort instance counts;
- share of sections recognised by the **wave-1 41 variants**;
- unassigned sections cropped onto contact sheets (`Scoping-Stardust/toolkit/scope/contact-sheet.mjs` pattern).

Resolve each unassigned section using the Phase-6 decisions in the playbook: existing, new, prose or widget.

### Step 6: uplift and prototypes (Phases 5–6)

- `stardust:uplift` for rbcdirectinvesting.com, rbcbank.com and avionrewards.com.
- Each runs in its own site folder with the wave-1 canon as design reference.
- **Customer gate:** pick A/B/C, or inherit canon C.
- Then prototype only the templates that have no wave-1 equivalent.

### Step 7: unknowns, then the report (Phases 7–8)

- Map the default scope onto the classification (`run-scope-only.mjs` already does the `scopeMap`).
- Close the unknowns.
- Build the per-cohort and consolidated reports: verdict, blocks, variants, templates, unknowns, reuse matrix.
- Patterns: `Scoping-Stardust/toolkit/scope-only/report.mjs`, `standalone.mjs`, `check-report.mjs`.
- Upload to DA `/drafts` only with consent.

---

## 4. Known traps (from waves 1 and 2)

- **Background-image photos** (callout-img) are lost unless carried as images. The matcher handles them now.
- **Whole-card links containing an h2**, and **spacer siblings** that outvote real tiles: both handled in the
  matcher.
- **Script-only links** (`javascript:`) and **client-side toolbars** (sort, filter, letter pickers): skipped.
  Real category navigation inside `#categories-filter` is kept.
- **Hidden letter or tab groups:** treat them as content (`.cc-sd`).
- **One scope fingerprint can cover two different components:** break the variant down per instance
  (`Scoping-Stardust/toolkit/scope/explain-variant.mjs`).
- **Measurement noise:** "accordion legal" matches often come from shared legal wording. Confirm them by
  screenshot.
- **Query-string sitemap entries** (FAQ deep links) are not pages. Verify, then list them separately.
- **hreflang errors** can merge a parent page and its child page. Split such groups by path depth.
