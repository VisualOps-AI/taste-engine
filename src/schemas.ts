/**
 * Shared constants and rubric weight presets.
 *
 * The markdown files in `rubrics/` are the authoritative, human-facing rubrics
 * and use richer, asset-specific criteria. The weight presets here are a
 * pragmatic projection of that rubric emphasis onto the ten canonical
 * `CategoryScores` fields, so the TypeScript scorer can produce a number.
 * Each preset sums to 1.
 */

import type { AssetType, CategoryWeights, Decision } from "./types.js";

export const ASSET_TYPES: readonly AssetType[] = [
  "apparel_graphic",
  "landing_page",
  "ad_creative",
  "brand_identity",
  "ai_visual",
  "social_creative",
  "product_mockup",
];

export const DECISIONS: readonly Decision[] = ["pass", "revise", "reject"];

export const CATEGORY_KEYS: readonly (keyof CategoryWeights)[] = [
  "clarity",
  "visual_hierarchy",
  "typography",
  "composition",
  "color_logic",
  "brand_alignment",
  "audience_fit",
  "commercial_strength",
  "originality",
  "production_readiness",
];

/** Balanced default used for asset types without a dedicated rubric. */
export const DEFAULT_WEIGHTS: CategoryWeights = {
  clarity: 0.1,
  visual_hierarchy: 0.1,
  typography: 0.1,
  composition: 0.1,
  color_logic: 0.1,
  brand_alignment: 0.1,
  audience_fit: 0.1,
  commercial_strength: 0.1,
  originality: 0.1,
  production_readiness: 0.1,
};

/** Per-asset-type weight presets. See note at top of file. */
export const RUBRIC_WEIGHTS: Record<AssetType, CategoryWeights> = {
  // apparel-rubric.md
  apparel_graphic: {
    clarity: 0.1,
    visual_hierarchy: 0,
    typography: 0.15,
    composition: 0.1,
    color_logic: 0.05,
    brand_alignment: 0.1,
    audience_fit: 0,
    commercial_strength: 0.15,
    originality: 0.15,
    production_readiness: 0.2,
  },
  // landing-page-rubric.md (commercial_strength = conversion, brand_alignment = brand trust)
  landing_page: {
    clarity: 0.2,
    visual_hierarchy: 0.2,
    typography: 0.1,
    composition: 0.1,
    color_logic: 0.05,
    brand_alignment: 0.15,
    audience_fit: 0,
    commercial_strength: 0.2,
    originality: 0,
    production_readiness: 0,
  },
  // ad-creative-rubric.md (visual_hierarchy = hook, audience_fit = emotional pull)
  ad_creative: {
    clarity: 0.15,
    visual_hierarchy: 0.2,
    typography: 0,
    composition: 0.15,
    color_logic: 0,
    brand_alignment: 0.15,
    audience_fit: 0.1,
    commercial_strength: 0.1,
    originality: 0.1,
    production_readiness: 0.05,
  },
  // brand-identity-rubric.md (originality = distinctiveness, clarity = memorability,
  // production_readiness = scalability + usability, visual_hierarchy = consistency)
  brand_identity: {
    clarity: 0.15,
    visual_hierarchy: 0.1,
    typography: 0.15,
    composition: 0,
    color_logic: 0.1,
    brand_alignment: 0.15,
    audience_fit: 0,
    commercial_strength: 0,
    originality: 0.2,
    production_readiness: 0.15,
  },
  ai_visual: DEFAULT_WEIGHTS,
  social_creative: DEFAULT_WEIGHTS,
  product_mockup: DEFAULT_WEIGHTS,
};

/** Resolve the weight preset for an asset type, falling back to the balanced default. */
export function getWeightsForAssetType(assetType: AssetType): CategoryWeights {
  return RUBRIC_WEIGHTS[assetType] ?? DEFAULT_WEIGHTS;
}
