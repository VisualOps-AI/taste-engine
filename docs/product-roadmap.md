# Product Roadmap

Taste Engine grows from a skill into a creative governance system. Each phase is usable on its own; later phases compound on earlier ones.

## Phase 1 — Skill & rubric system *(current)*

The judgment layer, written down.

- Claude Code skill (`skills/taste-engine/SKILL.md`)
- Weighted rubrics per asset type (`rubrics/`)
- JSON Schemas for audits, brand profiles, and inputs (`schemas/`)
- Review, brief, and regeneration templates (`templates/`)
- TypeScript scoring + validation foundation (`src/`)

**Outcome:** a consistent, explainable PASS / REVISE / REJECT review, usable today inside Claude Code.

## Phase 2 — CLI audit tool

Bring the engine to the terminal.

- `taste audit <asset> --brand <profile.json>`
- Reads an asset input, emits a `TasteAudit` JSON + human-readable review
- Batch mode for scoring a directory of assets
- Exit codes that gate scripts (non-zero on `reject`)
- Test harness around the scoring primitives

## Phase 3 — API service

Make the gate callable.

- HTTP endpoint that accepts an `AssetInput`, returns a `TasteAudit`
- Authentication and per-key brand profiles
- Webhooks for pipeline integration
- Rate limiting and usage accounting

## Phase 4 — Dashboard

Make judgment visible.

- Upload and review assets in a UI
- Score history and decision distribution per brand
- Side-by-side asset comparison
- Reviewer overrides and notes (human-in-the-loop)

## Phase 5 — Agentic creative QA pipeline

Close the generate → judge → regenerate loop.

- Hook into generation pipelines as a quality gate
- Auto-reject below-bar output before it ships
- Auto-issue improvement briefs and regeneration prompts on `revise`
- Re-audit regenerated assets until they clear the bar or hit a retry limit

## Phase 6 — Brand taste memory & comparative versioning

Make the engine learn a brand over time.

- Persistent brand taste memory across audits
- Version comparison: is v3 better than v2, and why?
- Drift detection when output strays from the established standard
- Profile versioning so verdicts are reproducible against a known standard

---

**Sequencing principle:** ship judgment first, automation later. The rubric and skill have to be right before the gate is worth wiring into a pipeline — a fast, automated gate applying a bad standard just ships bad work faster.
