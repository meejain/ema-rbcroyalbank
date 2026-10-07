# Stardust-led scoping playbook

> Active work: RBC wave 2, see [`rbc-wave2/HANDOFF.md`](rbc-wave2/HANDOFF.md) for status and next steps.

A step-by-step prompt for scoping a site migration to Edge Delivery Services. Stardust uplift sets the
design and the reference pages. Every page in scope is migrated. The default site scope runs on the same
URL list, and the two results are mapped onto each other until no block is left "unknown".

It was written from the RBC credit cards engagement (181 pages). Applied there, it took the default
scope's 220 variants, 58 of them unknown, down to 11 master blocks and 44 variants across 11 templates,
with a decision for every unknown.

---

## How to use this file

Paste the **Kickoff prompt** below into a new session, with the customer's site URL and page list. The
agent then works through Phases 0–8 in order. Each phase ends at a **gate**: a check that must pass, or
a question that must be answered, before the next phase starts. Questions marked **🧑 Customer** go to
the customer (multiple-choice where possible). Don't guess their answers.

### Kickoff prompt

```
We are scoping the migration of <SITE URL> to AEM Edge Delivery Services using the Stardust-led
scoping playbook (Scoping-Stardust/SCOPING-PLAYBOOK.md). Follow it phase by phase and stop at every gate.

Pages in scope: <URL list file, sitemap section, or description such as "homepage EN/FR + every
credit card page">.
Design intent: <brand-faithful refresh | reimagined | same design>. Default: brand-faithful refresh.
Languages: <list>.
Deliverables: block/variant/template scope with screenshots and live source links, an unknowns
resolution, a final verdict, published as an interactive index, a standalone file and a PDF to
DA /drafts.

Goal: zero unresolved "unknown" blocks. Every scoped component must end as an existing variant,
a new variant of an existing block, page prose, or a non-content widget, each with evidence.
```

---

## Ground rules (all phases)

- **Evidence over inference.** Every count, mapping and claim comes from a captured page, a measurement
  or a screenshot. Never make up content, URLs or numbers.
- **The customer decides scope and taste. The agent decides structure.** Ask the customer about page
  lists, the design direction, approval of the reference pages, and dynamic features. Make the
  structural calls yourself (block vs. prose, variant reuse), and record the evidence for each.
- **Content is generated only by import scripts.** Never hand-write or hand-edit migrated content.
  To change content, fix the importer and re-import the affected pages.
- **No installs into the project.** Playwright and other tooling are run from where they're installed.
  Don't run `npm i`, don't run `npx playwright install`, and don't copy bundled scripts into the repo.
- **Outward-facing actions need consent.** Uploads to DA, publishing, commits and PRs happen only when
  the user asks. Credentials are never pasted into chat; an upload that fails with 401/403 means the
  permission opt-in is off.
- **Reuse before you create.** A new block variant needs a screenshot showing that no existing variant
  fits. A new master block needs a stronger case still: it was needed zero times at RBC.
- **Running prose stays as plain text.** Don't wrap headings, paragraphs and lists in blocks just to
  lower the unknown count. Boxes embedded in the prose (tips, prompts) can be variants.

---

## Phase 0: Define the scope

**Goal:** a fixed, validated URL list that both Stardust and the default scope will use.

1. Collect the candidate URLs: the customer's list, the sitemap, or a crawl of the named sections.
2. Normalise them: one canonical URL per page, the language siblings paired (EN ↔ FR), and redirects,
   404s and duplicates removed. Record each page's HTTP status.
3. Group the URLs by path family (home, product pages, listings, articles, tools, cardholder/help) as a
   first idea of the page types.
4. **🧑 Customer:** confirm the list. Ask about excluded sections, language coverage, and whether
   gated or authenticated pages are out of scope.

**Gate 0:** the confirmed list is saved as `catalog/<scope>-scope-urls.txt`, every URL returns 200, and
the count is agreed with the customer.

---

## Phase 1: Stardust uplift (design direction and canon)

**Goal:** the target design system, and a canon that every migrated page will inherit.

1. Run `stardust:uplift` on the homepage, or on the most representative page if the homepage is out of
   scope. It extracts the brand surface, identifies tensions and renders three differentiated variants
   (A brand-faithful, B amplified, C cinematic).
2. Check that each variant keeps the brand's signatures: logo, palette, type, hero medium and voice.
3. **🧑 Customer:** pick the canon variant, and note any changes they ask for. Iterate with the impeccable
   commands until they approve it.

**Gate 1:** the canon variant is approved, and DESIGN.md / DESIGN.json reflect it.

---

