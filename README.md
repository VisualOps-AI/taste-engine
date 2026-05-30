# Taste Engine

### Creative QA for AI-generated brand assets.

Taste Engine is a creative judgment layer that evaluates visual assets using design principles, brand context, commercial intent, and production constraints.

---

## Why this exists

Generation is no longer the bottleneck.

A single operator can now produce hundreds of t-shirt graphics, ad frames, landing pages, logos, and brand concepts in an afternoon. The cost of *making* a creative asset has collapsed. The cost of *knowing whether it is any good* has not.

Judgment is the scarce resource. Most AI creative pipelines have no gate between "generated" and "shipped" — so generic, off-brand, or unprintable work slips through, and a human eventually has to clean it up by hand, one asset at a time. That doesn't scale with the volume AI now produces.

Taste Engine is the missing gate. It applies repeatable creative judgment to visual output: is this on-brand, visually strong, production-ready, and commercially worth shipping — or not? It behaves like a senior creative director doing aesthetic QA, except it runs every time, on every asset, with a consistent standard.

This is creative governance for an era of infinite generation.

---

## What it evaluates

- **Apparel graphics** — t-shirt designs, streetwear, merch, print
- **Landing pages** — marketing pages, portfolio sites, product pages
- **Ad creatives** — paid social frames, static and video stills
- **Brand identity assets** — logos, marks, identity systems
- **AI-generated visuals** — diffusion output, concept art, key visuals
- **Social media creatives** — feed posts, story formats, thumbnails
- **Product mockups** — packaging, device frames, presentation renders

---

## Core decision framework

Every audit resolves to one of three decisions:

| Decision | Meaning |
|----------|---------|
| **PASS** | The asset is strong enough to ship. |
| **REVISE** | The concept is viable, but execution needs targeted improvements. |
| **REJECT** | The asset fails core brand, design, or production standards. |

A high numeric score does not guarantee a `pass`. A fatal brand mismatch, production defect, legal/IP risk, or severe clarity failure can override the score and force a `reject`. Judgment under constraints — not arithmetic — produces the final call.

---

## Core score categories

Each asset is scored across ten categories. Rubrics weight these differently per asset type (apparel weights production readiness heavily; landing pages weight conversion strength).

- **Clarity** — does the asset communicate instantly?
- **Visual hierarchy** — does the eye move in the right order?
- **Typography** — is the type intentional, legible, and authoritative?
- **Composition** — is the layout balanced and considered?
- **Color logic** — is the palette coherent and purposeful?
- **Brand alignment** — does it match the brand's intended feel?
- **Audience fit** — does it resonate with the intended buyer?
- **Commercial strength** — will it perform in market?
- **Originality** — is it distinctive, or generic AI output?
- **Production readiness** — will it survive the real medium?

---

## Example JSON output

```json
{
  "asset_type": "apparel_graphic",
  "decision": "revise",
  "taste_score": 72,
  "summary": "Strong concept for AI-developer streetwear, but the typography lacks authority and the linework is too fine to print cleanly at scale.",
  "scores": {
    "clarity": 8,
    "visual_hierarchy": 7,
    "typography": 6,
    "composition": 8,
    "color_logic": 8,
    "brand_alignment": 8,
    "audience_fit": 9,
    "commercial_strength": 8,
    "originality": 7,
    "production_readiness": 6
  },
  "primary_issues": [
    "Headline typeface reads as default — no tension, no point of view.",
    "1px linework will break up or fill in on a screen-printed cotton tee."
  ],
  "recommended_fixes": [
    "Replace the headline with a heavier grotesque and tighten tracking for authority.",
    "Thicken minimum stroke weight to ~2.5pt and reduce detail density for print."
  ],
  "production_notes": "Target 3–4 spot colors for screen print. Verify contrast against a black garment. Re-check legibility from 6–10 feet.",
  "next_action": "Regenerate with tightened type and simplified linework, then re-audit."
}
```

---

## How this can be used

- **Claude Code Skill** — drop-in creative review skill (`skills/taste-engine/`)
- **Creative review assistant** — structured critique for designers and directors
- **CLI audit tool** — score assets from the terminal *(Phase 2)*
- **API for creative workflows** — gate assets programmatically *(Phase 3)*
- **Human-in-the-loop creative QA** — director reviews ranked, pre-critiqued work
- **Agentic creative pipeline gate** — block weak generations before they ship *(Phase 5)*

---

## Roadmap

| Phase | Focus |
|-------|-------|
| **Phase 1** | Skill and rubric system *(this repo)* |
| **Phase 2** | CLI audit tool |
| **Phase 3** | API service |
| **Phase 4** | Dashboard |
| **Phase 5** | Agentic creative QA pipeline |
| **Phase 6** | Brand taste memory and version comparison |

See [`docs/product-roadmap.md`](docs/product-roadmap.md) for detail.

---

## Positioning

Taste Engine is built for people who ship creative work and care whether it's good:

- **Designers** running AI-assisted workflows
- **Creative directors** reviewing high volumes of output
- **AI builders** adding a quality gate to generation pipelines
- **Apparel brands** vetting merch concepts before print
- **Agencies** standardizing creative review across clients
- **E-commerce teams** screening ad and product creative
- **AI-generated content workflows** that need a judgment layer

---

## Repository structure

```
taste-engine/
├── README.md
├── package.json
├── tsconfig.json
├── skills/taste-engine/SKILL.md   # Claude Code skill definition
├── rubrics/                       # Weighted scoring rubrics per asset type
├── schemas/                       # JSON Schemas for audits, brand profiles, inputs
├── templates/                     # Review, brief, and regeneration prompt templates
├── examples/                      # Realistic audit + brand profile examples
├── src/                           # TypeScript scoring + validation foundation
└── docs/                          # Score philosophy, guides, roadmap, use cases
```

## Getting started

```bash
npm install
npm run typecheck   # validate the TypeScript foundation
npm run build       # emit dist/
```

The scoring and validation primitives live in [`src/`](src/). Start with [`docs/taste-rubric.md`](docs/taste-rubric.md) to understand the philosophy, then read [`skills/taste-engine/SKILL.md`](skills/taste-engine/SKILL.md) to see how the review behaves.

---

## A note on scope

Taste Engine does not claim to perfectly judge art. Taste is contested, contextual, and partly subjective. What this system does is make *creative judgment under constraints* repeatable: it holds work to a defined brand, audience, medium, and execution standard, and it explains its reasoning every time. It is a sharper, faster first reviewer — not a replacement for a human creative director's final call.
