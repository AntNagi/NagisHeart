import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * 「凪此刻在做什么」。
 *
 * 客户端顶部显示的那一行。它回答的不是「凪会说什么」，而是
 * **「你没在跟他说话的时候，他在干嘛」**——把聊天软件变成"一个人"的关键一步。
 *
 * ## 为什么放服务端
 *
 * 这是**人格规则**（断言了他的作息习惯），按域 B 红线必须由 `resources/` 声明，
 * 不许写死在代码里，更不该写在客户端——客户端不持有凪的任何人格资料。
 * 本模块只负责**解析**那份资源并按时间选一条。
 *
 * 依据：`resources/core/presence.md`。
 */

export interface PresenceState {
  readonly text: string;
  /** 是否因"刚聊过"而覆盖了时段表。客户端可据此不显示得太像状态机。 */
  readonly recentlyActive: boolean;
}

interface PresenceRule {
  readonly fromHour: number;
  readonly toHour: number;
  readonly texts: readonly string[];
}

interface PresenceConfig {
  readonly rules: readonly PresenceRule[];
  readonly recentTurnWindowMinutes: number;
  readonly recentTurnText: string;
}

/** 资源读不到时的兜底。**刻意只有一条且中性**——宁可平淡，不可编造他的习惯。 */
const FALLBACK: PresenceConfig = {
  rules: [],
  recentTurnWindowMinutes: 5,
  recentTurnText: "在",
};

/**
 * 从 `presence.md` 里那段 YAML 抠出状态表。
 *
 * 与 `runtime-config.ts` 同样是手写解析，不引 YAML 依赖——只取这几个字段，
 * 不做通用 YAML 支持。格式见资源文件里的 `states:` 块。
 */
function parsePresence(markdown: string): PresenceConfig {
  const rules: PresenceRule[] = [];
  const lines = markdown.split(/\r?\n/u);
  let pendingHours: [number, number] | undefined;
  for (const line of lines) {
    const hours = /^\s*-\s*hours:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/u.exec(line);
    if (hours) {
      pendingHours = [Number(hours[1]), Number(hours[2])];
      continue;
    }
    const text = /^\s*text:\s*\[(.+)\]\s*$/u.exec(line);
    if (text && pendingHours) {
      const texts = text[1]!
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/gu, ""))
        .filter(Boolean);
      if (texts.length > 0) rules.push({ fromHour: pendingHours[0], toHour: pendingHours[1], texts });
      pendingHours = undefined;
    }
  }
  const window = /^\s*recentTurnWindowMinutes:\s*(\d+)\s*$/mu.exec(markdown);
  const recentText = /^\s*recentTurnText:\s*["'](.+?)["']\s*$/mu.exec(markdown);
  return {
    rules,
    recentTurnWindowMinutes: window ? Number(window[1]) : FALLBACK.recentTurnWindowMinutes,
    recentTurnText: recentText ? recentText[1]! : FALLBACK.recentTurnText,
  };
}

let cached: PresenceConfig | undefined;

export function loadPresenceConfig(resourceRoot?: string): PresenceConfig {
  if (cached) return cached;
  const path = resolve(resourceRoot ?? process.env.NAGI_RESOURCE_ROOT ?? "resources", "core", "presence.md");
  try {
    cached = parsePresence(readFileSync(path, "utf8"));
  } catch {
    // 读不到不该让服务起不来，但必须留声——静默兜底会让"状态一直是那一句"
    // 看起来像设计如此。
    console.warn(`[presence] 读不到 ${path}，状态显示退化为兜底`);
    cached = FALLBACK;
  }
  return cached;
}

/**
 * 算出此刻的状态。
 *
 * @param now              当前时间
 * @param lastTurnAt       最后一轮对话的时间；没有则 undefined
 * @param pick             从候选里选一条。默认随机；测试注入确定实现。
 */
export function resolvePresence(
  config: PresenceConfig,
  now: Date,
  lastTurnAt: Date | undefined,
  pick: (texts: readonly string[]) => string = (texts) => texts[Math.floor(Math.random() * texts.length)]!,
): PresenceState {
  // 刚聊过就不看时段表：否则会出现"你凌晨四点正在跟他说话、顶上写着睡死了"
  // 这种状态与眼前事实互相打脸的情况，比没有状态更糟。
  if (lastTurnAt) {
    const minutes = (now.getTime() - lastTurnAt.getTime()) / 60_000;
    if (minutes >= 0 && minutes < config.recentTurnWindowMinutes) {
      return { text: config.recentTurnText, recentlyActive: true };
    }
  }
  const hour = now.getHours();
  const rule = config.rules.find((item) => hour >= item.fromHour && hour < item.toHour);
  if (!rule) return { text: config.recentTurnText, recentlyActive: false };
  return { text: pick(rule.texts), recentlyActive: false };
}
