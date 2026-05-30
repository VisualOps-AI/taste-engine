# Brand Profile Guide

A brand profile is the standard Taste Engine reviews an asset *against*. Without one, the engine can only judge generic design quality. With one, it can judge whether an asset is right for *this* brand, *this* audience, and *this* medium.

This guide explains how to build a good profile. The machine-readable shape is defined in [`schemas/brand-profile.schema.json`](../schemas/brand-profile.schema.json); a worked example is in [`examples/brand-profile-example.json`](../examples/brand-profile-example.json).

## Why it matters

The most common reason a polished asset still fails is that it's polished for the wrong brand. A generic SaaS gradient hero is "good design" in the abstract and completely wrong for a brand whose whole point is that it isn't generic. The profile is what lets the engine catch that — it turns "feels off" into "violates the brand's stated `avoid` list."

## Questions to answer

Work through these. Vague answers produce vague reviews.

- **Who is this for?** Be specific. "Developers" is weak; "senior engineers and AI builders who can tell premium from generic" is usable.
- **What should the brand feel like?** Give 4–7 concrete descriptors (`dark`, `technical`, `cinematic`), not adjectives that apply to everyone (`good`, `modern`).
- **What should it never feel like?** This is the highest-leverage field. List the clichés, tells, and styles that are instant disqualifiers (`generic SaaS gradients`, `cheap AI clipart`, `cartoonish`).
- **What production constraints matter?** Hard limits the work must respect — max spot colors, must read on black garments, app-icon legible, mobile-first.
- **What does premium mean for this brand?** "Premium" is relative. Define the specific signals — restraint, contrast, custom type, finish — that read as premium *here*.
- **What visual styles are overused in this category?** Name the conventions competitors lean on, so the engine can flag when an asset blends in instead of standing apart.

## Field-by-field

| Field | What goes here |
|-------|----------------|
| `brand_name` | The brand. |
| `category` | Market/product category — sets the competitive frame. |
| `target_audience` | Concrete description of who it's for. |
| `visual_style` | 4–7 descriptors of the intended feel. |
| `avoid` | The disqualifiers — clichés and styles to never use. |
| `typography_preferences` | Type direction, approved faces, notes. |
| `color_preferences` | Core palette (hex/tokens) and usage notes. |
| `brand_personality` | Traits that drive tone (`confident`, `restrained`). |
| `production_constraints` | Hard medium limits the work must satisfy. |
| `quality_bar` | What "good enough to ship" means for this brand. |

## Tips

- **The `avoid` list does the most work.** Spend the most time here. It's how the engine catches off-brand work that's technically competent.
- **Make `quality_bar` a sentence you'd say out loud.** "If it could belong to any AI startup, it isn't done" is a usable bar. "High quality" is not.
- **Keep it stable, version it when it changes.** The profile is the constant the engine measures against; changing it mid-stream changes every verdict. (Brand taste memory and versioning is Phase 6.)
