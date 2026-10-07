# Point HANDOFF.md at the post-clean-up locations (repo cleaned 2026-10-07: only the EDS boilerplate,
# repo settings and Scoping-Stardust/ remain).
f = '/backups/meejain/ema-rbcroyalbank/repo/Scoping-Stardust/rbc-wave2/HANDOFF.md'
s = open(f).read()

def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)

start = s.index('### 1e. Where the wave-1 artefacts live')
end = s.index('---\n\n## 2. Wave 2: status')
s = s[:start] + """### 1e. Where the wave-1 artefacts live (after the 2026-10-07 clean-up)

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

""" + s[end:]
rep("New variants, not built yet, defined in `stardust/qa/unknown-scoping.json` → `newVariants`:",
    "New variants, not built yet, defined in `Scoping-Stardust/rbc-wave1/stardust-scope/unknown-scoping.json` → `newVariants`:")
rep("- **Canon:** variant C (Home C Cinematic). Tokens in `styles/styles.css`, `DESIGN.md`, `stardust/canon/*`.",
    "- **Canon:** variant C (Home C Cinematic), the RBC brand-faithful canon. Its CSS and design files were deleted in the clean-up; the decision is recorded here. A wave-2 uplift that needs the canon as reference re-extracts it from the live site, or uses the wave-1 pilot PDF as the visual record.")
rep("- For the rbcroyalbank.com cohorts, **reuse canon C**; copy `stardust/canon/` for reference only.",
    "- For the rbcroyalbank.com cohorts, **reuse canon C** as the design decision. The canon files are no longer in the repo; see § 1d.")
rep("Generalise `stardust/.work/scope-only/run-scope-only.mjs`:", "Generalise `Scoping-Stardust/toolkit/scope-only/run-scope-only.mjs`:")
rep("3. Rebundle `tools/importer/scope-classify.js` after any matcher change.",
    "3. Rebundle `Scoping-Stardust/toolkit/importer/scope-classify.js` after any matcher change: `aem-import-bundle.sh --importjs <path>`. The matcher lives next to it in `toolkit/importer/parsers/rbc-live.js`.")
open(f, 'w').write(s)
print('ok')
