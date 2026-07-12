# Nagi's Heart · Design Compliance Audit v1.0

> Tester: Laud (QA Engineer)
> Date: 2026-07-11
> Build: yiyi latest (Settings + Backlog update)
> Device: emulator-5554, 1080×2424
> Reference docs:
> - `CoCo_to_XoXo_Design_Handoff_v1_0.md`
> - `NagisHeart_Android_Design_Handoff_CC_v1_0.md`
> - `NagisHeart_Android_Core_Components_v1_0.md`
> - `NagisHeart_P0_HiFi_UI_Spec_v1_0.md`
> - `XoXo_P0_HiFi_UI_Review_v1_1.md`

---

## Summary

| Severity | Count |
|----------|-------|
| P0 Critical | 4 |
| P1 Major | 8 |
| P2 Medium | 7 |
| P3 Minor | 5 |
| **Total** | **24** |

---

## P0 — Critical (blocks core experience)

### D-001 · HUD缺少Back按钮 — 游戏中无法返回

**Design ref**: Core Components §4.1 "允许常驻: Back / Menu"；XoXo v1.1 明确列出 `ic_back.svg`

**Current**: NagiHud.kt 没有 Back 按钮参数，NavGraph.kt 没有从 Game 返回 Start 的路由。玩家进入游戏后无法返回主菜单，只能杀进程。

**Asset status**: `ic_back.svg` / `ic_back.xml` 已存在于 `assets/ui/`

**Fix**: NagiHud 增加 `onBack` 参数 + NavGraph 添加 Game→Start 返回路由

---

### D-002 · HUD缺少Menu按钮

**Design ref**: Core Components §4.1 "Back / Menu"；XoXo v1.1 列出 `ic_menu.svg`

**Current**: NagiHud.kt 没有 Menu 按钮。设计规范中 Menu 是提供 Save/Load/Settings/Backlog/返回主菜单 等入口的统一面板。

**Asset status**: `ic_menu.svg` / `ic_menu.xml` 已存在

**Fix**: 实现 Menu 侧栏/弹窗，包含 Save、Load、Settings、Backlog、Return to Title 等入口

---

### D-003 · `{{nagiCall}}` 占位符完全未实现

**Design ref**: story-data/nodes.json 有 51 处 `{{nagiCall}}` 使用

**Current**: Android 代码无任何 `{{nagiCall}}` 替换逻辑。所有含此占位符的对话会原样显示 `{{nagiCall}}`

**Fix**: GameViewModel 中所有文本替换处增加 `.replace("{{nagiCall}}", nagiCall)` ，nagiCall 值需从 GameState 或 NameSetup 获取

---

### D-004 · Auto/Skip 按钮不显示

**Design ref**: Core Components §4.1 "Auto, Skip" 为 HUD 常驻项

**Current**: NagiHud.kt 代码支持 Auto/Skip（条件渲染），GameScreen.kt 也传了 `onAuto`/`onSkip` 回调。但模拟器实测 HUD 只有 Backlog 和 Save，Auto/Skip 不可见。可能原因：GameViewModel 缺少 `toggleAuto()` / `toggleSkip()` / `isAutoPlaying` / `isSkipping` 导致编译回退旧 APK，或渲染异常。

**Fix**: 确认 GameViewModel 实现了 toggleAuto/toggleSkip 及对应 state 字段；验证 build 无 stub

---

## P1 — Major (feature or visual significantly off-spec)

### D-005 · Dialogue底部对话区没有毛玻璃效果

**Design ref**: Handoff §5.2 "底部对话区使用半透明毛玻璃叙事层"；Core Components §5 "Soft Glass Field"

**Current**: DialogueLayer.kt 使用 `bgColor.copy(alpha = 0.95f)` 纯色 + 顶部渐变，没有 blur/glass 效果。视觉上是不透明深色块，不是毛玻璃。

**Fix**: 使用 `Modifier.blur()` 或 `RenderEffect` 实现毛玻璃；或至少降低 alpha 到 0.7-0.85 让背景透出

---

### D-006 · Choice选项缺少左侧五角形标记

**Design ref**: HiFi Spec §2.7 "每条左侧用五边形小标记"；Core Components §8.3

**Current**: ChoiceLayer.kt ChoiceItem 只有文本，没有 ⬠ 标记

**Fix**: 在 ChoiceItem 的 Text 前增加 `⬠` 五角形图标，用 roseGold 色

---

