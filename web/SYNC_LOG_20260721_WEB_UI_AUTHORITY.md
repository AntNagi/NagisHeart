# Web UI Authority Alignment Sync Log

> 日期：2026-07-21
> 执行人：cc
> 基准文档：
>   - `design/NagisHeart_UI_Authority_XoXo_v1_0.html`（XoXo 合版权威候选 HTML）
>   - `handoff/.../XoXo_UI_Final_MinSpec_20260712.md`（UI 数值规范，§1-§21）

---

## 变更概览

共 90 项 authority 对齐修正，全部完成。变更分类如下：

### 1. 全局 token 修正（tokens.css）

- `--nagi-weak-text` 从 `#B7B3AD` 改为 `#C9D1DC`
- `--lh-choice` 从固定 21px 改为 `1.8`（15px × 1.8 = 27px）
- `--lh-dialogue` / `--lh-narration` 从固定 29px 改为 `1.9`
- `--fs-prologue` 从 16px 改为 28px，`--lh-prologue` 改为 1.68
- `--hud-color` 改为 `rgba(244,241,234,0.88)`
- `--hud-soft` 改为 `rgba(247,249,252,0.12)`
- `--text-secondary` dark 改为 `rgba(232,238,246,0.72)`
- `--border-subtle` dark 改为 `rgba(255,255,255,0.08)`
- 新增：`--nagi-gold`、`--clip-cut-sm`/`--clip-cut-md`、overlay layer 变量、glass-panel 变量、dialog 变量、dialogue-box 变量
- `--cut-small`/`--cut-medium` 重命名为 `--cut-sm`/`--cut-md`

### 2. 暗层系统（§1）

- 系统级页面（主页/存档/章节目录/设置/画廊）：3-stop 渐变 + 白色高光双层
- Splash 类（开场白/名字设置）：底部渐变 + 径向暗角双层
- Story 类：顶底渐变 + 左右暗边双层
- 各类暗层定义为 CSS 变量，通过 `.system-bg-overlay` / `.system-bg-overlay.splash` / `.system-bg-overlay.story` 类名控制

### 3. 开屏页（§2）

- START 呼吸动效：duration 1.6s→1.8s，alpha 0.68→0.72/1.00，增加 scale 0.992→1.012

### 4. 开场白页（§3）

- 暗层从平面 0.32 改为 splash 双层
- 正文字号 31px→28px，line-height 1.6→1.68
- 顶部 counter 增加两侧金色细线（CSS pseudo-elements）

### 5. 名字设置页（§4）

- 暗层改为 splash 双层
- 副标题色 `#D6D2CB` → `rgba(232,238,246,0.72)`
- 占位符色 alpha 0.58 → `rgba(244,241,234,0.66)`
- 标题色 `#F4F1EA` → `#F7F9FC`
- 顶部标签增加金色细线

### 6. 主页（§5）— 布局完全重写

- 暗层改为系统级双层
- 布局从垂直按钮列表改为：两列主操作 + 分割线 + 4列次操作 grid
- 主操作 17sp/500，说明 13sp
- 次操作 12sp，4列 grid
- 分割线 `rgba(255,255,255,0.08)`

### 7. 对白层（§8）— 结构重写

- 从底部渐变遮罩改为浮动玻璃卡片
- 背景：`rgba(16,24,39,0.54)→0.70` 渐变
- 增加 border 0.08、blur 16px、cut-md clip-path、box-shadow
- 外边距 left/right 18, bottom 34
- 内边距 top 18, left/right 20, bottom 22
- 正文色改为 `rgba(247,249,252,0.94)`

### 8. 选项层（§19）— 布局重写

- 从居中全屏布局改为底部对齐
- 位置 left/right 18, bottom 34
- 去掉 max-width 320px、居中遮罩
- 背景改为 `rgba(16,24,39,0.48)` + blur 12 + cut-sm
- gap 12→10, text color `rgba(247,249,252,0.92)`

### 9. HUD（§7/§15/§17.2）

- icon button 与 title chip 分离为不同 glass class
- title chip：渐变 `to bottom` → `to right`，增加中心横线装饰
- title chip text-shadow：`0 2px 14px rgba(0,0,0,0.48)`
- icon button：增加 radial-gradient 中心高光，border 0.12
- icon SVG 增加 drop-shadow halo

### 10. NagiDialog（§11/§16.5/§17.3）

