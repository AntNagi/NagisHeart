import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

interface CanonMemory {
  readonly id: string;
  readonly namespace: "canon:nagisheart";
  readonly kind: "canon";
  readonly text: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly salience: number;
  readonly confidence: 1;
  readonly tags: readonly string[];
  readonly source: { readonly path: string; readonly section: string; readonly sha256: string };
}

const root = resolve(process.cwd());
const sourceAbsolute = resolve(process.env.NAGI_CANON_SOURCE ?? "../authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md");
const outputAbsolute = resolve(process.env.NAGI_CANON_OUTPUT ?? "resources/world/events/canon-memory.json");
const sourceText = readFileSync(sourceAbsolute, "utf8");
const sha256 = createHash("sha256").update(sourceText).digest("hex").toUpperCase();
const sourceRelative = relative(resolve(root, ".."), sourceAbsolute).replaceAll("\\", "/");
const bakedAt = process.env.NAGI_CANON_BAKED_AT ?? "2026-08-21T00:00:00.000Z";
const lines = sourceText.split(/\r?\n/u);
const memories: CanonMemory[] = [];
let chapter = "";
let order = 0;

function allowedChapter(value: string): boolean {
  return /第一部|第二部|第三部|第四部|第五部|第六部|第八章|M线|Dream线/u.test(value) && !/J线|Stay线|Bad线/u.test(value);
}

function salienceFor(value: string): number {
  if (/TRUE|Dream|成名|世界看见|世界中心/u.test(value)) return 1;
  if (/终局|签约|世界杯|曼城|同居|关系/u.test(value)) return 0.85;
  return 0.65;
}

function tagsFor(value: string): string[] {
  const tags = [chapter];
  if (/足球|比赛|世界杯|训练|球场|成名/u.test(value)) tags.push("football");
  if (/关系|同居|亲密|归来|公寓|夏天|围巾/u.test(value)) tags.push("relationship");
  if (/冲突|低谷|淘汰|摩擦|失望/u.test(value)) tags.push("friction");
  if (/Dream|TRUE|世界中心|成名/u.test(value)) tags.push("dream");
  return [...new Set(tags.filter(Boolean))];
}

for (const line of lines) {
  const chapterMatch = line.match(/^##\s+(.+?)\s*$/u);
  if (chapterMatch) {
    chapter = chapterMatch[1]!.replace(/[｜|].*$/u, "").trim();
    continue;
  }
  const node = line.match(/^#{3,4}\s+---\s*([^|]+?)\s*\|\s*(.+?)\s*---(.*)$/u);
  if (!node || !allowedChapter(chapter)) continue;
  const nodeId = node[1]!.trim();
  const title = node[2]!.trim();
  const marker = node[3]!.trim();
  if (/J线|Stay线|Bad线|不显示|隐藏|备用|系统分流/u.test(`${title}${marker}`)) continue;
  order += 1;
  const section = `${chapter} · ${nodeId} · ${title}`;
  const now = bakedAt;
  memories.push({
    id: `canon:${nodeId}:${order}`,
    namespace: "canon:nagisheart",
    kind: "canon",
    text: `既成事实：在 TRUE END 时间线上，凪经历了「${title}」。这是已经发生的剧情节点，不是当前正在进行的事件。`,
    createdAt: now,
    updatedAt: now,
    salience: salienceFor(`${chapter} ${title}`),
    confidence: 1,
    tags: tagsFor(`${chapter} ${title}`),
    source: { path: sourceRelative, section, sha256 },
  });
}

if (memories.length === 0) throw new Error("no TRUE END canon nodes found in V17");
mkdirSync(dirname(outputAbsolute), { recursive: true });
writeFileSync(outputAbsolute, `${JSON.stringify({ schemaVersion: 1, source: { path: sourceRelative, sha256 }, memories }, null, 2)}\n`, "utf8");
console.log(`baked ${memories.length} canon memories -> ${outputAbsolute}`);
