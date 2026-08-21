/**
 * Canon 记忆烘焙。
 *
 * 依据：`NRH-20260822-0056`（改用 aux 摘要节点正文）
 *      + `NRH-20260822-0110`（Ant 不审中间产物 ⇒ 校验必须内置）
 * 低把握登记：U11。
 *
 * 与旧版的差别只有一处：`text` 从「套标题模板」改为「读节点正文并摘要」。
 * 章节白名单、稳定 id、source 三件套、salience、tags **全部沿用**，未重写。
 *
 * 流水线：解析节点（带正文）→ aux 摘要 → aux 反向核对 → 不通过则重生成一次
 *        → 二次仍不通过则**降级回标题模板**并标记。
 * 降级而非丢弃：宁可某条退回空壳，也不让未经核对的说法带着 confidence=1.0 入库。
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { createProviderFromEnvironment } from "../packages/server/src/provider-config.js";

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
  /** 摘要未通过核对、已降级回标题模板。留痕供抽检与回溯。 */
  readonly degraded?: true;
}

const root = resolve(process.cwd());
const sourceAbsolute = resolve(process.env.NAGI_CANON_SOURCE ?? "../authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md");
const outputAbsolute = resolve(process.env.NAGI_CANON_OUTPUT ?? "resources/world/events/canon-memory.json");
const sourceText = readFileSync(sourceAbsolute, "utf8");
const sha256 = createHash("sha256").update(sourceText).digest("hex").toUpperCase();
const sourceRelative = relative(resolve(root, ".."), sourceAbsolute).replaceAll("\\", "/");
const bakedAt = process.env.NAGI_CANON_BAKED_AT ?? "2026-08-22T00:00:00.000Z";

/**
 * 摘要提示词。
 *
 * 「不要推断动机」在试点里**不够** —— 模型仍把「他只是抬起脚，球像被重力吸住」
 * 写成「在队友刺激下开始主动跑位」，正好撞上 Bible §15.2 禁止的热血努力男主。
 * 故此处给出反例，并把「归属关系」单列一条：试点还把 V 队的凪写成了 Z 队，
 * 根源是正文用 Z 队选手与他**对比**，模型读成了归属。
 */
const SUMMARY_PROMPT = `你在为角色「凪诚士郎」制作**他本人的剧情记忆**。

输入是一个剧情节点的正文。写出这个节点发生了什么，作为凪日后可以回忆起的既成事实。

## 视角（最重要，先看这条）

这是**凪自己的记忆**，不是剧情简介、不是旁白复述。

- 正文里的 \`Nagi\`、\`Nagi Seishiro\`、\`凪\` **是同一个人，就是凪本人**。
  统一写成「凪」。**绝不可以写成他在旁观另一个叫 Nagi 的人**
- 正文的旁白是**玩家视角**（"你坐在观察席后方"）。**不要沿用**。
  正文里的「你」指的是与凪相处的那个人，一律写成 \`{{playerName}}\`
- **用第三人称记述，主语写「凪」**。不要用第一人称「我」，也不要用第二人称「你」。
  这是一份供检索的事实条目，不是凪的内心独白
- 与凪相处的那个人一律写成 \`{{playerName}}\`，**原样保留这个占位符**，
  不要替换成任何名字、也不要写成「对方」

## 事实要求

- 只写正文里**明确写到**的事实。正文没写的，一个字都不要补
- **不要解释动机、不要写因果**。例如正文写「他只是抬起脚，球落在他脚边」，
  就照实写，**不可**写成「他被激发了斗志所以主动跑位」——那是推断，不是正文
- **归属关系要看清**。正文常用 A 与 B 对比来突出某人，对比不等于归属。
  拿不准某人属于哪一方、哪支队伍时，**就不要写队伍**
- **必须保留专有名词**：人名、地名、球队名、比分、时间。它们是日后检索的钩子
- **不要逐字照抄对白**，用叙述概括说了什么

## 长度

**200 到 350 字，绝对不超过 400 字。** 内容多时压缩**叙述**，不要删事实。

直接输出这段文字，不要标题、不要 JSON、不要 markdown。`;

/** 反向核对：只找「正文没写却出现在摘要里」的说法。不管文笔，只管有没有出处。 */
/**
 * 反向核对。**只查硬事实，不查措辞**。
 *
 * 上一版偏严，把正文写了的细节（如「训练室处于待机状态」）也判成无据，
 * 51 条里误杀出 13 条降级。校验器本身也是模型判断——过严等于用一个不确定
 * 去否决另一个不确定，还白白丢掉信息。故本版收窄到只拦会**真正误导**的错误。
 */
const VERIFY_PROMPT = `你是事实核对员。

给你一段剧情正文，和一段根据它写成的摘要。找出摘要里**与正文矛盾、或正文完全没有的**硬事实。

**只检查这五类**：
1. 人物归属 —— 谁属于哪一方、哪支队伍、哪个组织
2. 数字 —— 比分、时间、数量
3. 专有名词 —— 人名、地名、队名、机构名
4. 动作主体 —— 某个动作是谁做的、对谁做的
5. 因果与动机 —— 摘要是否替人物解释了正文没说的动机

**不要报**这些（它们不算问题）：
- 措辞与详略差异、概括性表述、正文有但摘要没写的内容
- 摘要写得比正文简略、顺序不同、用词不同

特别注意：正文用对比手法提到某人时，不代表该人属于被对比的一方。

只输出 JSON，不要解释：
{"unsupported":["与正文矛盾的具体说法"]}
没有硬事实错误就返回 {"unsupported":[]}`;

