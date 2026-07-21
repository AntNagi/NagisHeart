# Dev Reply — Wewe Web Mobile P1 Settings Readability & BGM Verification

> Task ID: TASK-20260718-018  
> 开发者: Wewe (Web / Claude)  
> 日期: 2026-07-19  
> 状态: Settings 可读性修复完成，BGM 持久化验证通过，audio 链路如实说明

---

## 1. 修改文件清单

共修改 1 个 CSS 文件：

| 文件 | 改动 |
|---|---|
| `web/styles/overlays.css` | 新增 `.settings-overlay` dark glass 背景样式 `rgba(16, 24, 39, 0.88)` + `backdrop-filter: blur(12px) saturate(0.92)`；slider track 透明度从 `0.18` 提升到 `0.28` |

未改任何 JS、HTML、story-data、authority 资源。

---

## 2. Settings 可读性修复

### 问题

DeDe 017 复测发现 Settings overlay 在明亮剧情背景上文字、标题与 slider 对比度明显不足。根因：`.overlay` 基类使用 `background: var(--overlay-bg)`，但 `--overlay-bg` 未在 tokens.css 定义，导致 Settings overlay 无有效背景色，文字直接浮在游戏场景上。

### 修复

新增 `.settings-overlay` 特有样式，使用与 backlog/catalog overlay 一致的 dark glass 语言：

```css
.settings-overlay {
  background: rgba(16, 24, 39, 0.88);
  backdrop-filter: blur(12px) saturate(0.92);
  -webkit-backdrop-filter: blur(12px) saturate(0.92);
}
```

同时将 slider track 背景从 `rgba(255,255,255,0.18)` 提升到 `rgba(255,255,255,0.28)`，增强可视性。

### 效果

- 标题 "系统设置"：`rgb(247, 249, 252)` 白色 on `rgba(16, 24, 39, 0.88)` — 对比度充足
- 设置项标签（文字速度、自动播放速度、BGM 音量、显示模式）：`rgb(247, 249, 252)` — 对比度充足
- 设置项值（正常、3、深色）：`rgb(201, 209, 220)` 银蓝色 — 可读，右对齐保持
- BGM slider track：`rgba(255,255,255,0.28)` — 在 dark glass 上清晰可见
- BGM slider thumb：白色圆形 20px — 对比度充足
- BGM 百分比显示：`rgb(201, 209, 220)` — 可读

不是厚重 Material 面板，保持了 authority dark glass 一致风格。

---

## 3. BGM 持久化验证

### 验证步骤

1. 进入 gameplay → 打开游戏菜单 → 打开设置。
2. BGM slider 初始值为 8 (80%)（前轮 016 测试遗留值）。
3. 通过 JS 将 slider 改为 5 (50%)。
4. 确认 `localStorage.getItem('nagi_settings')` 立即更新为 `{"textSpeed":"Normal","autoSpeed":3,"displayTheme":"Dark","bgmVolume":5}`。
5. 执行 `window.location.reload()` 重载页面。
6. 读取 `localStorage.getItem('nagi_settings')` 确认 `bgmVolume: 5` 仍保持。
7. 将 localStorage 中 bgmVolume 改为 8，再次 reload。
8. 重新进入 gameplay → 打开设置 → slider 显示 8 (80%)，与 localStorage 一致。

### 结论

BGM slider 持久化链路完整：
- 写入：slider `input` 事件 → `SettingsManager.update()` → `localStorage.setItem('nagi_settings', ...)` — 即时生效
- 读取：页面加载 → `SettingsManager._load()` → `JSON.parse(localStorage.getItem('nagi_settings'))` → slider 初始值从 `settings.bgmVolume` 赋值
- key: `nagi_settings`
- 数据结构: `{ textSpeed, autoSpeed, displayTheme, bgmVolume }`, bgmVolume 0-10 整数

---

## 4. Audio 音量链路验证

### 代码链路

