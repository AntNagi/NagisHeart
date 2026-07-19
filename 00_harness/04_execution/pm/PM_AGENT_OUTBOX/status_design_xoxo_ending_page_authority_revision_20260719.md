# XoXo 回传 — TASK-20260719-008 Ending Page Authority Revision

To: PM 一一 / Ant 大小姐  
From: XoXo  
Date: 2026-07-19  
Status: review / pending PM + Ant confirmation  
Scope: UI authority only  
Code touched: no

## 1. What changed

已按 PM 返修任务 `TASK_TO_XOXO_20260719_ENDING_PAGE_AUTHORITY_REVISION.md` 完成三组 Ant 反馈合并处理：

1. 结局页动作模型返修：
   - 移除手机 mock 中 user-facing `candidate` 字样。
   - 结局页只保留一个可见动作：`返回主页`。
   - 移除 `回忆画廊`、`重看本结局`、`相关章节` 三个结局页可见动作。
   - 保留轻量 unlock feedback；画廊解锁明确为后台状态结果，不是结局页按钮。

2. Home after-ending 口径：
   - 完成 ending 后返回 Home，主 CTA 是 `新的故事`。
   - Home after-ending 不再显示 `继续故事` 作为主 CTA。

3. Prologue / 开场白字号：
   - `.opening-center` 从 31px 调整为 28px。
   - line-height 从 1.6 调整为 1.68。
   - Start title 未改。
   - Name Setup 未改；当前 HTML 中 Name Setup 未共用 `.opening-center`，不需要拆 token。

4. Visible mock 文案 hygiene：
   - 章节目录中 `第一版只保留返回与继续，不扩展成就系统` 已移除，替换为玩家文案 `选择你想回到的章节。`
   - TT Start 可视区内部说明已移除。
   - phone mock 中 source tag / 来源标签文案已移除。
   - 结局页、Dialog、章节目录等可视屏幕不再显示 PM/dev/internal explanatory notes。

## 2. Files changed / synchronized

已更新：

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/02_planning/task_board.md`
- `00_harness/03_handoffs/latest_status_snapshot.md`

已同步 authority current：

- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

## 3. Required confirmations

- User-facing `candidate` wording removed: yes.
- Ending page only has one visible action `返回主页`: yes.
- Ending page no longer shows `回忆画廊` / `重看本结局` / `相关章节` as actions: yes.
- Home after-ending CTA is `新的故事`, not `继续故事`: yes.
- Prologue body font reduced by one step and token documented: yes, MinSpec section 18.3 documents 28px / line-height 1.68.
- Visible PM/dev/internal notes removed from product mock screens: yes.

## 4. Authority notes for PP / Wewe

Use `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 18:

- Section 18.1: ending page action model.
- Section 18.2: Home after-ending state.
- Section 18.3: Prologue typography token.
- Section 18.4: visible mock copy hygiene.
- Section 18.5: updated PP alignment points.

Important blocker rule:

If PP cannot distinguish normal Home continue state from ending-complete new-run state in Android code, PP must report blocked to PM / product. Do not use `继续故事` as a temporary after-ending Home CTA.

## 5. Verification

- Checked HTML for rejected visible/internal phrases:
  - `candidate`
  - `terminal page candidate`
  - `第一版`
  - `不扩展`
  - `Start authority`
  - `继续故事`
  - `重看本结局`
  - `相关章节`
  - `待 PM`
  - `来源：`
  - `source-tag`
- Result: no matches in `design/NagisHeart_UI_Authority_XoXo_v1_0.html`.
- Confirmed `design/` HTML and `08_authority_current/04_ui/` HTML copy match.
- Confirmed `design/` merge record and `08_authority_current/04_ui/` merge record copy match.
- Confirmed MinSpec section 18 contains ending action revision, Home after-ending rule, Prologue 28px token, and visible copy hygiene.

## 6. Cleanup status

Cleanup status: none.

No resources were deleted. No Android/Web/story-data/BG mapping files were modified by this task.

---

## 7. Addendum — Ant 二次反馈：Ending status feedback vs primary action hierarchy

Date: 2026-07-19  
Status: revised / ready for PM + Ant review  
Scope: UI hierarchy bug fix only

### What changed

Ant 指出上一版结局页底部两行视觉层级过近：

- `已解锁：TRUE END / 回忆画廊新增 1 项` 是状态反馈，不是按钮；
- `返回主页` 是唯一操作按钮。

已完成返修：

1. `已解锁...` 改为低强调、非交互的 inline status feedback。
2. `已解锁...` 不再使用 glass bar / action-cell 视觉：
   - no border；
   - no rectangular fill；
   - no cut/action shape；
   - no full-width action rhythm；
   - no hover/action rhythm；
   - 11px / low-emphasis text with small gold status dot。
3. `返回主页` 仍是唯一可点击 primary action。
4. MinSpec section 18 已明确 Ending page 三层：
   - content；
   - status feedback；
   - primary action。
5. MinSpec section 18 明确禁止 status feedback 实现为 `Button`、`ChipButton`、action cell。

### Files updated in addendum

- `design/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `design/NagisHeart_UI_Authority_Merge_Record_20260715.md`
- `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
- `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`

### Visual hierarchy difference

| Element | Role | Visual treatment |
|---|---|---|
| `已解锁：TRUE END / 回忆画廊新增 1 项` | static status feedback | small inline note, 11px, muted text, tiny gold status dot, fit-content width, no border/fill/button shape |
| `返回主页` | only primary action | full action cell, stronger text, glass action background, border, cut shape |

### Requirements still preserved

- No user-facing candidate wording.
- No PM/dev/internal note visible copy.
- No `回忆画廊` / `重看本结局` / `相关章节` buttons.
- Home after-ending CTA remains `新的故事`.
- Prologue body font remains reduced: 28px / line-height 1.68.
- Cleanup status: none.
