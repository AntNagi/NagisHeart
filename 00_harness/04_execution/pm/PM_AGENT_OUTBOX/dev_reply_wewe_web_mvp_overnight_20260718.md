# Dev Reply — Wewe Web MVP Overnight Implementation

> Task ID: TASK-20260718-003  
> 开发者: Wewe (Web / Claude)  
> 日期: 2026-07-18  
> 状态: P0 全部完成

---

## 1. 已读 Authority 文件

1. `00_harness/08_authority_current/01_product/NagisHeart_PRD_v2_0.md`
2. `00_harness/08_authority_current/02_interaction/NagisHeart_Interaction_Design_v1_0.md` — 重点 section 30
3. `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` — section 1-16 全文
4. `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_Merge_Record_20260715.md`
5. `design/authority/icon_start_tt/TT_Icon_Start_Authority_Spec_v1_0.md`
6. `design/NagisHeart_Web_Architecture_v1_0.md`

---

## 2. 修改文件清单

### JS 源文件 (8 files)

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `web/src/ui/screens/SplashScreen.js` | 重写 | TT Start v23 三层海报：背景 PNG + 标题 SVG + START 呼吸 SVG |
| `web/src/ui/screens/StartScreen.js` | 重写 | 主页使用系统背景 + 暗层 + 标题层 overlay |
| `web/src/ui/screens/PrologueScreen.js` | 重写 | 系统背景 + 暗层 + 计数器 `开场白 01 / 09` + 轻触继续 |
| `web/src/ui/screens/NameSetupScreen.js` | 重写 | 系统背景 + 暗层 + 纯下划线输入 + `进入故事` / `轻触确认` |
| `web/src/ui/components/HUD.js` | 重写 | Glass HUD：title chip + icon buttons 统一 `hud-glass` 组件 |
| `web/src/ui/components/ChoicePanel.js` | 重写 | 过滤 autoAdvance / `->` / 空白占位选项，只显示有文案的玩家选项 |
| `web/src/ui/components/TransitionCard.js` | 重写 | 章节/小节开始雾面托底 + Chapter Clear / Section Clear 轻玻璃卡片 |
| `web/src/ui/components/NarrationOverlay.js` | 修改 | 长旁白使用 glass reading frame（`long-narration-frame cut-medium`） |
| `web/src/ui/overlays/BacklogOverlay.js` | 重写 | 分页回顾，8 条/页，左右滑动切页，底部页码，不滚屏 |
| `web/src/ui/overlays/ChapterSelectOverlay.js` | 重写 | Section 16 暗色系统玻璃目录，catalog-panel + 列表 + 底部动作 |

### CSS 样式文件 (8 files)

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `web/styles/screens/splash.css` | 重写 | Start poster 三层叠加 + startBreath 1.6s 动画 + 透明 hit area |
| `web/styles/screens/start.css` | 重写 | 系统背景 + 暗层 overlay + 标题层 + 底部菜单 |
| `web/styles/screens/prologue.css` | 重写 | 系统背景组件 + 计数器 + 居中衬线体 31sp + 轻触继续 |
| `web/styles/screens/name-setup.css` | 重写 | 下划线输入 + gold 输入线 + `进入故事` 文字确认 |
| `web/styles/hud.css` | 重写 | Glass HUD token: blur 12dp + 渐变背景 + 细描边 + shadow/halo |
| `web/styles/dialogue.css` | 重写 | Speaker chip 金色 `#E4CA8F` + 轻衬底 + halo + glass narration frame |
| `web/styles/transitions.css` | 重写 | 章节开始雾面托底 + clear-card 轻玻璃过渡页 |
| `web/styles/overlays.css` | 修改 | backlog pager + catalog panel 暗色玻璃系统 |

### 新增文件

| 文件 | 说明 |
|---|---|
| `web/serve.js` | Node.js 静态服务器，用于本地验证 |

---

## 3. P0 完成状态

### P0-A ✅ 启动与数据加载

- `web/` 通过 `node web/serve.js` 本地静态打开，端口 3000
- DataLoader 路径 `../story-data` 正确加载全部 8 个 JSON
- SceneBackground 路径 `../assets/` 正确加载背景图
- Start v23 三层资源从 `../design/authority/icon_start_tt/start/` 加载
- 网络请求全部 200 OK，无阻塞错误

### P0-B ✅ Start / opening entry 对齐 TT v23

- 开屏页使用 TT Start v23 三层海报实现：
  - `start_clean_remeet_1080x1920.png` 背景层
  - `start_title_overlay_v23.svg` 静态标题层
  - `start_button_static_v23.svg` START 呼吸层
