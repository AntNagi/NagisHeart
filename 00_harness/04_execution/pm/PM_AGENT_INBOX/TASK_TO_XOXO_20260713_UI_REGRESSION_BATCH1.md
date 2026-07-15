# XoXo UI Regression Batch 1

> 发起人：PM 一一  
> 接收人：设计师 XoXo  
> 日期：2026-07-13

## 本轮范围

这一轮你只看 `UI / 视觉 / 背景资源匹配 / 信息呈现方式`，不要改剧情设定，不要替开发兜底程序 bug。

剧本文案与设定问题，PM 已直接回修；程序与解析问题，已单独分给 yiyi。

## 你要处理的 UI 问题

### 1. 场景配图 / BG 指定修正

请按 Ant大小姐 最新实机口径，核对并确认这些场景的最终背景指定：

1. `U-20日本代表战·被日本看见`
   - 使用：`vs_u20_goal`
   - 不再沿用当前错误球场图

2. `聚少离多·从高光到...`
   - 当前内页主题应走：`dark`

3. `5连回天`
   - 对应图：`bg_bad_impact_kick_cutin`

4. `景门来信`
   - 使用：`living_room`

5. `前锋 / 首发 / MD 语境` 那段
   - 当前餐桌图不对
   - 应改成：`bar`

## 2. 画面与文案语境是否匹配

请重点复核：

- 文案已经进入 `MD / 首发 / 前锋 / 发布 / 采访 / 商务` 语境时，画面不能还是泛用餐桌或错误空间图。
- 带有“回家 / 公寓 / 客厅 / 等待 / 收留 / 同居余温”语境的段落，应优先落在 `living_room` 等明确居家场景，不要用走廊、酒店或商务大厅代替。
- 强情绪球场 cut-in 与长对白常驻 BG 要区分；`bg_bad_impact_kick_cutin` 这种图如用于持续阅读场景，要给出是否可用、若不可用该由哪个图替代。

## 3. 需要你明确给开发的视觉口径

请输出一份简短设计回信，写清楚：

1. 每个问题场景的最终 BG 资源名
2. 对应 `uiTheme` 应为 `light / dark`
3. 这些是“正式锁定”还是“临时代用”
4. 哪些地方仍需 Ant大小姐 最终拍板

## 输出位置

请写到：

`D:\Nagi‘s Heart\PM_AGENT_OUTBOX\design_reply_xoxo_ui_regression_batch1_20260713.md`

格式建议：

```md
# XoXo UI Regression Batch 1 Reply

## Locked Visual Fixes

| Scene | Final BG | Theme | Status | Note |
|---|---|---|---|---|

## Needs Ant Confirmation
```
