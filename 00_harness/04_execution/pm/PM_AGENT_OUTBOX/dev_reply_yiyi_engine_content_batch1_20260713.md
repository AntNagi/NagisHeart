# yiyi Engine Content Batch 1 Reply

> 回复人：developer yiyi
> 日期：2026-07-14

## Confirmed

- A. 章节开始页点击失效 — **已确认并修复**
- B. 选项解析错误（`→`、空label、autoAdvance 渲染给玩家）— **已确认并修复**
- C. Backlog 乱序/重复 — **代码结构审查通过，需实机复测**
- D. speaker/narration 识别 — **引擎无额外引号/包装逻辑，数据侧 PM 已修**
- E. story-data 不一致 — **PM 已修正源数据，`**MD**` 和 `好卖` 均已不存在于 nodes.json，`Ant大小姐` 已替换为 `{{playerName}}`**
- F. scene_visuals 映射 — **已修正 2 处**

## Fix Plan

| Issue | Root Cause | Files | Status |
|---|---|---|---|
| A. 章节开始页点不动 | ChapterOpeningOverlay / SectionOpeningOverlay 在 z-order 上覆盖了 tap target Box，吃掉了点击 | `GameScreen.kt` | ✅ Fixed — overlay 自带 clickable，tap target 不再覆盖转场阶段 |
| B. `→` 渲染为选项 | `getVisibleChoices()` 只过滤 condition，不过滤 autoAdvance / 空 label / `→` 占位 | `StoryEngine.kt` | ✅ Fixed — 新增 autoAdvance、空 label、`→` 过滤 |
| C. Backlog 乱序重复 | 代码逻辑：section/chapter 切换时 clear，append-only 追加当前节点。未发现明显 bug，但需实机复测确认 | `GameViewModel.kt` | ⏳ Need retest |
| D. speaker 误判 | 引擎不加引号、不包装括号。数据侧 PM 已将括号心理描写拆回旁白 | `DialogueLayer.kt` / data | ✅ No code change needed |
| E. 数据不一致 | PM 已在源数据修正：`**MD**` 移除、`好卖` 改口径、柠檬茶拆旁白、`Ant` → `{{playerName}}` | `nodes.json` | ✅ Data synced |
| F1. u20j bg | 旧值 `bg_u20j_worldcup_goal_kick.jpg` | `scene_visuals.json` | ✅ → `vs_u20_goal.jpg` |
| F2. c6a theme | 已经是 `Dark` | `scene_visuals.json` | ✅ Already correct |
| F3. bad_last bg | 已经是 `bg_bad_impact_kick_cutin.jpg` | `scene_visuals.json` | ✅ Already correct |
| F4. wc_offer bg | 旧值 `back.jpg` | `scene_visuals.json` | ✅ → `living_room.jpg` |
| F5. 前锋/首发/MD bar bg | e_tipsy / e_drunk 已映射 `bar.png`；`**MD**` 格式已从 nodes.json 移除 | `scene_visuals.json` / data | ✅ Already correct |

## Data Synced

- `nodes.json`: `Ant大小姐` → `{{playerName}}大小姐` (PM already applied)
- `nodes.json`: `**MD**` markdown bold removed (PM already applied)
- `scene_visuals.json`: u20j bg → `vs_u20_goal.jpg`, wc_offer bg → `living_room.jpg`

## Need Retest

- [ ] 章节开始页（第一部 U-20日本代表战）点击"轻触继续"能否正常推进
- [ ] 选项列表是否还出现 `→` / 空白 / 纯括号动作
- [ ] Backlog 内容是否仍有乱序/重复/错义
- [ ] 柠檬茶段落旁白是否正确显示（不再显示为 Nagi 对白）
- [ ] u20j / wc_offer 场景背景图是否正确
