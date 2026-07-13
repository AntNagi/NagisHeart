# Nagi's Heart · Web 端技术架构设计 v1.0

> 2026-07-13 · CC (Claude Code)  
> 目标：移动端优先的 Web VN 引擎，与 Android 共享同一套 story-data，支持热更新和灵活扩展

---

## 0. 设计原则

1. **剧本是数据，不是代码** — story-data 通过网络加载，引擎只是播放器
2. **热更新** — story-data 独立于引擎部署，版本号匹配即可替换
3. **移动端优先** — 竖屏 9:16 固定，触控交互，手机浏览器是主要载体
4. **与 Android 对等** — 同一套 JSON、同一套变量语义、同一套结局判定
5. **渐进增强** — 核心体验零依赖（原生 JS + CSS），高级特性按需加载
6. **离线可用** — Service Worker 缓存引擎和资源，断网也能继续游戏

---

## 1. 整体架构

```
┌─────────────────────────────────────────────────┐
│                   部署层                         │
│  CDN / Static Host (Vercel / Cloudflare Pages)  │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ engine/      │  │ story-data/              │ │
│  │ (版本化)      │  │ (独立版本化，可热替换)     │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────┐
│                 Service Worker                   │
│  缓存策略：引擎=Cache First / 数据=Stale While   │
│  Revalidate / 背景图=Cache First + LRU           │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│                  应用层                          │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │ DataLoader │  │ StoryEngine│  │ GameState  │  │
│  │ (fetch+    │  │ (resolve+  │  │ (变量+     │  │
│  │  validate) │  │  flow+     │  │  effect+   │  │
│  │            │  │  router)   │  │  snapshot)  │  │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  │
│        │               │               │         │
│        ▼               ▼               ▼         │
│  ┌──────────────────────────────────────────┐    │
│  │           GameController                 │    │
│  │  (对白推进 · 选择处理 · 章节转场 ·        │    │
│  │   自动播放 · 跳过 · 存档 · 回放)          │    │
│  └─────────────────┬────────────────────────┘    │
│                    │                              │
│                    ▼                              │
│  ┌──────────────────────────────────────────┐    │
│  │           UI Layer (DOM)                  │    │
│  │  ┌──────┐┌──────┐┌────┐┌──────┐┌──────┐  │    │
│  │  │Scene ││Dialog││Line││Choice││System│  │    │
│  │  │(BG)  ││Layer ││Chat││Layer ││Pages │  │    │
│  │  └──────┘└──────┘└────┘└──────┘└──────┘  │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │         Persistence Layer                │    │
│  │  SaveManager (IndexedDB / localStorage)  │    │
│  │  ProgressManager (已访问/已解锁)          │    │
│  │  SettingsManager (文字速度/音量/主题)      │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## 2. 目录结构

```
web/
├── index.html              ← 单页入口（SPA）
├── manifest.json           ← PWA 清单
├── sw.js                   ← Service Worker
│
├── src/
│   ├── main.js             ← 入口：初始化 → 加载 → 启动
│   │
│   ├── engine/
│   │   ├── StoryEngine.js      ← 节点解析、flow 查找、router 评估
│   │   ├── ConditionParser.js   ← 递归下降条件解析器
│   │   ├── GameState.js         ← 变量管理、effect 应用、snapshot
│   │   └── TemplateResolver.js  ← {{playerName}} / {{nagiCall}} 替换
│   │
│   ├── data/
│   │   ├── DataLoader.js       ← fetch JSON + 版本校验 + 缓存协调
│   │   ├── SaveManager.js      ← IndexedDB 存档（10槽 + auto）
│   │   ├── ProgressManager.js  ← localStorage 进度（已访问节点/解锁结局）
│   │   └── SettingsManager.js  ← localStorage 用户设置
│   │
│   ├── controller/
│   │   └── GameController.js   ← 状态机：对白推进、选择、转场、自动播放
│   │
│   ├── ui/
│   │   ├── Router.js           ← 页面路由（hash-based SPA）
│   │   ├── screens/
│   │   │   ├── SplashScreen.js
│   │   │   ├── StartScreen.js
│   │   │   ├── PrologueScreen.js
│   │   │   ├── NameSetupScreen.js
│   │   │   ├── GameScreen.js       ← 主游戏画面
│   │   │   ├── SaveLoadScreen.js
│   │   │   ├── BacklogScreen.js
│   │   │   ├── ChapterScreen.js
│   │   │   ├── GalleryScreen.js
│   │   │   ├── SettingsScreen.js
│   │   │   └── EndingScreen.js
│   │   │
│   │   ├── components/
│   │   │   ├── SceneBackground.js   ← 背景图加载/切换/淡入淡出
│   │   │   ├── DialogueBox.js       ← 底部毛玻璃对话框（切角）
│   │   │   ├── NarrationOverlay.js  ← 全屏旁白 + 长旁白分页
│   │   │   ├── ChoicePanel.js       ← 独立切角卡片选项
│   │   │   ├── LineChatView.js      ← LINE 聊天模式
│   │   │   ├── HUD.js              ← 顶部操作栏
│   │   │   ├── ChapterCard.js       ← 章节/段落转场卡
│   │   │   └── EndingCard.js        ← 结局展示
│   │   │
│   │   └── theme/
│   │       ├── tokens.js            ← 颜色/字号/间距/动画 token
│   │       ├── theme.js             ← Light/Dark/Auto 切换器
│   │       └── shapes.js            ← CutCorner clip-path 生成器
│   │
│   └── utils/
│       ├── EventBus.js         ← 轻量发布/订阅
│       ├── AudioManager.js     ← BGM (Web Audio API) + SE
│       └── ImagePreloader.js   ← 背景图预加载队列
│
├── styles/
│   ├── reset.css
│   ├── tokens.css              ← CSS 自定义属性（颜色/字号/间距）
│   ├── theme-light.css
│   ├── theme-dark.css
│   ├── layout.css              ← 竖屏容器、安全区
│   ├── dialogue.css
│   ├── choice.css
│   ├── line-chat.css
│   ├── hud.css
│   ├── transitions.css         ← 页面/场景转场动画
│   └── screens/                ← 各页面样式
│
└── assets/                     ← 构建时从根目录 assets/ 复制或 CDN 引用
    ├── bg/
    ├── ui/svg/
    └── audio/