## Phase 2: Choose the reference pages (archetypes)

**Goal:** one approved reference page (archetype) per page type, each chosen as the **best reference** for
its group.

1. Type every page in the scope list (`stardust:extract --prep`, run with `--pages-file`).
2. For each page type, rank the candidate pages by **component coverage**: how many distinct components
   the page carries (hero type, card patterns, accordions, tables, legal, calculators, promo and apply
   bands), not how much traffic it gets. The best reference is the page whose components cover the
   most of its siblings' components.
   - When no single page covers its group, prototype two pages, or note which sibling components the
     archetype doesn't show.
3. **🧑 Customer:** confirm the reference page for each type. For example: "For credit card product
   pages we propose /travel/rbc-avion-visa-infinite (it covers 87% of sibling components). Use it, or
   pick another?"
4. Run `stardust:prepare-migration`, which prototypes each archetype onto the canon. Then approve the
   archetypes. Phase 4.5 (dynamic features) is part of this run: it records every dynamic surface
   (calculators, compare, filters, search, feeds) with a disposition.

**Gate 2:** every page type has an approved archetype. The canon has been written back. The
dynamic-features register lists every feature, each with a disposition.

---

## Phase 3: Migrate every page in scope

**Goal:** the whole scope migrated to EDS documents, so the mapping in Phase 5 runs on real output.

1. Convert the archetypes to EDS blocks and documents (`stardust:migrate`, then the deploy conversion).
   Build the block code from the canon. Each block has its variants and stays author-editable: move the
   authored nodes, never rebuild them.
2. Write one import script per template (archetype or live-sibling), plus the nav and footer documents.
   Run the bulk import across the full URL list.
3. Run the QA gates: page QA on every page, image resolution, content completeness against the source,
   lint, and an author-editability check on the archetypes.

**Gate 3:** all pages are imported with zero failures. Page QA passes. Every image resolves. The inventory
of blocks and variants in use is recorded, with instances and pages for each variant.

---

## Phase 4: Run the default scope on the same URL list

**Goal:** the default scope's own view (templates, blocks, variants, unknowns), on exactly the same pages.

1. Run the default site-scope analysis on the Phase 0 list: page analysis, fingerprinting, template
   clustering, and the block and variant catalog.
2. Keep its output unchanged as the baseline: the template catalog, the block catalog (including the
   unknowns) and a screenshot of each variant.

**Gate 4:** the default scope covers 100% of the URL list. The baseline counts are recorded (templates,
variants, types, unknowns and their instances).

---

## Phase 5: Map the two results

**Goal:** for every scoped variant, where its content ended up in the Stardust migration.

1. For each scoped instance, take its text from the captured source page using the scope's selector.
   - If the selector doesn't resolve, find the element on the live page by the scope's recorded bounds.
     Mark those instances "measured by position".
2. Measure that text against the page's migrated document:
   - **text kept** is the share of the text found in the migrated page;
   - the **holder** is the migrated block or section holding the most of it;
   - a variant's **mapping** is its majority holder. Keep the full split of holders.
3. Roll the results up by scoped type and list the instances below 60% text kept.
4. Classify each low-coverage instance: toggle labels, share widgets, dynamic widgets, or a real loss.
   Real losses go to the Phase 6 fix list.

Watch out for:
- **One fingerprint, several components.** The scope can group different components under one variant;
  at RBC, "My Money Matters" cards and promo callouts shared one. Break such variants down per
  instance before you judge them.
- **Matches that come from shared text.** Legal footnotes share wording with everything, so a mapping to
  "accordion legal" is often noise. Confirm it by screenshot.
- **Text kept says nothing about images.** A component can keep all its text and still lose its photo.
  Check images separately (see the background-image trap in Phase 6).

**Gate 5:** every scoped variant has a mapping, or is flagged "not measured" with a reason.

---

## Phase 6: Resolve the unknowns

**Goal:** no unresolved unknowns. Every one gets exactly one decision, backed by evidence:

| Decision | Meaning | Needs |
|---|---|---|
| `existing` | Matches a variant Stardust already builds | A screenshot next to the variant |
| `new` | A new variant of an existing block | Proof that no existing variant fits |
| `default` | Page prose, authored without a block | A note on why it's prose; any embedded boxes listed |
| `removed` | A client-side widget, not content (filter, sort bar, letter picker) | A link to its row in the dynamic-features register |

The loop:

1. **Contact sheets.** Render the scope screenshots of the unknowns about ten per sheet, next to a sheet
   of the candidate Stardust variants. Judge them by eye.
