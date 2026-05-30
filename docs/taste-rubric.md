# The Taste Engine Score Philosophy

Taste Engine treats creative judgment as something that can be made repeatable. Not perfect, not objective — repeatable. This document explains the thinking behind the score.

## Taste is not personal preference alone

"I like it" is not a review. Personal preference is real, but it isn't transferable, defensible, or scalable. Taste Engine separates *preference* ("I'd have used a different blue") from *judgment* ("this blue fails the contrast the medium requires"). Only the second belongs in a score. The score is built from claims that can be defended with a reason, not from gut reactions.

## Taste is judgment under constraints

A creative asset never exists in a vacuum. It has an audience, a brand, a medium, and an execution standard. Taste is the ability to hold all four at once and decide whether the work satisfies them. A beautiful design that won't print is not good. A clever concept the audience won't get is not good. A polished page that doesn't convert is not good. Judgment is what survives contact with the constraints.

## Good creative must satisfy four masters

Every audit weighs the work against:

1. **Audience** — does it resonate with the specific people it's for?
2. **Brand** — does it express the right positioning and feel?
3. **Medium** — will it survive screen print, a mobile viewport, a feed, a favicon?
4. **Execution** — is the craft itself resolved — type, hierarchy, color, composition?

A failure in any one of these can sink an asset regardless of how strong the others are. That's why the decision system has overrides: a fatal medium or brand failure can force a `reject` even on a high score.

## Concept and execution are scored separately

A strong idea rendered badly is a `revise` — keep the idea, fix the craft. A polished execution of a weak idea is also a problem, but a different one — and dressing it up won't save it. Conflating the two leads to bad calls: killing good ideas over fixable craft, or waving through empty work because it's shiny. Taste Engine always names which layer is failing.

## AI generation makes QA more valuable, not less

When generating one asset took a day, a human reviewed it as a matter of course. When generating a hundred takes an hour, that review doesn't happen — and volume becomes a liability. The marginal value of judgment rises exactly as the marginal cost of generation falls. A consistent gate is the only thing that keeps a high-volume pipeline from shipping its own noise.

## The goal is repeatable creative judgment

Taste Engine isn't trying to be the final word on art. It's trying to apply the same defensible standard to the hundredth asset that a good director applied to the first — every time, with its reasoning written down. Repeatability is the product. The score is just the number that falls out of judging the same way twice.

## How the number is built

- Each asset type has a rubric (`rubrics/`) with weighted categories.
- Each category is scored 0–10 against that rubric.
- The weighted total maps to a 0–100 taste score.
- The score sets a default decision: `pass` (85–100), `revise` (60–84), `reject` (0–59).
- Overrides (brand, production, legal/IP, clarity) can force the decision down to `reject`.

The number exists to make judgments comparable. The decision is what matters.
