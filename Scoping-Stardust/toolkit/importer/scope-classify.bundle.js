/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // tools/importer/scope-classify.js
  var scope_classify_exports = {};
  __export(scope_classify_exports, {
    default: () => scope_classify_default
  });

  // tools/importer/rbc/scope.js
  var SCOPE = /* @__PURE__ */ new Set([
    "/credit-cards/activate/index.html",
    "/credit-cards/all-credit-cards.html",
    "/credit-cards/annual-fee-comparison/index.html",
    "/credit-cards/award-winning-credit-cards.html",
    "/credit-cards/campaign/balanceprotector/index.html",
    "/credit-cards/cardholder-resources.html",
    "/credit-cards/cardholders.html",
    "/credit-cards/cardholders/add-user.html",
    "/credit-cards/cardholders/credit-card-glossary.html",
    "/credit-cards/cardholders/credit-card-transaction-help.html",
    "/credit-cards/cardholders/documentation.html",
    "/credit-cards/cardholders/estatements-frequently-asked-questions.html",
    "/credit-cards/cardholders/estatements.html",
    "/credit-cards/cardholders/frequently-asked-questions/credit-limit-and-fees.html",
    "/credit-cards/cardholders/frequently-asked-questions/features-and-benefits.html",
    "/credit-cards/cardholders/frequently-asked-questions/general-questions.html",
    "/credit-cards/cardholders/frequently-asked-questions/payments.html",
    "/credit-cards/cardholders/frequently-asked-questions/protecting-my-card.html",
    "/credit-cards/cardholders/how-to-protect-from-credit-card-fraud.html",
    "/credit-cards/cardholders/how-to-reduce-credit-card-interest.html",
    "/credit-cards/cardholders/instant-use-with-apple-pay.html",
    "/credit-cards/cardholders/lost-or-stolen-credit-card.html",
    "/credit-cards/cardholders/manage-your-accounts-online.html",
    "/credit-cards/cardholders/moi-information-sharing.html",
    "/credit-cards/cardholders/optional-add-on-services.html",
    "/credit-cards/cardholders/optional-add-on-services/balance-protector-credit-card-insurance.html",
    "/credit-cards/cardholders/optional-add-on-services/identity-credit-theft-protection.html",
    "/credit-cards/cardholders/optional-add-on-services/rbc-additional-travel-insurance.html",
    "/credit-cards/cardholders/optional-add-on-services/rbc-road-assist.html",
    "/credit-cards/cardholders/pay-your-credit-card-bill.html",
    "/credit-cards/cardholders/protection.html",
    "/credit-cards/cardholders/read-your-credit-card-statement.html",
    "/credit-cards/cardholders/westjet-information-sharing.html",
    "/credit-cards/cardholders/westjet-rewards-program-updates.html",
    "/credit-cards/cash-back.html",
    "/credit-cards/cash-back/rbc-cashback-mastercard.html",
    "/credit-cards/cash-back/rbc-preferred-world-elite-mastercard.html",
    "/credit-cards/credit-card-information-and-questions/card-benefits.html",
    "/credit-cards/credit-card-information-and-questions/how-to-use-credit-cards-to-improve-credit-score.html",
    "/credit-cards/credit-card-information-and-questions/manage-finances.html",
    "/credit-cards/credit-card-information-and-questions/managing-my-credit.html",
    "/credit-cards/index.html",
    "/credit-cards/low-interest.html",
    "/credit-cards/low-interest/rbc-visa-classic-low-rate.html",
    "/credit-cards/mastercard.html",
    "/credit-cards/no-fee.html",
    "/credit-cards/no-fee/rbc-visa-platinum.html",
    "/credit-cards/product-advice.html",
    "/credit-cards/product-advice/a-students-guide-to-choosing-the-right-credit-card.html",
    "/credit-cards/product-advice/credit-card-safety-travel-checklist.html",
    "/credit-cards/product-advice/file-credit-card-travel-insurance-claim.html",
    "/credit-cards/product-advice/how-credit-cards-protect-fans-from-ticket-scams.html",
    "/credit-cards/product-advice/how-do-cashback-credit-cards-work.html",
    "/credit-cards/product-advice/how-do-travel-credit-cards-work.html",
    "/credit-cards/product-advice/how-to-apply-for-a-credit-card.html",
    "/credit-cards/product-advice/how-to-choose-best-no-annual-fee-credit-card.html",
    "/credit-cards/product-advice/is-a-low-interest-rate-credit-card-right-for-you/index.html",
    "/credit-cards/product-advice/maximize-international-sports-travel-credit-card-points.html",
    "/credit-cards/product-advice/maximize-travel-credit-card-benefits.html",
    "/credit-cards/product-advice/safe-ways-to-buy-international-event-tickets-online.html",
    "/credit-cards/product-advice/using-credit-cards-abroad.html",
    "/credit-cards/product-advice/what-is-a-cash-advance.html",
    "/credit-cards/product-advice/what-is-a-credit-card.html",
    "/credit-cards/rewards.html",
    "/credit-cards/rewards/moi-rbc-visa.html",
    "/credit-cards/rewards/more-rewards-rbc-visa-infinite.html",
    "/credit-cards/rewards/more-rewards-rbc-visa.html",
    "/credit-cards/rewards/rbc-ion-plus-visa.html",
    "/credit-cards/rewards/rbc-ion-visa.html",
    "/credit-cards/services/chip-and-pin-technology.html",
    "/credit-cards/services/contactless-payments.html",
    "/credit-cards/services/visa-checkout.html",
    "/credit-cards/student.html",
    "/credit-cards/tools/choose-a-credit-card.html",
    "/credit-cards/tools/compare-credit-cards.html",
    "/credit-cards/tools/credit-card-cashback-calculator/",
    "/credit-cards/tools/credit-card-reward-points-calculator/index.html",
    "/credit-cards/tools/low-interest-credit-card-savings-calculator-offer.html",
    "/credit-cards/travel.html",
    "/credit-cards/travel/avion-rbc-credit-cards.html",
    "/credit-cards/travel/rbc-avion-visa-infinite-privilege.html",
    "/credit-cards/travel/rbc-avion-visa-infinite.html",
    "/credit-cards/travel/rbc-british-airways-visa-infinite.html",
    "/credit-cards/travel/rbc-us-dollar-visa-gold.html",
    "/credit-cards/travel/rbc-visa-platinum-avion.html",
    "/credit-cards/travel/westjet-rbc-credit-cards.html",
    "/credit-cards/travel/westjet-rbc-mastercard.html",
    "/credit-cards/travel/westjet-rbc-world-elite-mastercard.html",
    "/credit-cards/visa.html",
    "/fr/cartes/activate/index.html",
    "/fr/cartes/aucuns-frais/visa-platine-rbc.html",
    "/fr/cartes/campaign/protectionsolde/index.html",
    "/fr/cartes/carte-credit-information-et-questions/avantages-carte.html",
    "/fr/cartes/carte-credit-information-et-questions/gerer-finances.html",
    "/fr/cartes/carte-credit-information-et-questions/gerer-mon-credit.html",
    "/fr/cartes/carte-credit-information-et-questions/utilisation-de-carte-de-credit-pour-ameliorer-la-cote-de-solvabilite.html",
    "/fr/cartes/cartes-de-credit-primees.html",
    "/fr/cartes/comparer-les-frais-annuels/index.html",
    "/fr/cartes/conseil-sur-le-produit.html",
    "/fr/cartes/conseils-sur-les-produits/choisir-la-carte-de-credit-sans-frais-annuels-qui-vous-convient-le-mieux.html",
    "/fr/cartes/conseils-sur-les-produits/comment-une-carte-de-credit-protege-les-fans-contre-une-escroquerie-aux-billets.html",
    "/fr/cartes/conseils-sur-les-produits/demande-reglement-assurance-voyage-carte-de-credit.html",
    "/fr/cartes/conseils-sur-les-produits/est-ce-quune-carte-de-credit-a-taux-reduit-correspond-a-vos-besoins/index.html",
    "/fr/cartes/conseils-sur-les-produits/fonctionnement-des-cartes-de-credit-avec-remise-en-argent.html",
    "/fr/cartes/conseils-sur-les-produits/fonctionnement-des-cartes-de-credit-de-voyage.html",
    "/fr/cartes/conseils-sur-les-produits/guide-de-letudiant-pour-choisir-la-bonne-carte-de-credit.html",
    "/fr/cartes/conseils-sur-les-produits/liste-de-controle-de-securite-des-cartes-de-credit-en-voyage.html",
    "/fr/cartes/conseils-sur-les-produits/moyens-surs-dacheter-des-billets-en-ligne-pour-evenements-internationaux.html",
    "/fr/cartes/conseils-sur-les-produits/optimisation-avantages-cartes-de-credit-voyage.html",
    "/fr/cartes/conseils-sur-les-produits/optimisez-les-points-de-carte-de-credit-voyages-sportifs-internationaux.html",
    "/fr/cartes/conseils-sur-les-produits/presenter-une-demande-de-carte-de-credit.html",
    "/fr/cartes/conseils-sur-les-produits/quest-ce-quune-avance-de-fonds.html",
    "/fr/cartes/conseils-sur-les-produits/quest-ce-quune-carte-de-credit.html",
    "/fr/cartes/conseils-sur-les-produits/utilisation-cartes-de-credit-etranger.html",
    "/fr/cartes/etudiant.html",
    "/fr/cartes/index.html",
    "/fr/cartes/mastercard.html",
    "/fr/cartes/outils/calculatrice-de-remise-en-argent/",
    "/fr/cartes/outils/calculatrice-deconomies-sur-carte-de-credit-a-interet-reduit-offre.html",
    "/fr/cartes/outils/calculatrice-des-recompenses-sur-cartes-de-credit/index.html",
    "/fr/cartes/outils/choisir-carte-credit.html",
    "/fr/cartes/outils/comparer-cartes-credit.html",
    "/fr/cartes/recompenses.html",
    "/fr/cartes/recompenses/moi-rbc-visa.html",
    "/fr/cartes/recompenses/more-rewards-rbc-visa-infinite.html",
    "/fr/cartes/recompenses/more-rewards-rbc-visa.html",
    "/fr/cartes/recompenses/visa-rbc-ion-plus.html",
    "/fr/cartes/recompenses/visa-rbc-ion.html",
    "/fr/cartes/remise-en-argent.html",
    "/fr/cartes/remise-en-argent/remise-en-argent-mastercard-rbc.html",
    "/fr/cartes/remise-en-argent/remise-en-argent-preference-world-elite-mastercard.html",
    "/fr/cartes/ressources-pour-les-titulaires.html",
    "/fr/cartes/sans-frais.html",
    "/fr/cartes/services/paiement-sans-contact.html",
    "/fr/cartes/services/technologie-puce-nip.html",
    "/fr/cartes/services/visa-checkout.html",
    "/fr/cartes/taux-reduit.html",
    "/fr/cartes/taux-reduit/visa-classique-rbc-taux-reduit.html",
    "/fr/cartes/titulaires.html",
    "/fr/cartes/titulaires/aide-sur-les-operations-par-carte-de-credit.html",
    "/fr/cartes/titulaires/ajouter-utilisateur.html",
    "/fr/cartes/titulaires/carte-perdue-ou-volee.html",
    "/fr/cartes/titulaires/documentation.html",
    "/fr/cartes/titulaires/faq/caracteristiques-et-garanties.html",
    "/fr/cartes/titulaires/faq/limite-de-credit-et-frais.html",
    "/fr/cartes/titulaires/faq/paiements.html",
    "/fr/cartes/titulaires/faq/protection-de-ma-carte.html",
    "/fr/cartes/titulaires/faq/questions-general.html",
    "/fr/cartes/titulaires/gerer-vos-comptes-en-ligne.html",
    "/fr/cartes/titulaires/glossaire-carte-credit.html",
    "/fr/cartes/titulaires/lire-votre-releve-de-carte-de-credit.html",
    "/fr/cartes/titulaires/mises-a-jour-du-programme-de-recompenses-westjet.html",
    "/fr/cartes/titulaires/partage-informations-moi.html",
    "/fr/cartes/titulaires/partage-informations-westjet.html",
    "/fr/cartes/titulaires/protection.html",
    "/fr/cartes/titulaires/proteger-contre-fraude-sur-carte-credit.html",
    "/fr/cartes/titulaires/reduire-interets-carte-credit.html",
    "/fr/cartes/titulaires/regler-votre-facture-de-carte-de-credit.html",
    "/fr/cartes/titulaires/releve-electronique-faq.html",
    "/fr/cartes/titulaires/releve-electronique.html",
    "/fr/cartes/titulaires/services-complementaires-facultatifs.html",
    "/fr/cartes/titulaires/services-complementaires-facultatifs/assistance-routiere-rbc.html",
    "/fr/cartes/titulaires/services-complementaires-facultatifs/assurance-protection-solde-carte-de-credit.html",
    "/fr/cartes/titulaires/services-complementaires-facultatifs/assurance-voyage-facultative-rbc.html",
    "/fr/cartes/titulaires/services-complementaires-facultatifs/usurpation-identite-et-surveillance-du-credit.html",
    "/fr/cartes/titulaires/utilisation-instantanee-avec-apple-pay.html",
    "/fr/cartes/toutes-cartes.html",
    "/fr/cartes/visa.html",
    "/fr/cartes/voyages.html",
    "/fr/cartes/voyages/avion-visa-infinite-privilege-rbc.html",
    "/fr/cartes/voyages/avion-visa-infinite-rbc.html",
    "/fr/cartes/voyages/cartes-de-credit-avion-rbc.html",
    "/fr/cartes/voyages/cartes-de-credit-westjet-rbc.html",
    "/fr/cartes/voyages/rbc-recompenses-privilege.html",
    "/fr/cartes/voyages/visa-infinite-british-airways-rbc.html",
    "/fr/cartes/voyages/visa-or-en-dollars-us-rbc.html",
    "/fr/cartes/voyages/visa-platine-voyage-rbc.html",
    "/fr/cartes/voyages/westjet-mastercard-rbc.html",
    "/fr/cartes/voyages/westjet-world-elite-mastercard-rbc.html",
    "/fr/personal.html",
    "/personal.html"
  ]);

  // tools/importer/rbc/dom.js
  function deliveredPath(pathname) {
    if (pathname === "/personal.html" || pathname === "/") return "/";
    if (pathname === "/fr/personal.html" || pathname === "/fr/") return "/fr/";
    if (pathname.endsWith("/index.html")) return pathname.slice(0, -"index.html".length);
    if (pathname.endsWith("/")) return pathname;
    return pathname.replace(/\.html?$/, "");
  }
  function localizeLinks(root) {
    root.querySelectorAll("a[href]").forEach((a) => {
      let u;
      try {
        u = new URL(a.getAttribute("href"));
      } catch (e) {
        return;
      }
      if (!/^(www\.)?rbcroyalbank\.com$/.test(u.hostname)) return;
      const p = decodeURIComponent(u.pathname);
      const hit = SCOPE.has(p) ? p : SCOPE.has(`${p}index.html`) ? `${p}index.html` : null;
      if (!hit) return;
      a.setAttribute("href", `${deliveredPath(hit)}${u.search}${u.hash}`);
    });
  }
  function block(document, name, cells) {
    return WebImporter.Blocks.createBlock(document, { name, cells });
  }
  function sectionMeta(document, style) {
    return block(document, "Section Metadata", { style });
  }
  function el(document, tag, children = [], attrs = {}) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v !== void 0 && v !== null) e.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c === null || c === void 0) return;
      e.append(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return e;
  }
  var txt = (n) => n ? n.textContent.replace(/\s+/g, " ").trim() : "";
  function abs(href, base) {
    if (!href) return href;
    if (/^(mailto:|tel:|#|javascript:)/i.test(href)) return href;
    try {
      return new URL(href, base).href;
    } catch (e) {
      return href;
    }
  }
  function img(document, src, alt, base) {
    const i = document.createElement("img");
    i.setAttribute("src", src && src.startsWith("/") && !src.startsWith("//") && /\/stardust\//.test(src) ? src : abs(src, base));
    i.alt = alt || "";
    return i;
  }
  function cta(document, a, kind, base) {
    const link = el(document, "a", [txt(a)], { href: abs(a.getAttribute("href"), base) });
    if (kind === "primary") return el(document, "p", [el(document, "strong", [link])]);
    if (kind === "secondary") return el(document, "p", [el(document, "em", [link])]);
    return el(document, "p", [link]);
  }
  var hr = (document) => document.createElement("hr");
  function inline(document, src, tag, base, opts = {}) {
    const out = document.createElement(tag);
    const walk2 = (node, parent) => {
      node.childNodes.forEach((c) => {
        if (c.nodeType === 3) {
          parent.append(document.createTextNode(c.textContent.replace(/\s+/g, " ")));
          return;
        }
        if (c.nodeType !== 1) return;
        const t = c.tagName.toLowerCase();
        if (c.matches(".offscreen, .sr-only, .visually-hidden, .hide, .display-none, [data-imp-hidden], .irs, script, style, svg, button.collapse-toggle .icon")) return;
        if (t === "a") {
          const href = c.getAttribute("href");
          if (!href || /^javascript:/i.test(href) || href === "#" && !txt(c)) {
            walk2(c, parent);
            return;
          }
          const target = href === "#" ? `${String(base).split("#")[0]}#legal` : abs(href, base);
          const a = el(document, "a", [], { href: target });
          walk2(c, a);
          if (txt(a)) parent.append(a);
          return;
        }
        if (t === "strong" || t === "b") {
          const s = document.createElement("strong");
          walk2(c, s);
          if (txt(s)) parent.append(s);
          return;
        }
        if ((t === "em" || t === "i") && !opts.noEm) {
          const s = document.createElement("em");
          walk2(c, s);
          if (txt(s)) parent.append(s);
          return;
        }
        if (t === "br") {
          parent.append(document.createElement("br"));
          return;
        }
        if (t === "img") return;
        walk2(c, parent);
      });
    };
    walk2(src, out);
    while (out.firstChild && out.firstChild.nodeType === 3 && !out.firstChild.textContent.trim()) out.firstChild.remove();
    while (out.lastChild && out.lastChild.nodeType === 3 && !out.lastChild.textContent.trim()) out.lastChild.remove();
    if (out.firstChild && out.firstChild.nodeType === 3) out.firstChild.textContent = out.firstChild.textContent.replace(/^\s+/, "");
    if (out.lastChild && out.lastChild.nodeType === 3) out.lastChild.textContent = out.lastChild.textContent.replace(/\s+$/, "");
    out.querySelectorAll("br + br").forEach((b) => b.remove());
    return out;
  }
  var NO_UNDERLINE = /^(faq|faqs|frequently asked|questions fréquentes|foire aux questions|tools|outils|read this next|related|lisez|à lire|tl;?dr|tlpl|introduction|key takeaways|points clés|principaux points|bottom line|conclusion|share|partager)/i;
  var KEY_NOUNS = [
    "credit cards",
    "credit card",
    "cartes de cr\xE9dit",
    "carte de cr\xE9dit",
    "cash back",
    "remise en argent",
    "remises en argent",
    "Avion points",
    "points Avion",
    "Avion Points",
    "Avion",
    "WestJet points",
    "points WestJet",
    "Avios",
    "Moi points",
    "points Moi",
    "points",
    "rewards",
    "r\xE9compenses",
    "travel",
    "voyage",
    "voyages",
    "benefits",
    "avantages",
    "insurance",
    "assurance",
    "offers",
    "offres",
    "interest",
    "int\xE9r\xEAt",
    "fees",
    "frais",
    "security",
    "s\xE9curit\xE9",
    "fraud",
    "fraude",
    "app",
    "application",
    "card",
    "carte",
    "help",
    "aide",
    "statement",
    "relev\xE9",
    "questions",
    "savings",
    "\xE9conomies",
    "flights",
    "vols",
    "students",
    "\xE9tudiants",
    "Visa",
    "Mastercard"
  ];
  function keyNoun(document, h, explicit) {
    if (!h || h.querySelector("em")) return h;
    const t = txt(h);
    if (!t || NO_UNDERLINE.test(t)) return h;
    const pick = explicit || KEY_NOUNS.find((k) => t.toLowerCase().includes(k.toLowerCase()));
    if (!pick) return h;
    const walker = document.createTreeWalker(h, 4);
    let node;
    let hit = null;
    while (node = walker.nextNode()) {
      const i2 = node.textContent.toLowerCase().lastIndexOf(pick.toLowerCase());
      if (i2 >= 0) hit = { node, i: i2 };
    }
    if (!hit) return h;
    const { node: n, i } = hit;
    const after = n.splitText(i);
    after.splitText(pick.length);
    const em = document.createElement("em");
    after.replaceWith(em);
    em.append(after);
    return h;
  }
  function chromePaths(url) {
    const p = new URL(url).pathname;
    const fr = p.startsWith("/fr/");
    const cc = /^\/(fr\/)?(credit-cards|cartes)\//.test(p);
    const base = `${fr ? "/fr" : ""}${cc ? fr ? "/cartes" : "/credit-cards" : ""}`;
    return { nav: `${base}/nav`, footer: `${base}/footer`, lang: fr ? "fr" : "en" };
  }
  function metadataBlock(document, { title, description, template, url, image }) {
    const { nav, footer } = chromePaths(url);
    const cells = { Title: title, Description: description || "", Template: template };
    if (nav !== "/nav") cells.nav = nav;
    if (footer !== "/footer") cells.footer = footer;
    if (image) cells.Image = image;
    return block(document, "Metadata", cells);
  }

  // tools/importer/parsers/rbc-live.js
  var ALLOWED_HIDDEN = ".collapse-content, .accordion-panel, .tab-pane, [role=tabpanel], .tabs-content, .legalcontent, section.disclaimer, .carousel-item:not(.slick-cloned), .slick-slide:not(.slick-cloned), .hero-slide, .card-accordion, .cc-sd";
  var SKIP = [
    "script",
    "style",
    "noscript",
    "template",
    "svg",
    "iframe",
    "form",
    "button",
    "input",
    "select",
    "label",
    "nav",
    "#sticky-wrapper",
    ".sticky-wrapper",
    ".breadcrumb-wpr",
    ".compare-tray",
    "#compare-tray",
    "[id*=compare-tray]",
    ".compare-card-button",
    ".modal",
    "[role=dialog]",
    ".slick-cloned",
    ".offscreen",
    ".sr-only",
    ".visually-hidden",
    ".carousel-indicators",
    ".carousel-ctrl",
    ".slick-dots",
    ".slick-arrow",
    ".hero-previews-container",
    ".hero-mobile-controls",
    ".hero-a11y-pause-toggle",
    ".card-legal-collapse",
    ".custom-side-nav.mobile-only",
    ".cards-showing-container",
    ".card-filters",
    ".drawer-content-container",
    "[data-imp-hidden]",
    ".socials-block .social-links img",
    ".irs",
    ".irs-grid",
    "input[type=range]",
    ".tab-nav",
    ".tablesaw-bar",
    ".tablesaw-advance",
    ".tablesaw-nav-btn",
    "caption",
    // client-side widgets (listing toolbar, article category filter, compare toggles): no static content
    ".app-toolbar",
    '#categories-filter:not(:has(a[href]:not([href^="javascript:"])))',
    ".filter-container",
    'a[href^="javascript:"]',
    "div:has(> ul.cc-sd-letters)",
    ".card-image-decoration-container"
  ].join(",");
  function annotate(document) {
    return __async(this, null, function* () {
      const win = document.defaultView || window;
      const main = document.querySelector("main") || document.body;
      main.querySelectorAll("img[data-src]").forEach((i) => {
        if (!i.getAttribute("src") || /data:|blank|spacer/.test(i.getAttribute("src"))) i.setAttribute("src", i.getAttribute("data-src"));
      });
      main.querySelectorAll("*").forEach((n) => {
        const cs = win.getComputedStyle(n);
        if ((cs.display === "none" || cs.visibility === "hidden") && !n.closest(ALLOWED_HIDDEN)) n.setAttribute("data-imp-hidden", "1");
        if (cs.backgroundImage && cs.backgroundImage.startsWith("url(") && !n.closest("[data-imp-hidden]")) {
          const m = cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
          if (m && !/gradient|\.svg/.test(m[1])) n.setAttribute("data-imp-bg", m[1]);
        }
        if (n.tagName === "IMG" && n.naturalWidth) n.setAttribute("data-imp-w", String(n.naturalWidth));
      });
      const probe = (u) => __async(this, null, function* () {
        try {
          const r = yield fetch(u, { method: "HEAD" });
          return r.ok;
        } catch (e) {
          return true;
        }
      });
      const imgs = [...main.querySelectorAll("img[src]")].filter((i) => !i.closest("[data-imp-hidden]"));
      yield Promise.all(imgs.map((i) => __async(this, null, function* () {
        if (!(yield probe(i.src))) i.setAttribute("data-imp-hidden", "1");
      })));
      const bgs = [...main.querySelectorAll("[data-imp-bg]")];
      yield Promise.all(bgs.map((n) => __async(this, null, function* () {
        const u = new URL(n.getAttribute("data-imp-bg"), document.baseURI).href;
        if (!(yield probe(u))) {
          n.removeAttribute("data-imp-bg");
          const slide = n.closest(".hero-slide");
          if (slide) slide.setAttribute("data-imp-badbg", "1");
        }
      })));
      main.querySelectorAll(":scope > section, :scope > div > section").forEach((s) => {
        const probe2 = [s, ...s.querySelectorAll(":scope > div")].find((x) => {
          const c = win.getComputedStyle(x).backgroundColor;
          return c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c);
        });
        if (!probe2) return;
        const m = win.getComputedStyle(probe2).backgroundColor.match(/\d+(\.\d+)?/g);
        if (!m) return;
        const [r, g, b] = m.map(Number);
        if ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.35) s.setAttribute("data-imp-dark", "1");
      });
    });
  }
  var isHeading = (n) => n && /^H[1-6]$/.test(n.tagName);
  var words = (s) => (s || "").split(/\s+/).filter(Boolean).length;
  var visible = (n) => n && n.nodeType === 1 && !n.matches(SKIP) && !n.closest("[data-imp-hidden]");
  var kids = (n) => [...n.children].filter(visible);
  var traceFrom = (n, out, from) => {
    for (let i = from; i < out.length; i += 1) if (out[i] && !out[i].__src) out[i].__src = n;
  };
  var isBtn = (a) => a && a.matches("a.btn, a.button, a[class*=btn-], a.apply-now-container");
  var btnKind = (a) => a.matches(".primary, .btn-primary, .apply-now-container, [id*=apply]") ? "primary" : "secondary";
  function imageOf(document, n, base) {
    const i = n.matches("img") ? n : n.querySelector("img");
    if (!i || !i.getAttribute("src")) return null;
    const src = i.getAttribute("src");
    if (/ui-chevron|breadcrumb-chevron|icon-close|spacer|pixel|\.gif$/i.test(src)) return null;
    const out = img(document, src, i.getAttribute("alt"), base);
    if (i.getAttribute("data-imp-w")) out.setAttribute("data-imp-w", i.getAttribute("data-imp-w"));
    return out;
  }
  function headingOut(document, n, base, level) {
    const tag = level || n.tagName.toLowerCase();
    const h = inline(document, n, tag, base);
    return txt(h) ? h : null;
  }
  function paraOut(document, n, base) {
    const links = [...n.querySelectorAll("a")].filter(visible);
    if (links.length === 1 && isBtn(links[0]) && txt(n) === txt(links[0])) return cta(document, links[0], btnKind(links[0]), base);
    const p = inline(document, n, "p", base);
    return txt(p) ? p : null;
  }
  function listOut(document, n, base) {
    const l = el(document, n.tagName.toLowerCase());
    kids(n).filter((li) => li.matches("li")).forEach((li) => {
      const x = inline(document, li, "li", base);
      if (txt(x)) l.append(x);
    });
    return l.children.length ? l : null;
  }
  function tableOut(document, t, base) {
    const rows = [...t.querySelectorAll("tr")].filter((tr) => !tr.closest("[data-imp-hidden]")).map((tr) => [...tr.children].map((c) => {
      const p = inline(document, c, "p", base);
      return txt(p) ? p : "";
    }));
    if (!rows.length) return null;
    const width = Math.max(...rows.map((r) => r.length));
    rows.forEach((r) => {
      while (r.length < width) r.push("");
    });
    return block(document, "Table", rows);
  }
  function unitNodes(document, n, base, ctx = {}) {
    const out = [];
    const visit = (node) => {
      if (!visible(node)) return;
      if (node.matches("img")) {
        const i = imageOf(document, node, base);
        if (i) out.push(i);
        return;
      }
      if (isHeading(node)) {
        const h = headingOut(document, node, base, ctx.keepLevel ? null : ctx.headLevel || "h3");
        if (h) out.push(h);
        return;
      }
      if (node.matches("p")) {
        node.querySelectorAll("img").forEach((i) => {
          if (visible(i)) {
            const x = imageOf(document, i, base);
            if (x) out.push(x);
          }
        });
        const p = paraOut(document, node, base);
        if (p) out.push(p);
        return;
      }
      if (node.matches("ul, ol")) {
        if (node.querySelector("li img") && !node.querySelector("li p")) {
          kids(node).forEach(visit);
          return;
        }
        const l = listOut(document, node, base);
        if (l) out.push(l);
        return;
      }
      if (node.matches("table")) {
        const t = tableOut(document, node, base);
        if (t) out.push(t);
        return;
      }
      if (node.matches("a[href]") && node.querySelector("h1, h2, h3, h4, h5")) {
        const start = out.length;
        kids(node).forEach(visit);
        const h = out.slice(start).find(isHeading);
        if (h) {
          const a = el(document, "a", [...h.childNodes], { href: abs(node.getAttribute("href"), base) });
          h.replaceChildren(a);
        }
        return;
      }
      if (node.matches("a")) {
        const i = node.querySelector("img");
        if (i && visible(i)) {
          const x = imageOf(document, i, base);
          if (x) out.push(x);
        }
        if (txt(node)) out.push(isBtn(node) ? cta(document, node, btnKind(node), base) : cta(document, node, "link", base));
        return;
      }
      if (node.matches(".card-details-rate-container, #overview-details, .rates-container")) {
        const r = ratesOut(document, node, base);
        if (r) out.push(r);
        return;
      }
      if (node.matches(".accordion-panel")) {
        const t = node.querySelector(".collapse-toggle, button");
        if (t && txt(t)) out.push(el(document, "h4", [txt(t)]));
        const c = node.querySelector(".collapse-content");
        if (c) kids(c).forEach(visit);
        return;
      }
      const k = kids(node);
      if (!k.length) {
        const bg = node.getAttribute("data-imp-bg");
        if (bg) out.push(img(document, bg, "", base));
        const t = txt(node);
        if (t && !node.matches("span.tel-no, sup")) out.push(inline(document, node, "p", base));
        return;
      }
      const hasText = [...node.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      if (hasText && !node.querySelector("p, h1, h2, h3, h4, h5, ul, ol, div, img, table")) {
        const p = inline(document, node, "p", base);
        if (txt(p)) out.push(p);
        return;
      }
      k.forEach(visit);
    };
    visit(n);
    return out;
  }
  function ratesOut(document, n, base) {
    const rows = [...n.querySelectorAll(".split-horizontal-flex, .card-details-rate-item-container, .rate-item")].filter(visible);
    if (rows.length < 2) return null;
    const ul = el(document, "ul");
    rows.forEach((r) => {
      const label = r.querySelector(".card-details-rate-item-label") || [...r.children].find((c) => !c.matches(".card-detail-value") && !c.querySelector(".card-detail-value"));
      const value = r.querySelector(".card-details-rate-item-value") || [...r.querySelectorAll(".card-detail-value")].find((v2) => !v2.matches(".hide")) || r.lastElementChild;
      if (!label || !value) return;
      const v = inline(document, value, "span", base);
      ul.append(el(document, "li", [el(document, "strong", [txt(label)]), " ", ...v.childNodes]));
    });
    return ul.children.length > 1 ? ul : null;
  }
  var sig = (n) => `${n.tagName}.${(n.className && typeof n.className === "string" ? n.className : "").split(/\s+/).filter((c) => c && !/^(mar|pad|mob|tab|w|h|eh|text|centered|flex|active|ga|col-\d|clearfix|slick)/.test(c)).sort()[0] || ""}`;
  var unitLike = (n) => !!(n.querySelector("img, h2, h3, h4, h5") || words(txt(n)) >= 8 || n.matches("a"));
  function repeatGroup(n) {
    if (n.matches("ul, ol") && !n.querySelector(":scope > li img, :scope > li h3, :scope > li h4, :scope > li a.category-button-container")) return null;
    if (n.matches(".accordion, table, p, h1, h2, h3, h4, .tabs, .tab-content")) return null;
    let k = kids(n);
    const track = n.matches(".slick-track") ? n : null;
    if (track) k = k.filter((c) => !c.matches(".slick-cloned"));
    if (k.length < 2) return null;
    if (n.matches(".grid-wpr")) {
      const members = k.filter((c) => /(^| )grid-/.test(c.className));
      if (members.length >= 2) return { members, rest: k.filter((c) => !members.includes(c)), grid: true };
    }
    const groups = {};
    k.forEach((c) => {
      const s = sig(c);
      (groups[s] = groups[s] || []).push(c);
    });
    const [best] = Object.values(groups).filter((g) => g.every(unitLike)).sort((a, b) => b.length - a.length);
    if (!best || best.length < 2) return null;
    const subSection = (c) => [...c.querySelectorAll("h2")].some((h) => !h.closest("a[href]"));
    if (best.every(subSection) || best.some((c) => c.matches("section, .custom-side-nav-item, .tab-pane"))) return null;
    if (best.some((c) => c.querySelector("table, .accordion, .accordion-panel, .tab-pane"))) return null;
    if (best.every((c) => c.matches("p, li") && !c.querySelector("img"))) return null;
    if (best.length / k.length < 0.5 && best.length < 3) return null;
    return { members: best, rest: k.filter((c) => !best.includes(c)), grid: false };
  }
  function cardsVariant(units, ctx) {
    const all = (f) => units.every(f);
    const some = (f) => units.some(f);
    const imgs = (u) => u.filter((x) => x.tagName === "IMG");
    const heads = (u) => u.filter(isHeading);
    const ps = (u) => u.filter((x) => x.tagName === "P");
    const rates = (u) => u.some((x) => x.tagName === "UL" && [...x.children].length > 1 && [...x.children].every((li) => li.firstElementChild && li.firstElementChild.tagName === "STRONG"));
    const small = (i) => /\.svg(\?|$)/i.test(i.getAttribute("src")) || /icon|pictogram/i.test(i.getAttribute("src")) || Number(i.getAttribute("data-imp-w") || 999) <= 120;
    const isCardImg = (i) => /cardData|\/credit-cards\/canada\/|card-art|-card\.|visa|mastercard/i.test(i.getAttribute("src"));
    if (all((u) => !heads(u).length && !ps(u).filter((p) => txt(p)).length && imgs(u).length)) return "awards";
    if (ctx.category) return "links";
    if (ctx.articleGrid) return "articles";
    if (some(rates) && some((u) => imgs(u).some(isCardImg))) return some((u) => u.some((x) => x.tagName === "P" && x.querySelector("strong > a"))) ? "offers" : "compare";
    if (all((u) => /^[\d.,]+\s?(x|%|k)?$/i.test(txt(ps(u)[0] || heads(u)[0])) && words(txt(ps(u)[0] || heads(u)[0])) <= 2)) return "stats";
    if (all((u) => u.length <= 3 && u.filter((x) => x.querySelector && x.querySelector("a")).length === 1 && words(u.map(txt).join(" ")) <= 8)) return imgs(units[0]).length ? "links" : "quick";
    if (some((u) => imgs(u).some((i) => /logo/i.test(i.getAttribute("src") + i.getAttribute("alt"))))) return "partners";
    if (all((u) => imgs(u).length && imgs(u).every(small))) return "icons";
    if (all((u) => imgs(u).length && heads(u).length && u.some((x) => x.querySelector && x.querySelector("a"))) && units.length === 3 && ctx.articles) return "articles";
    if (all((u) => imgs(u).length)) return units.length === 3 ? "why" : "tiles";
    return units.length === 4 ? "list" : "features";
  }
  function cardsBlock(document, members, base, ctx = {}) {
    const units = members.map((m) => unitNodes(document, m, base, ctx)).filter((u) => u.length);
    if (!units.length) return null;
    if (units.length === 1) return units[0];
    if (units.length === 2 && units.some((u) => u.every((x) => x.tagName === "IMG"))) {
      const media = units.find((u) => u.every((x) => x.tagName === "IMG"));
      const text = units.find((u) => u !== media);
      return block(document, "Columns (intro)", [units[0] === media ? [media, text] : [text, media]]);
    }
    if (units.length === 2 && units.every((u) => u.filter((x) => isHeading(x) || x.tagName === "UL").length >= 2)) {
      return block(document, "Columns", [units]);
    }
    if (units.length === 2 && units.every((u) => !u.some((x) => x.tagName === "IMG") && words(u.map(txt).join(" ")) >= 30)) {
      return block(document, "Columns", [units]);
    }
    const variant = cardsVariant(units, ctx);
    return block(document, `Cards (${variant})`, units.map((u) => [u]));
  }
  function accordionOut(document, acc, base) {
    const rows = [...acc.querySelectorAll(".accordion-panel")].filter((p) => !p.closest("[data-imp-hidden]")).map((p) => {
      const t = p.querySelector(".collapse-toggle, .accordion-title, button");
      const c = p.querySelector(".collapse-content, .accordion-content");
      const head = [el(document, "p", [txt(t)])];
      const sub = t && t.querySelector(".sub-title, small, .accordion-sub-title");
      if (sub) {
        head[0] = el(document, "p", [txt(t).replace(txt(sub), "").trim()]);
        head.push(el(document, "p", [txt(sub)]));
      }
      const body = c ? unitNodes(document, c, base, { headLevel: "h4" }) : [];
      return [head, body.length ? body : ""];
    }).filter((r) => txt(r[0][0]));
    if (!rows.length) return null;
    const hasSub = rows.some((r) => r[0].length > 1);
    return block(document, hasSub ? "Accordion (details)" : "Accordion", rows);
  }
  function mediaColumns(document, n, base, variant) {
    const parts = kids(n);
    const isMediaPart = (c) => c.matches("[data-imp-bg]") || !!c.querySelector("img") && !c.querySelector("h1, h2, h3, h4, h5, p");
    const media = parts.find(isMediaPart);
    if (!media || parts.length < 2) return null;
    const mediaCell = media.matches("[data-imp-bg]") ? [img(document, media.getAttribute("data-imp-bg"), "", base)] : unitNodes(document, media, base);
    const textCell = parts.filter((c) => c !== media).flatMap((c) => unitNodes(document, c, base, { keepLevel: true }));
    if (!mediaCell.length || !textCell.length) return null;
    const mediaFirst = parts.indexOf(media) < parts.indexOf(parts.find((c) => c !== media)) && !n.matches(".callout-reverse");
    return block(document, variant ? `Columns (${variant})` : "Columns", [mediaFirst ? [mediaCell, textCell] : [textCell, mediaCell]]);
  }
  function componentOut(document, n, base) {
    if (n.matches(".ssr-cta-template")) return mediaColumns(document, n, base, "apply");
    if (n.matches(".app-mobile-container")) return mediaColumns(document, n, base, null);
    if (n.matches(".callout.horizontal") && (n.closest("section") || n.parentElement).querySelectorAll(".callout.horizontal").length < 3) {
      return mediaColumns(document, n, base, n.querySelector(".reward-card-container, .banner-card-img") ? "apply" : null);
    }
    const results = kids(n).filter((c) => c.matches(".card-result"));
    if (results.length >= 2) {
      const rows = results.map((t) => {
        var _a;
        const cell = [];
        const im = t.querySelector("img");
        if (im && visible(im)) {
          const x = imageOf(document, im, base);
          if (x) cell.push(x);
        }
        const href = (_a = t.querySelector('a[href$=".html"]:not(.btn)')) == null ? void 0 : _a.getAttribute("href");
        const name = [...t.querySelectorAll("p.text-bold, p.font-medium")].find(visible);
        if (name) cell.push(el(document, "h3", [href ? el(document, "a", [txt(name)], { href: abs(href, base) }) : txt(name)]));
        const ul = t.querySelector("ul.disc-list");
        if (ul) {
          const snipe = ul.querySelector(".snipe");
          const copy = ul.cloneNode(true);
          copy.querySelectorAll("li").forEach((li) => li.remove());
          const p = inline(document, copy, "p", base);
          if (txt(p)) {
            if (snipe && txt(snipe)) p.prepend(el(document, "strong", [txt(snipe)]), " ");
            cell.push(p);
          }
        }
        const cols = [...t.querySelectorAll(".row > [class*=col-]")].filter(visible);
        const rates = el(document, "ul");
        for (let i = 0; i + 1 < cols.length; i += 2) {
          if (txt(cols[i])) rates.append(el(document, "li", [el(document, "strong", [txt(cols[i]).replace(/:?\s*$/, ":")]), " ", ...inline(document, cols[i + 1], "span", base).childNodes]));
        }
        if (rates.children.length) cell.push(rates);
        const links = [...t.querySelectorAll(".callout-link a[href]")].filter(visible);
        links.filter((a) => isBtn(a)).forEach((a) => cell.push(cta(document, a, "primary", base)));
        links.filter((a) => !isBtn(a) && txt(a)).forEach((a) => cell.push(cta(document, a, "link", base)));
        return [cell];
      }).filter((r) => r[0].length);
      return rows.length ? block(document, "Cards (offers)", rows) : null;
    }
    if (n.matches(".card-awards-container")) {
      const units = kids(n).filter((c) => c.matches(".card-awards-item")).map((c) => unitNodes(document, c, base)).filter((u) => u.length);
      return units.length ? block(document, "Cards (awards)", units.map((u) => [u])) : null;
    }
    const tools = [...n.querySelectorAll(".card-tools-grid-item, .learn-more-tool")].filter(visible);
    if (tools.length >= 2 && !kids(n).some(isHeading)) {
      const units = tools.map((t) => {
        const u = unitNodes(document, t, base);
        if (t.getAttribute("data-imp-bg")) u.unshift(img(document, t.getAttribute("data-imp-bg"), "", base));
        const pic = u.filter((x) => x.tagName === "IMG");
        return [...pic, ...u.filter((x) => x.tagName !== "IMG")];
      }).filter((u) => u.length);
      return block(document, "Cards (tools)", units.map((u) => [u]));
    }
    return null;
  }
  function walk(document, root, base, out, ctx = {}) {
    if (root.querySelector(":scope > rbc-accordion")) {
      const rows = [];
      const all = [...root.children];
      all.forEach((n, i) => {
        if (!n.matches("rbc-accordion")) return;
        const nx = all[i + 1];
        const body = nx && nx.matches('[id^="acc-"]') ? [...nx.querySelectorAll("p, li")].map((x) => inline(document, x, "p", base)).filter((x) => txt(x)) : [];
        if (txt(n)) rows.push([[el(document, "p", [txt(n)])], body.length ? body : ""]);
      });
      all.filter((n) => !n.matches('rbc-accordion, [id^="acc-"]') && visible(n)).forEach((n) => walk(document, el(document, "div", [n.cloneNode(true)]), base, out, ctx));
      if (rows.length) {
        out.push(block(document, "Accordion", rows));
        out[out.length - 1].__src = root;
      }
      return out;
    }
    const tiles = [...root.children].filter((c) => c.matches(".card-container") && !c.closest("[data-imp-hidden]"));
    if (tiles.length >= 2) {
      const rows = tiles.map((t) => {
        const cell = [];
        const im = t.querySelector(".card-image-container img.card-image, .card-image-container img:not(.card-image-decoration img)");
        if (im) {
          const x = imageOf(document, im, base);
          if (x) cell.push(x);
        }
        const title = t.querySelector(".card-title");
        const view = [...t.querySelectorAll('.card-view-card a, a.view-card, a[href*=".html"]')].find((a) => !a.matches(".apply-now-container") && !/#/.test(a.getAttribute("href") || "#"));
        if (title) cell.push(el(document, "h3", [view ? el(document, "a", [txt(title)], { href: abs(view.getAttribute("href"), base) }) : txt(title)]));
        const fee = t.querySelector(".card-details-annual-fee-container");
        if (fee && txt(fee)) cell.push(el(document, "p", [txt(fee)]));
        const cap = t.querySelector(".card-details-offer-caption");
        const off = t.querySelector(".card-details-offer-content");
        if (off && txt(off)) {
          const p = inline(document, off, "p", base);
          if (cap && txt(cap)) p.prepend(el(document, "strong", [txt(cap)]), " ");
          cell.push(p);
        }
        const feats = [...t.querySelectorAll(".card-details-features-container.desktop-only-flex .card-details-features-item, .card-details-features-item")];
        const seen = /* @__PURE__ */ new Set();
        const ul = el(document, "ul");
        feats.forEach((f) => {
          const li = inline(document, f, "li", base);
          const k = txt(li);
          if (k && !seen.has(k)) {
            seen.add(k);
            ul.append(li);
          }
        });
        if (ul.children.length) cell.push(ul);
        const rates = ratesOut(document, t, base);
        if (rates) cell.push(rates);
        const apply = t.querySelector("a.apply-now-container, a.btn.primary");
        if (apply) cell.push(cta(document, apply, "primary", base));
        if (view) cell.push(cta(document, view, "link", base));
        return [cell];
      });
      out.push(block(document, "Cards (offers)", rows));
      out[out.length - 1].__src = root;
      [...root.children].filter((c) => !tiles.includes(c) && visible(c)).forEach((c) => walk(document, el(document, "div", [c.cloneNode(true)]), base, out, ctx));
      return out;
    }
    const step = (n) => {
      if (n.matches(".socials-block")) {
        const label = n.querySelector("p, .h5");
        if (label && txt(label)) out.push(el(document, "p", [txt(label)]));
        const ul = el(document, "ul");
        n.querySelectorAll("a[href]").forEach((a) => {
          const first = a.querySelector("span");
          const name = (txt(first) || txt(a)).replace(/\s*\((opens|s'ouvre|ouvre)[^)]*\)\s*$/i, "").replace(/^click to /i, "").replace(/^cliquez pour /i, "");
          if (name) ul.append(el(document, "li", [el(document, "a", [name.charAt(0).toUpperCase() + name.slice(1)], { href: abs(a.getAttribute("href"), base) })]));
        });
        if (ul.children.length) out.push(ul);
        return;
      }
      if (n.matches(".tabs")) {
        [...n.querySelectorAll(".tab-pane")].forEach((pane) => {
          const before = out.length;
          walk(document, pane, base, out, ctx);
          const first = out.slice(before).find((x) => isHeading(x));
          if (first && first.tagName !== "H2") {
            const h2 = document.createElement("h2");
            h2.append(...first.childNodes);
            out[out.indexOf(first)] = h2;
          }
        });
        return;
      }
      const comp = componentOut(document, n, base);
      if (comp) {
        out.push(comp);
        return;
      }
      if (n.matches(".accordion") || n.querySelector(":scope > .grid-wpr > .grid-half > .accordion-panel, :scope > .accordion-panel")) {
        const a = accordionOut(document, n, base);
        if (a) out.push(a);
        return;
      }
      if (n.matches("table")) {
        const t = tableOut(document, n, base);
        if (t) out.push(t);
        return;
      }
      if (isHeading(n)) {
        const h = headingOut(document, n, base, n.tagName === "H1" && !ctx.keepH1 ? "h2" : null);
        if (h) out.push(h);
        return;
      }
      if (n.matches("p")) {
        n.querySelectorAll("img").forEach((i) => {
          if (visible(i)) {
            const x = imageOf(document, i, base);
            if (x) out.push(x);
          }
        });
        const p = paraOut(document, n, base);
        if (p) out.push(p);
        return;
      }
      if (n.matches("img")) {
        const i = imageOf(document, n, base);
        if (i) out.push(i);
        return;
      }
      if (n.matches("a")) {
        if (txt(n)) out.push(cta(document, n, isBtn(n) ? btnKind(n) : "link", base));
        return;
      }
      const rep = repeatGroup(n);
      if (rep) {
        const before = [];
        const after = [];
        let seen = false;
        kids(n).forEach((c) => {
          if (rep.members.includes(c)) seen = true;
          else if (!seen) before.push(c);
          else after.push(c);
        });
        before.forEach((c) => walk(document, el(document, "div", [c]), base, out, ctx));
        const b = cardsBlock(document, rep.members, base, __spreadProps(__spreadValues({}, ctx), { category: n.matches(".category-button-grid"), articles: ctx.articles || n.matches(".advices-container, [id*=article]") || !!n.querySelector("[id*=article]"), articleGrid: n.matches(".article-grid-container") || !!n.closest("#read-next-articles") }));
        if (Array.isArray(b)) out.push(...b);
        else if (b) out.push(b);
        after.forEach((c) => walk(document, el(document, "div", [c]), base, out, ctx));
        return;
      }
      if (n.matches("ul, ol")) {
        const l = listOut(document, n, base);
        if (l) out.push(l);
        return;
      }
      const k = kids(n);
      if (!k.length) {
        const bg = n.getAttribute("data-imp-bg");
        if (bg) out.push(img(document, bg, "", base));
        const t = txt(n);
        if (t && !n.matches("sup, span.tel-no")) {
          const p = inline(document, n, "p", base);
          if (txt(p)) out.push(p);
        }
        return;
      }
      const hasText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      if (hasText && !n.querySelector("p, h1, h2, h3, h4, h5, ul, ol, div, img, table")) {
        const p = inline(document, n, "p", base);
        if (txt(p)) out.push(p);
        return;
      }
      walk(document, n, base, out, ctx);
    };
    kids(root).forEach((n) => {
      const from = out.length;
      step(n);
      traceFrom(n, out, from);
    });
    return out;
  }
  function splitAtH2(nodes) {
    const sections = [];
    let cur = [];
    nodes.forEach((n) => {
      if (n.tagName === "H2" && cur.length) {
        sections.push(cur);
        cur = [];
      }
      cur.push(n);
    });
    if (cur.length) sections.push(cur);
    return sections;
  }
  function crumbsOut(document, main, base) {
    const ol = main.querySelector("#breadcrumb-wpr ol, .breadcrumb-wpr ol");
    if (!ol) return null;
    const ul = el(document, "ul");
    ol.querySelectorAll(":scope > li").forEach((li) => {
      const a = [...li.querySelectorAll("a")].find((x) => txt(x) && txt(x) !== "...");
      const label = a ? txt(a) : txt(li.querySelector("span:not([aria-hidden])") || li);
      if (!label) return;
      ul.append(el(document, "li", [a ? el(document, "a", [label], { href: abs(a.getAttribute("href"), base) }) : label]));
    });
    return ul.children.length ? ul : null;
  }
  function bannerImage(document, banner, base) {
    if (!banner) return null;
    const withBg = [banner, ...banner.querySelectorAll("[data-imp-bg]")].find((n) => n.getAttribute && n.getAttribute("data-imp-bg"));
    if (withBg) return img(document, withBg.getAttribute("data-imp-bg"), "", base);
    const i = [...banner.querySelectorAll(".banner-img img, img.banner-img, .hero-img img")].find(visible);
    return i ? imageOf(document, i, base) : null;
  }
  function heroFrom(document, { main, banner, base, h1Text, variant, intro }) {
    const cell = [];
    const crumbs = crumbsOut(document, main, base);
    if (crumbs) cell.push(crumbs);
    const bg = variant === "typeled" ? null : bannerImage(document, banner, base);
    if (bg) cell.push(bg);
    const art = banner ? [...banner.querySelectorAll("img.banner-card-img, img.custom-banner-card-img")].find((i) => !i.closest("[data-imp-hidden]")) : null;
    if (art && variant === "card") cell.push(imageOf(document, art, base));
    else if (!art && variant === "card" && !banner) {
      const card = main.querySelector(".ssr-card-template img.cta-img, .reward-card-container img");
      if (card) cell.push(imageOf(document, card, base));
    }
    if (h1Text) cell.push(el(document, "h1", [h1Text]));
    if (banner) {
      const scope = banner.querySelector(".banner-text, .banner-content, .banner-wpr, .section-inner") || banner;
      const heads = [...scope.querySelectorAll("h1, h2")].filter(visible);
      heads.forEach((h) => {
        if (txt(h) === h1Text) return;
        const o = headingOut(document, h, base, h1Text ? "h2" : "h1");
        if (o) {
          if (!h1Text) h1Text = txt(o);
          o.querySelectorAll("strong").length || markGoldNumber(document, o);
          cell.push(o);
        }
      });
      const CTA = "a.btn, a.button, a[class*=standalone-link]";
      [...scope.querySelectorAll("p")].filter((p) => visible(p) && !p.querySelector(CTA) && !p.closest("h1, h2")).forEach((p) => {
        const x = paraOut(document, p, base);
        if (x) cell.push(x);
      });
      [...scope.querySelectorAll(CTA)].filter((a) => visible(a) && txt(a)).forEach((a, i) => cell.push(cta(document, a, i === 0 ? "primary" : "secondary", base)));
    } else if (intro) {
      intro.forEach((n) => cell.push(n));
    }
    let v = variant;
    if (variant === "card" && !banner) v = "card, typeled";
    else if (variant === "card" && !art) v = null;
    return block(document, v ? `Hero (${v})` : "Hero", [[cell]]);
  }
  function markGoldNumber(document, h) {
    const walker = document.createTreeWalker(h, 4);
    let node;
    while (node = walker.nextNode()) {
      const m = node.textContent.match(/\$?\d[\d,.]*(\s?(points|pts|%))?/i);
      if (m && m[0].length >= 3 && !node.parentElement.closest("a")) {
        const after = node.splitText(m.index);
        after.splitText(m[0].length);
        const s = document.createElement("strong");
        after.replaceWith(s);
        s.append(after);
        return;
      }
    }
  }
  function cardHighlightsFrom(document, tpl, base) {
    const cell = [];
    const card = tpl.querySelector("img.cta-img, .reward-card-container img");
    if (card) cell.push(imageOf(document, card, base));
    const offer = tpl.querySelector(".card-details-offer-content");
    if (offer) {
      const c = offer.cloneNode(true);
      c.querySelectorAll(".card-details-offer-additional").forEach((x) => x.remove());
      const full = inline(document, c, "h2", base);
      const text = full.textContent;
      const m = text.match(/(Apply by|Faites votre demande d’ici|Présentez une demande d’ici|Demandez-la d’ici)[^.]*\.?/i);
      if (m) {
        const walker = document.createTreeWalker(full, 4);
        let node;
        while (node = walker.nextNode()) {
          const i = node.textContent.indexOf(m[0]);
          if (i >= 0) {
            node.textContent = node.textContent.slice(0, i);
            break;
          }
        }
      }
      if (txt(full)) cell.push(full);
      const bullets = offer.querySelector(".card-details-offer-additional ul");
      if (bullets) {
        const l = listOut(document, bullets, base);
        if (l) cell.push(l);
      }
      if (m) cell.push(el(document, "p", [el(document, "strong", [m[0].trim()])]));
    }
    const rates = ratesOut(document, tpl.querySelector("#overview-details") || tpl, base);
    if (rates) cell.push(rates);
    [...tpl.querySelectorAll("#overview-details p.p-sm, .card-details-note, p.p-sm")].filter(visible).forEach((p) => {
      const x = paraOut(document, p, base);
      if (x) cell.push(x);
    });
    [...tpl.querySelectorAll("a.btn")].filter(visible).slice(0, 1).forEach((a) => cell.push(cta(document, a, "primary", base)));
    return block(document, "Card Highlights", [[cell]]);
  }
  function legalOut(document, sec, base) {
    const inner = sec.querySelector(".legalcontent, .collapse-content, .collapse-inner") || sec;
    const items = [];
    const rows = [...inner.querySelectorAll(".table-row")];
    if (rows.length) {
      rows.forEach((r) => {
        const cells = [...r.querySelectorAll(":scope > .table-cell")];
        const textCell = cells[cells.length - 1] || r;
        const marker = cells.length > 1 ? txt(cells[0]) : "";
        const li = inline(document, textCell, "li", base);
        if (marker && txt(li)) li.prepend(`${marker} `);
        if (txt(li)) items.push(li);
      });
    } else {
      inner.querySelectorAll("p, li").forEach((p) => {
        if (p.closest("button") || p.querySelector("button")) return;
        const li = inline(document, p, "li", base);
        if (txt(li)) items.push(li);
      });
    }
    if (!items.length) return null;
    const btn = sec.querySelector("button.collapse-toggle");
    const leaf = btn ? [...btn.querySelectorAll("*")].find((c) => !c.children.length && txt(c)) : null;
    const ownTextNode = btn ? [...btn.childNodes].find((c) => c.nodeType === 3 && c.textContent.trim()) : null;
    let label = (ownTextNode ? ownTextNode.textContent.replace(/\s+/g, " ").trim() : txt(leaf || btn)) || "View Legal Disclaimers";
    label = label.replace(/^(.+?)\s*(Hide|Cacher|Masquer)\b.*$/i, "$1").trim();
    const half = label.length / 2;
    if (Number.isInteger(half) && label.slice(0, half) === label.slice(half)) label = label.slice(0, half).trim();
    return block(document, "Accordion (legal)", [[[el(document, "p", [label])], [el(document, "ol", items)]]]);
  }
  function liveToEds(document, url, template) {
    var _a, _b, _c, _d;
    const base = url;
    const main = document.querySelector("main") || document.body;
    const out = document.createElement("div");
    const h1El = main.querySelector("h1#page-title, h1.nav-location") || main.querySelector("h1");
    let h1Text = h1El ? txt(h1El) : "";
    const sections = kids(main).filter((s) => !s.matches("#sticky-wrapper, .sticky-wrapper"));
    const used = /* @__PURE__ */ new Set();
    const edsSections = [];
    let banner = sections.find((s) => s.matches("section.banner, section[id*=banner], .banner-container, section.bg-highlight") || s.querySelector(":scope > .banner, :scope > div > .banner-wpr"));
    if (banner && sections.indexOf(banner) > 1) banner = null;
    if (template === "landing") {
      const allSlides = [...main.querySelectorAll(".hero-slide, .hero-slides > div")].filter((x) => !x.matches(".slick-cloned"));
      const slide = allSlides.find((x) => !x.matches("[data-imp-badbg]") && (x.matches("[data-imp-bg]") || x.querySelector("[data-imp-bg]"))) || allSlides[0];
      const cell = [];
      if (slide) {
        const bg = bannerImage(document, slide, base);
        if (bg) cell.push(bg);
        const sigEl = [...slide.querySelectorAll("p, div")].find((p) => visible(p) && /script|handwrit|cursive|tagline/i.test(p.className));
        if (sigEl) cell.push(el(document, "p", [inline(document, sigEl, "em", base)]));
        [...slide.querySelectorAll("h1, h2")].filter(visible).slice(0, 1).forEach((h) => {
          const o = headingOut(document, h, base, "h2");
          markGoldNumber(document, o);
          cell.push(o);
        });
        [...slide.querySelectorAll("p")].filter((p) => visible(p) && p !== sigEl && !p.querySelector("a.btn")).forEach((p) => {
          const x = paraOut(document, p, base);
          if (x) cell.push(x);
        });
        [...slide.querySelectorAll("a.btn")].filter(visible).forEach((a, i) => cell.push(cta(document, a, i === 0 ? "primary" : "secondary", base)));
      }
      edsSections.push({ nodes: [Object.assign(block(document, "Hero (home)", [[cell]]), { __src: slide || banner })], style: null });
      used.add(banner);
      const slides = allSlides.filter((x) => x !== slide);
      if (slides.length) {
        const units = slides.map((s) => unitNodes(document, s, base, { headLevel: "h3" }).filter((x) => !(x.tagName === "P" && x.querySelector("em > a")))).filter((u) => u.length);
        if (units.length) edsSections.push({ nodes: [Object.assign(block(document, "Cards (promo)", units.map((u) => [u])), { __src: slides[0].parentElement })], style: "band" });
      }
    } else {
      const variant = template === "program" ? "card" : template === "static" || !bannerImage(document, banner, base) ? "typeled" : null;
      let intro = null;
      if (template === "program" && !banner) {
        const h = [...main.querySelectorAll("#overview h2, #sts-text h2")].find((x) => visible(x) && !x.closest(".ssr-card-template"));
        if (h) {
          intro = [headingOut(document, h, base, "h2")];
          const nx = h.nextElementSibling;
          if (nx && nx.matches("p") && visible(nx)) {
            intro.push(paraOut(document, nx, base));
            nx.setAttribute("data-imp-hidden", "1");
          }
          h.setAttribute("data-imp-hidden", "1");
          intro = intro.filter(Boolean);
        }
      }
      edsSections.push({ nodes: [Object.assign(heroFrom(document, { main, banner, base, h1Text, variant, intro }), { __src: banner || h1El })], style: null });
      if (banner) used.add(banner);
    }
    if (template === "landing") {
      const welcome = sections.find((s) => !used.has(s) && s.querySelector("h1"));
      if (welcome) {
        edsSections.push({ nodes: walk(document, welcome, base, [], { keepH1: true }), style: "plate" });
        used.add(welcome);
      }
    }
    if (template === "program") {
      const tpl = main.querySelector(".ssr-card-template");
      if (tpl) {
        edsSections.push({ nodes: [Object.assign(cardHighlightsFrom(document, tpl, base), { __src: tpl })], style: "plate" });
        tpl.setAttribute("data-imp-hidden", "1");
      }
    }
    if (template === "listing") {
      const cat = main.querySelector("#category-buttons, section:has(.category-button-grid)");
      if (cat && sections.indexOf(cat) <= 2) {
        edsSections.push({ nodes: walk(document, cat, base, [], {}), style: "plate" });
        used.add(cat);
      }
    }
    if (template === "article") {
      const left = main.querySelector(".advice-left-contents");
      const tocList = main.querySelector(".advice-right-table-of-contents ul, .custom-dropdown-nav-items");
      if (left) {
        const nodes = walk(document, left, base, [], { headLevel: "h3" });
        const firstH2 = nodes.findIndex((n) => n.tagName === "H2");
        const nextH2 = nodes.findIndex((n, i) => i > firstH2 && n.tagName === "H2");
        if (firstH2 >= 0 && /takeaway|tl;?dr|tlpl|points clés|principaux points|à retenir/i.test(txt(nodes[firstH2]))) {
          edsSections.push({ nodes: nodes.slice(firstH2, nextH2 < 0 ? void 0 : nextH2), style: "takeaways" });
          nodes.splice(firstH2, (nextH2 < 0 ? nodes.length : nextH2) - firstH2);
        }
        const art = [];
        if (tocList) {
          const ul = el(document, "ul");
          tocList.querySelectorAll("a").forEach((a) => {
            const label2 = txt(a);
            const id = label2.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            ul.append(el(document, "li", [el(document, "a", [label2], { href: `#${id}` })]));
          });
          const label = txt(main.querySelector(".custom-dropdown-nav-btn")) || (chromeLang(url) === "fr" ? "Sur cette page" : "On this page");
          art.push(Object.assign(block(document, "Toc", [[[el(document, "p", [label]), ul]]]), { __src: tocList }));
        }
        nodes.forEach((n) => art.push(n));
        edsSections.push({ nodes: art, style: "article" });
        (_a = main.querySelector(".advices-container")) == null ? void 0 : _a.setAttribute("data-imp-hidden", "1");
        (_b = main.querySelector(".custom-side-nav")) == null ? void 0 : _b.setAttribute("data-imp-hidden", "1");
      }
    }
    let band = false;
    sections.forEach((s) => {
      if (used.has(s) || s.closest("[data-imp-hidden]") || s.matches("[data-imp-hidden]")) return;
      if (s.matches("section.disclaimer, .disclaimer")) {
        const l = legalOut(document, s, base);
        if (l) {
          l.__src = s;
          edsSections.push({ nodes: [l], style: "legal" });
        }
        return;
      }
      const nodes = walk(document, s, base, [], { articles: template === "article" || template === "landing" });
      const dark = s.matches("[data-imp-dark]");
      splitAtH2(nodes).forEach((chunk) => {
        if (!chunk.length) return;
        const prev = edsSections[edsSections.length - 1];
        const titled = chunk.some((x) => x.tagName === "H2" || x.tagName === "DIV" && x.querySelector("h2"));
        if (!titled && prev && prev.body && !dark) {
          prev.nodes.push(...chunk);
          return;
        }
        edsSections.push({ nodes: chunk, style: dark ? "dark" : band ? "band" : null, body: true });
        band = !band;
      });
    });
    edsSections.forEach(({ nodes, style }, i) => {
      if (!nodes.length) return;
      if (i > 0) out.append(hr(document));
      nodes.forEach((n) => {
        if (isHeading(n) && n.tagName === "H2" && style !== "legal") keyNoun(document, n);
        out.append(n);
      });
      if (style) out.append(sectionMeta(document, style));
    });
    localizeLinks(out);
    out.append(hr(document));
    out.append(metadataBlock(document, {
      title: document.title,
      description: (_c = document.querySelector("meta[name=description]")) == null ? void 0 : _c.getAttribute("content"),
      template,
      url,
      image: (_d = document.querySelector('meta[property="og:image"]')) == null ? void 0 : _d.getAttribute("content")
    }));
    return out;
  }
  function chromeLang(url) {
    return new URL(url).pathname.startsWith("/fr/") ? "fr" : "en";
  }

  // tools/importer/scope-classify.js
  var key = (name) => {
    const m = name.trim().match(/^([^(]+)(?:\((.*)\))?\s*$/) || [null, name, ""];
    const blockName = m[1].trim().toLowerCase().replace(/\s+/g, "-");
    const vars = (m[2] || "").split(",").map((v) => v.replace(/[()]/g, " ").trim().toLowerCase().replace(/\s+/g, " ")).filter(Boolean);
    return [blockName, ...vars].join(" ");
  };
  var sidOf = (n) => {
    const e = n && n.nodeType === 1 ? n : null;
    if (!e) return null;
    const s = e.closest ? e.closest("[data-sid]") : null;
    return s ? s.getAttribute("data-sid") : e.getAttribute && e.getAttribute("data-sid");
  };
  var words2 = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9$%]+/g, " ").split(" ").filter((w) => w.length >= 3);
  function classify(document, url, template) {
    const out = liveToEds(document, url, template);
    const items = [];
    let section = 0;
    let style = null;
    const pending = [];
    [...out.children].forEach((n) => {
      var _a, _b, _c;
      if (n.tagName === "HR") {
        pending.forEach((x) => {
          x.style = style;
        });
        pending.length = 0;
        style = null;
        section += 1;
        return;
      }
      const head = n.tagName === "TABLE" ? ((_a = n.querySelector("tr th, tr td")) == null ? void 0 : _a.textContent) || "" : "";
      if (/^section metadata$/i.test(head.trim())) {
        style = ((_c = (_b = n.querySelectorAll("tr")[1]) == null ? void 0 : _b.children[1]) == null ? void 0 : _c.textContent.trim()) || null;
        return;
      }
      if (/^metadata$/i.test(head.trim())) return;
      const item = head ? { kind: "block", variant: key(head), sid: sidOf(n.__src), section, words: words2(n.textContent).length } : { kind: "prose", tag: n.tagName.toLowerCase(), sid: sidOf(n.__src), section, words: words2(n.textContent).length };
      items.push(item);
      pending.push(item);
    });
    pending.forEach((x) => {
      x.style = style;
    });
    return { items, outWords: [...new Set(words2(out.textContent))] };
  }
  var scope_classify_default = {
    onLoad: (_0) => __async(void 0, [_0], function* ({ document }) {
      yield annotate(document);
    }),
    transform: () => [],
    classify
  };
  return __toCommonJS(scope_classify_exports);
})();