2. **For each unknown:** outline its live markup (classes, background images, whole-card anchors). Then
   compare it with what the importer produced for that page.
3. **Decide** using the table above.
   - Prefer `existing`.
   - Use `new` when the component's shape repeats somewhere and nothing existing fits.
   - Use `default` only for running text.
4. **Fix the importer** for every `existing` or `new` decision the migration doesn't yet produce.
   Test-import one page per component, then re-import only the affected templates.
5. **Re-measure** (Phase 5) and repeat until every decision is backed.
6. **🧑 Customer:** ask only the genuinely ambiguous cases. For example: "This eligibility checklist
   appears on 4 pages: make it a new variant, Cards (checklist), or keep it as a plain list?" Also ask
   for the owner's decision on each dynamic feature the widgets belong to.

Importer traps found at RBC. Check every site for them:

- **Photos as CSS backgrounds.** An element painted with a photo but holding nothing else loses the
  photo, while its text is kept. Carry the background image as an image.
- **Whole-card links that contain an h2.** These were taken for sub-sections, so whole card grids
  disappeared. A heading inside a link is a card title.
- **Spacer elements between tiles.** Separators can outnumber the tiles and win the repeat vote, so the
  grid is lost. Only groups of card-like siblings should compete.
- **Script-only links (`javascript:`).** These come from filter chips and compare toggles, and leak into
  the document as dead links. Drop them, but keep containers that also hold real links (category
  navigation).
- **Hidden content groups.** Letter or tab filters show one group at a time, and the hidden groups get
  dropped. At RBC only 11 of 42 definitions survived. Treat these groups as content.
- **Image-led bands split at the h2.** The image fell into the previous section. Keep media and copy
  together in one block.
- **A lone callout vs. a grid of callouts.** A lone callout is a promo banner (Columns). Three or more
  in a section are a card repeat.
- **Client-side toolbars.** Text such as "Showing N cards" or "Sort by" leaks in as copy. Skip it.

**Gate 6:** `stardust/qa/unknown-scoping.json` has a decision for **every** unknown. The new variants
are listed, each with its source unknowns and a one-line description.

---

## Phase 7: Final scope and verdict

1. Compute the final numbers:
   - master blocks (content blocks plus header and footer);
   - variants (built plus new);
   - templates, with their page counts;
   - the before/after comparison with the default scope;
   - the unknown decisions by category.
2. Write the **verdict**: "scoping complete" only when Gate 6 holds. Then list what's left before
   go-live:
   - new variants to build;
   - pages still to re-import with the importer fixes;
   - open dynamic features awaiting owner decisions.
3. State the caveats: measurements taken before the importer fixes, pages imported with an older
   importer, anything measured by position.

**Gate 7:** every number in the verdict is reproducible from the files in `stardust/qa/`.

---

## Phase 8: Deliverables and publishing

Build the gallery, using `stardust/qa/block-gallery/` as the template:

| Tab | Content |
|---|---|
| **Blocks** | The final verdict (page 1 of the PDF). The master blocks table: variants, instances, pages, variant names, and new variants marked *new*. A card per block, with screenshots of header and footer. |
| **Variants** | Every built variant, desktop and mobile, with its source page plus "also used on N pages". The scope variants mapped to it, and the unknowns decided onto it. A New variants section with the live components each one covers. |
| **Unknowns** | A summary by decision. Per unknown: the live screenshot, the scope's description, the decision and its reason, the measured migration result, and every live page it appears on. |
| **Templates** | Per template: a full-page screenshot of the representative page, live beside migrated; the variants used; and every page in the template. |

- Every source link opens the live page. Check that they all return 200.
- Produce the interactive index, a standalone single file with the images embedded (zipped), and a PDF.
  The PDF prints the tabs in order with the "show more" lists expanded.
- **🧑 Customer / user:** confirm the upload. Then upload the PDF and the zip to DA `/drafts`, and check
  that the size in DA matches the local file.

**Gate 8:** both files are in DA with matching sizes. The verdict is on page 1.

---

## Track B: scoping only (no migration)

Use this track when the customer needs the scope (blocks, variants, templates, screenshots) but no pages
migrated yet. It replaces Phases 3–5. No content is imported. The pages are classified from the saved
Stardust snapshot instead.

Piloted on RBC (181 pages):
- The pilot reproduced the full migration's scope: 9 content blocks and 41 variants.
- Its block sets were identical on every page imported with the current importer (71/71) and on every
  reference page (5/5).
- The 9 templates were assigned automatically, and every unknown was mapped.
- Classifying 181 pages took about 3 minutes.

