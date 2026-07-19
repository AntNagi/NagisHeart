# XoXo 回传 — TASK-20260719-001 Android 实机反馈 UI authority 补齐

To: PM 一一 / Ant 大小姐  
From: XoXo  
Date: 2026-07-19  
Status: review authority candidate / pending PM + Ant confirmation  
Task: `TASK-20260719-001`

## 1. 当前结果

已按 `DEC-20260719-001` 与 `DEC-20260719-002` 补齐 UI authority candidate。本轮不直接给开发 final，而是先给 PM / Ant 确认。

已覆盖：

1. 全局压图文字可读性托底。
2. HUD / nav / title / icon / skip chip 同族规则。
3. Dialog Android no-real-blur fallback，避免圆角矩形线框感。
4. 长旁白宽度对齐底部单行旁白正文。
5. 结局页 terminal final-candidate。
6. 小章节结束页从当前产品 UI 范围移除。
7. PP implementation alignment checklist。

## 2. 修改文件

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/01_governance/decision_log.md`
- `00_harness/02_planning/task_board.md`

## 3. Authority sync status

已同步。

- HTML authority source 已同步到 `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- Merge record source 已同步到 `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- UI MinSpec 已在 `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` 新增 section 17。
- Decision log 已追加 `DEC-20260719-003`。

注意：本轮是 review authority candidate。PM / Ant 确认前，不得称为 final dev authority。

## 4. Developer-readable token 摘要

| Component | Shape | Alpha / background | Border | Shadow / halo | Android no-real-blur fallback |
|---|---|---|---|---|---|
| HUD icon button | `cut-sm` / `CutCornerShape(8dp)` | radial `0.08` + `rgba(15,24,39,0.34 -> 0.22)` | `rgba(255,255,255,0.12)` 1dp | container shadow `0 3dp 12dp rgba(0,0,0,0.42)`；icon shadow + halo | 保留半透明底、描边、shadow、icon halo；不得裸白 |
| HUD title chip | `cut-sm` | `rgba(15,24,39,0.30 -> 0.12)` | `rgba(255,255,255,0.12)` 1dp | text shadow + container shadow | 与 icon button 同族，长标题单行省略 |
| Skip/action chip | `cut-sm` | `rgba(15,24,39,0.30 -> 0.18/0.12)` | `rgba(255,255,255,0.12)` 1dp | drop shadow + text shadow | 右侧动作清楚但不能变厚按钮 |
| Dialog | `cut-md` / `CutCornerShape(14dp)` | card `rgba(27,36,54,0.56 -> 0.52)` | `rgba(255,255,255,0.08)` 1dp | inner highlight `0.05~0.06` + `0 18dp 42dp rgba(0,0,0,0.36)` | 无真实 blur 时用 fixed fallback；不得做圆角矩形硬线框 |
| Dialogue box | `cut-md` | `rgba(16,24,39,0.54 -> 0.70)` | `rgba(255,255,255,0.08)` 1dp | card shadow；speaker gold halo | 不低于当前 alpha；姓名保留金色但加轻衬底 |
| Long narration | text width = screen - 76dp | radial backing `rgba(16,24,39,0.44 -> 0.32 -> transparent)` | soft / no hard frame | text shadow | outer 18dp + inner 20dp；bottom reserve 120dp |
| Ending page | `cut-md` | `rgba(16,24,39,0.50 -> 0.76)` + mood accent | `rgba(255,255,255,0.10)` 1dp | `0 22dp 54dp rgba(0,0,0,0.34)` | terminal page card，含 unlock + 4 actions |

## 5. 禁止样式列表

1. 圆角矩形硬线框 dialog。
2. 厚系统按钮 / Material 默认按钮替代 final glass。
3. 裸白 HUD icon 压亮背景。
4. title/action chip 有底但 icon button 无底。
5. 旧 handoff / archive / 截图印象样式。
6. 未同步到 `08_authority_current` 的聊天口径。

## 6. PP implementation alignment checklist

| Authority section | 目标效果 | Android 组件 | 关键 token | 实机验收截图点 |
|---|---|---|---|---|
| MinSpec 17.1 / 17.2 | HUD 全套同族轻玻璃，亮图可读 | `NagiHud.kt`、`NagiIconButton.kt` | icon 36dp，cut-sm，bg `0.34 -> 0.22`，border `0.12`，shadow，icon halo | 亮背景下 back/auto/save/menu/backlog 不裸白；title 与 icon 不割裂 |
| MinSpec 17.3 | Dialog 不再是圆角矩形线框 | `NagiDialog.kt` | `CutCornerShape(14dp)`，card `0.56 -> 0.52`，scrim `0.40`，border `0.08`，inner highlight，shadow | 跳过确认弹窗截图；边框不能成为主视觉 |
| MinSpec 17.1 | 底部对白与 speaker/name 可读 | `DialogueLayer.kt` | dialogue bg `0.54 -> 0.70`，speaker gold chip `#E4CA8F` + gold halo | 亮背景对白截图，金色姓名清晰但不变厚牌 |
| MinSpec 17.4 | 长旁白与底部旁白正文同宽，不裁切 | long narration text layer | outer 18dp，inner 20dp，正文宽 = screen - 76dp，bottom reserve 120dp | 5~7 行长旁白截图，左右宽度与底部旁白正文对齐 |
| MinSpec 17.5 | 结局页是 terminal ending page | ending screen / terminal route view | ending-card cut-md，bg `0.50 -> 0.76`，mood accent，四个终局动作 | TRUE/GOOD/NORMAL/BAD 候选截图；空白点击不继续 story |
| MinSpec 17.6 | 小章节结束页从当前范围移除 | route / screen registry | 移除 standalone `section-clear` 运行入口；保留 Chapter Clear | 小节结束进入下一小节 opening；最后小节进入 Chapter Clear 或 Ending |

## 7. Ant / PM 需要确认

1. 结局页 TRUE/GOOD/NORMAL/BAD 共用结构与终局动作是否 OK。
2. Dialog cut-corner + 弱边界 fallback 是否摆脱“圆角矩形线框感”。
3. 长旁白宽度对齐底部旁白正文后，实机阅读是否舒服。

## 8. Blocked status

XoXo 当前不标 blocked：本轮 UI authority 已补足到可审核 token 粒度。

但后续 PP 若遇到以下情况，必须在开发前 alignment table 标 blocked，不能猜：

1. Android 无法实现 cut-corner、inner highlight、shadow、icon halo 的关键层。
2. 找不到 active Android component path，或发现重复实现路径。
3. 实机仍显示旧样式，无法确认 stale APK / wrong variant / active path mismatch。
4. Ending page 文案、动作或 unlock 反馈需要 Ant 进一步产品确认。

## 9. 验证

- 已确认 `design/` 与 `08_authority_current/04_ui/` 的 HTML 副本一致。
- 已确认 `design/` 与 `08_authority_current/04_ui/` 的 merge record 副本一致。
- 已确认 HTML 中 `section-clear` / `SECTION CLEAR` / `小节结束` 当前无残留。
- 已确认 MinSpec section 17 包含 no-real-blur fallback、禁止样式、PP checklist、blocked rule。

## 10. Cleanup status

Cleanup status: none。

本轮只标记口径，不删除旧资源 / 旧 UI / 未引用资源。资源清理必须等 PP 接入、QA / 实机验证通过后，由 PM 另开清理任务。
