# Use Cases

How Taste Engine is used in practice. Each scenario is a real workflow the judgment layer slots into.

## Apparel brand reviewing t-shirt concepts

A merch brand generates dozens of tee concepts per drop. Taste Engine scores each against the apparel rubric and the brand profile — flagging the ones with placeholder typography, unprintable linework, or weak buyer-identity fit — so the team only samples designs that will actually print and sell. Verdict per concept: `pass` (sample it), `revise` (here's the fix), `reject` (skip it).

## Designer reviewing AI-generated graphics

A designer using diffusion models produces a wall of options. Instead of eyeballing 60 images, they run them through the engine to get a ranked shortlist with specific critiques — "generic, default type," "strong concept, fix the contrast" — and spend their time refining the few worth refining.

## Agency reviewing campaign assets

An agency standardizes creative review across clients. Each client gets a brand profile; every campaign asset is audited against it before it reaches the client. The agency catches off-brand and weak work internally, and shows up to reviews with assets that already cleared a defined bar — fewer surprised clients, fewer rounds.

## E-commerce team reviewing ads

A performance team ships a high volume of paid-social creative. The engine scores each frame for hook strength, product clarity, and platform fit, and flags the ones that won't stop a scroll or read at thumbnail size — so budget goes behind creative that has a chance, not behind frames that blend into the feed.

## AI workflow rejecting weak creative outputs

A generation pipeline produces assets autonomously. Taste Engine sits in the pipeline as a gate: below-bar output is auto-rejected before it's ever published, `revise` output triggers an improvement brief and regeneration, and only `pass` output proceeds. The pipeline stops shipping its own noise. *(Phase 5.)*

## Creative director comparing multiple versions

A director iterating on an identity or a hero asset needs to know whether v3 is actually better than v2 — not just different. The engine scores each version against the same brand standard and explains what improved and what regressed, turning "I think this one's stronger" into a defensible, side-by-side judgment. *(Comparative versioning matures in Phase 6.)*

---

**Common thread:** in every case the bottleneck is the same — too much creative to judge by hand, and no consistent standard for judging it. Taste Engine is the layer that applies that standard, at volume, with its reasoning attached.
