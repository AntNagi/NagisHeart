# TASK-20260727-004 本地未提交杂项归属审计

执行人：Sai  
日期：2026-07-27  
范围：只读审计 `git status --short` 当前列出的未提交 / 未跟踪项；未修改、未删除、未移动、未提交、未 push；未进入剧情地图 v7 实现；未触碰 PP 正在实现的 `ChapterScreen.kt` / `StoryMapLayout.kt`。

## 使用的只读检查

- `git status --short`
- `git diff --name-status`
- `git diff --stat`
- `Select-String` 检查 `AndroidManifest.xml` launcher 入口
- `rg` 搜索 icon / safezone / 旧 bg / story map concept / output / preview scripts 引用
- `Get-FileHash` 对比 Android icon 与 authority icon 包 hash

## 关键结论

1. Android launcher 当前入口为：
   - `android:icon="@mipmap/ic_launcher"`
   - `android:roundIcon="@mipmap/ic_launcher_round"`
2. `ic_launcher_safezone*` 资源当前未被 Android Manifest 引用；仅 Web/设计文档/历史报告引用 safezone authority 包或相关说明。
3. `mipmap-anydpi-v26/ic_launcher.xml` 与 `ic_launcher_round.xml` 在工作区被删除；这会让 API 26+ adaptive icon 路由丢失，需由 App Icon owner/PM 决定回滚还是进入新 icon 任务处理。
4. 当前 Android `ic_launcher.png` / `ic_launcher_background.png` hash 不匹配已查的 `android_launcher_rework_v4_safezone`、`android_launcher_rework_v4`、旧 `android_mipmap` 三组 authority 样本，说明本地 icon 资源处于非清晰 authority 状态。
5. `design/concepts/story_map_xoxo_v1/` 被 `authority/ui` 和 PM 任务引用为人工参考图；authority 明确禁止 runtime/APK 引用或复制。
6. 被删除旧 bg `assets/bg/微信图片_20260710220436_260_2.jpg` 当前搜索未发现 runtime/story-data 引用，仅 decision log 提及“待确认未提交删除”。
7. `output/` 与 6 个 `tools/render_*` / `build_promo_*` 脚本属于 Start/Promo 预览生成链路，当前未发现 runtime 引用。

## 归属判断表

