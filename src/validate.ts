/**
 * Lightweight, dependency-free validation.
 *
 * These are intentionally minimal runtime guards that mirror the JSON Schemas
 * in `schemas/`. A future phase may swap in a schema validator (e.g. Ajv) or a
 * parser (e.g. Zod); the function signatures here are the stable contract.
 */

import { ASSET_TYPES, CATEGORY_KEYS, DECISIONS } from "./schemas.js";
import type { AssetInput, BrandProfile, TasteAudit } from "./types.js";

export interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  /** Present only when `valid` is true. The same reference, narrowed. */
  value?: T;
}

type JsonObject = { [key: string]: unknown };

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(obj: JsonObject, key: string, errors: string[]): void {
  if (typeof obj[key] !== "string" || (obj[key] as string).length === 0) {
    errors.push(`"${key}" must be a non-empty string`);
  }
}

function requireStringArray(obj: JsonObject, key: string, errors: string[]): void {
  const value = obj[key];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    errors.push(`"${key}" must be an array of strings`);
  }
}

function ok<T>(value: T): ValidationResult<T> {
  return { valid: true, errors: [], value };
}

function fail<T>(errors: string[]): ValidationResult<T> {
  return { valid: false, errors };
}

function validateCategoryScores(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`"scores" must be an object`);
    return;
  }
  for (const key of CATEGORY_KEYS) {
    const score = value[key];
    if (typeof score !== "number" || Number.isNaN(score)) {
      errors.push(`"scores.${key}" must be a number`);
    } else if (score < 0 || score > 10) {
      errors.push(`"scores.${key}" must be between 0 and 10`);
    }
  }
}

export function validateTasteAudit(input: unknown): ValidationResult<TasteAudit> {
  const errors: string[] = [];
  if (!isRecord(input)) {
    return fail(["audit must be an object"]);
  }

  if (!ASSET_TYPES.includes(input.asset_type as never)) {
    errors.push(`"asset_type" must be one of: ${ASSET_TYPES.join(", ")}`);
  }
  if (!DECISIONS.includes(input.decision as never)) {
    errors.push(`"decision" must be one of: ${DECISIONS.join(", ")}`);
  }

  const score = input.taste_score;
  if (typeof score !== "number" || score < 0 || score > 100) {
    errors.push(`"taste_score" must be a number between 0 and 100`);
  }

  requireString(input, "summary", errors);
  validateCategoryScores(input.scores, errors);
  requireStringArray(input, "primary_issues", errors);
  requireStringArray(input, "recommended_fixes", errors);
  requireString(input, "production_notes", errors);
  requireString(input, "commercial_verdict", errors);
  requireString(input, "improved_direction", errors);
  requireString(input, "next_action", errors);

  if (!isRecord(input.brand_alignment)) {
    errors.push(`"brand_alignment" must be an object`);
  } else {
    if (typeof input.brand_alignment.aligned !== "boolean") {
      errors.push(`"brand_alignment.aligned" must be a boolean`);
    }
    requireString(input.brand_alignment, "notes", errors);
  }

  return errors.length === 0 ? ok(input as unknown as TasteAudit) : fail(errors);
}

export function validateBrandProfile(input: unknown): ValidationResult<BrandProfile> {
  const errors: string[] = [];
  if (!isRecord(input)) {
    return fail(["brand profile must be an object"]);
  }

  requireString(input, "brand_name", errors);
  requireString(input, "category", errors);
  requireString(input, "target_audience", errors);
  requireStringArray(input, "visual_style", errors);
  requireStringArray(input, "avoid", errors);
  requireStringArray(input, "brand_personality", errors);
  requireStringArray(input, "production_constraints", errors);
  requireString(input, "quality_bar", errors);

  if (!isRecord(input.typography_preferences)) {
    errors.push(`"typography_preferences" must be an object`);
  } else {
    requireString(input.typography_preferences, "direction", errors);
  }

  if (!isRecord(input.color_preferences)) {
    errors.push(`"color_preferences" must be an object`);
  } else {
    requireStringArray(input.color_preferences, "palette", errors);
  }

  return errors.length === 0 ? ok(input as unknown as BrandProfile) : fail(errors);
}

export function validateAssetInput(input: unknown): ValidationResult<AssetInput> {
  const errors: string[] = [];
  if (!isRecord(input)) {
    return fail(["asset input must be an object"]);
  }

  if (!ASSET_TYPES.includes(input.asset_type as never)) {
    errors.push(`"asset_type" must be one of: ${ASSET_TYPES.join(", ")}`);
  }
  requireString(input, "asset_description", errors);
  requireString(input, "intended_use", errors);
  requireString(input, "target_audience", errors);
  requireStringArray(input, "constraints", errors);

  const brandResult = validateBrandProfile(input.brand_profile);
  if (!brandResult.valid) {
    errors.push(...brandResult.errors.map((e) => `brand_profile: ${e}`));
  }

  return errors.length === 0 ? ok(input as unknown as AssetInput) : fail(errors);
}