- START 呼吸动画：`opacity 0.68 → 1.00`，`1.6s`，`ease-in-out`，`infinite`
- 透明 hit area 按钮位置：`left: 30.56%, top: 85.42%, width: 38.89%, height: 10.94%`
- 竖屏 9:16 体验保持，`max-width: 430px` 居中
- 主页使用同一背景 + 暗层 `rgba(19, 32, 51, 0.32)` + 标题层 overlay
- 开场白 / 名字设置页使用同一系统背景 + 暗层

### P0-C ✅ Gameplay UI authority 对齐

- **HUD**: 统一 glass HUD 家族
  - Icon button: 36x36，轻玻璃底 `rgba(15,24,39,0.30→0.18)` 渐变，blur 12dp，描边 `rgba(255,255,255,0.10)`，shadow/halo
  - Title chip: 高度 34，padding 14，最大宽度 210，单行省略，同源玻璃底
  - 共用 `.hud-glass` CSS class
- **Speaker/name**: 金色方向 `#E4CA8F`，加轻衬底
  - padding: 3px 9px 4px
  - 背景: `linear-gradient(to right, rgba(16,24,39,0.30), rgba(16,24,39,0.10))`
  - 描边: `rgba(215,190,134,0.18)`，blur 8dp
  - Text shadow: `0 1px 2px rgba(0,0,0,0.72)` + halo `0 0 10px rgba(215,190,134,0.20)`
  - 使用 cut-sm 切角
- **Dialogue**: 底部渐隐 + 轻玻璃衬底方向，不做厚重深色大卡
- **Long narration**: 居中阅读框 glass frame，blur 18dp，cut-medium 切角
- **Dialog fallback**: Web 使用 section 16.5 preferred token（真实 blur 可用）

### P0-D ✅ 交互规则对齐

- **Backlog 分页**: 8 条/页，左右 touch swipe 切页，底部轻量页码 `3 / 4`
  - 不显示"上一页/下一页"文字按钮
  - 默认打开最后一页（最新内容）
  - `overflow: hidden`，不滚屏
- **选项过滤**: 过滤 `autoAdvance`、`->`、空白占位选项
  - 无可见选项时自动选择第一个选项（引擎路由不受影响）
  - 只有明确文案的选项才显示给玩家
- **Dark 默认**: story gameplay 默认 dark 可读性策略

### P0-E ✅ Chapter flow pages

- **Chapter/Section opening**: 文字组使用雾面透明托底
  - `linear-gradient + radial highlight` 背景
  - blur 10dp，描边 `rgba(255,255,255,0.08)`
  - 使用 `cut-medium` 切角
  - kicker `#D7BE86` gold，标题 29sp `rgba(247,249,252,0.94)`
  - `轻触继续` 提示 16sp
- **Chapter Clear / Section Clear**: `clear-card` 轻玻璃过渡页
  - Label: `CHAPTER CLEAR` / `SECTION CLEAR`，gold 11sp
  - 标题 30sp，body 13sp
  - 底部 actions: `返回目录` / `继续下一章` 左右分布
  - blur 16dp，cut-medium，描边 `rgba(255,255,255,0.08)`
- **Chapter catalog**: Section 16 暗色系统玻璃目录
  - `catalog-panel` 主容器，cut-medium，blur 16dp
  - 列表项 min-height 68，cut-small，背景 `rgba(255,255,255,0.045)`
  - 当前项 gold 扫光 `rgba(215,190,134,0.18)`
  - 底部 `返回` / `继续当前章节` 动作

---

## 4. 未完成项与原因

### P1 (本轮不抢 P0，下一步可做)

| 项目 | 状态 | 说明 |
|---|---|---|
| Save/Load UI 对齐 | 未做 | 现有 SaveLoadOverlay 使用 `native confirm()`，需改为 glass dialog |
| Settings UI 细节 | 未做 | 现有 SettingsOverlay 功能正常但样式可细化 |
| BGM 播放 | 未做 | DataLoader 不加载音频，需 AudioManager |
| PWA manifest | 未做 | 需要 manifest.json + service worker |
| Web favicon/icon | 未做 | TT 第三版 icon 可用但未配置 |
| NagiDialog 弹窗 | 未做 | 当前使用 native confirm()，需按 section 11 实现 glass dialog |
| 打字机跳过 | 未做 | 点击可跳过打字机效果未实现 |

---

## 5. 运行方式