### D-007 · Choice选项缺少dim/遮罩保护层

**Design ref**: Core Components §8.1 "面板外遮罩: 轻暗化 18-28%"

**Current**: Choice 出现时背景无暗化处理，选项直接浮在原背景上（p2无背景时不明显，但有背景的场景会影响可读性）

**Fix**: Choice phase 时在背景上叠加 18-28% alpha 的深色遮罩

---

### D-008 · Backlog中 `{{playerName}}` speaker未替换

**Design ref**: 功能bug

**Current**: GameViewModel.kt:253 `backlog.add(BacklogEntry(speaker = line.speaker, ...))` ——speaker 没做 `.replace("{{playerName}}", playerName)`

**Fix**: `speaker = line.speaker.replace("{{playerName}}", playerName)`

---

### D-009 · Start菜单没有背景KV图

**Design ref**: Handoff §5.1 "背景先用占位 KV"；HiFi Spec §2.3 "背景先用占位 KV，不强制绑定最终首页图"

**Current**: StartScreen.kt 只有 `NagiPalette.deepBlueNight` 纯色背景。即使是占位，也应该有一张 KV/背景图，让第一印象不像空白调试页。

**Fix**: 先用 `assets/bg/` 中任一张合适图片（如 nagi CG）作为 Start 背景，上叠暗渐变

---

### D-010 · Start菜单 Continue 应作为主按钮突出

**Design ref**: HiFi Spec §2.3 "`Continue` 是主按钮，其他入口降级"

**Current**: Start / Continue / Chapter / Gallery / Settings 五个按钮样式完全相同（同一个 MenuItem 组件）。Continue 没有任何视觉优先级。

**Fix**: Continue 使用更高 alpha 或轻微玫瑰金描边；其他非主入口用更低 opacity

---

### D-011 · Prologue/Opening没有毛玻璃承载层

**Design ref**: HiFi Spec §2.4 "文本用半透明毛玻璃大区域承载"；"背景仍然可见，不做纯白整板"

**Current**: PrologueScreen.kt 使用 `NagiPalette.deepBlueNight` 纯色背景 + 居中文本。完全不透明，没有背景图可见，也没有毛玻璃。

**Fix**: Prologue 背景使用一张氛围图（或当前 KV），上叠半透明毛玻璃层

---

### D-012 · 说话人名颜色不符合规范

**Design ref**: Core Components §5.3 "说话人: `accentPrimary`, 13sp"（即玫瑰金色）

**Current**: DialogueLayer.kt:73 使用 `colors.textSecondary` — 这是蓝灰色。设计要求说话人名用玫瑰金色（accentPrimary）。

**Fix**: 改为 `colors.accentPrimary` 或 `NagiPalette.roseGold`

---

## P2 — Medium (off-spec but not blocking)

### D-013 · FullscreenNarration的displayType匹配不完整

**Design ref**: story-data 中 `"display": "fullscreen"` 用于结局文本

**Current**: DialogueLayer.kt:22 只匹配 `"center"` 不匹配 `"fullscreen"`。但 GameScreen.kt:80 把 `"fullscreen"` 也路由到 `"center"` 处理。功能上能工作，但 Fullscreen Narration 应有自己的规范实现（Core Components §7: 遮罩 62-78%，文本区垂直居中偏上）

**Fix**: 给 `"fullscreen"` 类型单独实现：更强遮罩、文本偏上、不同字号

---

### D-014 · Continue Indicator (▽) 没有呼吸动画

**Design ref**: Core Components §9 "呼吸周期 900-1200ms"，"透明度 45-85%"

**Current**: DialogueLayer.kt:92 `▽` 是静态文本，alpha 固定 0.4，无动画

**Fix**: 给 ▽ 增加 `infiniteTransition` alpha 动画

---

### D-015 · p2及后续多个场景背景图缺失

**Design ref**: BG Mapping v1.1 要求 p2 "投资的私心" 至少有临时代用背景

**Current**: p2 显示纯深蓝色底，没有加载任何背景图。`scene_visuals.json` 可能未配置 p2 的背景。

**Fix**: 检查 scene_visuals.json 是否为 p2 配了 bg；如未配，先用临代图

---

### D-016 · Settings页面缺少 Skip 类别

**Design ref**: Handoff §5.11 分类应有 "Text, Audio, Display, Skip, Data"

**Current**: Settings 有 Text Speed / Auto Speed / BGM / Display / Data，但没有 Skip 设置（Skip Read / Skip All）

