import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseResourceMarkdown, type ResourceBlock } from "@nagi/core";
import type { GuardConfig, ForbiddenPatternRule, FrequencyCapRule } from "@nagi/core";

export interface GuardPolicy {
  readonly config: GuardConfig;
  readonly fallbacks: readonly string[];
}

function scalar(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function section(text: string, name: string): string {
  const start = text.indexOf(`  ${name}:`);
  if (start < 0) return "";
  const end = text.slice(start + 1).search(/^  [a-z_]+:/m);
  return text.slice(start, end < 0 ? text.length : start + 1 + end);
}

function listItems(text: string): Array<Record<string, string>> {
  const items: Array<Record<string, string>> = [];
  let current: Record<string, string> | undefined;
  for (const line of text.split(/\r?\n/u)) {
    const id = line.match(/^\s+- id:\s*(.+)$/u);
    if (id) {
      current = { id: scalar(id[1]!) };
      items.push(current);
      continue;
    }
    const field = line.match(/^\s+([a-z_]+):\s*(.+)$/u);
    if (current && field) current[field[1]!] = scalar(field[2]!);
  }
  return items;
}

/** Reads the structured guard block without adding YAML dependencies to core. */
export function loadGuardPolicy(root: string): GuardPolicy {
  const path = join(root, "policy", "output_guard.md");
  const text = readFileSync(path, "utf8");
  const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] ?? "";
  const forbidden: ForbiddenPatternRule[] = listItems(section(frontMatter, "forbidden_patterns")).flatMap((item) => {
    if (!item.pattern || (item.severity !== "block" && item.severity !== "warn")) return [];
    return [{ id: item.id ?? "unknown", severity: item.severity, pattern: item.pattern, ...(item.why ? { why: item.why } : {}) }];
  });
  const frequency: FrequencyCapRule[] = listItems(section(frontMatter, "frequency_caps")).flatMap((item) => {
    const numbers = ["max_per_reply", "max_per_window", "window_turns"].map((key) => Number(item[key]));
    if (!item.phrase_pattern || numbers.some((value) => !Number.isFinite(value))) return [];
    return [{ id: item.id ?? "unknown", phrasePattern: item.phrase_pattern, maxPerReply: numbers[0]!, maxPerWindow: numbers[1]!, windowTurns: numbers[2]!, severity: item.severity === "block" ? "block" : "warn", ...(item.why ? { why: item.why } : {}) }];
  });
  const length = listItems(section(frontMatter, "length_caps"))[0] ?? {};
  const beats = listItems(section(frontMatter, "beat_caps"))[0] ?? {};
  const fallbackBlock = text.match(/降级候选[\s\S]*?```(?:text)?\r?\n([\s\S]*?)```/u)?.[1] ?? "";
  const fallbacks = fallbackBlock.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  return {
    config: {
      forbiddenPatterns: forbidden,
      frequencyCaps: frequency,
      defaultLength: Number(length.default) || 50,
      hardMaxLength: Number(length.hard_max) || 80,
      maxBeatsPerReply: Number(beats.max_per_reply) || 3,
    },
    fallbacks: fallbacks.length > 0 ? fallbacks : ["……好麻烦。"],
  };
}

function markdownFiles(directory: string): readonly string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "_sources" || entry.name === "MANIFEST.md") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files.sort();
}

/** Loads only server-side resource descriptors; raw source files are excluded. */
export function loadResourceBlocks(root: string): readonly ResourceBlock[] {
  const files = markdownFiles(root);
  const resources: ResourceBlock[] = [];
  for (const file of files) {
    const parsed = parseResourceMarkdown(readFileSync(file, "utf8"));
    resources.push(parsed);
  }
  return resources;
}
