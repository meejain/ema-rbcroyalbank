<!-- stardust provenance: skill=stardust:dynamics · phase=triage (curated) · 2026-10-04 · input stardust/dynamics/dynamic-features.generated-plan.md (59 rows, 14 probed pages: home, 4 archetypes, 8 tools/unique, FR hub) + extract --dynamics reach (181 pages) -->
# Dynamic features — rbcroyalbank.com (homepage EN/FR + credit cards EN/FR, 181 pages)

Gate rule: every row has a disposition. Static first, then wire — every page works as a static page before any row replaces a degradation with live behaviour.

## Listings contract

**None index-backed.** Every card grid, carousel and related-article rail detected (rows L1–L8) is editorially curated on the source (fixed card order per page, authored in AEM). They ship **document-first**: the items are authored rows in the page document. No query index is required (`helix-query.yaml` is retired on this project; index config would live at tools.aem.live if a later phase needs one).

Per-page metadata every page emits (for a later index, at no extra cost): `title`, `description`, `template` (landing / program / listing / article / static / tool), `lang` (en / fr), `card-category` (program pages: travel / rewards / cash-back / low-interest / no-fee / student / business / us-dollar), `image`.

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | card-data | card catalogue data (fees, rates, offers, insurance, apply links) — `/credit-cards/_assets-custom/js/cardData/**.json`, `main-card-list.json`, `localization.json` | A | 174/181 | data-fed (static snapshot on the code bus, `data/cards/`) | self | in-progress | off-origin-data · snapshot | owner: confirm refresh cadence (snapshot is dated; re-run sync at each rate change) | 27 first-party GETs on the hub; 30 on the product page |
| 2 | compare-tray | "Compare" checkbox tray + compare modal (`compareToolModal_open`, `_compare_partial_card.html`) | M | 174/181 | rebuild-native (block `compare-tray`, reads `data/cards/`) | self | pending | modal-loader + client-compute | none | trigger on every card tile |
| 3 | compare-tool | Compare Credit Cards tool page (side-by-side table, card pickers) | F/X | 2/181 (EN+FR) | client-only (reads `data/cards/`) | self | pending | client-compute | none | /credit-cards/tools/compare-credit-cards.html |
| 4 | choose-a-card | Help Me Choose a Card questionnaire (filters by income tier, category, insurance) | F | 2/181 | client-only (filters `data/cards/*.filters`) | self | pending | client-compute | owner: confirm the filter mapping matches the live tool's ranking | /credit-cards/tools/choose-a-credit-card.html |
| 5 | rewards-calculator | Reward points calculator (`rewardsForm`, 8 range fields) | F | 2/181 | client-only | self | pending | client-compute | owner: sign off the earn formula (per-card earn rates from `data/cards/`) | /credit-cards/tools/credit-card-reward-points-calculator/ |
| 6 | cashback-calculator | Cash back calculator | F | 2/181 | client-only | self | pending | client-compute | owner: sign off the formula | /credit-cards/tools/credit-card-cashback-calculator/ |
| 7 | low-interest-calculator | Low-interest savings calculator (Angular, `ng-untouched`) | F/CR | 2/181 | client-only | self | pending | client-compute | owner: sign off the formula | /credit-cards/tools/low-interest-credit-card-savings-calculator-offer.html |
| 8 | earn-estimator | Product-page "Estimate your points" sliders (ion.rangeSlider) | F | 35/181 (program) | client-only (block `earn-calculator`); interim = captured default values, sliders disabled | self | interim | client-compute | owner: sign off the per-card formula | archetype `cc-program-avion` estimator |
| 9 | flight-tiers | Avion fixed-points flight tiers with departure-region / trip-type selectors | F | 6/181 (Avion family) | client-only; interim = captured default view (the archetype's dashed marker becomes a `data-dynamic` mount) | self | interim | client-compute | none | Avion product pages |
| 10 | annual-fee-comparison | Annual fee comparison table | F | 2/181 | static-snapshot (settled table authored as content) | self | pending | settled-dom-snapshot | unfreeze when card data sync runs | /credit-cards/annual-fee-comparison/ |
| 11 | legal-popups | Legal-note superscripts → in-page legal section; `data-popup-ordinal` / `data-popup-type` dialogs | M | 99/181 | rebuild-native (anchor to the authored legal section; no modal) | self | pending | modal-loader → anchor | none | legal disclaimers on every product/hub page |
| 12 | legal-disclaimers-ondemand | Hub legal disclaimers loaded on demand (the archetype's one `[data-placeholder]`) | CR | 32/181 (listing) | data-fed → authored at import (fetched from the live page's disclaimer include and authored as the page's legal section) | self | pending | settled-dom-snapshot | none | cc-listing-index placeholder |
| 13 | chrome-menus | header mega-menus, segment bar, mobile menu, footer accordions, OneTrust collapse | M | 181/181 | rebuild-native (header/footer blocks) | self | pending | chrome-interaction | none | rows 30–32, 36 |
| 14 | site-search | header + sidebar search (`/search-public/index.html`, `suggest.json`) | S/F | 181/181 | embed-passthrough (form posts to RBC's live search on rbcroyalbank.com / rbcbanqueroyale.com) | needs-business-decision | interim | search | owner: keep RBC search as the results surface, or build a site index search (only ~181 pages in scope) | rows 8, 9, 13, 37–39 |
| 15 | locale-trees | EN `/credit-cards/*` + FR `/fr/cartes/*`, homepage EN/FR; hreflang en-ca / fr-ca | I18N | 181/181 | rebuild-native (two content trees, per-language nav/footer, hreflang in metadata) | self | pending | locale-tree | decided by the user: EN + FR in scope; zh/other variants out | rows 14–21 |
| 16 | avion-booking-iframe | "Why book with us" iframe (runtime-injected src) | V | 6/181 | delivered-by-capture (content authored as a section; no iframe) | self | delivered-by-capture | embed-passthrough → content | none | archetype booking-tools section |
| 17 | other-runtime-iframes | other src-less iframes (tag/consent frames) | V | 181/181 | decided-out (tag frames, not content) | self | decided-out | — | covered by row 18 | row 50 |
| 18 | tags-consent | GTM, Google Analytics/Ads, retargeting pixel, session replay, VoC badge, Conductrics, OneTrust, digstream/ssgtm (RBC tag hosts), Cloudflare insights | T/A | 181/181 | embed-passthrough, **disabled** in `scripts/site-config.js` until the owner supplies property ids | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | owner: which tags run on the new host, property ids, OneTrust domain script | rows 1, 2, 4, 40–49 |
| 19 | personalised-offers | offer.rbc.com personalised offer call | A | 1/181 | decided-out on the static pages (authored default offer shown) | needs-backend | decided-out | — | owner: personalisation on the new host? | row 5 |
| 20 | money-matters-feed | WP JSON `rbc_my_money_matter` article feed | A | 1/181 | static-snapshot (captured article cards authored as rows) | self | pending | settled-dom-snapshot | unfreeze if the rail must auto-update | row 6 |
| 21 | apply-and-sign-in | Apply Now / Sign In / Activate → RBC secure application and online banking | X | 181/181 | embed-passthrough (links stay absolute to RBC's secure hosts; no form rebuilt) | self | done-by-link | — | none — regulated application flow stays on RBC infrastructure | row 51 |
| 22 | commerce-signals | "cart / prices" signals | X | — | decided-out (false positive: dollar amounts are card fees, no cart) | self | decided-out | — | none | rows 52–59 |
| 23 | data-layer | `dataLayer` / app-settings objects | A | 181/181 | decided-out with tags (row 18) | self | decided-out | read-settings | none | row 3 |

No submission form collects personal data on these 181 pages. Search is a GET to RBC's search; card applications deep-link to RBC's secure application. No form needs to be rebuilt, so no regulated-PII row exists.

## Decision batch (one message to the owner)

1. **Card data refresh**: who owns the card catalogue snapshot, and when is it refreshed? Interim: a dated snapshot of the live JSON on the code bus.
2. **Calculator formulas**: sign off the rewards, cash back, low-interest and product-page estimator formulas rebuilt from the per-card earn rates. Interim: product pages show the captured default values.
3. **Search**: keep RBC's live search as the results page (interim, shipping now), or build a site search?
4. **Tags & consent**: which analytics and marketing tags run on the new host, their property ids, and the OneTrust domain script. Interim: all tags off.
5. **Personalised offers** (offer.rbc.com): needed on the new host? Interim: the authored default offer.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| other-runtime-iframes | tag/consent frames, no content | returns with the tag decision (batch item 4) |
| personalised-offers | needs RBC's offer backend | default offer shown; personalisation is a later phase |
| commerce-signals | false positive | none |
| data-layer | belongs to tags | returns with the tag decision |
