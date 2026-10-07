# Scoping-only support in the live matcher: every top-level node the walker emits remembers the source element
# it came from (node.__src). Import output is unchanged; the scoping classifier reads __src to place screenshots.
f = '/backups/meejain/ema-rbcroyalbank/repo/tools/importer/parsers/rbc-live.js'
s = open(f).read()

def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)

rep("const kids = (n) => [...n.children].filter(visible);",
    "const kids = (n) => [...n.children].filter(visible);\n"
    "// scoping-only trace: nodes emitted while handling source element n remember it (innermost source wins)\n"
    "const traceFrom = (n, out, from) => { for (let i = from; i < out.length; i += 1) if (out[i] && !out[i].__src) out[i].__src = n; };")

rep("  kids(root).forEach((n) => {\n    // article share row", "  const step = (n) => {\n    // article share row")
rep("    walk(document, n, base, out, ctx);\n  });\n  return out;\n}",
    "    walk(document, n, base, out, ctx);\n  };\n  kids(root).forEach((n) => { const from = out.length; step(n); traceFrom(n, out, from); });\n  return out;\n}")
# blocks emitted straight from the walker's root (Angular accordion, hub product tiles)
rep("    if (rows.length) out.push(block(document, 'Accordion', rows));\n    return out;",
    "    if (rows.length) { out.push(block(document, 'Accordion', rows)); out[out.length - 1].__src = root; }\n    return out;")
rep("    out.push(block(document, 'Cards (offers)', rows));\n    [...root.children]",
    "    out.push(block(document, 'Cards (offers)', rows)); out[out.length - 1].__src = root;\n    [...root.children]")
# template heads
rep("    edsSections.push({ nodes: [block(document, 'Hero (home)', [[cell]])], style: null });",
    "    edsSections.push({ nodes: [Object.assign(block(document, 'Hero (home)', [[cell]]), { __src: slide || banner })], style: null });")
rep("      if (units.length) edsSections.push({ nodes: [block(document, 'Cards (promo)', units.map((u) => [u]))], style: 'band' });",
    "      if (units.length) edsSections.push({ nodes: [Object.assign(block(document, 'Cards (promo)', units.map((u) => [u])), { __src: slides[0].parentElement })], style: 'band' });")
rep("    edsSections.push({ nodes: [heroFrom(document, { main, banner, base, h1Text, variant, intro })], style: null });",
    "    edsSections.push({ nodes: [Object.assign(heroFrom(document, { main, banner, base, h1Text, variant, intro }), { __src: banner || h1El })], style: null });")
rep("      edsSections.push({ nodes: [cardHighlightsFrom(document, tpl, base)], style: 'plate' });",
    "      edsSections.push({ nodes: [Object.assign(cardHighlightsFrom(document, tpl, base), { __src: tpl })], style: 'plate' });")
rep("        art.push(block(document, 'Toc', [[[el(document, 'p', [label]), ul]]]));",
    "        art.push(Object.assign(block(document, 'Toc', [[[el(document, 'p', [label]), ul]]]), { __src: tocList }));")
rep("    if (s.matches('section.disclaimer, .disclaimer')) { const l = legalOut(document, s, base); if (l) edsSections.push({ nodes: [l], style: 'legal' }); return; }",
    "    if (s.matches('section.disclaimer, .disclaimer')) { const l = legalOut(document, s, base); if (l) { l.__src = s; edsSections.push({ nodes: [l], style: 'legal' }); } return; }")
open(f, 'w').write(s)
print('patched')
