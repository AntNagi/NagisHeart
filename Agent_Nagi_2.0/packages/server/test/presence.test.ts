import { describe, expect, it } from "vitest";
import { loadPresenceConfig, resolvePresence } from "../src/presence.js";

const config = loadPresenceConfig();
/** 确定性选取——随机会让断言时灵时不灵。 */
const first = (texts: readonly string[]): string => texts[0]!;

describe("凪此刻在做什么", () => {
  it("读得到资源里的状态表", () => {
    expect(config.rules.length).toBeGreaterThan(0);
    expect(config.recentTurnWindowMinutes).toBe(5);
    expect(config.recentTurnText).toBe("在");
  });

  it("按时段给出状态", () => {
    const at = (hour: number): string =>
      resolvePresence(config, new Date(2026, 7, 23, hour, 0, 0), undefined, first).text;
    expect(at(4)).toBe("睡着");
    expect(at(20)).toBe("在打游戏");
    expect(at(15)).toBe("训练");
  });

  it("刚聊过就压过时段表——否则凌晨四点正在说话却显示「睡着」", () => {
    // 这是本设计最容易出丑的地方：状态与眼前的事实互相打脸，比没有状态更糟。
    const now = new Date(2026, 7, 23, 4, 0, 0);
    const justNow = new Date(now.getTime() - 60_000);
    const state = resolvePresence(config, now, justNow, first);
    expect(state.text).toBe("在");
    expect(state.recentlyActive).toBe(true);
  });

  it("超过时间窗后回到时段表", () => {
    const now = new Date(2026, 7, 23, 4, 0, 0);
    const longAgo = new Date(now.getTime() - 60 * 60_000);
    const state = resolvePresence(config, now, longAgo, first);
    expect(state.text).toBe("睡着");
    expect(state.recentlyActive).toBe(false);
  });

  it("资源里不写「在想你」这类——凪的在意从不用宣告表达", () => {
    // 这条测的是**内容判据**而非代码：卖可爱的状态一旦混进资源，
    // 整个设计就退化成恋爱机器人。judge 不了语义，但能挡住明显的几个。
    const all = config.rules.flatMap((rule) => rule.texts);
    for (const text of all) {
      expect(text).not.toMatch(/想你|等你|想念|喜欢你|在意/u);
    }
  });
});
