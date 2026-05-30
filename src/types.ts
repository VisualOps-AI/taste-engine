/**
 * Core domain types for Taste Engine.
 *
 * These mirror the JSON Schemas in `schemas/` and are the contract shared by
 * the skill, the (future) CLI, and the (future) API.
 */

export type Decision = "pass" | "revise" | "reject";

export type AssetType =
  | "apparel_graphic"
  | "landing_page"
  | "ad_creative"
  | "brand_identity"
  | "ai_visual"
  | "social_creative"
  | "product_mockup";

/** Overall weighted result, constrained to 0-100 by validation/normalization. */
export type TasteScore = number;

/** A single category score, expected in the 0-10 range. */
export type CategoryScore = number;

/** The ten core scoring categories, each 0-10. */
export interface CategoryScores {
  clarity: CategoryScore;
  visual_hierarchy: CategoryScore;
  typography: CategoryScore;
  composition: CategoryScore;
  color_logic: CategoryScore;
  brand_alignment: CategoryScore;
  audience_fit: CategoryScore;
  commercial_strength: CategoryScore;
  originality: CategoryScore;
  production_readiness: CategoryScore;
}

/** Per-category weights for an asset type. Should sum to 1. */
export type CategoryWeights = Record<keyof CategoryScores, number>;

export type OverrideReason =
  | "brand_mismatch"
  | "production_defect"
  | "legal_ip"
  | "clarity_failure";

export interface ScoreOverride {
  triggered: boolean;
  reason_type: OverrideReason;
  reason: string;
}

export interface BrandAlignment {
  aligned: boolean;
  notes: string;
}

export interface TasteAudit {
  asset_type: AssetType;
  decision: Decision;
  taste_score: TasteScore;
  summary: string;
  scores: CategoryScores;
  primary_issues: string[];
  recommended_fixes: string[];
  production_notes: string;
  brand_alignment: BrandAlignment;
  commercial_verdict: string;
  improved_direction: string;
  regeneration_prompt?: string;
  override?: ScoreOverride;
  next_action: string;
}

export interface TypographyPreferences {
  direction: string;
  approved_typefaces?: string[];
  notes?: string;
}

export interface ColorPreferences {
  palette: string[];
  notes?: string;
}

export interface BrandProfile {
  brand_name: string;
  category: string;
  target_audience: string;
  visual_style: string[];
  avoid: string[];
  typography_preferences: TypographyPreferences;
  color_preferences: ColorPreferences;
  brand_personality: string[];
  production_constraints: string[];
  quality_bar: string;
}

export interface AssetInput {
  asset_type: AssetType;
  asset_description: string;
  asset_reference?: string;
  intended_use: string;
  target_audience: string;
  brand_profile: BrandProfile;
  constraints: string[];
}

/**
 * Input to the CLI scorer. The category `scores` and narrative are supplied by
 * the reviewer (or the skill); the engine computes `taste_score` and
 * `decision` from them deterministically. This is the deterministic scoring /
 * gating layer — it does not look at an image and assign category scores.
 */
export interface AuditInput {
  asset_type: AssetType;
  summary: string;
  scores: CategoryScores;
  primary_issues: string[];
  recommended_fixes: string[];
  next_action: string;
}
