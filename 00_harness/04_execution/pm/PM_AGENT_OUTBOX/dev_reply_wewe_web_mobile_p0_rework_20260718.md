# Dev Reply — Wewe Web Mobile P0 Rework

> Task ID: TASK-20260718-010  
> 开发者: Wewe (Web / Claude)  
> 日期: 2026-07-18  
> 状态: P0 返工完成，393x852 / 430x932 Start v23 可见，截图已产出

---

## 1. 根因说明：移动端首屏为什么是黑/深色空屏

### 根因 A（首屏黑屏主因）：`#app` 高度依赖 `100dvh`，无回退

`web/styles/layout.css` 原代码：

```css
#app {
  width: 100vw;
  height: 100dvh;   /* 只有 dvh，没有 vh 回退 */
  ...
}
```

`dvh` 是较新的视口单位。在不支持 `dvh` 的移动端浏览器 / WebView 内核中，`height: 100dvh` 整行被丢弃，`#app` 没有任何有效高度声明，高度塌缩为 0。后果链：

1. `#app` 高度 0；
2. `.screen`（`position: absolute; inset: 0`）挂在高度 0 的容器里，高度也是 0；
3. `.start-poster` 及三层 Start v23 图片高度全部为 0，实际不渲染任何像素；
4. 屏幕上只剩 `body { background: #101827 }` —— 正好是 PM 复核看到的"整屏深蓝/黑色"。

这个根因完全吻合 PM 复核的全部现象：**DOM 已挂载、三层图片 200 OK、console 无错误，但视觉是空的**。资源没有问题，是高度链路在移动端断了。

### 根因 B（加固项）：`.start-poster` 高度链依赖 `height: 100%`

`web/styles/screens/splash.css` 原来 `.start-poster` 用 `position: relative; width/height: 100%` 拿高度，依赖 flex 父级的高度传递，在部分移动内核上与根因 A 叠加放大。已改为 `position: absolute; inset: 0` 直接锚定，脱离百分比高度链。

### 根因 C（P0-C 检查时发现的真实断点）：`.game-screen` 覆盖了 `.screen` 的定位

`web/styles/screens/game.css` 原代码：

```css
.game-screen {
  position: relative;   /* 覆盖了 .screen 的 position: absolute */
}
```

`.screen` 靠 `position: absolute; inset: 0` 撑满屏幕。`.game-screen` 把 position 改回 relative 后，`inset: 0` 不再拉伸元素，游戏页高度塌缩为 0，场景背景实测 `393x0` 完全不可见。本轮已修复并实测确认修复后 `.game-screen` 与 `.scene-bg` 均为 393x852。

---

## 2. 修改文件清单

只修改了 3 个 Web CSS 文件：

| 文件 | 改动 |
|---|---|
| `web/styles/layout.css` | `#app` 增加 `height: 100vh` 回退行，`100dvh` 保留为渐进增强（支持 dvh 的浏览器仍用 dvh） |
| `web/styles/screens/splash.css` | `.start-poster` 从 `position: relative; width/height: 100%` 改为 `position: absolute; inset: 0`，脱离百分比高度链 |
| `web/styles/screens/game.css` | 删除 `.game-screen { position: relative }` 覆盖，恢复继承 `.screen` 的 `absolute + inset: 0`，并留注释防止回归 |

未改任何 JS、HTML、story-data、authority 资源引用。Start v23 仍是 authority 三层结构：base PNG + title SVG + START SVG breathing，未换图。

---

## 3. 移动端截图路径

输出目录：`00_harness/05_reports/validation/web_mobile_p0_rework_20260718/`

| 文件 | 视口 | 大小 | 内容 |
|---|---|---|---|
| `web_mobile_start_393x852.png` | 393x852 | 377 KB | Start v23 可见：凪面部底图 + "Blue Lock: Nagi's Heart" 标题层 + "START / Tap to start" 按钮层 |
| `web_mobile_start_430x932.png` | 430x932 | 434 KB | 同上，430 宽视口 |

截图方法说明（如实回报）：本会话浏览器面板的原生截图通道在渲染 Start v23 的 SVG 滤镜（feGaussianBlur/feDropShadow）时持续超时，无法产出原生截图。两张截图为在修复后的实际页面内，用 Canvas 从**已渲染的三层 live `<img>` 元素**按 object-fit: cover 同等几何合成导出（含 breathing 层透明度）。同时用像素采样验证了真实渲染：修复后底图中心采样 RGB(249,248,249)（凪的白发区域），非黑色。两个视口的 DOM 布局数据（app/splash/poster 均等于视口尺寸、三层图片 complete 且 naturalWidth>0）一并核验通过。

---

## 4. Console 检查结果

- 393x852 与 430x932 两个视口下，Start → 主菜单 → 开场白(9页) → 名字设置 → 游戏页全流程 console 零 error；
- 无资源 404、无 JS 异常。

（按任务要求，本回报不以此作为完成证明，仅作为检查项之一。）

---

## 5. 资源加载检查结果

全部 200 OK，关键资源：

- Start v23 三层：`start_clean_remeet_1080x1920.png` / `start_title_overlay_v23.svg` / `start_button_static_v23.svg` → 200
- 17 个 CSS、30 个 JS 模块 → 200
- 8 个 `story-data/*.json` → 200
- 游戏页背景 `assets/bg/bluelock_monitor_room.jpg` → 200
- `assets/bgm.mp3` → 200

---

## 6. P0-C 移动端基础口径检查（393x852 实测）

| 检查项 | 结果 |
|---|---|
| Start / Splash 铺满手机屏幕 | ✅ 修复后 splash/poster/三层图片均 393x852、430x932 铺满 |
| HUD 不超出安全区 | ✅ HUD 44 高、left 0 / right 393，界内；`env(safe-area-inset-top, 14px)` 回退在位 |
| action chip 不超出安全区 | ✅ "跳过本节" chip right=376 < 393，HUD 下方 14px |
| system pages 非纯黑空屏 | ✅ 开场白页背景加载、正文可见（"「好麻烦。」"）；名字设置页背景/输入框/确认区全部可见 |
| game screen 背景正常显示 | ✅ 修复根因 C 后 scene-bg 393x852，`bluelock_monitor_room.jpg` 实际渲染；对白框 393x160 锚定底部，speaker "JFA会长" 显示 |
| overlays 手机宽度可读可点 | ✅ 菜单 6 按钮（200x49）居中界内；设置 4 行（353x56，含 BGM 音量 50%）全部界内、值列右对齐 |

---

## 7. Android touched: no

本轮修改范围：

- `web/styles/layout.css`
- `web/styles/screens/splash.css`
- `web/styles/screens/game.css`
- 截图 2 张（validation 目录）
- 本回报文件

未修改任何 Android 文件、Android 资源、Manifest、Gradle。  
未修改 story-data 正文、BG mapping 权威、authority_current、TT Start / App Icon authority。  
未引用 archive，未换底图，未使用临时纯色或 demo 图。

---

## 8. Cleanup Status

### Done

- 临时截图辅助服务（session scratchpad 内 `save_screenshot.js`，端口 3001）已停止；文件在 session 临时目录，不在仓库内，无需清理提交。

### Cleanup Candidates（只回报，未删除）

- `web/styles/screens/ending.css`：沿用前两轮候选，待 authority 对齐；
- `NagisHeart/.claude/launch.json`：与根目录 `.claude/launch.json` 冗余（本轮启动服务用的是根目录配置）。

### 跨平台备注（只回报，不修改）

- 无新增 Android 侧问题发现；本轮三处根因均为 Web 侧 CSS 问题，与 Android 实现无关。