**Fix**: 增加 Skip 设置项

---

### D-017 · Backlog条目缺少时间/节点信息

**Design ref**: Core Components §12.4 Backlog Item "时间 / 节点: 11-12sp"

**Current**: Backlog只显示说话人+正文，无节点ID、时间戳等附属信息

**Fix**: BacklogEntry 增加 nodeId / timestamp，Backlog UI 显示

---

### D-018 · Backlog没有选项记录

**Design ref**: Handoff §5.8 "选项记录"；Core Components §12.4 "选项记录: 细线标签"

**Current**: 只记录对话，不记录玩家做的选择

**Fix**: 玩家选择时在 backlog 追加选项记录

---

### D-019 · Choice选项使用圆角不符合切角规范

**Design ref**: Design Handoff §2.2 "不做圆角按钮"；"形状统一为轻切角"

**Current**: ChoiceLayer 使用 `NagiShapes.cutSmall` — 需要确认 cutSmall 是否真正实现了切角。从截图看，选项边框有轻微圆角外观。如果 cutSmall 实际是 RoundedCornerShape 而非 CutCornerShape，则不符合设计。

**Fix**: 确认 NagiShapes.cutSmall 是 `CutCornerShape` 而非 `RoundedCornerShape`

---

## P3 — Minor (polish / nice-to-have)

### D-020 · Debug Overlay在非开发模式应隐藏

**Current**: 每个截图都有 `⬠ p1 | dialogue[20/66]` debug 信息。虽然 BuildConfig.DEBUG_MODE 控制，但确认发布前要关闭。

---

### D-021 · HUD章节名两侧的细线可能过于明显

**Design ref**: Core Components §4 "HUD 不做实体导航栏，不做重底色"

**Current**: NagiHud.kt 在章节名两侧有 0.5dp 的 borderSubtle 线段，在有背景图时可能过于抢眼。

---

### D-022 · NameSetup的确认按钮样式偏重

**Design ref**: HiFi Spec §2.5 "`Confirm` 沿用 Start 菜单按钮语言"

**Current**: 确认按钮有较重的背景色，看起来像系统按钮而非轻切角文字按钮

---

### D-023 · Splash画面未观测到（跳过太快或被覆盖）

**Design ref**: HiFi Spec §2.2 "居中显示 App mark，标题只显示 Nagi's Heart"

**Current**: 启动后直接跳到 Start，Splash 可能过快（需确认是否有 delay 或动画）

---

### D-024 · "Tap to continue" 在 ChapterTransition 中使用英文

**Current**: GameScreen.kt:249 `"Tap to continue"` — 游戏是中文环境，应改为中文或去掉

---

## Cross-reference: Previously reported bugs

| ID | Severity | Status | Description |
|----|----------|--------|-------------|
| BUG-001 | P0 | Fixed by Laud → 需验证yiyi未覆盖 | `{{playerName}}` speaker未替换 |
| BUG-002 | P0 | = D-003 | `{{nagiCall}}` 完全未实现 |
| BUG-003 | P1 | = D-008 | Backlog speaker `{{playerName}}` 未替换 |

---

## Test Evidence

| Screen | Screenshot | Status |
|--------|-----------|--------|
| Start | fresh_start.png | 纯色背景，无KV |
| NameSetup | name_setup.png | 功能OK，按钮偏重 |
| Prologue | 跳过太快未截 | 纯色底，无毛玻璃 |
| Dialogue (p1) | dialogue_audit.png | 缺Back/Menu/Auto/Skip，speaker色不对 |
| Choice (p2) | choice_audit.png | 缺⬠标记，缺遮罩，无背景图 |
| Settings | settings_screen.png | 功能OK，缺Skip类别 |
| Backlog | backlog_fresh.png | {{playerName}}未替换，缺时间/选项 |
| HUD | hud_check.png | 只有Backlog+Save |

---

## Priority recommendation for yiyi

**立即修复（影响基本可用性）：**
1. D-001: 加 Back 按钮（用户反馈最强烈）
2. D-004: 排查 Auto/Skip 为何不显示
3. D-008: Backlog speaker 替换一行改动
4. D-003: `{{nagiCall}}` 替换逻辑

**下一轮迭代：**
5. D-005: 对话区毛玻璃
6. D-006: Choice 五角形标记
7. D-007: Choice 遮罩
8. D-009: Start 背景
9. D-012: Speaker 颜色改玫瑰金
