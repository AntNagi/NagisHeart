# Status - XoXo UI Authority Revision

## Summary

`TASK-20260715-001` 的 2026-07-17 局部修订已完成，当前可回到 PM / Ant 复核。

本轮只处理 PM brief 指定的 3 点：

1. Start / 开屏页改为引用 TT Start v23 权威方向。
2. 主页移除顶部 `Nagi's Heart` 标题。
3. 设置页每行小字 / 数值改为右侧对齐。

其余已通过页面未重设计，章节目录 / 大章节结束页 / 小节结束页继续 pending。

## Changes Made

| File | Change |
|---|---|
| `design/NagisHeart_UI_Authority_XoXo_v1_0.html` | Start 页改为 TT Start v23 分层引用：`start_clean_remeet_1080x1920.png`、`start_title_overlay_v23.svg`、`start_button_static_v23.svg`；移除 XoXo 自有 Start 权威展示 |
| `design/NagisHeart_UI_Authority_XoXo_v1_0.html` | 主页删除顶部标题块，保留主页操作区结构 |
| `design/NagisHeart_UI_Authority_XoXo_v1_0.html` | 设置页新增 `settings-rows` / `setting-row` 结构，数值列右对齐 |
| `design/NagisHeart_UI_Authority_Merge_Record_20260715.md` | 更新开屏、主页、设置页来源/动作表，并追加 2026-07-17 局部修订记录 |

## Self Check

| Check | Result | Evidence |
|---|---|---|
| 只改指定 3 点 | Pass | HTML 仅改 Start / Home / Settings 相关结构与样式；记录文件只补修订说明 |
| TT Start 包未修改 | Pass | 本轮只引用 `design/authority/icon_start_tt/start/...` 资源，未编辑该目录文件 |
| TT Start v23 资源存在 | Pass | `start_clean_remeet_1080x1920.png`、`start_title_overlay_v23.svg`、`start_button_static_v23.svg` 均已在本地存在 |
| XoXo 自有 Start 权威展示已移除 | Pass | `.screen-start` 内不再包含旧 `poster-title` / `start-menu` / `minor-actions` 结构 |
| 主页顶部标题已移除 | Pass | `.screen-home` 内不再包含 `title-tight` 标题块 |
| 设置页值右对齐 | Pass | 设置页行使用 `setting-row`，值列 `justify-self: end`、`text-align: right` |
| 不触碰禁止范围 | Pass | 未修改 App Icon、story data、script text、Android/Web 代码、章节目录、大章结束页、小节结束页 |

Browser note: attempted to open the local `file://` HTML through the in-app browser, but the browser security policy blocked local file navigation. I did not bypass that policy. Validation above is static DOM/CSS/resource-path verification.

## Need PM / Ant Decision

| Decision Needed | Options | Recommendation | Why |
|---|---|---|---|
| 局部修订是否通过 | 通过 / 退回局部调整 | 通过 | 3 个指定修订均已按 brief 落到候选 HTML 与合版记录 |
| 是否进入最终 UI authority 提升 | 提升 / 暂缓 | PM / Ant 复核后再提升 | XoXo 仍不直接宣布 final authority |

## Remaining Risks

- Start 页当前在 XoXo 候选 HTML 中作为 TT v23 分层引用展示；最终开发接入仍应以 TT spec 与 yiyi 接入任务为准。
- 章节目录、大章节结束页、小节结束页仍未定稿，继续 pending。