```

---

## 3. 核心模块设计

### 3.1 DataLoader — 数据加载与热更新

```javascript
class DataLoader {
  constructor(baseUrl = './story-data') { ... }

  // 加载所有 JSON，返回完整数据包
  async loadAll() → StoryData

  // 检查远程版本号，决定是否需要更新
  async checkUpdate() → { needsUpdate, remoteVersion, localVersion }

  // 增量更新：只拉取变化的文件
  async applyUpdate() → void
}
```

**热更新机制：**

```
story-data/version.json
├── version: 3              ← 数据版本号
├── minEngineVersion: 1     ← 最低引擎版本
├── files: {                ← 文件清单 + hash（增量更新用）
│   "nodes.json": "a1b2c3",
│   "flow.json": "d4e5f6",
│   ...
│ }
└── updatedAt: "2026-07-13"
```

流程：
1. 引擎启动 → 读本地缓存的 `version.json`
2. 后台 fetch 远程 `version.json`
3. 比对 `version` 号 — 相同则跳过
4. 比对 `minEngineVersion` — 超过当前引擎版本则提示用户刷新
5. 比对各文件 hash — 只下载变化的文件
6. 写入 Cache Storage → 下次启动生效
7. 如果用户正在游戏中，不打断，下次进入主菜单时提示更新

### 3.2 StoryEngine — 状态机内核

与 Android 完全对等的 JS 实现：

```javascript
class StoryEngine {
  constructor({ nodes, flow, routers, sceneVisuals, endings }) { ... }