interface Node {
  readonly nodeId: string;
  readonly title: string;
  readonly chapter: string;
  readonly body: string;
}

/** 切节点，**带正文**。旧版只取标题行、正文一行未读，这是 F7 的根因。 */
function parseNodes(text: string): readonly Node[] {
  const lines = text.split(/\r?\n/u);
  const nodes: Node[] = [];
  let chapter = "";
  let current: { nodeId: string; title: string; chapter: string; body: string[] } | undefined;
  const flush = (): void => {
    if (current) nodes.push({ ...current, body: current.body.join("\n").trim() });
    current = undefined;
  };
  for (const line of lines) {
    const chapterMatch = /^##\s+(.+?)\s*$/u.exec(line);
    if (chapterMatch) {
      flush();
      chapter = chapterMatch[1]!.replace(/[｜|].*$/u, "").trim();
      continue;
    }
    const nodeMatch = /^#{3,4}\s+---\s*([^|]+?)\s*\|\s*(.+?)\s*---(.*)$/u.exec(line);
    if (nodeMatch) {
      flush();
      const marker = nodeMatch[3]!.trim();
      const title = nodeMatch[2]!.trim();
      if (/J线|Stay线|Bad线|不显示|隐藏|备用|系统分流/u.test(`${title}${marker}`)) continue;
      current = { nodeId: nodeMatch[1]!.trim(), title, chapter, body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  flush();
  return nodes;
}

// ── 以下三个函数原样保留自旧版，未改 ──────────────────────────────
function allowedChapter(value: string): boolean {
  return /第一部|第二部|第三部|第四部|第五部|第六部|第八章|M线|Dream线/u.test(value) && !/J线|Stay线|Bad线/u.test(value);
}

function salienceFor(value: string): number {
  if (/TRUE|Dream|成名|世界看见|世界中心/u.test(value)) return 1;
  if (/终局|签约|世界杯|曼城|同居|关系/u.test(value)) return 0.85;
  return 0.65;
}

function tagsFor(value: string, chapter: string): string[] {
  const tags = [chapter];
  if (/足球|比赛|世界杯|训练|球场|成名/u.test(value)) tags.push("football");
  if (/关系|同居|亲密|归来|公寓|夏天|围巾/u.test(value)) tags.push("relationship");
  if (/冲突|低谷|淘汰|摩擦|失望/u.test(value)) tags.push("friction");
  if (/Dream|TRUE|世界中心|成名/u.test(value)) tags.push("dream");
  return [...new Set(tags.filter(Boolean))];
}
// ──────────────────────────────────────────────────────────────

const provider = createProviderFromEnvironment();
const apiKey = process.env.NAGI_DEV_LLM_KEY;
if (!provider?.hasSlot("aux") || !apiKey) {
  throw new Error("烘焙需要 aux 能力位与 key：请配置 NAGI_LLM_MODEL_AUX 与 NAGI_DEV_LLM_KEY");
}

async function summarize(node: Node, feedback?: readonly string[]): Promise<string> {
  const correction = feedback?.length
    ? `\n\n上一版摘要有以下说法在正文中找不到依据，请去掉或改正：\n${feedback.map((item) => `- ${item}`).join("\n")}`
    : "";
  const result = await provider!.complete({
    model: "aux",
    messages: [
      { role: "system", content: SUMMARY_PROMPT },
      { role: "user", content: `节点标题：${node.title}\n\n正文：\n${node.body.slice(0, 6000)}${correction}` },
    ],
    temperature: 0.2,
    maxTokens: 900,
  }, { apiKey: apiKey! });
  return result.text.trim();
}

async function verify(node: Node, summary: string): Promise<readonly string[]> {
  const result = await provider!.complete({
    model: "aux",
    messages: [
      { role: "system", content: VERIFY_PROMPT },
      { role: "user", content: `正文：\n${node.body.slice(0, 6000)}\n\n摘要：\n${summary}` },
    ],
    temperature: 0,
    maxTokens: 400,
  }, { apiKey: apiKey! });
  try {
    const cleaned = result.text.trim().replace(/^```(?:json)?\s*/u, "").replace(/\s*```$/u, "");
    const parsed = JSON.parse(cleaned) as { unsupported?: unknown };
    if (!Array.isArray(parsed.unsupported)) return [];
    return parsed.unsupported.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    // 核对结果解析不了 ⇒ 视为未通过。宁可降级，不可放行未核对的内容。
    return ["核对结果无法解析"];
  }
}

/**
 * 长度上限**从预算推导，不是拍脑袋**。
 *
 *   canonMemory 预算 2000 token（runtime.yaml）
 *   ÷ topK.canon = 8 条          ⇒ 每条 250 token
 *   ÷ 0.561 token/字（实测中文比） ⇒ 约 445 字
 *
 * 取 400 留余量。教训：上一版我拍了 180，而 V17 节点正文中位 1220 字、
 * p90 达 2609 字——把它压进 180 字还要保住全部专有名词与事实，
 * 是个不可能任务，结果 51 条里 44 条降级（86%）。
 */
const MAX_CHARS = 400;

/**
 * 程序化硬检查。**不依赖模型自觉**——上一版把视角和长度只写进提示词，
 * 结果 51 条里 26 条人称混乱、最长一条 342 字（超上限一倍多）。
 * 这些是可以用规则确定判定的，就不该交给模型。
 */
function mechanicalIssues(text: string): readonly string[] {
  const issues: string[] = [];
  const chars = [...text].length;
  if (chars > MAX_CHARS) issues.push(`超长：${chars} 字，上限 ${MAX_CHARS} 字，请压缩叙述但保留全部事实`);
  // 第二人称是玩家视角残留。这是凪的记忆，出现「你」意味着视角写错了。
  // 先挖掉 {{playerName}} 占位符再查，避免误判。
  const withoutPlaceholder = text.replaceAll("{{playerName}}", "◇");
  if (/你/u.test(withoutPlaceholder)) issues.push("出现了第二人称「你」。用第三人称记述，主语写「凪」，对方写作 {{playerName}}");
  // 第一人称同样是视角写错。上一版禁掉「你」之后，模型跳到了另一个极端写「我」。
  // 排除「我们」「自我」这类不构成叙述主语的用法。
  if (/(?:^|[。，、；：！？\s])我(?!们)/u.test(withoutPlaceholder)) {
    issues.push("出现了第一人称「我」。用第三人称记述，主语写「凪」");
  }
  // 同一条里中英名混用 ⇒ 模型可能把凪当成了两个人。
  if (/Nagi/u.test(text)) issues.push("出现了英文名 Nagi。凪本人一律写作「凪」，不要用 Nagi / Nagi Seishiro");
  return issues;
}

const fallbackText = (title: string): string =>
  `既成事实：在 TRUE END 时间线上，凪经历了「${title}」。这是已经发生的剧情节点，不是当前正在进行的事件。`;

const nodes = parseNodes(sourceText).filter((node) => allowedChapter(node.chapter) && node.body.length > 0);
console.log(`V17 命中 ${nodes.length} 个 TRUE END 节点，开始烘焙…\n`);

const memories: CanonMemory[] = [];
let degradedCount = 0;
let order = 0;

for (const node of nodes) {
  order += 1;
  let text = "";
  let degraded = false;
  try {
    text = await summarize(node);
    // 机械检查先跑：它确定、免费、且能给出可执行的修改指令。
    // 模型核对只在机械检查通过后跑，省一次调用。
    let issues = [...mechanicalIssues(text), ...await verify(node, text)];
    for (let attempt = 1; attempt <= 2 && issues.length > 0; attempt += 1) {
      console.log(`\n  ↻ ${node.nodeId} 第 ${attempt} 次重写（${issues.length} 处）：${issues[0]!.slice(0, 46)}`);
      text = await summarize(node, issues);
      issues = [...mechanicalIssues(text), ...await verify(node, text)];
    }
    if (issues.length > 0) {
      console.log(`\n  ⚠ ${node.nodeId} 三次仍未通过，降级回标题模板：${issues[0]!.slice(0, 46)}`);
      text = fallbackText(node.title);
      degraded = true;
      degradedCount += 1;
    }
  } catch (error) {
    console.log(`  ⚠ ${node.nodeId} 摘要失败，降级：${error instanceof Error ? error.message : String(error)}`);
    text = fallbackText(node.title);
    degraded = true;
    degradedCount += 1;
  }
  memories.push({
    id: `canon:${node.nodeId}:${order}`,
    namespace: "canon:nagisheart",
    kind: "canon",
    text,
    createdAt: bakedAt,
    updatedAt: bakedAt,
    salience: salienceFor(`${node.chapter} ${node.title}`),
    confidence: 1,
    tags: tagsFor(`${node.chapter} ${node.title}`, node.chapter),
    source: { path: sourceRelative, section: `${node.chapter} · ${node.nodeId} · ${node.title}`, sha256 },
    ...(degraded ? { degraded: true as const } : {}),
  });
  process.stdout.write(`\r  进度 ${order}/${nodes.length}`);
}

console.log();
if (memories.length === 0) throw new Error("no TRUE END canon nodes found in V17");
mkdirSync(dirname(outputAbsolute), { recursive: true });
writeFileSync(outputAbsolute, `${JSON.stringify({ schemaVersion: 1, source: { path: sourceRelative, sha256 }, memories }, null, 2)}\n`, "utf8");
const lengths = memories.map((memory) => [...memory.text].length).sort((left, right) => left - right);
console.log(`\nbaked ${memories.length} canon memories -> ${outputAbsolute}`);
console.log(`降级 ${degradedCount} 条 | 字数 中位 ${lengths[Math.floor(lengths.length / 2)]} · 最长 ${lengths.at(-1)}`);