| Step | What happens | Gate |
|---|---|---|
| B1 Capture | Phases 0–2 as above: scope list, uplift canon, best reference page per type, prototypes approved. `stardust:extract --prep` saves each page's rendered HTML and a full-page screenshot, and types the page. | Every page in the snapshot has live-render provenance |
| B2 Classify | Render each saved page with page scripts off and the live stylesheets loaded. Record every element's position. Run the component matcher in report mode: it returns the block, variant or prose for each section, plus the source element. Reference pages take their variants from the approved prototype. | Each page classified; text recognised ≥ 80% on content pages |
| B3 Screenshots | Crop the first instance of each variant from the page render. Variants defined only by a prototype use the prototype render. Crop every unassigned section too. | Every variant has a screenshot |
| B4 Map the default scope | Locate each default-scope instance in the same render: by selector first, else by its recorded bounds. Name the recognised block emitted inside it, or the nearest one around it. That's the automatic resolution of the unknowns, with no migration involved. | Every scope instance found, or flagged |
| B5 Templates | Template = Stardust page type × page head (hero family). The representative is the best reference: the page covering the most of its siblings' components, weighted by frequency, unless an approved reference page covers enough. Compare with the default scope's templates. | Each template has a representative and its coverage |
| B6 Close the unknowns | Phase 6 on the automatic mapping: review by screenshot, then add matcher rules or new variants, then re-classify. The loop takes minutes because nothing is imported. | No undecided unknowns |
| B7 Report | Verdict · Blocks · Variants · Templates · Unknowns · Pilot check. Delivered as the index, a standalone zip and a PDF. Upload to DA `/drafts` only with consent. | Verdict on page 1 |

What Track B doesn't show: losses that only appear in imported content, such as photos dropped by the
importer or card grids that disappear. Its stand-ins are the coverage check (text recognised, unassigned
sections) and the screenshot review. If the scope later turns into a migration, run Phases 3–5 then.

Track B tooling (now in `toolkit/scope-only/`; see `toolkit/README.md`):

| Script | Use |
|---|---|
| `run-scope-only.mjs [--only slugs] [--workers 4]` | B2–B4: classifies the snapshot pages, crops screenshots, maps the default-scope instances |
| `toolkit/importer/scope-classify.js` (bundled) | The matcher in report mode (block or prose items, each with its source element) |
| `analyze.mjs` | Variant inventory, coverage, unknown mapping, templates, and the comparison with any migrated documents |
| `report.mjs`, `standalone.mjs`, `check-report.mjs` | B7: the tabbed report, standalone file, PDF and zip, and the link/image check |

---

## Tooling from the RBC run (now in `toolkit/`; see `toolkit/README.md`)

| Script | Use |
|---|---|
| `validate-blocks.mjs` | Phase 5: measures scoped instances against the migrated documents (text kept, holder, majority) |
| `measure-unmapped.mjs` | Phase 5: measures by position on the live page when the scope selector fails |
| `explain-variant.mjs <id>` | Phase 5/6: per-instance breakdown of one scope variant |
| `classify-misses.mjs`, `correction-stats.mjs` | Phase 5: classifies the low-coverage instances; counts how often Stardust kept or changed the scope's block family |
| `contact-sheet.mjs`, `eds-sheet.mjs` | Phase 6: screenshot sheets of scope unknowns and of Stardust variants |
| `dom-outline.mjs <page> "<text>"` | Phase 6: condensed live markup around a component |
| `probe-onload.mjs` | Phase 6: runs the importer's page annotation on a live page, then inspects the result |
| `callout-img-audit.mjs` | Phase 6: checks every background-image banner against the migrated documents |
| `write-scoping.mjs` | Phase 6: the decision for every unknown, written to `stardust/qa/unknown-scoping.json` |
| `block-gallery.mjs`, `template-shots.mjs` | Phase 8: variant and template screenshots |
| `gallery-tabs.mjs` | Phase 8: the four-tab index, including the verdict |
| `gallery-standalone.mjs`, `publish-gallery.sh` | Phase 8: standalone file, PDF, zip, DA upload and size check |
| `check-gallery.mjs` | Phase 8: broken images, dangling anchors, tab screenshots |

---

## Customer checkpoints at a glance

| When | Question |
|---|---|
| Phase 0 | Is this the right page list (sections, languages, exclusions)? |
| Phase 1 | Which design variant becomes the canon, and what should change? |
| Phase 2 | Is this the right reference page for each page type? Approve each archetype. |
| Phase 6 | The genuinely ambiguous unknowns: new variant or plain text? The owner's call on each dynamic feature. |
| Phase 8 | OK to upload the deliverables to DA `/drafts`? |
