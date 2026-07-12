# 交接日志 — yiyi → cc

> 日期: 2026-07-13
> 来源: 家里电脑 (yiyi session)
> 接手: 公司电脑 (cc)

---

## 一、本轮已完成改动

### 1. UI 设计系统

| 文件 | 改动 |
|------|------|
| `NagiColors.kt` | 新增 `textWeak`、`textShadowColor` 语义色；Dark/Light 两套完整色值按 XoXo spec 落地 |
| `NagiTypography.kt` | dialogue Normal 17sp/29sp、narration Serif 17sp/29sp（去掉 italic）、choiceText 15sp/21sp |
| `NagiShapes.kt` | cutSmall(8dp)、cutMedium(14dp)、PentagonShape — 已有，未改 |
| `NagiDialog.kt` | **新增** — 玻璃风格 Dialog 组件，替代所有 Material AlertDialog |

### 2. 图标系统

| 文件 | 改动 |
|------|------|
| `res/drawable/` | 新增 15 个 vector icon XML（ic_auto, ic_back, ic_backlog, ic_continue 等） |
| `NagiIconButton.kt` | 从文字 glyph 改为 `painterResource` 加载真正的 vector drawable |
| `DialogueLayer.kt` | BreathingIndicator 改用 `ic_continue` 图标（17x9dp） |

### 3. 游戏内页面

| 页面 | 改动 |
|------|------|
| `GameScreen.kt` — ChapterEndingOverlay | **重写** — 从居中简单样式改为海报风格（左下对齐，章节背景+暗层），带"返回目录"和"继续下一章"两个文字按钮 |
| `GameScreen.kt` — ChapterOpeningOverlay | 海报风格，左下对齐，KickerLabel + 章节标签 + 标题 + 提示文字 |
| `GameScreen.kt` — SectionOpeningOverlay | 同上，底部间距 96dp |
| `SectionClearScreen.kt` | **重写** — 从居中样式改为海报风格，带"返回目录"和"进入下一节"文字按钮，支持 `isSkipped` 区分文案 |
| `DialogueLayer.kt` | 对白/旁白文字加 text shadow（`textShadowColor`），继续指示器位置调整为 end=22dp, bottom=14dp |
| `NagiHud.kt` | 高度 44dp，top padding 14dp；章节标题 chip 加 cutSmall + glassBg 背景 + text shadow |

### 4. 长旁白 & 剧情回顾重写（lulu 最新规范）

| 文件 | 改动 |
|------|------|
| `LongNarrationLayer.kt` | 去掉矩形框，改为 radial gradient 渐隐衬底，中心实→边缘透明，无 border/clip-path；页码格式 `01 / 03`，13sp，距底 42dp |
| `BacklogScreen.kt` | 去掉 SystemPageBackground + timeline 卡片布局，改为当前剧情背景+重暗层(0.52)，全页沉浸式文字；角色名金色 SemiBold 13sp，正文 Serif 16sp/32sp |

### 5. 其他已完成（前几个 session）

- Splash 三层合成（bg + title + START 呼吸动画）
- 主页去掉标题覆盖层
- App 启动图标替换（rounded rect v2 decorated）
- 开场白页、名字设置页重写（金色装饰线、暗层叠加）
- ChapterOpeningScreen 独立页面（海报风格）
- NagiDialog 替换 NavGraph（新的故事确认）、SaveLoadScreen（覆盖确认）、GameScreen（跳过确认）
- 跳过本节功能（按钮 + 确认弹窗 + skipSection 逻辑）
- 存档 6→10 槽 + 覆盖确认
- scene_visuals.json v1.4 mapping（13 节点 BG + 11 节点 uiTheme 修正）
- LongNarrationLayer 长旁白分页
- Off-by-one 修复（长旁白结束后不多递增 dialogueIndex）
- SystemPageBackground 改为开屏同源背景
- XoXo 系统页视觉数值落地

---

## 二、仍未完成的任务

### 需要 cc 继续做的

