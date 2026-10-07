# New-session prompt: RBC wave 2 scoping

Paste the block below as the first message of a new session.

```
We are continuing the RBC migration scoping (wave 2) in this repo. Work in scoping-only mode (Track B):
no content import, no site build, no commits/publishing/DA uploads unless I ask.

Read these first, in order, and follow them:
1. Scoping-Stardust/rbc-wave2/HANDOFF.md  – status, wave-1 baseline, exact next steps, ground rules
2. Scoping-Stardust/rbc-wave2/STRATEGY.md – the wave-2 plan (cohorts, phases, gates, dynamic features)
3. Scoping-Stardust/SCOPING-PLAYBOOK.md   – the method (Track B section)
4. Scoping-Stardust/toolkit/README.md     – the matcher + scripts saved from wave 1 (paths need re-pointing)

Wave-1 baseline (homepage + credit cards, 181 pages) is final and must stay the reference:
11 master blocks, 44 variants (41 built + 3 new: columns tip, columns cta, cards checklist),
9 templates, 58/58 unknowns resolved. Data is in Scoping-Stardust/rbc-wave1/.

Wave-2 scope (EN only), from my cohort sheet: Customer Service 1, Mortgages 149, Personal Loans 46,
Investments 36, Business + Commercial 252, Direct Investing 58 (include all /learn articles),
RBC Bank (rbcbank.com) 104, Avion Rewards (avionrewards.com) 31. Search results
(/search-public/, ~1,200 dynamic FAQs) are a dynamic feature, not pages.

Decisions already made: EN only; include all Direct Investing /learn articles; finish discovery before
scoping; reuse the wave-1 canon C for rbcroyalbank.com cohorts; run the Stardust uplift for Direct
Investing, RBC Bank and Avion Rewards (I pick the design variant at the gate).

Start with HANDOFF.md § 3 Step 1: finish the resumable discovery, run reconcile, and show me the
reconciliation table (Gate 0) before any scoping. Then run the default scope and the Stardust snapshot
in parallel, each cohort in its own folder under Scoping-Stardust/rbc-wave2/. Never run the catalog
setup at the repo root.

Main question to answer: how far the wave-1 blocks and variants carry across these cohorts. Give me a
reuse matrix (variant × cohort), the new variants needed, the templates, and every unknown decided.

Keep me posted with a short status every few minutes while long jobs run. Launch long jobs detached
(setsid nohup) and resumable, because my interruptions stop background processes.
```

## Notes

- HANDOFF.md § 0 holds the ground rules a new session most needs:
  - the catalog setup deletes any `catalog/` folder in its working directory;
  - background jobs die when the user interrupts a turn;
  - never `npm i` or `npx playwright install`;
  - inline shell commands with regex-like paths are blocked, so write scripts instead.
- The git trust fix is in place on this machine: the repo's real path is in the global git config's
  `safe.directory` list.
- The sitemap seed files the first discovery pass used are gone. Rebuild them with the site-scope sitemap
  fetch, or simply resume the rendered pass (`work/rendered-crawl.mjs`), which works from
  `inventory/<cohort>.json` alone.
