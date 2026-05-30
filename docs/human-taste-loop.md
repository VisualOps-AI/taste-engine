# The Human Taste Loop

Taste Engine is a creative QA system, not a creative authority. It exists to make first-pass judgment fast, consistent, and explainable — and then to get out of the way of the person who owns the call. The Human Taste Loop is the mechanism that keeps a human creative director in charge.

## Why humans remain the final taste authority

Taste is contested, contextual, and partly subjective. An engine can apply a defined standard repeatably, but it cannot own the brand's risk, read the room on a campaign, or decide that *this* exception is worth making. Those are judgment calls a person is accountable for.

So the engine never gets the last word. It proposes; the human disposes. A score of 72 with a `revise` default is an opinion the director can accept, sharpen, or overrule — on the record, with a reason.

## What the engine handles

- Scoring each category (0–10) against the asset-type rubric.
- Computing the weighted `taste_score` (0–100).
- Assigning a **default** decision (`pass` / `revise` / `reject`).
- Surfacing the reasoning: summary, primary issues, recommended fixes, next action.

This is the deterministic, repeatable layer — the part worth automating because it should produce the same verdict on the same inputs every time.

## What the human owns

- The **final decision** (`human_decision`): `pass`, `revise`, `reject`, or `pending`.
- The **reason** when they overrule the engine (`override_reason`).
- The **calibration note** that records *why this class of asset should be judged differently next time* (`calibration_note`).

The human's decision is authoritative. When set, it — not the engine's — is the *effective decision* that gates the pipeline.

## Override logic

The engine produces `engine_decision`. The human supplies `human_decision`. The `review_status` is derived from how they relate:

| `human_decision` | Relationship | `review_status` | `override_reason` |
|------------------|--------------|-----------------|-------------------|
| `pending` (default) | not yet reviewed | `pending_human_review` | must be absent |
| `pass` | matches engine | `approved` | optional |
| `revise` | matches engine | `revised` | optional |
| `reject` | matches engine | `rejected` | optional |
| any | **differs from engine** | `overridden` | **required** |

Rules enforced by the CLI:

- `human_decision` must be one of `pass`, `revise`, `reject`, `pending`.
- A `pending` review **cannot** carry an `override_reason` (there is nothing to override yet).
- If `human_decision` **differs** from `engine_decision`, an `override_reason` is **required** — an override without a stated reason is not an override, it's an erasure.
- `calibration_note` is always optional.

The **effective decision** drives the exit code: it is the `human_decision` when one is set, otherwise the `engine_decision`. `reject` exits `1`; anything else exits `0`. This lets a human `pass` clear an asset the engine wanted to `revise`, and a human `reject` stop one the engine would have passed.

## Calibration notes

An override fixes one asset. A calibration note is meant to fix the *standard*.

> "Allow more experimental type for streetwear assets."

That note is a signal: the engine's typography expectation was too conservative for this brand and category. Captured once, it's an anecdote. Captured consistently, it's a pattern — evidence for how this brand's taste actually differs from the generic rubric.

Calibration notes are written in the human's language, attached to a concrete asset and decision, so they stay grounded rather than abstract.

## How this becomes brand taste memory later

Today the loop **captures** human decisions and calibration notes. It does not yet **apply** them — nothing reads the notes back to change future scores. That feedback loop is Phase 6 (brand taste memory):

1. **Collect** — every override and calibration note is recorded against an asset type and brand.
2. **Aggregate** — repeated calibration in one direction (e.g. "more aggressive type is fine for this brand's apparel") becomes a measurable bias.
3. **Apply** — that bias adjusts the rubric weights or thresholds for that brand + asset type, so the engine's *default* decision drifts toward the brand's demonstrated taste.
4. **Compare** — versioned profiles make it possible to ask whether v3 is more on-brand than v2, against a standard the brand itself taught the engine.

The result is an engine that starts generic and gets sharper for a specific brand the more a human corrects it — without ever taking the final call away from the human. The loop is the data source; brand taste memory is what the data eventually trains.