| 优先级 | 任务 | 预计工时 | 阻塞 |
|--------|------|----------|------|
| P1 | 小章节状态枚举系统（未解锁/进行中/已完成/已跳过完成） | 3h | 需确认 chapters.json 小章节数据完整性 |
| P2 | 剧情回顾按章节隔离（BacklogScreen 只显示当前小章节已读） | 1.5h | 依赖 P1 |
| P3 | 三种能力拆分：剧情回顾 / 章节目录 / 章节回看 | 4h | 依赖 P1 |
| P4 | 章节目录显示小章节状态 + 回看入口 | 2h | 依赖 P1+P3 |
| P5 | 一一固定称呼确认（story-data 中台词检查） | 0.5h | 需确认 script 数据 |

### 需 XoXo 确认的设计问题

1. **金色强调色**：spec 标 `#D7BE86`，当前 `paleGold = #D8C38A`，色差 ΔE ≈ 2，是否需精确匹配？
2. **系统浮层 border 应用位置**：`borderSubtle = #FFFFFF 10%` 已设好，但不是所有组件都用了 border，需指定范围
3. **跳过按钮视觉规范**：当前用 glassBg + RoundedCorner(14dp) + micro 字体，无 XoXo spec
4. **Dark theme 文字色适用范围**：XoXo spec 的 `#F4F1EA`/`#D6D2CB` 是否也适用于游戏内对白？还是只针对系统页？

### 需 PM 确认的

1. **chapters.json 小章节数据**：当前只有大章结构，双层章节需小章节列表
2. **一一称呼**：story-data 里一一台词是否已写成"Ant大小姐"/"Nagi少爷"？
3. **优先级确认**：P1-P4 依赖数据层，是否先做数据再做 UI？

---

## 三、代码关键位置导航

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| 导航 | `ui/navigation/NavGraph.kt` | 所有路由 + 新的故事确认弹窗 |
| 游戏主画面 | `ui/screen/GameScreen.kt` | 所有 overlay（Opening/Ending/Dialogue/Choice） |
| 游戏逻辑 | `ui/viewmodel/GameViewModel.kt` | onTap/skipSection/章节切换 |
| 对白框 | `ui/component/DialogueLayer.kt` | 底部对白/旁白 + 全屏旁白 |
| HUD | `ui/component/NagiHud.kt` | 顶部导航栏 |
| 选项 | `ui/component/ChoiceLayer.kt` | 选择支 |
| 弹窗 | `ui/component/NagiDialog.kt` | 全局玻璃弹窗组件 |
| 色彩 | `ui/theme/NagiColors.kt` | 语义色 + 调色盘 |
| 字体 | `ui/theme/NagiTypography.kt` | 全部字体样式 |
| 形状 | `ui/theme/NagiShapes.kt` | 切角 + 五角形 |
| 图标 | `ui/icon/NagiIcon.kt` + `NagiIconButton.kt` | 图标枚举 + 按钮 |

---

## 四、编译和测试

- **无 gradlew wrapper**：需要在 Android Studio 中同步 + 编译
- **Gradle 配置**：`android/build.gradle.kts` + `android/app/build.gradle.kts` + `android/settings.gradle.kts`
- **Asset 链接**：`android/.gitignore` 排除了 `app/src/main/assets/bg/` 和 `app/src/main/assets/story-data/`，这些目录需要手动创建为 symlink 或复制：
  - `app/src/main/assets/bg/` → `NagisHeart/assets/bg/`
  - `app/src/main/assets/story-data/` → `NagisHeart/story-data/`
- **Splash 切图**：`res/drawable-nodpi/` 下的 `splash_title.png` 和 `splash_start.png` 需要是无背景透明 tight 切图

---

## 五、注意事项

1. `GameScreen.kt` 的 ChapterEndingOverlay 现在需要 `bgAssetPath` 参数（来自 `state.bgAssetPath`），如果值为 null 会 fallback 到 `pillow.jpg`
2. SectionClearScreen 的 `isSkipped` 参数目前在 NavGraph 中硬编码为 `true`（因为当前只有跳过流程到达此页面），正常完成流程到达时需改为 `false`
3. `NagiHud` 的 `height(44.dp)` 包含了 `statusBarsPadding()` 和 `top padding 14dp`，在不同设备上可能需要微调
4. Dark theme 的 `textPrimary` 已从 `snowWhite (#F7F9FC)` 改为 `#F4F1EA`（暖白），这影响所有 Dark theme 页面包括游戏内对白，需要 XoXo 确认是否正确
