/**
 * Canon 记忆烘焙 · 试点（NRH-20260822-0056 / U11）
 *
 * 只烘 3 个节点交 Ant 目视，通过后才改正式的 bake-canon.ts 跑全量 51 条。
 * 用法：pnpm exec tsx --env-file-if-exists=.env scripts/bake-canon-pilot.mts
 *
 * 与正式脚本的关系：本文件**只验证 `text` 的生成质量**。
 * 章节白名单、id、source 三件套、salience、tags 全部沿用 bake-canon.ts，此处不重复实现。
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createProviderFromEnvironment } from "../packages/server/src/provider-config.js";

const SOURCE = resolve(
  process.env.NAGI_CANON_SOURCE ??
    "../authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md",
);

/**
 * 摘要提示词。
 *
 * 四条硬约束，每条都对应一个具体风险：
 *  1. **只写正文写明的** —— 防模型脑补。canon 的 confidence 是 1.0，
 *     编出来的东西会被当既成事实反复使用，比 live 记错更难纠正。
 *  2. **不评价、不抒情** —— 这是记忆不是影评。评价会污染凪的人格判断。
 *  3. **保留专有名词**（人名、地名、队名、比分）—— 检索靠 bigram 命中这些实词，
 *     摘要若把「曼城」写成「英国那边」，就等于没进记忆。
 *  4. **不逐字抄对白** —— MANIFEST 的 V17 用途表规定 Canon 事件「逐字？→ 否」。
 *     台词逐字是 style_anchors 的活，两者分工不能混。
 */
const SUMMARY_PROMPT = `你在为一个角色 Agent 制作「剧情记忆」。

输入是一个剧情节点的正文。请写出这个节点**发生了什么**，作为凪诚士郎日后可以回忆起的既成事实。

硬性要求：
- 只写正文里**明确写到**的事。不要推断动机、不要补充正文没有的细节
- 不要评价、不要抒情、不要写"这体现了…"这类总结
- **必须保留专有名词**：人名、地名、球队名、比分、时间。这些是日后检索的钩子
- **不要逐字照抄对白**，用叙述的方式概括说了什么
- 用第三人称陈述，80 到 150 字
- 直接输出这段文字，不要标题、不要 JSON、不要 markdown`;

interface Node {
  readonly nodeId: string;
  readonly title: string;
  readonly chapter: string;
  readonly body: string;
  readonly startLine: number;
}

/** 把 V17 切成节点，**带正文** —— 旧脚本只取标题行，正文一行未读，这是 F7 的根因。 */
function parseNodes(text: string): readonly Node[] {
  const lines = text.split(/\r?\n/u);
  const nodes: Node[] = [];
  let chapter = "";
  let current: { nodeId: string; title: string; chapter: string; startLine: number; body: string[] } | undefined;
  const flush = (): void => {
    if (current) nodes.push({ ...current, body: current.body.join("\n").trim() });
    current = undefined;
  };
  lines.forEach((line, index) => {
    const chapterMatch = /^##\s+(.+?)\s*$/u.exec(line);
    if (chapterMatch) {
      flush();
      chapter = chapterMatch[1]!.replace(/[｜|].*$/u, "").trim();
      return;
    }
    const nodeMatch = /^#{3,4}\s+---\s*([^|]+?)\s*\|\s*(.+?)\s*---/u.exec(line);
    if (nodeMatch) {
      flush();
      current = { nodeId: nodeMatch[1]!.trim(), title: nodeMatch[2]!.trim(), chapter, startLine: index + 1, body: [] };
      return;
    }
    if (current) current.body.push(line);
  });
  flush();
  return nodes;
}

const provider = createProviderFromEnvironment();
if (!provider?.hasSlot("aux")) {
  console.error("需要配置 NAGI_LLM_MODEL_AUX 才能跑摘要");
  process.exit(2);
}
const apiKey = process.env.NAGI_DEV_LLM_KEY;
if (!apiKey) {
  console.error("需要 NAGI_DEV_LLM_KEY");
  process.exit(2);
}

const nodes = parseNodes(readFileSync(SOURCE, "utf8"));
console.log(`V17 解析出 ${nodes.length} 个节点（含正文）\n`);

// 挑三个覆盖不同性质的节点：初遇 / 关系推进 / 冲突低谷
const picks = ["w_game", "club_media"];
const selected = picks
  .map((key) => nodes.find((node) => node.nodeId === key) ?? nodes.find((node) => node.title.includes(key)))
  .filter((node): node is Node => !!node);

for (const node of selected) {
  const bodyChars = [...node.body].length;
  console.log("═".repeat(72));
  console.log(`节点 ${node.nodeId} | ${node.title}`);
  console.log(`章节 ${node.chapter} | V17 第 ${node.startLine} 行 | 正文 ${bodyChars} 字`);
  console.log("─".repeat(72));
  console.log("【旧】" + `既成事实：在 TRUE END 时间线上，凪经历了「${node.title}」。这是已经发生的剧情节点，不是当前正在进行的事件。`);
  console.log("─".repeat(72));
  try {
    const result = await provider.complete({
      model: "aux",
      messages: [
        { role: "system", content: SUMMARY_PROMPT },
        { role: "user", content: `节点标题：${node.title}\n\n正文：\n${node.body.slice(0, 6000)}` },
      ],
      temperature: 0.2,
      maxTokens: 500,
    }, { apiKey });
    console.log("【新】" + result.text.trim());
    console.log(`      （${[...result.text.trim()].length} 字 · ${result.latencyMs}ms · in ${result.inputTokens} / out ${result.outputTokens}）`);
  } catch (error) {
    console.log("【新】摘要失败：" + (error instanceof Error ? error.message : String(error)));
  }
  console.log();
}