  // 解析节点 ID → Found / EndingReached / NotFound
  resolve(id, gameState) → NodeResolution

  // 查 flow 获取下一个节点
  getNextNodeId(currentId, gameState) → string | null

  // 过滤可见选项（评估 condition）
  getVisibleChoices(choices, gameState) → Choice[]

  // 处理选项 transition
  processChoiceTransition(choice) → string | null
}
```

**关键设计决策：**
- StoryEngine 是**无状态的**，不持有 GameState，由外部传入
- Router 解析有**环路检测**（visited set）
- byRoute 匹配规则与 Android 相同：硬编码 `M/J/dream/stay/bad`

### 3.3 ConditionParser — 条件解析器

递归下降解析器，支持：

```
表达式 = OrExpr
OrExpr = AndExpr ("||" AndExpr)*
AndExpr = Comparison ("&&" Comparison)*
Comparison = Atom (("===" | "!==" | ">=" | "<=" | ">" | "<") Atom)?
Atom = "!" Atom | "(" OrExpr ")" | number | string | boolean | identifier
```

identifier 从 GameState 查值。类型强转规则与 Android 一致：
- `toNum`: Boolean→0/1, String→parseInt fallback 0
- `toBool`: 0/null/false/""/undefined→false, 其余→true
- `eq`: 先 `===`，再 `toString()` 比较

### 3.4 GameState — 变量管理

```javascript
class GameState {
  constructor(variablesData) { ... }  // 从 variables.json 初始化

  get(name) → any
  getInt(name) → number
  getString(name) → string
  getBoolean(name) → boolean
  set(name, value) → void

  applyEffect({ var, op, val }) → void   // add | set
  applyEffects(effects[]) → void

  snapshot() → object                     // 用于存档和 debug
  restoreFrom(saved) → void              // 从存档恢复
  toSerializable() → object              // 序列化为 JSON
}
```

### 3.5 GameController — 游戏控制器

管理所有游戏流程，是 UI 和 Engine 之间的桥梁：

```javascript
class GameController extends EventTarget {
  // 生命周期
  startNewGame(name, nagiCall)
  continueGame()
  loadGame(slotId)
  saveGame(slotId)

  // 游戏操作
  onTap()                        // 点击推进
  onChoiceSelected(index)        // 选择选项
  toggleAuto()                   // 自动播放
  toggleSkip()                   // 跳过模式

  // 章节
  jumpToChapter(startNodeId)
  skipSection()

  // 回放
  startReplay(startNodeId, chapterId, sectionIndex)
  stopReplay()

  // 状态（只读，UI 监听 change 事件获取更新）
  get state() → GameUiState
}
```

**状态机 phases：**

```
Loading → Dialogue ⇄ Choice → Response → ...循环...
                                           ↓
                                   ChapterTransition
                                   SectionTransition
                                   ChapterEnding
                                           ↓
                                        Ending
```

**事件驱动 UI 更新：**

```javascript
controller.addEventListener('statechange', (e) => {
  const { phase, speaker, text, choices, ... } = e.detail;
  // UI 根据 phase 切换显示
});

controller.addEventListener('scenechange', (e) => {
  const { bg, bgm, uiTheme, mood } = e.detail;
  // 切换背景、音乐、主题
});

controller.addEventListener('transition', (e) => {
  const { type, data } = e.detail;  // chapter / section / ending
  // 播放转场动画
});
```

---

## 4. UI 层设计

### 4.1 渲染策略

**原生 DOM + CSS 动画**，不用 Canvas/WebGL：
- 文字排版需要浏览器原生能力（换行、字间距、无障碍）
- 毛玻璃（backdrop-filter）是 CSS 原生特性
- 切角形状用 CSS clip-path
- 转场动画用 CSS transition/animation + requestAnimationFrame
- 背景图用 `<img>` + `object-fit: cover`

**组件模式：**

每个组件是一个 class，管理自己的 DOM 子树：

```javascript
class DialogueBox {
  constructor(container) {
    this.el = this.createElement();
    container.appendChild(this.el);
  }

