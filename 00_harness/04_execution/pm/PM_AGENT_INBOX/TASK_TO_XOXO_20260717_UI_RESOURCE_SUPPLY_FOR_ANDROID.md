# Task to XoXo - Supply Missing UI Resources For Android

- 时间：2026-07-17
- From：PM 一一
- To：XoXo（主 UI 设计）
- 任务：`TASK-20260717-006`
- 优先级：P0
- 来源：Ant大小姐纠正资源职责 / XoXo Android 资源审计结果

## 背景

XoXo 已完成 `TASK-20260717-002` Android 当前 UI 资源 vs final UI authority 审计，并指出 Android 侧存在缺少 / 未接入 / 冗余风险。

PM 修正职责边界：

- XoXo 是 UI owner。审计出缺少或未交付给开发的 UI 资源，应先由 XoXo 补齐、确认、整理成开发可接入包。
- yiyi 是开发 owner。yiyi 负责把 XoXo 提供的权威资源接入 Android、修正路由、构建和验证。
- 旧资源 / 未引用资源暂不删除。必须等缺口补齐、开发适配完成、测试通过后，再另开清理任务。

## 目标

请 XoXo 基于 final UI authority 和你自己的 Android 资源审计，补齐并整理 Android 开发需要的 UI 资源交付包。

## 必做范围

### A. HUD / system icons

请确认并补齐 Android 需要的 drawable icon 资源，至少覆盖：

- `ic_back`
- `ic_auto`
- `ic_save`
- `ic_menu`
- `ic_continue`
- `ic_settings`
- `ic_gallery`
- `ic_chapter`
- `ic_skip`
- `ic_backlog`
- `ic_lock`
- `ic_line`
- `ic_pentagon_ring`
- `ic_pentagon_fill`

如果现有 `assets/ui/android/drawable/` 已经是权威 Android XML 资源，请输出确认清单和 hash / 文件列表，并说明 yiyi 可以从该目录接入。

如果缺少，请由 XoXo 补齐到权威资源目录，不要让 yiyi 反向设计或临时画图标。

### B. Prologue / Name 背景口径

审计中已确认 `R.drawable.splash_bg` 与 final authority clean remeet background hash 一致。

请 XoXo 在交付说明中明确：

- Prologue / Name 是否直接使用现有 `R.drawable.splash_bg`；
- 是否不再需要新增 `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`；
- 如果 UI 认为仍需要 asset 路径版本，请补交正确命名资源。

### C. App Icon 边界

App Icon 仍等待 Ant大小姐最终确认。

请不要把 App Icon 替换任务混进本次 Android UI 资源补齐。可以在报告中保留“待 Ant 确认后再交付 / 接入”的备注。

### D. 旧资源 / 未引用资源

请只标记，不删除。

旧 splash、keyart、round icon、raw/contact-sheet 等资源，即使看起来多余，也必须等：

1. 缺失资源补齐；
2. yiyi Android 适配完成；
3. QA / 视觉测试通过；
4. PM 另开资源清理任务；

之后再删除。

## 输出要求

请写回：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_xoxo_ui_resource_supply_android_20260717.md`

建议格式：

```md
# Status - XoXo UI Resource Supply For Android

## Summary

## Resource Package / Files Provided

| Resource | File | Status | Notes |
|---|---|---|---|

## Prologue / Name Background Decision

## App Icon Boundary

## Deprecated / Extra Resources To Keep For Now

## Handoff To yiyi

## Self Check
```

## 禁止事项

- 不要修改 Android 代码。
- 不要删除旧资源。
- 不要替换 App Icon。
- 不要修改 TT Start 长屏资源。
- 不要补章节目录、大章结束页、小节结束页。