- 形状 border-radius 24px → cut-md clip-path
- padding 32/40/28 → 22/22/18
- title 22px → 28px, color `rgba(247,249,252,0.96)`
- body 15px → 16px, line-height 1.9, color `rgba(244,241,234,0.88)`
- gap 26 → 24, border 0.12 → 0.08
- 增加 `::before` inner highlight
- scrim 0.32 → 0.40
- dismiss color `rgba(244,241,234,0.74)`, confirm `#F7F9FC` + weight 500, font 15px

### 11. 长旁白（§9/§17.4）

- 背景从实底 glass 改为 radial-gradient 椭圆雾化
- 增加 mask radial-gradient
- 去掉显式 border 和 clip-path
- 外边距 18px，内边距 20px
- blur 18→16px

### 12. 系统页面（存档/设置/章节目录/画廊）

- 全部改为系统级背景图 + 双层暗层 + 玻璃面板
- JS 中注入 system-bg + system-bg-overlay DOM
- 面板使用 glass-panel token + cut-md

### 13. 章节目录（§16）

- 当前项背景改为 `linear-gradient(to right, gold 0.18, white 0.04)`
- 底部动作 padding-top 14→10
- 左侧动作色 0.86→0.82

### 14. 章节/小节开始页（§14.1）

- 玻璃托底 radial-gradient 位置改为 at 36% 42%
- 增加 opacity 0.92
- 增加 cut-md clip-path
- text-shadow 加强

### 15. Chapter Clear（§14.2）

- 背景改为 authority 双层 radial+linear 精确值
- border 改为 0.10
- 增加 cut-md clip-path
- text-shadow 对齐

### 16. 结局页（§18.1）— 完全重写

- 新增 ending-card 三层结构（content / status feedback / primary action）
- Ending-card 玻璃卡片：gold radial-gradient + dark linear-gradient
- Status feedback：11px inline note（非按钮），gold dot
- Primary action：仅"返回主页"，gold gradient cell + cut-sm
- Mood token：TRUE/GOOD/NORMAL/BAD 不同 accent color

### 17. LINE 聊天层（§20）— CSS ready

- soft-screen 玻璃容器：glass-panel-bg + cut-md
- 气泡 cut-sm（非圆角），14sp，NPC rgba(255,255,255,0.08)，玩家 rgba(215,190,134,0.18)
- JS 组件待 LINE 聊天功能实际接入时创建

### 18. 回忆画廊 — 骨架创建

- 新增 GalleryOverlay.js + CSS
- 系统级背景 + 玻璃面板 + grid 布局骨架

### 19. 剧情回顾（§10）

- overlay alpha 0.92→0.58
- 正文 text-shadow 对齐 authority

---

## 修改文件清单

| 文件 | 类型 |
|---|---|
| `web/styles/tokens.css` | 重写 |
| `web/styles/screens/splash.css` | 重写 |
| `web/styles/screens/prologue.css` | 重写 |
| `web/styles/screens/name-setup.css` | 重写 |
| `web/styles/screens/start.css` | 重写 |
| `web/styles/screens/ending.css` | 重写 |
| `web/styles/dialogue.css` | 重写 |
| `web/styles/choice.css` | 重写 |
| `web/styles/hud.css` | 重写 |
| `web/styles/transitions.css` | 重写 |
| `web/styles/overlays.css` | 编辑 |
| `web/src/ui/screens/StartScreen.js` | 重写 |
| `web/src/ui/screens/PrologueScreen.js` | 编辑 |
| `web/src/ui/screens/NameSetupScreen.js` | 编辑 |
| `web/src/ui/screens/EndingScreen.js` | 重写 |
| `web/src/ui/components/HUD.js` | 重写 |
| `web/src/ui/overlays/SettingsOverlay.js` | 编辑 |
| `web/src/ui/overlays/SaveLoadOverlay.js` | 编辑 |
| `web/src/ui/overlays/ChapterSelectOverlay.js` | 编辑 |
| `web/src/ui/overlays/GalleryOverlay.js` | 新增 |

---

## 未变更（已正确）

- `web/src/ui/screens/SplashScreen.js` — 结构正确，无需改
- `web/src/ui/components/DialogueBox.js` — JS 逻辑未变
- `web/src/ui/components/ChoicePanel.js` — JS 逻辑未变
- `web/src/ui/components/TransitionCard.js` — 结构已正确
- `web/src/ui/components/NagiDialog.js` — JS 逻辑未变
- Story data / script / BG mapping / Android code — 未触碰
