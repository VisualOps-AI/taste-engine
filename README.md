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

## CLI audit tool (Phase 2)

A lightweight, dependency-free CLI that scores a structured audit input file and prints a PASS / REVISE / REJECT verdict.

```bash
npm run build
node dist/cli.js audit examples/apparel-input-example.json
```

Once built, the `taste` bin is also available (via `npm link` or after install):

```bash
taste audit examples/landing-page-input-example.json
```

### Input format

The CLI is the **deterministic scoring layer**. It does not look at an image — it takes the category scores (0–10) and the review narrative as input, then computes the weighted `taste_score` and the decision. The visual judgment (assigning category scores from an asset) is the skill's job.

```json
{
  "asset_type": "apparel_graphic",
  "summary": "Short executive verdict.",
  "scores": { "clarity": 8, "typography": 6, "...": 0 },
  "primary_issues": ["..."],
  "recommended_fixes": ["..."],
  "next_action": "..."
}
```

See [`examples/*-input-example.json`](examples/) for complete inputs. The full ten-category `scores` block is required (see [`schemas/taste-audit.schema.json`](schemas/taste-audit.schema.json)).

### Output

A terminal report with asset type, taste score, decision, per-category score bars, summary, primary issues, recommended fixes, and next action.

### Exit codes

| Code | Meaning |
|:----:|---------|
| `0` | `pass` or `revise` |
| `1` | `reject` (use to gate scripts/pipelines) |
| `2` | usage or input error |

### Human-in-the-loop overrides

When a reviewer disagrees with the engine, record the override — what the engine said, the human's call, the reason, and an optional calibration note to steer future scoring. Records append to a JSON Lines log (`overrides.jsonl`), the raw material for Phase 6 brand taste memory.

```bash
node dist/cli.js override examples/apparel-input-example.json \
  --decision pass \
  --reason "This campaign intentionally uses aggressive type tension." \
  --note "Allow more experimental typography for streetwear assets."
```

Each line in the log is one `OverrideRecord` (see [`schemas/override-record.schema.json`](schemas/override-record.schema.json) and [`examples/override-record-example.json`](examples/override-record-example.json)):

```json
{ "id": "ovr_…", "recorded_at": "…", "asset_type": "apparel_graphic", "engine_score": 72, "engine_decision": "revise", "human_decision": "pass", "override_reason": "…", "calibration_note": "…" }
```

The log file is git-ignored — it's per-environment runtime data, not source.

> The standalone `override` command **persists** a decision to a log. The `audit --human-decision` flags below attach a human review **inline** to a single audit's output. Use the flags for review; use `override` when you want an append-only record.

---

## Human Taste Loop

Taste Engine does not replace a human creative director. The engine provides first-pass creative QA — a score and a default decision — but the human remains the final authority: they can approve, reject, revise, or override the result. Overrides can carry calibration notes that become the foundation for future brand taste memory.

Run a plain audit and the review stays open — `pending_human_review`, `human_decision: pending`:

```bash
node dist/cli.js audit examples/apparel-input-example.json
```

Attach a human decision. If it differs from the engine, an `--override-reason` is required and the status becomes `overridden`:

```bash
node dist/cli.js audit examples/apparel-input-example.json \
  --human-decision pass \
  --override-reason "The campaign intentionally uses aggressive typography." \
  --calibration-note "Allow more experimental type for streetwear assets."
```

Emit machine-readable JSON (for pipelines) instead of the terminal report:

```bash
node dist/cli.js audit examples/apparel-input-example.json --json
```

`npm run audit` works too — pass flags after `--`:

```bash
npm run audit -- examples/apparel-input-example.json \
  --human-decision pass \
  --override-reason "Approved by creative director." \
  --calibration-note "This brand can tolerate more visual tension."
```

### Review status

| Human decision | vs engine | `review_status` |
|----------------|-----------|-----------------|
| `pending` (default) | — | `pending_human_review` |
| `pass` | matches engine | `approved` |
| `revise` | matches engine | `revised` |
| `reject` | matches engine | `rejected` |
| any | **differs** (requires `--override-reason`) | `overridden` |

The **effective decision** (the human's call, or the engine's when pending) drives the exit code: `reject` → `1`, otherwise `0`. See sample outputs in [`examples/human-loop-pass-example.json`](examples/human-loop-pass-example.json) and [`examples/human-loop-override-example.json`](examples/human-loop-override-example.json), and the full rationale in [`docs/human-taste-loop.md`](docs/human-taste-loop.md).

---

## A note on scope

Taste Engine does not claim to perfectly judge art. Taste is contested, contextual, and partly subjective. What this system does is make *creative judgment under constraints* repeatable: it holds work to a defined brand, audience, medium, and execution standard, and it explains its reasoning every time. It is a sharper, faster first reviewer — not a replacement for a human creative director's final call.
