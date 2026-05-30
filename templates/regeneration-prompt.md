# Regeneration Prompt Template

> A prompt template for regenerating or improving a creative asset with an image model or design AI. Fill the placeholders from the audit and brand profile, then feed the assembled prompt to the generator.

---

## Template

```
Create a {{asset_type}} for {{brand_name}}, targeting {{target_audience}}.

Visual style: {{visual_style}}.

This is a revision. The previous version had one core problem:
{{primary_issue}}

Fix it directly: {{recommended_fix}}.

Hard production constraints (must be respected):
{{production_constraints}}

Do not produce generic, templated, or default AI output. Commit to a clear
point of view. Prioritize legibility, intentional typography, strong visual
hierarchy, and brand fit over decoration.
```

## Placeholders

| Placeholder | Source | Example |
|-------------|--------|---------|
| `{{asset_type}}` | audit / input | `apparel graphic (screen-printed tee)` |
| `{{brand_name}}` | brand profile | `VisualOps AI` |
| `{{target_audience}}` | brand profile / input | `AI builders and senior engineers` |
| `{{visual_style}}` | brand profile | `dark, minimal, technical, cinematic, high-contrast` |
| `{{primary_issue}}` | audit `primary_issues[0]` | `headline typography reads as a default placeholder` |
| `{{recommended_fix}}` | audit `recommended_fixes[0]` | `use a heavy grotesque with tight tracking for authority` |
| `{{production_constraints}}` | brand profile / input | `max 4 spot colors; must read on a black garment; min stroke ~2.5pt` |

## Notes

- Keep one regeneration prompt focused on the **primary** issue. Chaining too many fixes into one prompt dilutes all of them.
- Restate the constraints every time — generators do not remember the brand.
- After regeneration, re-run the audit. Regeneration without re-review defeats the purpose of the gate.