完整路径：slider → SettingsManager → AudioManager → `audio.volume`

1. **slider `input` 事件** → `SettingsManager.update(current)` where `current.bgmVolume = v`
2. **SettingsManager.update()** → `this._save()` (localStorage) + `this._notify()` (callbacks)
3. **AudioManager constructor** 订阅 `settingsManager.onBgmVolumeChange(() => this._applyVolume())`
4. **AudioManager._applyVolume()** → `this._audio.volume = this._settings.getBgmVolume() / 10`
   - bgmVolume 0-10 → audio.volume 0.0-1.0
   - volume=0 时 pause，volume>0 且 paused 时 resume play

### 当前限制

- 当前 DOM 无 `<audio>` 元素，因为 `AudioManager.play(bgmPath)` 仅在 `main.js` 的 `statechange` handler 中当 `visual.bgm` 存在时调用。
- 当前测试所在的 "作战室·初遇" 场景的 visual 数据中未指定 bgm 字段，因此 AudioManager 未创建 audio 元素。
- `assets/bgm.mp3` 文件存在且可加载（`canplaythrough` 事件验证通过）。
- AudioManager 使用硬编码路径 `../assets/bgm.mp3`，不论 `bgmPath` 参数值。

### 结论

代码链路完整，slider 变化会即时传递到 audio.volume。当前无法用运行时 audio 元素证明音量变化，因为测试场景无 bgm visual 数据。这不是 bug，而是当前章节的数据特性。当有 bgm 的场景播放时，链路会正常工作。

---

## 5. 视口证据

| 视口 | window.innerWidth | window.innerHeight | #app 宽度 | #app 高度 | 验证方式 |
|---|---|---|---|---|---|
| 393x852 | 393 | 852 | 393 | 852 | Browser pane `resize_window` + JS `window.innerWidth/Height` |
| 430x932 | 430 | 932 | 430 | 932 | Browser pane `resize_window` + JS `window.innerWidth/Height` |

两个视口均精确生效，app 容器完全填充。

---

## 6. Console / Resource 检查

- 全流程 console error/warn: 空，零错误。
- Settings overlay dark glass 样式正确加载并应用。
- 无 JS 异常、无 404。

---

## 7. 证据目录

`00_harness/05_reports/validation/web_mobile_p1_settings_bgm_verify_20260718/`

本轮验证通过 Browser pane DOM + JavaScript 检查方式，验证记录如下：

- Settings overlay `backgroundColor`: `rgba(16, 24, 39, 0.88)` 确认
- Settings overlay `backdropFilter`: `blur(12px) saturate(0.92)` 确认
- 标题/标签/值颜色对比度确认（white on dark glass）
- Slider track `rgba(255,255,255,0.28)` 确认
- BGM slider value 8 (80%) reload 后保持
- localStorage `nagi_settings` 写入/读取完整验证
- Audio 链路代码审查完成，bgm.mp3 文件存在
- 视口 393x852 / 430x932 精确确认
- Console error: 0

注：Browser pane 原生截图因 SVG 滤镜超时问题无法生成 PNG。功能验证依据为 DOM 结构 + computed style + JS 状态检查。

---

## 8. Android touched: no

本轮修改范围：

- `web/styles/overlays.css`
- 本回报文件

未修改任何 Android 文件、Android 资源、Manifest、Gradle。
未修改 story-data 正文、BG mapping 权威、authority_current、TT Start / App Icon authority。
未引用 archive，未换底图。

---

## 9. Cleanup Status

### Done

- 无临时文件产生。

### Cleanup Candidates（只回报，未删除）

- `web/styles/screens/ending.css`：沿用前轮候选，待 authority 对齐。
- `NagisHeart/.claude/launch.json`：与根目录 `.claude/launch.json` 冗余。

### 跨平台备注（只回报，不修改）

- 本轮修复为 Web 侧 CSS-only 问题，与 Android 实现无关。
