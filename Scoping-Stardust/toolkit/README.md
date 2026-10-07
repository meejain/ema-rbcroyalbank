# Scoping toolkit (saved from wave 1)

The repo was cleaned on 2026-10-07: the wave-1 RBC site build, the Stardust snapshot and the catalogs were
removed. These are the scripts the scoping method needs, copied from where they ran in wave 1.

**Paths are hard-coded to the old wave-1 locations.** Examples: `ROOT=/backups/meejain/ema-rbcroyalbank/repo`,
`stardust/current/pages`, `stardust/qa/...`, `catalog/`. Before re-using a script, point its `ROOT`, input and
output paths at the cohort folder you're working in.

## importer/: the component matcher (report mode)

| File | Role |
|---|---|
| `parsers/rbc-live.js` | Live RBC page → blocks. Trace-enabled: every emitted node remembers its source element (`__src`). Encodes all the wave-1 component rules: apply bands, callouts, tool tiles, offer tiles, award seals, whole-card links, background photos, skipped widgets. |
| `rbc/dom.js`, `rbc/scope.js` | Helpers used by the matcher. `dom.js` imports `scope.js`, the wave-1 URL list used for link localisation. Wave 2 can replace `SCOPE` with the cohort's list. |
| `scope-classify.js` | Report-mode entry point: `classify(document, url, template)` returns block, prose and section items with source ids. Bundle it with `aem-import-bundle.sh --importjs scope-classify.js`. |
| `scope-classify.bundle.js` | The last bundle built (wave 1). |

## scope-only/: Track B (scoping without import)

| File | Role |
|---|---|
| `run-scope-only.mjs` | Renders each snapshot page with page scripts off and live stylesheets loaded. Stamps element positions, runs the classifier, crops variant screenshots and maps the default-scope instances (`scopeMap`). |
| `analyze.mjs` | Variant inventory, coverage, unknown mapping, templates (page type × page head, best reference by coverage), comparison with any migrated documents |
| `report.mjs`, `standalone.mjs`, `check-report.mjs` | Tabbed report → standalone HTML, PDF and zip; image and link check |
| `peek.mjs`, `peek-scope.mjs` | Quick terminal views of results |
| `patch-trace.py`, `patch-templates.py` | One-off patches already applied to the files above (history only) |

## scope/: review helpers

| File | Role |
|---|---|
| `contact-sheet.mjs`, `eds-sheet.mjs` | Screenshot sheets for the unknown review |
| `explain-variant.mjs` | Per-instance breakdown of one scope variant |
| `dom-outline.mjs` | Condensed markup around a text anchor |
| `probe-onload.mjs` | Runs the importer's page annotation on a live page, then inspects it |
| `validate-blocks.mjs`, `measure-unmapped.mjs` | Scope-vs-migration text measurement (Track A) |
| `write-scoping.mjs` | Writes the final decision for every unknown |
| `callout-img-audit.mjs` | Checks background-image banners against migrated documents (Track A) |

Dependencies: load Playwright and cheerio with `createRequire` from the plugin paths given in
`../rbc-wave2/HANDOFF.md` § 0. Never `npm i` into the repo.
