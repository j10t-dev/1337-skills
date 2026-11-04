---
name: drawing-diagrams
description: Use when a diagram would show structure, flow, states, sequence or relationships more clearly than prose, or when the user asks for a diagram, chart or visual. Writes Mermaid and renders it to a themed SVG with Pele.
---

# Drawing diagrams

Write the diagram in Mermaid, render it to a blueprint SVG, and show the user the image.

## Draw

1. Write the Mermaid to a `.mmd` file in a scratch folder outside the repo, unless the user wants it kept in the repo.
2. Run `sh <skill dir>/scripts/render DIAGRAM.mmd` from any directory. Add `--css FILE` for extra rules, once per file. It writes the SVG beside the `.mmd` file and prints the SVG's absolute path. The first run installs Pele with bun and needs the network.
3. Show the user the SVG as an image by its absolute path, such as `![Checkout flow](/tmp/diagrams/checkout.svg)`, where the harness displays images. Otherwise give the path to open in a browser. Give the Mermaid text with it.

The diagram is done when the user has the image or its path, and the Mermaid text.

## Write Mermaid that reads

- Label nodes and edges in the reader's words.
- Pick the type that fits the question: `flowchart` for flow, `stateDiagram-v2` for states, `sequenceDiagram` for messages over time, `classDiagram` or `erDiagram` for relationships. https://pele.run lists the types Pele supports.
- Keep a diagram to about 20 edges. Split a larger one into several diagrams.

## Pele

- Pele ignores Mermaid `theme`, `themeVariables` and init directives. The blueprint theme sets every colour, so leave them out.
- Pele writes `classDef` and `style` colours as inline styles, which override the theme. To colour a class within the theme, give nodes the class and pass a `--css` file with rules of the form `.pele .<class> rect { fill: …; }`.
- The SVG reads correctly in browsers and in harnesses that display images through a browser engine.

## When render fails

- Exit 3 is a Mermaid error. Fix the Mermaid at the place the message names and render again. If it still fails, show the user the Mermaid text and the message.
- Exit 2 means the command could not run. Show the user the message.
