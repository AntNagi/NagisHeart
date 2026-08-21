import type { ContextBlockKind, ResourceBlock } from "../context/types.js";
import type { ResourceDescriptor } from "./types.js";

const KINDS = new Set<ContextBlockKind>([
  "personality", "speech", "style_anchor", "canon", "relationship",
  "behavior", "policy", "memory", "conversation", "recap",
]);

function scalar(value: string): string | number | boolean | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/u.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function arrayOfStrings(value: string): readonly string[] {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return [];
  return trimmed.slice(1, -1).split(",").map((item) => String(scalar(item) ?? "").trim()).filter(Boolean);
}

/** Parses only the resource contract; it intentionally ignores unknown YAML. */
export function parseResourceMarkdown(input: string, fallbackId = "resource.unknown"): ResourceDescriptor {
  const lines = input.replace(/^\uFEFF/u, "").split(/\r?\n/u);
  if (lines[0]?.trim() !== "---") throw new Error("resource is missing front-matter");
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) throw new Error("resource front-matter is not closed");

  const values = new Map<string, string | number | boolean>();
  let section = "";
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = /^(\s*)([A-Za-z_][\w-]*):\s*(.*?)\s*$/u.exec(line);
    if (!match) continue;
    const key = match[2] ?? "";
    const raw = match[3] ?? "";
    const indent = (match[1] ?? "").length;
    if (indent === 0) section = key;
    if (indent === 0 && raw) {
      const parsed = scalar(raw);
      if (parsed !== undefined) values.set(key, parsed);
    }
    if (section === "activation" && indent >= 2 && raw) {
      const parsed = scalar(raw);
      if (parsed !== undefined) values.set(`activation.${key}`, parsed);
    }
  }

  const id = String(values.get("id") ?? fallbackId);
  const kindValue = String(values.get("kind") ?? "policy");
  const kind: ContextBlockKind = KINDS.has(kindValue as ContextBlockKind) ? kindValue as ContextBlockKind : "policy";
  const priority = typeof values.get("activation.priority") === "number" ? Number(values.get("activation.priority")) : 0;
  const tokenBudget = typeof values.get("activation.token_budget") === "number" ? Number(values.get("activation.token_budget")) : 0;
  const always = values.get("activation.always") === true;
  const contextEnabled = values.get("activation.context") !== false;
  const body = lines.slice(end + 1).join("\n").trim();
  const activationWhen = values.get("activation.when");
  const block: ResourceBlock = {
    id,
    kind,
    text: body,
    priority,
    tokenBudget,
    active: contextEnabled,
    ...(!always && typeof activationWhen === "string" ? { when: activationWhen } : {}),
  };
  return {
    ...block,
    version: String(values.get("version") ?? "0.0.0"),
    contextEnabled,
    sourcePaths: [],
  };
}
