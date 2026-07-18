# PM Review - yiyi TASK-20260717-015 HUD / speaker readability implementation

> 时间：2026-07-18  
> PM：一一  
> 输入：`00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_hud_speaker_readability_20260717.md`  
> 结论：PM 静态复核通过，保持 `review`，等待 Android Studio / Gradle 构建与 Ant大小姐实机确认。

---

## 核验范围

- `TASK-20260717-015`：Android 接入 XoXo 014 HUD 统一与 speaker 金色可读性规则
- 修改范围：
  - `NagiIconButton.kt`
  - `NagiHud.kt`
  - `GameScreen.kt`
  - `DialogueLayer.kt`
  - `BacklogScreen.kt`

## 静态复核结论

### 1. HUD icon button 不再裸线

通过。

- `NagiIconButton` 增加 glass backing：渐变、1dp 边框、shadow、cutSmall。
- 保持 36x36 容器和 18x18 图标，不变成厚按钮。
- 符合 XoXo section 15 “icon/title/action 同属 final glass HUD 家族”的方向。

### 2. title / action chip 与 icon button 统一

通过。

- title chip 与 action chip 从 013 的 flat 可见托底，更新为 section 15 的同源轻玻璃渐变。
- 该改动覆盖 013 的 flat alpha 方案，是更靠近最新 authority 的实现，不视为回退。

### 3. speaker/name 金色可读性

通过。

- 金色从 `#BFA08A` 提亮为 `#E4CA8F`。
- speaker/name 增加只包住文字的轻衬底、金色边框与 text shadow。
- 未做成厚 name plate、整条黑底或系统标签，符合 Ant 喜欢金色但要求可读的口径。
- Backlog speaker 同步更新，避免剧情回顾与游戏对话不一致。

### 4. 技术限制说明

接受。

- Compose 无真实 background blur 的 fallback 使用半透明渐变 + border + shadow。
- radial highlight 未实现，影响较小，暂不作为阻塞。

## 验证状态

- CLI 构建：未完成，因 Gradle wrapper 尚未完成。
- 实机验证：未完成。

## PM 裁决

- `TASK-20260717-015` 保持 `review`。
- 不转 `done`，直到构建通过并完成 Ant大小姐实机确认。
- 实机重点看：
  1. 亮底图下 icon button 是否足够可见；
  2. title/action/icon 是否统一但不过厚；
  3. speaker 金色是否可读且仍保留 Ant 喜欢的金色气质。

## Cleanup status

Cleanup status: none.

本轮为 Android UI 实现回修，未产生废弃资源或可归档候选。
