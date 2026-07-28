# PM 一一回报：TASK-20260728-001 Web 回看完成误用结局页 + 剧情 BG 黑屏 hotfix

状态：review / 等 Ant 真机刷新验证

## Ant 反馈

1. Web 移动端出现 `ENDING / 回看已完成`，疑似“剧情回看结束页”。
2. 普通剧情页背景没有按剧情 BG 加载，画面接近纯黑。

## PM 判断

这不是 UI authority 新增页面，也不是审美差异。

- `ENDING / 回看已完成` 是 Web runtime fallback：回看模式走到边界后被塞进 `GamePhase.Ending`，`EndingScreen` 在 `ending=null` 时自行 fallback 出 `ENDING / 回看已完成`。
- 剧情 BG 黑屏是 Web runtime 资产加载风险：剧情背景路径由 `SceneBackground` 手拼 `../assets/...`，部署路径变化时容易漂移，且失败时原逻辑仍可能静默进入黑屏视觉。

## 修改范围

仅 Web runtime：

- `web/src/controller/GameController.js`
- `web/src/ui/screens/GameScreen.js`
- `web/src/ui/screens/StartScreen.js`
- `web/src/ui/screens/EndingScreen.js`
- `web/src/ui/components/SceneBackground.js`
- `web/src/utils/assetPath.js`
- `00_harness/02_planning/task_board.md`

未触碰：

- Android
- story-data
- BG mapping
- authority
- assets

## 实施内容

1. 新增 `GamePhase.ReplayComplete`。
2. 回看模式到达下一节边界 / ending 边界时，不再进入 `EndingScreen`，而是退出 replay mode 并进入 `ReplayComplete`。
3. `GameScreen` 收到 `ReplayComplete` 后返回 Home，并自动打开章节目录；不再显示任何未确认的“回看完成页”。
4. 新增 `repoAssetUrl()`，按当前 URL 推导仓库根路径。
5. `SceneBackground` 和 `EndingScreen` 改用仓库根路径加载 `assets/bg/...`，不再依赖当前页面层级手拼 `../assets/...`。
6. BG 加载失败时输出明确 console error，避免静默黑屏。
7. `EndingScreen` 已移除 `ending=null` 时的 `ENDING / 回看已完成` fallback；若误入则返回章节目录。

## 自检

`node --check` 已通过：

- `web/src/utils/assetPath.js`
- `web/src/ui/components/SceneBackground.js`
- `web/src/controller/GameController.js`
- `web/src/ui/screens/GameScreen.js`
- `web/src/ui/screens/EndingScreen.js`
- `web/src/ui/screens/StartScreen.js`

## 待验证

Ant 真机刷新后确认：

1. 回看完成不再出现 `ENDING / 回看已完成`。
2. 回看到边界后回到章节目录。
3. 普通剧情页显示 `scene_visuals.json` 对应 BG，不再纯黑。

Cleanup status: none。