| 路径 | 类型 | 疑似来源任务/owner | 当前是否被引用 | 建议：提交/回滚/归档/删除/继续保留 | 需要谁确认 |
|---|---|---|---|---|---|
| `00_harness/02_planning/task_board.md` | tracked modified 文档 | PM / 一一，新增 `TASK-20260727-004` 并更新 `TASK-20260727-003` 状态 | harness 规划文件被团队使用 | 提交，但应由 PM 确认是否和本审计报告同批提交 | PM / 一一 |
| `android/app/src/main/AndroidManifest.xml` | tracked modified；当前无文本 diff，仅 line ending/status drift | App Icon 还原链路 / Sai 临时指回原入口 | 是，Android launcher 入口；当前指向 `ic_launcher` / `ic_launcher_round` | 继续保留当前内容；建议后续用明确 icon 任务统一处理 line ending/status | PM + App Icon owner |
| `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` | tracked deleted | Lulu icon 替换/还原链路或 App Icon 实验残留 | 原本会被 `@mipmap/ic_launcher` 在 API 26+ 作为 adaptive icon 解析 | 倾向回滚，除非 PM 确认要移除 adaptive icon 路由 | PM + App Icon owner |
| `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` | tracked deleted | Lulu icon 替换/还原链路或 App Icon 实验残留 | 原本会被 `@mipmap/ic_launcher_round` 在 API 26+ 作为 adaptive round icon 解析 | 倾向回滚，除非 PM 确认要移除 adaptive round icon 路由 | PM + App Icon owner |
| `android/app/src/main/res/mipmap-*/ic_launcher.png` | tracked modified 二进制，5 密度 | Lulu icon 替换/还原链路；也可能混入 TT v4/safezone 实验 | 是，Manifest 当前直接引用 `@mipmap/ic_launcher`；若 adaptive XML 恢复也可能作为 legacy fallback | 不建议直接提交；先由 App Icon owner 对照最终 authority hash 决定提交或回滚 | PM + TT/XoXo + App Icon owner |
| `android/app/src/main/res/mipmap-*/ic_launcher_background.png` | tracked modified 二进制，5 密度 | Lulu icon 替换/还原链路；adaptive icon 背景实验 | 若 adaptive XML 恢复则会被 `ic_launcher.xml` / `ic_launcher_round.xml` 引用；当前 XML 删除导致运行引用不清 | 不建议直接提交；需和 adaptive XML/foreground 作为一套 icon 包统一处理 | PM + TT/XoXo + App Icon owner |
| `android/app/src/main/res/mipmap-*/ic_launcher_round.png` | untracked 二进制，5 密度 | Lulu icon 替换/还原链路；旧 round fallback 重生成或残留 | 当前 Manifest 指向 `@mipmap/ic_launcher_round`；因 anydpi round XML 被删，可能成为实际 roundIcon fallback | 高风险；不要提交到普通功能批次。建议 PM 决定：回滚 XML 后删除/归档，或作为正式 round fallback 验证后提交 | PM + App Icon owner |
| `android/app/src/main/res/mipmap-*/ic_launcher_safezone.png` | untracked 二进制，5 密度 | Lulu safezone icon 方案 | Android 当前未引用；`rg` 未见 Android Manifest/runtime 引用 | 归档或删除候选；若保留应放设计/authority 包，不应留在 runtime res 下 | PM + TT/XoXo + Lulu |
| `android/app/src/main/res/mipmap-*/ic_launcher_safezone_round.png` | untracked 二进制，5 密度 | Lulu safezone round icon 方案 | Android 当前未引用；此前 Manifest 曾临时指向但现已指回原入口 | 归档或删除候选；不建议提交到 runtime，除非 App Icon 任务正式确认 | PM + TT/XoXo + Lulu |
| `assets/bg/微信图片_20260710220436_260_2.jpg` | tracked deleted 二进制 | 不明；可能是旧导入 bg 清理 | `rg` 当前未发现 runtime/story-data 引用；decision_log 提及待确认删除 | 不替 PM 决定删除；建议资产 owner 确认是否确为废弃资源。确认前回滚或继续保留删除待审 | PM + BG/Story-data owner |
| `design/concepts/story_map_xoxo_v1/` | untracked 设计概念图 / SVG / generator；约 `.jpg` 13、`.png` 33、`.py` 7、`.svg` 32 | XoXo / lulu 剧情地图 v7 authority 参考包 | 是，被 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` 与 HTML authority 引用为人工参考；authority 明确禁止 runtime 引用 | 建议提交到 design/authority/concepts 类路径或由 PM 归档；不要复制进 Android runtime | PM + XoXo/lulu |
| `output/promo/` | untracked 预览产物；含 mp4/contact sheet/keyframes | Promo/Start 预览生成链路，疑似 Sai/Lulu 实验输出 | 当前未发现 runtime 引用；由 `tools/render_promo_draft.py` 输出 | 建议归档到报告或外部交付区；不建议长期留根 `output/` 未跟踪 | PM + 产出 owner |
| `output/preview/start_vignette_20260725/` | untracked Start 暗角预览图 | Start v23 暗角方案预览 | 当前未发现 runtime 引用；由 `tools/render_start_vignette_preview.py` 输出 | 若作为决策证据则归档/提交到对应 report；否则删除候选 | PM + Start owner |
| `output/preview/start_eye_ember_20260724/` | untracked Start 眼部 ember 预览 gif/jpg | Start 特效实验预览 | 当前未发现 runtime 引用；由 `tools/render_start_eye_ember_preview.py` 输出 | 建议归档或删除候选；不要混入 Android 功能提交 | PM + Start owner |
| `output/preview/start_eye_blink_20260725/` | untracked Start 眨眼预览 gif/jpg | Start 特效实验预览 | 当前未发现 runtime 引用；由 `tools/render_start_eye_blink_preview.py` 输出 | 建议归档或删除候选；不要混入 Android 功能提交 | PM + Start owner |
| `output/preview/start_eye_blink_imagegen_20260725/` | untracked ImageGen keyframe/preview | Start 眨眼 ImageGen 实验 | 当前未发现 runtime 引用；可能由 `render_start_blink_from_keyframe.py` 消费 | 建议归档或删除候选；若要复现需连同脚本说明提交 | PM + Start owner |
| `tools/build_promo_keyframes.py` | untracked 脚本 | Promo draft 生成链路 | 当前未被 runtime 引用；可能为人工生成 `output/promo/keyframes` | 若 Promo 仍要复现则提交到 tools 并补说明；否则归档/删除候选 | PM + Promo owner |
| `tools/render_promo_draft.py` | untracked 脚本 | Promo draft 生成链路 | 当前未被 runtime 引用；输出 `output/promo/nagis_heart_promo_draft*.mp4` | 若 Promo 仍要复现则提交到 tools 并补说明；否则归档/删除候选 | PM + Promo owner |
| `tools/render_start_blink_from_keyframe.py` | untracked 脚本 | Start 眨眼预览链路 | 当前未被 runtime 引用 | 若 Start 特效进入正式任务则提交；否则归档/删除候选 | PM + Start owner |
| `tools/render_start_eye_blink_preview.py` | untracked 脚本 | Start 眨眼预览链路 | 当前未被 runtime 引用；输出 `output/preview/start_eye_blink_20260725` | 若 Start 特效进入正式任务则提交；否则归档/删除候选 | PM + Start owner |
| `tools/render_start_eye_ember_preview.py` | untracked 脚本 | Start ember 预览链路 | 当前未被 runtime 引用；输出 `output/preview/start_eye_ember_20260724` | 若 Start 特效进入正式任务则提交；否则归档/删除候选 | PM + Start owner |
| `tools/render_start_vignette_preview.py` | untracked 脚本 | Start v23 暗角预览链路 | 当前未被 runtime 引用；输出 `output/preview/start_vignette_20260725` | 若暗角方案需要可复现证据则提交到 tools/report；否则归档/删除候选 | PM + Start owner |

## 建议处理顺序（只建议，未执行）

1. 先冻结 App Icon 资源：PM 指定最终 authority 包与目标 Android 路由；再一次性处理 `Manifest`、`mipmap-anydpi-v26` XML、`ic_launcher*`、`safezone*`、`round*`，不要让它们混入 UI/剧情功能提交。
2. `task_board.md` 由 PM 确认后单独提交，避免规划状态长期脏。
3. `design/concepts/story_map_xoxo_v1/` 由 XoXo/lulu/PM 确认归档路径；如果作为 §27 authority reference，则提交 design 概念资产，但保持“禁止 runtime 引用”。
4. `output/` 与 render scripts 按“是否需要复现”二选一：需要复现则脚本 + 小体积 contact sheet 入报告；不需要则清理/外部归档。
5. 删除旧 bg 必须由 BG/story-data owner 确认；当前仅能证明未发现引用，不能替 PM 判定可删。

