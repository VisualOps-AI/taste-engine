/**
 * Taste Engine — public entry point.
 *
 * Creative QA for AI-generated brand assets: a judgment layer that scores,
 * critiques, and gates visual creative using design principles, brand context,
 * and production constraints.
 */

export type {
  Decision,
  AssetType,
  TasteScore,
  CategoryScore,
  CategoryScores,
  CategoryWeights,
  OverrideReason,
  ScoreOverride,
  BrandAlignment,
  TasteAudit,
  TypographyPreferences,
  ColorPreferences,
  BrandProfile,
  AssetInput,
} from "./types.js";

export {
  PASS_THRESHOLD,
  REVISE_THRESHOLD,
  CATEGORY_SCORE_MAX,
  calculateWeightedScore,
  getDecisionFromScore,
  normalizeScore,
  createEmptyScorecard,
} from "./scorecard.js";

export {
  ASSET_TYPES,
  DECISIONS,
  CATEGORY_KEYS,
  DEFAULT_WEIGHTS,
  RUBRIC_WEIGHTS,
  getWeightsForAssetType,
} from "./schemas.js";

export {
  validateTasteAudit,
  validateBrandProfile,
  validateAssetInput,
} from "./validate.js";

export type { ValidationResult } from "./validate.js";
