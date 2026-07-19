# PM Review - PP TASK-20260719-009 Android P0 Logic + Confirmed UI Controlled Pass

- Date: 2026-07-19
- Reviewer: PM 一一
- Source dev reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_pp_android_p0_logic_and_ui_controlled_pass_20260719.md`
- Review status: `review_with_caveats`

## PM conclusion

PP 的主流程 P0 根因判断基本成立：`StoryEngine.resolve()` 先判 `isNode()` 再判 `isEndingNode()`，会让 `end_true/end_good/end_normal/end_bad` 被当作普通剧情节点，导致 `EndingReached` 死代码、结局后继续剧情、远处的世界第一处卡死、画廊不解锁等问题连锁出现。

本轮 Android 修改范围静态检查为 11 个 Android Kotlin 文件，未见 Web / story-data / BG mapping / TT Start / App Icon 混入。

## Static check passed

- `StoryEngine.kt`: `isEndingNode()` 已放到 `isNode()` 之前。
- `GameViewModel.kt`: `EndingReached` 分支存在；`showEnding()` 里执行 unlock；unlock key 使用 `removePrefix("end_")`。
- `GalleryScreen.kt`: unlocked endings 不再用 `remember {}` 固定缓存。
- `GameScreen.kt`: 存在新的 `EndingOverlay`，仅保留 `返回主页` action。
- `BacklogScreen.kt`: `rememberPagerState(initialPage = 0)`，剧情回顾默认第一页。
- `StartScreen.kt`: after-ending CTA 口径为 `新的故事`，并仍保留普通存档继续入口供实机确认。
- `PrologueScreen.kt`: 开场白字号已降为 28sp / line-height 1.68。

## PM caveats / not closed yet

1. **Build not verified**  
   PP 机器无 JDK / Gradle wrapper，无法 build。`TASK-20260719-009` 不能转 done，必须由 Ant 使用 Android Studio build + 真机验证。

2. **Backlog text clipping is not fully solved**  
   Ant 已反馈“剧情回顾页单页文字没有显示全”。PP 本轮只把默认页改为第一页，仍保留 `ENTRIES_PER_PAGE = 8` 固定分页。长条目在小屏仍可能裁切。此项不算关闭，若实机仍裁字，需 PP 追加动态分页 / 可视高度分页方案。

3. **Long narration width is still open**  
   Ant 已反馈“长旁白宽度太窄，要和底部单行旁白宽度一致”。当前 `LongNarrationLayer` 仍为 `fillMaxWidth(0.78f)`，本轮未修改。此项仍需追加 Android UI 调整。

4. **StartScreen save/ending state must be real-device checked**  
   `StartScreen` 目前在 `hasSave` 时仍显示一个 `继续故事`按钮，同时主 CTA 文案变为 `新的故事`。这符合“结局后 auto-save 清除，不再继续故事”的方向，但必须实机确认：普通中途存档仍能继续；结局后返回主页不再误显示继续故事。

## Required Ant real-device checks

1. Build freshness: Android Studio clean/rebuild，确认安装的是最新 APK。
2. 主流程：到任意结局后进入 terminal EndingOverlay，不再继续接剧情，不再卡在远处的世界第一。
3. Ending page：只有 `返回主页` 一个按钮；空白处点击不推进剧情。
4. Gallery：看过结局后，画廊可见对应已解锁结局。
5. Backlog：默认第一页；检查长文本是否仍裁切。
6. Long narration：宽度是否仍显窄。
7. Dialog / HUD：确认 cut-corner glass 与 HUD 玻璃令牌是否真正摆脱圆角矩形线框和旧导航样式。

## Next PM action

- `TASK-20260719-009` 保持 `review`。
- 若 Ant build 后主流程 P0 通过，可把主流程逻辑部分视为 resolved。
- Backlog clipping 与 long narration width 不随本轮自动关闭；如仍复现，需给 PP 追加小范围 follow-up。

Cleanup status: none.
