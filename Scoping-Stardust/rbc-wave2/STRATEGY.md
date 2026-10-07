# RBC wave 2: scoping strategy

The remaining RBC cohorts are scoped with Stardust uplift plus the default site scope, **without importing
any content** (Track B of `Scoping-Stardust/SCOPING-PLAYBOOK.md`). The scope reuses the wave-1 block library
(11 master blocks, 44 variants) and measures how far it carries.

Written 2026-10-07, from the customer's cohort list and a first discovery probe of all four sites.

> **Current status, the wave-1 baseline and the exact next steps are in [`HANDOFF.md`](HANDOFF.md). Start there in a new session.**

---

## 1. What's in scope

The page counts come from the customer's sheet and are **EN only**.

| # | Cohort | Site / folder | EN pages (sheet) | Found in sitemap | Discovery needed |
|---|---|---|---|---|---|
| 1 | Customer Service | rbcroyalbank.com/customer-service/ | 1 | 0 | Single URL |
| 2 | Mortgages | rbcroyalbank.com/mortgages/* | 149 | 78 | Crawl the folder |
| 3 | Personal Loans | rbcroyalbank.com/loans-line-of-credit/* | 46 | 0 | Crawl the folder |
| 4 | Investments | rbcroyalbank.com/investments/* | 36 | 0 | Crawl the folder |
| 5 | Business + Commercial | rbcroyalbank.com/business/* + /commercial/* | 252 | 150 (business) · 0 (commercial) | Crawl both folders |
| 6 | Direct Investing | rbcdirectinvesting.com (all public pages) | 58 (sheet) · 129 (earlier count, 33 templates) | 190 (140 under /learn) | Reconcile the three counts |
| 7 | RBC Bank (US) | rbcbank.com/* | 104 | 60 | Crawl the site |
| 8 | Avion Rewards | avionrewards.com | 31 | 9 | Crawl the site |
| | **Total** | | **677 EN pages** | | |
| — | Search Results | rbcroyalbank.com/search-public/* | ~1,200 dynamic FAQ results | — | **Not pages**: one search template plus a dynamic feature (§ 6) |

**What the discovery probe found (2026-10-07):**
- All 10 entry pages return 200, with no bot block.
- **Every site uses the same RBC design system (DVL)**: `/dvl/v1.0/assets/css/dvl.min.css` and the `grid-wpr` grid. That includes Direct Investing, RBC Bank and Avion Rewards. Each section adds its own `_assets-custom/` CSS for its components.
- **The RBC sitemap is incomplete for these cohorts.** It lists 842 URLs, 623 of them under the old `http://` scheme. It has no loans, investments, commercial or customer-service URLs, and only 72 of the 179 credit card pages. The sitemap can't define scope; folder crawls plus the customer's list must.
- **French exists on rbcroyalbank.com** (`/fr/`). The sheet is EN only, and FR stays out of scope unless the customer adds it. Wave 1 showed FR pages share their EN pages' templates and blocks.

---

## 2. The approach

```
Phase 0  Inventory      folder crawls + sitemap + customer list  →  confirmed EN URL list per cohort   [customer gate]
Phase 1  Default scope  site-scope per cohort (no import)        →  templates, block variants, unknowns
Phase 2  Snapshot       Stardust capture of every page            →  rendered HTML + screenshots (no import)
Phase 3  Classify       wave-1 matcher in report mode             →  every section labelled with a variant, or unassigned
Phase 4  Reuse check    wave-1 library vs each cohort             →  reuse matrix, list of new variants
Phase 5  Uplift         Stardust uplift where the brand differs   →  canon per brand family                 [customer gate]
Phase 6  Prototypes     one reference page per NEW template       →  approved archetypes, new variants        [customer gate]
Phase 7  Unknowns       map the default scope onto Phase 3        →  every unknown decided                   [customer gate for ambiguous ones]
Phase 8  Report         per cohort + consolidated                 →  index, standalone file, PDF, verdict    [upload gate]
```

Phases 1 and 2 run in parallel; neither imports content.

### Phase 0: Inventory (per cohort)

1. Sitemap URLs filtered to the cohort folder, plus a crawl limited to that folder starting from its index
   page (the RBC sitemap is incomplete).
2. Normalise: drop `http://` duplicates and query-string variants, dedupe trailing slashes, drop off-site
   links.
3. Reconcile with the customer's sheet. Explain every difference in a table: missing, extra, redirected or
   404.
4. Separate out non-page URLs: search results, FAQ deep links, calculators that live on one URL with
   parameters, PDFs.
5. **🧑 Customer gate:** confirm the URL list for each cohort, and settle Direct Investing's count (58
   public EN pages, 129 in the earlier count, 190 in the sitemap).

### Phase 1: Default scope (per cohort, in its own project folder)

Run the site-scope skill on each confirmed list: page analysis, templates, naming, block catalog and summary.
Keep its output unchanged as the baseline.

**Isolation:** each cohort gets its own project root. The catalog setup deletes any existing `catalog/` in its
folder, so it must never run at the repo root, where the wave-1 catalog lives.

### Phase 2: Stardust snapshot

`stardust:extract` (bundled crawler) captures every page's rendered HTML and full-page screenshot.

Wave-1 rates for planning:
- RBC pages captured at about 4 to 5 pages a minute;
- 677 pages take roughly 2 to 2.5 hours;
- it runs unattended alongside Phase 1.

### Phase 3: Classification (no import)

Run `Scoping-Stardust/toolkit/scope-only/run-scope-only.mjs` against each cohort's snapshot, using the wave-1 matcher
`Scoping-Stardust/toolkit/importer/parsers/rbc-live.js` in report mode.

Output: every section of every page labelled as block variant, page prose, client-side widget, or
**unassigned**, with a screenshot crop and the share of page text recognised.

### Phase 4: Block reuse check (the main question)

For each cohort:

- **Reuse rate:** the share of sections recognised by the existing 44 variants, and the share of page text
  they hold.
- **Unassigned sections:** cropped and grouped by visual similarity on contact sheets, then each resolved as
  - an existing variant (a matcher rule to add);
  - a new variant of an existing block;
  - a genuinely new block (expected to be rare, given the shared DVL design system);
  - page prose;
  - a widget.
- **Cross-cohort reuse matrix:** variant × cohort, with instance counts. It shows which variants serve every
  cohort, which serve only one, and where a cohort-specific variant could fold into a shared one.

**Expected pattern** (to be measured, not assumed):
- the rbcroyalbank.com sections (mortgages, loans, investments, customer service) reuse most of the library;
- Business and Commercial reuse it largely but bring their own components;
- Direct Investing, RBC Bank and Avion Rewards share the DVL base but add site-specific components (trading
  tools, cross-border calculators, offer tiles).

### Phase 5: Stardust uplift (where the brand differs)

| Brand family | Sites | Canon |
|---|---|---|
| RBC Royal Bank | rbcroyalbank.com cohorts 1–5 | **Reuse the wave-1 canon (variant C).** Same origin, same brand. No new uplift; the new templates are prototyped onto it. |
| RBC Direct Investing | rbcdirectinvesting.com | Uplift on its homepage in brand-faithful mode, with the wave-1 canon as the design reference, so the shared DVL base stays consistent. |
| RBC Bank (US) | rbcbank.com | Same as Direct Investing. |
| Avion Rewards | avionrewards.com | Same as Direct Investing. Avion is its own sub-brand, so expect the largest visual differences. |

**🧑 Customer gate:** for each of the three uplifts, the customer picks the canon variant (A, B or C), or
chooses "inherit RBC canon C as is" to skip that uplift.

### Phase 6: Prototypes for new templates only

Templates whose layout the wave-1 archetypes already cover are classified, not prototyped. Only templates
with no wave-1 equivalent get a reference page, chosen by component coverage, prototyped onto the canon and
approved by the customer. The prototype's conversion defines any new variants, as the wave-1 reference
pages did.

### Phase 7: Resolve the unknowns

Map each default-scope instance onto the Phase 3 classification, by selector, else by recorded position.
Resolve every unknown with the four decisions:
- **existing:** an existing variant;
- **new:** a new variant of an existing block;
- **default:** page prose;
- **removed:** a client-side widget.

Each decision needs screenshot evidence. Loop on matcher rules until the unknowns reach zero. Ask the
customer only about genuinely ambiguous cases.

### Phase 8: Report and verdict

Per cohort and consolidated:
- **Verdict:** pages, templates, master blocks, variants, unknowns resolved, reuse rate.
- **Blocks:** with the cross-cohort matrix.
- **Variants:** live crops, or prototype renders for new variants.
- **Templates:** a full-page screenshot of each best reference page, its coverage, and every page in the
  template.
- **Unknowns:** automatic mapping plus review decision.
- **Dynamic features.**

Delivered as the index, a standalone zip and a PDF. Upload to DA `/drafts` only with consent.

---

## 3. Folder layout

Each site keeps its own data under `Scoping-Stardust/rbc-wave2/`. Nothing goes to the repo root, where the
wave-1 data stays as it is.

```
Scoping-Stardust/rbc-wave2/
├── STRATEGY.md                      ← this file
├── rbcroyalbank/                    ← cohorts 1–5 (one origin)
│   ├── mortgages/      catalog/ (default scope) · reports/
│   ├── loans/          catalog/ · reports/
│   ├── investments/    catalog/ · reports/
│   ├── customer-service/ …
│   ├── business-commercial/ catalog/ · reports/
│   └── stardust/       one snapshot for all rbcroyalbank.com cohorts (same origin; canon = wave-1 canon C)
├── rbcdirectinvesting/  catalog/ · stardust/ · reports/
├── rbcbank/             catalog/ · stardust/ · reports/
├── avionrewards/        catalog/ · stardust/ · reports/
└── consolidated/        reuse matrix · combined block library · consolidated verdict and PDF
```

---

## 4. Order of work

Cohorts run in order of expected reuse, so the matcher improves before the harder sites:

1. **Customer Service, Mortgages, Loans, Investments:** same origin and chrome as wave 1. Proves the reuse rate.
2. **Business + Commercial:** 252 pages, the largest cohort, with business-specific components.
3. **Direct Investing:** its own templates and the /learn article library.
4. **RBC Bank (US):** cross-border content and US calculators.
5. **Avion Rewards:** offers fed from SFMC, so the most dynamic.

**Timings for planning** (from wave 1, before customer wait time):

| Step | Time |
|---|---|
| Discovery and reconciliation | about 1–2 hours |
| Default scope | about 30 pages a minute plus setup; 677 pages ≈ 1 hour of analysis |
| Snapshot | about 2–2.5 hours, unattended |
| Classification | about 1 page a second; minutes |
| Unknown-review loop | the variable part: about half a day per new site, less for the rbcroyalbank cohorts |
| Each uplift | about 1–2 hours plus the customer gate |
| Each new-template prototype | about 1 hour plus approval |

---

## 5. Customer checkpoints

| When | Question |
|---|---|
| Phase 0 | Confirm each cohort's URL list. Settle Direct Investing's count (58, 129 or 190). Should FR be in scope? |
| Phase 5 | For Direct Investing, RBC Bank and Avion: pick a canon variant, or inherit RBC canon C |
| Phase 6 | Approve each new-template prototype |
| Phase 7 | Ambiguous unknowns: new variant or prose? |
| § 6 | Owner decisions on the dynamic features |
| Phase 8 | OK to upload the deliverables to DA `/drafts`? |

---

## 6. Dynamic features (scoped, not crawled)

| Feature | Where | Treatment in scope |
|---|---|---|
| Public search + ~1,200 FAQ results | rbcroyalbank.com/search-public/* | One search template plus an FAQ index. The results aren't pages. Owner decides: an EDS query index, the existing search service, or federated search. |
| Rates and calculators | Mortgages, loans, investments, RBC Bank (US affordability), Direct Investing pricing | Each listed with its data source; shown on the page as a block; logic is a dynamic feature |
| Offers (SFMC) | Avion Rewards | Offer tiles are a block; the feed is a dynamic integration ("most content updates tie back to MOP (Offers – SFMC)") |
| Trading tools and platforms | Direct Investing | Marketing pages are in scope; the tools themselves are out (application) |
| Sign-in and online banking | All | Links out to other domains; out of scope, as in wave 1 |
| Forms (applications, contact, prequalify) | Mortgages, RBC Bank, business | Form block plus submission endpoint, an owner decision |

---

## 7. Risks and assumptions

- **Counts:** the sheet's EN counts and the sitemap differ in every cohort. Phase 0 reconciles them before any
  estimate is fixed.
- **Matcher tuning:** the matcher was tuned on wave-1 pages. The reuse rate must be measured per cohort,
  not assumed. Sections-specific `_assets-custom` components will need new rules.
- **What scoping-only can't show:** losses that only appear in imported content. The stand-ins are the
  coverage check (text recognised, unassigned sections) and the screenshot review.
- **Multi-origin:** Direct Investing, RBC Bank and Avion Rewards are separate Edge Delivery sites, or
  separate folders on one site. That's a delivery decision for the customer; scoping treats them separately
  either way.
- **No content import, no publishing, no commits** without an explicit request.