  update({ speaker, text, display }) { ... }
  show() / hide() { ... }
  animateTextIn(text, speed) { ... }  // 打字机效果

  destroy() {
    this.el.remove();
  }
}
```

不用虚拟 DOM / 框架 — VN 的 UI 更新频率低（用户点击驱动），DOM 操作成本可忽略。

### 4.2 主题系统

CSS 自定义属性驱动，与 Android NagiColors 对等：

```css
/* tokens.css */
:root {
  /* 基础色板 */
  --nagi-rose-gold: #C8A2A8;
  --nagi-muted-rose: #9B7B82;
  --nagi-snow-white: #F7F9FC;
  --nagi-silver-blue: #D1D9E6;
  --nagi-mist-blue: #E8EEF6;
  --nagi-soft-glass-white: #FFFFFF;
  --nagi-gray-blue: #AEBAC8;
  --nagi-deep-blue-night: #101827;
  --nagi-ink-navy: #1B2430;
  --nagi-warm-slate: #3C3640;
  --nagi-warm-slate-light: #4A424E;
  --nagi-pentagon-blue: #1A4B8C;
}

/* theme-light.css */
[data-theme="light"] {
  --bg-primary: var(--nagi-mist-blue);
  --text-primary: var(--nagi-ink-navy);
  --text-secondary: var(--nagi-warm-slate);
  --glass-bg: rgba(255, 255, 255, 0.78);
  --glass-border: rgba(174, 186, 200, 0.45);
  --accent-primary: var(--nagi-rose-gold);
  --icon-default: rgba(174, 186, 200, 0.82);
  ...
}

/* theme-dark.css */
[data-theme="dark"] {
  --bg-primary: var(--nagi-deep-blue-night);
  --text-primary: var(--nagi-snow-white);
  --glass-bg: rgba(16, 24, 39, 0.74);
  ...
}
```

**主题切换逻辑：**

```javascript
class ThemeManager {
  apply(uiTheme, bgBrightness = 0.5) {
    const resolved = uiTheme === 'Auto'
      ? (bgBrightness > 0.5 ? 'light' : 'dark')
      : uiTheme.toLowerCase();
    document.documentElement.setAttribute('data-theme', resolved);
  }
}
```

### 4.3 切角形状

CoCo 设计语言核心 — **不用圆角**，用切角：

```javascript
// shapes.js
function cutCornerPath(w, h, cut = 8) {
  return `polygon(
    ${cut}px 0, ${w - cut}px 0,
    ${w}px ${cut}px, ${w}px ${h - cut}px,
    ${w - cut}px ${h}px, ${cut}px ${h}px,
    0 ${h - cut}px, 0 ${cut}px
  )`;
}
```

```css
.glass-card {
  clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px),
    calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);
  backdrop-filter: blur(12px);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}
```

### 4.4 安全区与布局

```css
.game-container {
  width: 100vw;
  height: 100dvh;               /* dynamic viewport height，避免移动浏览器地址栏问题 */
  max-width: 430px;             /* 手机最大宽度 */
  margin: 0 auto;               /* 桌面端居中 */
  overflow: hidden;
  position: relative;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0;
}
```

### 4.5 页面路由

Hash-based SPA 路由，零依赖：

```javascript
class Router {
  constructor(routes) {
    // routes = { 'splash': SplashScreen, 'start': StartScreen, ... }
    window.addEventListener('hashchange', () => this.resolve());
  }

  navigate(name, params = {}) {
    location.hash = `#/${name}`;
    this.currentScreen?.destroy();
    this.currentScreen = new this.routes[name](this.container, params);
  }
}
```

---

## 5. 存储层

### 5.1 存档 — IndexedDB

```
Database: NagisHeart
├── Store: saves
│   ├── key: 0 (auto-save)
│   ├── key: 1-10 (manual slots)
│   └── value: { nodeId, playerName, nagiCall, variables, timestamp, sceneTitle }
│
├── Store: progress
│   ├── visitedNodes: Set<string>
│   ├── unlockedEndings: Set<string>
│   └── sectionStates: Map<string, SectionState>
│
└── Store: settings
    └── { textSpeed, autoSpeed, bgmVolume, displayTheme }
