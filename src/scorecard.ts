/**
 * Scoring primitives for Taste Engine.
 *
 * The weighted score sets a *default* decision. A fatal brand, production,
 * legal, or clarity issue can override that decision to `reject` regardless of
 * the number — see `getDecisionFromScore` and the override notes below.
 */

import type {
  CategoryScores,
  CategoryWeights,
  Decision,
  TasteScore,
} from "./types.js";

/** Decision band thresholds applied to the 0-100 taste score. */
export const PASS_THRESHOLD = 85;
export const REVISE_THRESHOLD = 60;

/** Each category is scored on this scale before weighting. */
export const CATEGORY_SCORE_MAX = 10;

/**
 * Compute a 0-100 weighted score from 0-10 category scores and weights.
 *
 * Weights are expected to sum to 1. If they don't, the result is normalized by
 * the total weight so the output stays on a 0-100 scale.
 */
export function calculateWeightedScore(
  scores: CategoryScores,
  weights: CategoryWeights,
): TasteScore {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const key of Object.keys(weights) as (keyof CategoryScores)[]) {
    const weight = weights[key];
    const score = scores[key];
    weightedSum += score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    return 0;
  }

  const normalizedToTen = weightedSum / totalWeight;
  return normalizeScore((normalizedToTen / CATEGORY_SCORE_MAX) * 100);
}

/**
 * Map a 0-100 score to a default decision.
 *
 * - 85-100 -> pass
 * - 60-84  -> revise
 * - 0-59   -> reject
 *
 * Note: this is the *default* only. A fatal production, brand-alignment,
 * legal/IP, or clarity issue can force `reject` even on a high score. That
 * override is a judgment call applied on top of this function, not encoded
 * in the number itself.
 */
export function getDecisionFromScore(score: TasteScore): Decision {
  const normalized = normalizeScore(score);
  if (normalized >= PASS_THRESHOLD) {
    return "pass";
  }
  if (normalized >= REVISE_THRESHOLD) {
    return "revise";
  }
  return "reject";
}

/** Clamp a score into the 0-100 range and round to a whole number. */
export function normalizeScore(score: number): TasteScore {
  if (Number.isNaN(score)) {
    return 0;
  }
  const clamped = Math.min(100, Math.max(0, score));
  return Math.round(clamped);
}

/** Create a zeroed-out category scorecard, useful as a starting point. */
export function createEmptyScorecard(): CategoryScores {
  return {
    clarity: 0,
    visual_hierarchy: 0,
    typography: 0,
    composition: 0,
    color_logic: 0,
    brand_alignment: 0,
    audience_fit: 0,
    commercial_strength: 0,
    originality: 0,
    production_readiness: 0,
  };
}
