#!/bin/bash
# Copy everything the scoping handoff needs into Scoping-Stardust/ before the repo clean-up.
set -e
R=/backups/meejain/ema-rbcroyalbank/repo
S=$R/Scoping-Stardust
W1=$S/rbc-wave1; TK=$S/toolkit
mkdir -p $W1/default-scope $W1/stardust-scope $W1/pilot $TK/importer/parsers $TK/importer/rbc $TK/scope-only $TK/scope $S/rbc-wave2/inventory/sitemaps

# wave-1 baseline data (small JSON) + pilot deliverables
cp $R/stardust/qa/unknown-scoping.json $R/stardust/qa/scope-block-validation.json $R/stardust/qa/unknown-review.json $W1/stardust-scope/
cp $R/stardust/qa/block-gallery/gallery.json $R/stardust/qa/block-gallery/templates.json $W1/stardust-scope/
cp $R/stardust/state.json $W1/stardust-scope/stardust-state.json
cp $R/stardust/dynamic-features.md $W1/stardust-scope/ 2>/dev/null || true
cp $R/catalog/template-catalog.json $R/catalog/block-catalog.json $R/catalog/summary.json $W1/default-scope/
cp $R/catalog/urls-grouped.json $W1/default-scope/ 2>/dev/null || true
cp $R/stardust/qa/scope-only/summary.json $W1/pilot/scope-only-summary.json
cp $R/stardust/qa/scope-only/results.json $W1/pilot/scope-only-results.json
cp $R/stardust/qa/scope-only/scope-only.pdf $R/stardust/qa/scope-only/scope-only-standalone.zip $W1/pilot/

# toolkit: the component matcher (report mode) + scoping scripts
cp $R/tools/importer/parsers/rbc-live.js $TK/importer/parsers/
cp $R/tools/importer/rbc/dom.js $R/tools/importer/rbc/scope.js $TK/importer/rbc/
cp $R/tools/importer/scope-classify.js $TK/importer/
cp $R/tools/importer/scope-classify.bundle.js $TK/importer/ 2>/dev/null || true
cp $R/stardust/.work/scope-only/*.mjs $R/stardust/.work/scope-only/*.py $TK/scope-only/ 2>/dev/null || true
for f in contact-sheet.mjs eds-sheet.mjs explain-variant.mjs dom-outline.mjs probe-onload.mjs validate-blocks.mjs measure-unmapped.mjs write-scoping.mjs callout-img-audit.mjs; do cp $R/stardust/.work/scope/$f $TK/scope/ 2>/dev/null || true; done

# wave-2 discovery seeds (sitemap URL lists that lived in /tmp)
for f in /tmp/w2-rbc-n.txt /tmp/w2-rbcdirectinvesting.com.txt /tmp/w2-rbcbank.com.txt /tmp/w2-avionrewards.com.txt; do [ -f $f ] && cp $f $S/rbc-wave2/inventory/sitemaps/; done
echo "secured:"; du -sh $W1 $TK $S/rbc-wave2/inventory; find $W1 $TK -type f | wc -l