```

为什么用 IndexedDB 而不是 localStorage：
- 存档含完整变量快照，单个可达 10KB+
- 10 个槽 + auto = 最多 ~110KB
- localStorage 的 5MB 限制虽然够用，但 IndexedDB 是异步的，不阻塞主线程
- 设置和进度用 localStorage 即可（体积小、同步读取快）

### 5.2 资源缓存 — Cache API

```javascript
// sw.js
const CACHE_ENGINE = 'engine-v1';
const CACHE_DATA = 'data-v2';
const CACHE_ASSETS = 'assets-v1';

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.pathname.startsWith('/story-data/')) {
    // Stale-While-Revalidate：先返回缓存，后台更新
    e.respondWith(staleWhileRevalidate(e.request, CACHE_DATA));
  }
  else if (url.pathname.startsWith('/assets/bg/')) {
    // Cache First + LRU：背景图不常变，缓存优先
    e.respondWith(cacheFirst(e.request, CACHE_ASSETS));
  }
  else {
    // 引擎代码：Cache First
    e.respondWith(cacheFirst(e.request, CACHE_ENGINE));
  }
});
```

---

## 6. 音频

### 6.1 BGM

Web Audio API + HTMLAudioElement fallback：

```javascript
class AudioManager {
  constructor() {
    this.bgm = new Audio();
    this.bgm.loop = true;
  }

  async playBgm(path) {
    // 移动端需要用户交互后才能播放音频
    // 在首次 tap 时 resume AudioContext
    this.bgm.src = path;
    await this.bgm.play().catch(() => {
      this.pendingBgm = path;  // 等下次用户交互时重试
    });
  }

  setVolume(v) { this.bgm.volume = v; }
  pause() { this.bgm.pause(); }
  resume() { this.bgm.play(); }
}
```

### 6.2 移动端音频限制

iOS Safari 要求用户交互后才能播放音频。处理方式：
- 在 Splash/Start 页面的第一次 tap 上 `AudioContext.resume()`
- 如果 BGM 播放失败，存入 pending，下次 tap 时重试

---

## 7. 热更新详细设计

### 7.1 数据版本与引擎版本分离

```
引擎版本: web/package.json → version: "1.0.0"
数据版本: story-data/version.json → version: 3
兼容性:   story-data/version.json → minEngineVersion: 1
```

- 引擎和数据**独立部署**
- 数据更新不需要发新版引擎
- `minEngineVersion` 保证向前兼容：新数据需要新引擎特性时，提示用户刷新页面

### 7.2 更新流程

```
用户打开 → 加载本地缓存数据 → 正常游戏
              ↓ (后台)
        fetch 远程 version.json
              ↓
        比对 version 号
              ↓
        ┌─ 相同 → 不更新
        │
        ├─ 不同 → 比对 minEngineVersion
        │         ├─ 兼容 → 比对文件 hash → 增量下载 → 写入缓存
        │         │         → 下次进主菜单时提示「剧情已更新」
        │         └─ 不兼容 → 提示「请刷新页面」
        │
        └─ 网络失败 → 静默忽略，用本地缓存
