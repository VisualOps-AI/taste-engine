#!/usr/bin/env node
/**
 * Taste Engine CLI — Phase 2.
 *
 * Commands:
 *   audit <input.json>      Score an input and print a PASS / REVISE / REJECT verdict.
 *   override <input.json>   Record a human override of the engine decision.
 *
 * Usage:
 *   taste audit examples/apparel-input-example.json
 *   taste override examples/apparel-input-example.json --decision pass --reason "..." --note "..."
 *
 * Node built-ins only — no external CLI dependencies.
 */

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { argv, exit, stderr, stdout } from "node:process";
import { randomUUID } from "node:crypto";

import {
  calculateWeightedScore,
  DECISIONS,
  getDecisionFromScore,
  getWeightsForAssetType,
  HUMAN_DECISIONS,
  validateAuditInput,
} from "./index.js";
import type {
  AuditInput,
  CategoryScores,
  Decision,
  HumanDecision,
  HumanTasteLoop,
  OverrideRecord,
  ReviewStatus,
} from "./index.js";

const EXIT_OK = 0;
const EXIT_REJECT = 1;
const EXIT_ERROR = 2;

const DEFAULT_LOG = "overrides.jsonl";

const useColor = stdout.isTTY && process.env.NO_COLOR === undefined;

const ansi = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
} as const;

function paint(text: string, ...codes: string[]): string {
  if (!useColor) {
    return text;
  }
  return `${codes.join("")}${text}${ansi.reset}`;
}

function decisionColor(decision: Decision): string {
  switch (decision) {
    case "pass":
      return ansi.green;
    case "revise":
      return ansi.yellow;
    case "reject":
      return ansi.red;
  }
}

function paintDecision(decision: Decision): string {
  return paint(decision.toUpperCase(), ansi.bold, decisionColor(decision));
}

const USAGE = `Taste Engine — Creative QA CLI

Usage:
  taste audit <input.json> [--human-decision <pass|revise|reject|pending>] [--override-reason <text>] [--calibration-note <text>] [--json]
  taste override <input.json> --decision <pass|revise|reject> --reason <text> [--note <text>] [--log <path>]

Commands:
  audit <file>      Score an audit input and print a verdict, with an optional human review.
  override <file>   Record a human override of the engine decision to a log.

Options (audit):
  --human-decision  Optional. Human's call: pass | revise | reject | pending (default: pending).
  --override-reason Required when the human decision differs from the engine decision.
  --calibration-note Optional. Note to steer future scoring (seeds brand taste memory).
  --json            Optional. Emit a JSON audit object instead of the human-readable report.

Options (override):
  --decision        Required. The human decision: pass | revise | reject.
  --reason          Required. Why the engine decision was overridden.
  --note            Optional. Calibration note to steer future scoring.
  --log             Optional. Log file path (default: ${DEFAULT_LOG}).

Options:
  -h, --help        Show this help.

Exit codes:
  0  effective decision is pass / revise (or override recorded)
  1  effective decision is reject
  2  usage or input error
`;

function fail(message: string): never {
  stderr.write(`${paint("error:", ansi.bold, ansi.red)} ${message}\n`);
  exit(EXIT_ERROR);
}

