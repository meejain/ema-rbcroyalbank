#!/bin/bash
# Repo clean-up (user-approved 2026-10-07): keep the EDS boilerplate as originally committed, repo settings and
# Scoping-Stardust/; remove the RBC site build and all Stardust / scope working data. Never touches content/.
set -e
R=/backups/meejain/ema-rbcroyalbank/repo
cd $R
# 1. tracked files back to the original commit (boilerplate), incl. the 4 deleted Roboto fonts
git restore --source=HEAD --staged --worktree -- .gitignore .hlxignore .stylelintrc.json blocks/cards blocks/columns blocks/footer blocks/header blocks/hero scripts/scripts.js styles/fonts.css styles/styles.css fonts/roboto-bold.woff2 fonts/roboto-condensed-bold.woff2 fonts/roboto-medium.woff2 fonts/roboto-regular.woff2
# 2. untracked site build + working data
rm -rf stardust catalog tools migration-work data .impeccable
rm -rf blocks/accordion blocks/card-highlights blocks/earn-calculator blocks/search blocks/table blocks/toc
rm -f DESIGN.md DESIGN.json DESIGN-A.md DESIGN-A.json DESIGN-B.md DESIGN-B.json DESIGN-C.md DESIGN-C.json PRODUCT.md icons/rbc-logo-shield.svg
# untracked RBC fonts (the 4 tracked Roboto files stay)
for f in fonts/*; do git ls-files --error-unmatch "$f" >/dev/null 2>&1 || rm -rf "$f"; done
# 3. session logs in the handoff folder
rm -f Scoping-Stardust/rbc-wave2/*.log
echo done
