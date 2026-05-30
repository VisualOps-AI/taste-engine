#!/usr/bin/env node
/**
 * Taste Engine CLI — Phase 2.
 *
 * Reads a structured audit input file, computes the weighted taste score and
 * a PASS / REVISE / REJECT decision using the existing scorecard logic, and
 * prints a readable terminal report.
 *
 * Usage:
 *   taste audit <input.json>
 *   node dist/cli.js audit examples/apparel-input-example.json
 *
 * Node built-ins only — no external CLI dependencies.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { argv, exit, stdout } from "node:process";

import {
  calculateWeightedScore,
  getDecisionFromScore,
  getWeightsForAssetType,
  validateAuditInput,
} from "./index.js";
import type { AuditInput, CategoryScores, Decision } from "./index.js";

const EXIT_OK = 0;
const EXIT_REJECT = 1;
const EXIT_ERROR = 2;

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

const USAGE = `Taste Engine — Creative QA CLI

Usage:
  taste audit <input.json>

Commands:
  audit <file>   Score an audit input file and print a verdict.

Options:
  -h, --help     Show this help.

Example:
  taste audit examples/apparel-input-example.json

Exit codes:
  0  pass / revise
  1  reject
  2  usage or input error
`;

function fail(message: string): never {
  process.stderr.write(`${paint("error:", ansi.bold, ansi.red)} ${message}\n`);
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

function report(input: AuditInput): Decision {
  const weights = getWeightsForAssetType(input.asset_type);
  const score = calculateWeightedScore(input.scores, weights);
  const decision = getDecisionFromScore(score);

  const rule = paint("─".repeat(52), ansi.dim);

  stdout.write(`\n${paint("Taste Engine — Creative QA Audit", ansi.bold, ansi.cyan)}\n`);
  stdout.write(`${rule}\n`);
  stdout.write(`${paint("Asset type:", ansi.bold)}   ${input.asset_type}\n`);
  stdout.write(`${paint("Taste score:", ansi.bold)}  ${score} / 100\n`);
  stdout.write(
    `${paint("Decision:", ansi.bold)}     ${paint(
      decision.toUpperCase(),
      ansi.bold,
      decisionColor(decision),
    )}\n`,
  );

  stdout.write(`\n${paint("Summary", ansi.bold)}\n  ${input.summary}\n`);

  stdout.write(`\n${paint("Category scores", ansi.bold)}\n`);
  printCategoryScores(input.scores);

  printList("Primary issues", input.primary_issues, false);
  printList("Recommended fixes", input.recommended_fixes, true);

  stdout.write(`\n${paint("Next action", ansi.bold)}\n  ${input.next_action}\n`);
  stdout.write(`${rule}\n`);

  return decision;
}

function main(): void {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    stdout.write(USAGE);
    exit(args.length === 0 ? EXIT_ERROR : EXIT_OK);
  }

  const [command, filePath] = args;

  if (command !== "audit") {
    fail(`unknown command: ${command}\n\n${USAGE}`);
  }
  if (filePath === undefined) {
    fail(`missing input file.\n\n${USAGE}`);
  }

  const input = loadInput(filePath);
  const decision = report(input);

  exit(decision === "reject" ? EXIT_REJECT : EXIT_OK);
}

main();
