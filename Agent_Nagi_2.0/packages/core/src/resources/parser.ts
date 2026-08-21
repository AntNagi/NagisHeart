import type { ContextBlockKind, ResourceBlock } from "../context/types.js";
import type { SceneId } from "../domain/state.js";
import type { ResourceDescriptor } from "./types.js";

const KINDS = new Set<ContextBlockKind>([
  "personality", "speech", "style_anchor", "timeline", "canon", "relationship",
  "behavior_rule", "behavior", "policy", "event", "memory", "conversation", "recap",
]);

/** YAML 行内注释：`#` 前需有空白才算注释；引号内的 `#` 是正文。 */
function stripInlineComment(value: string): string {
  const raw = value.trim();
  if (raw.startsWith("\"") || raw.startsWith("'")) {
    const quote = raw[0]!;
    const close = raw.indexOf(quote, 1);
    return close === -1 ? raw : raw.slice(0, close + 1);
  }
  return raw.replace(/\s+#.*$/u, "").trim();
}

function scalar(value: string): string | number | boolean | undefined {
  // 不剥行内注释会让 `position: tail   # 说明` 整行变成值，
  // 且**无任何报错**——尾部锚因此静默失效。见 OPEN_QUESTIONS F21。
  const trimmed = stripInlineComment(value);
  if (!trimmed) return undefined;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/u.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function stringArray(value: string): readonly string[] {
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
      const parsed = key === "scenes" ? stringArray(raw).join(",") : scalar(raw);
      if (parsed !== undefined) values.set(`activation.${key}`, parsed);
    }
  }

  const id = String(values.get("id") ?? fallbackId);
  const kindValue = String(values.get("kind") ?? "policy");
  const kindRecognized = KINDS.has(kindValue as ContextBlockKind);
  // 回落保留（不抛错，避免一份资源写错就整个服务起不来），但**必须留痕**：
  // 静默回落曾让 10 份资源的 kind 被悄悄改写而无人发现。见 OPEN_QUESTIONS F19。
  const kind: ContextBlockKind = kindRecognized ? kindValue as ContextBlockKind : "policy";
  const priority = typeof values.get("activation.priority") === "number" ? Number(values.get("activation.priority")) : 0;
  const tokenBudget = typeof values.get("activation.token_budget") === "number" ? Number(values.get("activation.token_budget")) : 0;
  const always = values.get("activation.always") === true;
  const contextEnabled = values.get("activation.context") !== false;
  const scenesValue = values.get("activation.scenes");
  const validScenes = new Set<SceneId>(["daily", "affection", "intimacy", "conflict", "football", "setback"]);
  const scenes = typeof scenesValue === "string"
    ? scenesValue.split(",").filter((scene): scene is SceneId => validScenes.has(scene as SceneId))
    : [];
  const body = lines.slice(end + 1).join("\n").trim();
  const activationWhen = values.get("activation.when");
  const block: ResourceBlock = {
    id,
    kind,
    ...(kindRecognized ? {} : { unrecognizedKind: kindValue }),
    text: body,
    priority,
    tokenBudget,
    active: contextEnabled,
    ...(values.get("activation.position") === "tail" ? { position: "tail" as const } : {}),
    ...(scenes.length > 0 ? { scenes } : {}),
    ...(!always && typeof activationWhen === "string" ? { when: activationWhen } : {}),
  };
  return {
    ...block,
    version: String(values.get("version") ?? "0.0.0"),
    contextEnabled,
    sourcePaths: [],
  };
}