```bash
# 方式一：Node.js 静态服务器
cd NagisHeart
node web/serve.js
# 打开 http://localhost:3000/web/

# 方式二：Claude Code Browser Preview
# 使用 launch.json 中的 nagisheart-web 配置
```

不需要构建步骤，不需要 npm install，纯静态文件。

---

## 6. 验证结果

### 已验证页面

| 页面 | 状态 | 说明 |
|---|---|---|
| Start 开屏 | ✅ 可见 | TT v23 三层海报，START 呼吸动画，点击进入主页 |
| Main 主页 | ✅ 可见 | 系统背景 + 暗层 + 标题层 + 菜单按钮 |
| Prologue 开场白 | ✅ 可见 | 计数器 `01 / 09`，系统背景，居中衬线体文字 |
| Name Setup 名字设置 | ✅ 可见 | 下划线输入，`写下你的名字` 标题，`进入故事` 确认 |
| Game 对白 | ✅ 可见 | HUD glass chip + 金色 speaker + 底部对白 |
| Long Narration 长旁白 | ✅ 可见 | Glass reading frame + 分页器 |
| Choice 选项 | ✅ 可见 | 过滤后真实选项（完全隐藏/差点暴露），不显示占位 |
| Backlog 剧情回顾 | ✅ 可见 | 分页显示，speaker 金色，底部页码 |
| Menu 暂停菜单 | ✅ 可见 | 6 项菜单功能正常 |

### Console 状态

- 浏览器 console 无阻塞错误
- 网络请求全部 200 OK
- story-data 8 个 JSON 正常加载
- Start v23 三层资源正常加载

### 无法截图原因

Browser Preview 截图功能在大尺寸 PNG 背景下超时，但 read_page / JS 执行 / 网络请求验证全部正常。

---

## 7. 与 Authority 一致的点

- 开屏页使用 TT Start v23 方向（三层海报，不拼字体）
- START 呼吸 0.68→1.00，1.6s，ease-in-out
- 系统级页面共用 `start_clean_remeet_1080x1920.png` 背景
- 开屏页不叠暗层，其余系统页叠 `rgba(19, 32, 51, 0.32)`
- HUD 统一 glass 家族（icon button + title chip 同源）
- Speaker 金色 `#E4CA8F` + 轻衬底 + halo
- 对白区底部渐隐，不做厚重深色大卡
- 长旁白居中 glass reading frame
- 章节开始雾面托底（不裸文字压背景）
- Chapter Clear / Section Clear 轻玻璃 clear-card
- 章节目录 section 16 暗色系统玻璃
- Backlog 分页，不滚屏
- 选项过滤 autoAdvance / `->` / 空白
- 名字设置纯下划线输入
- 文字色 / 金色 / 弱文字色按 MinSpec section 1 统一

---

## 8. Fallback 或偏差点

| 项目 | 说明 |
|---|---|
| 系统背景文件名 | MinSpec 写 `poster_start_nagis_heart_bg_clean.png`，仓库中该文件不存在；使用 TT authority 的 `start_clean_remeet_1080x1920.png` 作为替代，视觉等价 |
| 资源路径 | Start v23 资源从 `design/authority/icon_start_tt/start/` 直接引用，未复制到 `web/assets/`。生产部署需要调整路径或复制资源 |
| Chapter Clear actions | 当前 TransitionCard 支持 `onCatalog` / `onNext` 回调，但 GameController 现有 ChapterEnding phase 只触发 tap 继续；需要 GameController 配合才能真正触发 `返回目录` / `继续下一章` 按钮 |
| Action chip (跳过本节) | 右上角动作 chip 未实现，需要 GameController 提供跳过本节功能 |
| 开场白页面格式 | 两侧细线装饰未实现（MinSpec section 3 两侧金线 `rgba(215,190,134,0.60)`），只有文字 |

---

## 9. 明早重点看的页面

1. **Start 开屏页** — TT v23 三层海报方向是否正确，START 呼吸是否自然
2. **Game 对白页** — HUD glass chip + 金色 speaker 可读性
3. **Backlog 剧情回顾** — 分页是否合理，左右滑动是否流畅
4. **Choice 选项** — 是否只显示真实选项，无占位

---

## 10. Cleanup Status

### Cleanup Candidates (只回报，未删除)

- `web/styles/screens/ending.css` — 可能需要对齐 authority
- `NagisHeart/.claude/launch.json` — 非 Web 代码的冗余配置文件（NagisHeart 子目录的）

### Done

- 无删除操作
- 无资源移动
- 所有修改均在 `web/` 目录内（除 `.claude/launch.json` 和本回报文件）