function loadInput(filePath: string): AuditInput {
  const absolute = resolve(filePath);
  if (!existsSync(absolute)) {
    fail(`file not found: ${filePath}`);
  }

  let raw: string;
  try {
    raw = readFileSync(absolute, "utf8");
  } catch (cause) {
    fail(`could not read ${filePath}: ${(cause as Error).message}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.replace(/^﻿/, ""));
  } catch (cause) {
    fail(`invalid JSON in ${filePath}: ${(cause as Error).message}`);
  }

  const result = validateAuditInput(parsed);
  if (!result.valid || result.value === undefined) {
    fail(`invalid audit input in ${filePath}:\n  - ${result.errors.join("\n  - ")}`);
  }

  return result.value;
}

interface ParsedArgs {
  positionals: string[];
  options: Map<string, string>;
}

/** Flags that take no value; presence alone is meaningful. */
const BOOLEAN_FLAGS = new Set(["json"]);

function parseArgs(tokens: string[]): ParsedArgs {
  const positionals: string[] = [];
  const options = new Map<string, string>();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const body = token.slice(2);
    const eq = body.indexOf("=");
    if (eq !== -1) {
      options.set(body.slice(0, eq), body.slice(eq + 1));
      continue;
    }

    if (BOOLEAN_FLAGS.has(body)) {
      options.set(body, "true");
      continue;
    }

    const next = tokens[i + 1];
    if (next === undefined || next.startsWith("--")) {
      fail(`option --${body} requires a value`);
    }
    options.set(body, next);
    i++;
  }

  return { positionals, options };
}

function scoreInput(input: AuditInput): { score: number; decision: Decision } {
  const weights = getWeightsForAssetType(input.asset_type);
  const score = calculateWeightedScore(input.scores, weights);
  return { score, decision: getDecisionFromScore(score) };
}

function bar(score: number): string {
  const filled = Math.round(score);
  return "█".repeat(filled) + paint("░".repeat(10 - filled), ansi.dim);
}

function printCategoryScores(scores: CategoryScores): void {
  const labelWidth = Math.max(...Object.keys(scores).map((k) => k.length));
  for (const [name, score] of Object.entries(scores)) {
    const label = name.padEnd(labelWidth);
    stdout.write(`  ${label}  ${String(score).padStart(2)}/10  ${bar(score)}\n`);
  }
}

function printList(title: string, items: string[], ordered: boolean): void {
  if (items.length === 0) {
    return;
  }
  stdout.write(`\n${paint(title, ansi.bold)}\n`);
  items.forEach((item, index) => {
    const marker = ordered ? `${index + 1}.` : "•";
    stdout.write(`  ${marker} ${item}\n`);
  });
}

const RULE = paint("─".repeat(52), ansi.dim);

function reviewStatusColor(status: ReviewStatus): string {
  switch (status) {
    case "approved":
      return ansi.green;
    case "rejected":
      return ansi.red;
    case "revised":
      return ansi.yellow;
    case "overridden":
      return ansi.cyan;
    case "pending_human_review":
      return ansi.dim;
  }
}

/**
 * Resolve the human review from CLI flags against the engine decision.
 * The human is the final authority; the engine decision is the default.
 */
function resolveHumanLoop(
  engineDecision: Decision,
  options: Map<string, string>,
): HumanTasteLoop {
  const raw = options.get("human-decision") ?? "pending";
  if (!HUMAN_DECISIONS.includes(raw as never)) {
    fail(`--human-decision must be one of: ${HUMAN_DECISIONS.join(", ")}`);
  }
  const humanDecision = raw as HumanDecision;

  const overrideReason = options.get("override-reason");
  const calibrationNote = options.get("calibration-note");
  const note =
    calibrationNote !== undefined && calibrationNote.length > 0
      ? { calibration_note: calibrationNote }
      : {};

  if (humanDecision === "pending") {
    if (overrideReason !== undefined) {
      fail("--override-reason is not allowed when the human decision is pending");
    }
    return {
      review_status: "pending_human_review",
      engine_decision: engineDecision,
      human_decision: "pending",
      ...note,
    };
  }

  if (humanDecision !== engineDecision) {
    if (overrideReason === undefined || overrideReason.length === 0) {
      fail(
        "--override-reason is required when the human decision differs from the engine decision",
      );
    }
    return {
      review_status: "overridden",
      engine_decision: engineDecision,
      human_decision: humanDecision,
      override_reason: overrideReason,
      ...note,
    };
  }

  const matchStatus: Record<Decision, ReviewStatus> = {
    pass: "approved",
    revise: "revised",
    reject: "rejected",
  };
  return {
    review_status: matchStatus[humanDecision],
    engine_decision: engineDecision,
    human_decision: humanDecision,
    ...(overrideReason !== undefined && overrideReason.length > 0
      ? { override_reason: overrideReason }
      : {}),
    ...note,
  };
}

function buildAuditJson(
  input: AuditInput,
  tasteScore: number,
  engineDecision: Decision,
  loop: HumanTasteLoop,
): Record<string, unknown> {
  return {
    asset_type: input.asset_type,
    taste_score: tasteScore,
    engine_decision: engineDecision,
    human_review: loop,
    summary: input.summary,
    scores: input.scores,
    primary_issues: input.primary_issues,
    recommended_fixes: input.recommended_fixes,
    next_action: input.next_action,
  };
}

function printHumanLoop(loop: HumanTasteLoop): void {
  const humanColor =
    loop.human_decision === "pending"
      ? ansi.dim
      : decisionColor(loop.human_decision);

  stdout.write(`\n${paint("Human Taste Loop", ansi.bold)}\n`);
  stdout.write(
    `  Review status:    ${paint(loop.review_status, ansi.bold, reviewStatusColor(loop.review_status))}\n`,
  );
  stdout.write(`  Engine decision:  ${paintDecision(loop.engine_decision)}\n`);
  stdout.write(
    `  Human decision:   ${paint(loop.human_decision.toUpperCase(), ansi.bold, humanColor)}\n`,
  );
  if (loop.override_reason !== undefined) {
    stdout.write(`  Override reason:  ${loop.override_reason}\n`);
  }
  if (loop.calibration_note !== undefined) {
    stdout.write(`  Calibration note: ${loop.calibration_note}\n`);
  }
}

function runAudit(filePath: string, options: Map<string, string>): never {
  const input = loadInput(filePath);
  const { score, decision: engineDecision } = scoreInput(input);
  const loop = resolveHumanLoop(engineDecision, options);

  if (options.has("json")) {
    stdout.write(
      `${JSON.stringify(buildAuditJson(input, score, engineDecision, loop), null, 2)}\n`,
    );
  } else {
    stdout.write(`\n${paint("Taste Engine — Creative QA Audit", ansi.bold, ansi.cyan)}\n`);
    stdout.write(`${RULE}\n`);
    stdout.write(`${paint("Asset type:", ansi.bold)}      ${input.asset_type}\n`);
    stdout.write(`${paint("Taste score:", ansi.bold)}     ${score} / 100\n`);
    stdout.write(`${paint("Engine decision:", ansi.bold)} ${paintDecision(engineDecision)}\n`);

    stdout.write(`\n${paint("Summary", ansi.bold)}\n  ${input.summary}\n`);

    stdout.write(`\n${paint("Category scores", ansi.bold)}\n`);
    printCategoryScores(input.scores);

    printList("Primary issues", input.primary_issues, false);
    printList("Recommended fixes", input.recommended_fixes, true);

    printHumanLoop(loop);

    stdout.write(`\n${paint("Next action", ansi.bold)}\n  ${input.next_action}\n`);
    stdout.write(`${RULE}\n`);
  }

  const effective: Decision =
    loop.human_decision === "pending" ? engineDecision : loop.human_decision;
  exit(effective === "reject" ? EXIT_REJECT : EXIT_OK);
}

function runOverride(filePath: string, options: Map<string, string>): never {
  const input = loadInput(filePath);
  const { score: engineScore, decision: engineDecision } = scoreInput(input);

  const humanDecision = options.get("decision");
  if (humanDecision === undefined) {
    fail(`--decision is required (one of: ${DECISIONS.join(", ")})`);
  }
  if (!DECISIONS.includes(humanDecision as never)) {
    fail(`--decision must be one of: ${DECISIONS.join(", ")}`);
  }

  const reason = options.get("reason");
  if (reason === undefined || reason.length === 0) {
    fail("--reason is required");
  }

  const note = options.get("note");
  const logPath = resolve(options.get("log") ?? DEFAULT_LOG);

  const record: OverrideRecord = {
    id: `ovr_${randomUUID()}`,
    recorded_at: new Date().toISOString(),
    asset_type: input.asset_type,
    source: filePath,
    engine_score: engineScore,
    engine_decision: engineDecision,
    human_decision: humanDecision as Decision,
    override_reason: reason,
    ...(note !== undefined && note.length > 0 ? { calibration_note: note } : {}),
  };

  try {
    appendFileSync(logPath, `${JSON.stringify(record)}\n`, "utf8");
  } catch (cause) {
    fail(`could not write log ${logPath}: ${(cause as Error).message}`);
  }

  stdout.write(`\n${paint("Override recorded", ansi.bold, ansi.cyan)}\n`);
  stdout.write(`${RULE}\n`);
  stdout.write(`${paint("Asset type:", ansi.bold)}   ${record.asset_type}\n`);
  stdout.write(
    `${paint("Engine:", ansi.bold)}       ${paintDecision(engineDecision)} (${engineScore})\n`,
  );
  stdout.write(`${paint("Human:", ansi.bold)}        ${paintDecision(record.human_decision)}\n`);
  stdout.write(`${paint("Reason:", ansi.bold)}       ${record.override_reason}\n`);
  if (record.calibration_note !== undefined) {
    stdout.write(`${paint("Calibration:", ansi.bold)}  ${record.calibration_note}\n`);
  }
  if (record.human_decision === engineDecision) {
    stdout.write(
      `\n${paint("note:", ansi.bold, ansi.yellow)} human decision matches the engine — recorded, but not a divergence.\n`,
    );
  }
  stdout.write(`${paint("Logged to:", ansi.bold)}    ${options.get("log") ?? DEFAULT_LOG}\n`);
  stdout.write(`${RULE}\n`);

  exit(EXIT_OK);
}

function main(): void {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    stdout.write(USAGE);
    exit(args.length === 0 ? EXIT_ERROR : EXIT_OK);
  }

  const [command, ...rest] = args;
  const { positionals, options } = parseArgs(rest);
  const filePath = positionals[0];

  if (filePath === undefined) {
    fail(`missing input file.\n\n${USAGE}`);
  }

  switch (command) {
    case "audit":
      runAudit(filePath, options);
      break;
    case "override":
      runOverride(filePath, options);
      break;
    default:
      fail(`unknown command: ${command}\n\n${USAGE}`);
  }
}

main();