```

### 7.3 存档兼容

数据更新可能改变节点 ID 或变量名。处理方式：
- 存档记录的 `version` 与当前数据 `version` 比对
- 如果节点 ID 不存在 → 回退到最近的章节起点
- 变量名变更通过 `variables.json` 的 `legacy` 字段映射

---

## 8. 性能策略

### 8.1 背景图

- **懒加载**：只加载当前节点和下一个节点的背景图
- **预加载**：当前节点进入后，预加载 flow 链上接下来 2 个节点的背景图
- **渐进加载**：先显示低分辨率缩略图（CSS blur），高清图加载完成后替换
- **格式**：优先 WebP，fallback JPEG

### 8.2 JSON 数据

- `nodes.json`（475KB）在启动时一次性加载并解析
- 解析后持有内存引用，不重复解析
- 其他 JSON 文件均 < 10KB，可同时加载

### 8.3 渲染

- 对白文字打字机效果用 `requestAnimationFrame` 而非 `setInterval`
- 背景切换用 CSS `opacity` transition（GPU 加速）
- 毛玻璃 `backdrop-filter` 在低端机可降级为半透明纯色

---

## 9. 构建与部署

### 9.1 构建工具

**Vite**（开发）+ **Rollup**（生产构建）：
- 开发时 HMR 热重载
- 生产构建输出静态文件，零运行时依赖
- 可选：不用构建工具，直接原生 ES Modules（适合极简部署）

### 9.2 部署方案

```
方案 A: 静态托管（推荐 MVP）
├── Vercel / Cloudflare Pages / GitHub Pages
├── story-data/ 和 assets/ 同站部署
└── CDN 自动缓存

方案 B: 分离部署（热更新生产方案）
├── 引擎 → CDN (engine.nagisheart.com)
├── 数据 → 对象存储 (data.nagisheart.com)
└── 资源 → CDN (assets.nagisheart.com)
```

MVP 阶段用方案 A，后续按需切换到方案 B。

### 9.3 PWA

```json
// manifest.json
{
  "name": "Nagi's Heart",
  "short_name": "Nagi's Heart",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#101827",
  "background_color": "#101827",
  "start_url": "/",
  "scope": "/"
}
```

- `display: standalone` — 全屏运行，隐藏浏览器地址栏
- `orientation: portrait` — 锁定竖屏
- 支持「添加到主屏幕」，体验接近原生 App

---

## 10. 与 Android 的差异处理

| 项目 | Android | Web |
|------|---------|-----|
| 数据加载 | `context.assets.open()` | `fetch()` + Cache API |
| 存档 | `filesDir/saves/` | IndexedDB |
| 设置 | SharedPreferences | localStorage |
| BGM | MediaPlayer | HTMLAudioElement |
| 主题 | Compose CompositionLocal | CSS 自定义属性 |
| 切角 | Compose Path (clip) | CSS clip-path |
| 毛玻璃 | RenderEffect.blur | CSS backdrop-filter |
| 动画 | Compose Animation | CSS transition + rAF |
| 导航 | Navigation Compose | hash-based SPA |

引擎逻辑（StoryEngine / ConditionParser / GameState）完全对等移植，只改语言语法。

---

## 11. 开发阶段

| 阶段 | 内容 | 产出 |
|------|------|------|
| P0 | 引擎内核 + 主游戏画面 + 对白 + 选择 + 结局 | 能跑通 Golden Playthrough 4 条路径 |
| P1 | 存档/读档 + 设置 + 回看 + 章节选择 + LINE 模式 | 功能完整 |
| P2 | PWA + Service Worker + 热更新 + 离线 | 生产可用 |
| P3 | 画廊 + 音效 + 高级转场 + 性能优化 | 体验打磨 |

---

## 12. 文件级依赖关系

```
main.js
├── DataLoader.js
│   └── (fetch story-data/*.json)
├── GameState.js
│   └── (reads variables.json schema)
├── StoryEngine.js
│   ├── ConditionParser.js
│   └── (reads nodes/flow/routers/sceneVisuals/endings)
├── GameController.js
│   ├── StoryEngine.js
│   ├── GameState.js
│   ├── SaveManager.js
│   ├── ProgressManager.js
│   ├── AudioManager.js
│   └── TemplateResolver.js
├── Router.js
│   └── screens/*.js
│       └── components/*.js
│           └── theme/*.js
└── sw.js (独立，浏览器注册)
```

零外部依赖。生产构建后是一个 HTML + 一个 JS bundle + 一个 CSS bundle + Service Worker。
