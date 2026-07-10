# Nagi's Heart · Background Adaptation Test Plan v1.0

> 文档类型：背景适配与压力测试计划  
> 提交对象：GPT PM / CC Engineer / CoCo  
> 背景资源路径：`assets/bg/`  
> 视觉方向：冷光玫瑰 / Snowlit Rose  
> 目标：验证 Android 竖屏 UI 在多背景、多亮度、多情绪场景下稳定可读。

---

## 1. 测试目标

本计划用于验证 UI 系统是否真正适配视觉小说场景，而不是只在单张主图上好看。

必须验证：

```text
换背景后文字仍然清楚。
浅色和深色场景都能使用。
对话框不抢 Nagi 和人物情绪。
选项出现时有仪式感但不浮夸。
章节和路线情绪变化时 UI 系统不散。
```

---

## 2. 资源原则

当前背景母版位于：

```text
assets/bg/
```

允许为 Android 单独导出 9:16 裁切版本，但必须遵守：

1. 保留原图母版。
2. 记录裁切版本来源。
3. 记录焦点点位。
4. 记录安全区。
5. 不遮挡人物脸部和关键剧情物件。

建议 Android 裁切导出命名：

```text
assets/bg_android/{scene}_android_9x16.jpg
```

示例：

```text
assets/bg_android/apartment_android_9x16.jpg
assets/bg_android/openday_android_9x16.jpg
```

---

## 3. 第一轮压力测试背景

| 背景 | 建议主题 | 主要模式 | 测试重点 |
|---|---|---|---|
| `apartment.jpg` | 高级生活 | Light | 柔和高级，不甜腻 |
| `bedroom.jpg` | 亲密日常 | Light / Auto | 横图或非 9:16 背景的裁切与可读性 |
| `pitch.jpg` | 球场压力 | Dark | 有压力但不电竞 |
| `drive.jpg` | 夜景 | Dark | Dark Glass 可读性 |
| `valentine.jpg` | 高甜 | Light | 不过粉，不过腻 |
| `hug.jpg` | 亲密情绪 | Auto | UI 不抢人物情绪 |
| `openday.jpg` | 蓝锁开放日 | Auto / Mixed | 横图裁切、角色保护 |
| `afterwork.jpg` | 都市成年感 | Dark / Auto | 克制高级感 |

---

## 4. 第二轮扩展测试背景

| 背景 | 测试目的 |
|---|---|
| `curry.jpg` | 日常轻喜剧，生活场景稳定性 |
| `propose.jpg` | TRUE / 特殊演出适配 |
| `worldstage.jpg` | 世界赛、强舞台光 |
| `magazine.jpg` | 媒体 / 商业冷光 |
| `apocalypse.jpg` | 高压 / 特殊深剧情 |
| `summerfestival.jpg` | 节日场景，避免装饰过量 |
| `qixi.jpg` | 七夕情绪，控制玫瑰金和花瓣使用 |
| `morning.jpg` | 明亮柔光，Light Glass 上限 |

---

## 5. 每张背景必须验证的 UI

每张测试图至少叠加以下组件：

1. HUD Bar。
2. Dialogue Box。
3. Choice Panel。
4. Continue Indicator。
5. 至少一段 3 行中文正文。
6. 至少一个长选项。

P0 样张建议每张背景输出两种状态：

```text
Dialogue State
Choice State
```

特殊背景可额外输出：

```text
Fullscreen Narration State
LINE State
Ending State
```

---

## 6. 裁切与安全区记录模板

每张背景进入 Android 适配时需要记录：

| 字段 | 示例 |
|---|---|
| Source | `assets/bg/apartment.jpg` |
| Android Export | `assets/bg_android/apartment_android_9x16.jpg` |
| Original Size | `1280 x 2275` |
| Export Size | `1080 x 1920` |
| Crop Mode | center crop / manual crop |
| Focus X | `0.50` |
| Focus Y | `0.42` |
| Protected Region | face / hands / object / none |
| Suggested uiTheme | Light / Dark / Auto |
| Suggested Overlay | bottomLight / bottomDark / fullDim / none |
| Risk | text contrast / face overlap / busy background |

---

## 7. 首轮背景初判

以下为 CoCo 初步判断，最终以实际样张走查为准。

| 背景 | 初判 | 风险 |
|---|---|---|
| `apartment.jpg` | 适合 Light Glass | 过白区域可能让玻璃边界不明显 |
| `bedroom.jpg` | 适合 Light / Auto | 非竖屏比例，需要手动裁切 |
| `pitch.jpg` | 适合 Dark Glass | 高对比背景，需要全屏轻暗化 |
| `drive.jpg` | 适合 Dark Glass | 底部夜景细节可能和文字区竞争 |
| `valentine.jpg` | 适合 Light Glass | 容易过甜，玫瑰色点缀要减少 |
| `hug.jpg` | 适合 Auto | 人物情绪区不能被选项面板盖住 |
| `openday.jpg` | 适合 Auto / Mixed | 横图，裁切风险最高 |
| `afterwork.jpg` | 适合 Dark / Auto | 成年感要克制，不要黑金化 |

---

## 8. Light / Dark 选择规则

### 8.1 Light 优先场景

- 公寓、卧室、日常、食物、节日柔光。
- TRUE / GOOD 柔和场景。
- 需要亲密、生活、低压的剧情。

建议：

```text
Light Glass + bottomLight overlay
```

### 8.2 Dark 优先场景

- 球场、夜景、作战室、媒体、Bad 线。
- 高对比或强光背景。
- 需要压力、疏离、冷光的剧情。

建议：

```text
Dark Glass + bottomDark overlay
```

### 8.3 Auto 场景

Auto 场景必须允许人工覆盖。自动判断只能作为默认建议。

Auto 适合：

- `hug.jpg`
- `openday.jpg`
- `afterwork.jpg`
- 亮暗区域差异很大的 CG

---

## 9. 验收标准

每张压力测试图按 0 / 1 / 2 评分。

| 维度 | 0 | 1 | 2 |
|---|---|---|---|
| 文字可读 | 读不清 | 勉强可读 | 清楚舒适 |
| 背景保留 | 被 UI 盖住 | 重要信息保留一般 | 情绪与信息保留良好 |
| 风格一致 | 像别的模板 | 基本一致 | 明确是 Nagi's Heart |
| 情绪匹配 | 与剧情冲突 | 基本匹配 | 气质准确 |
| 触控清晰 | 不像可点 | 可点但弱 | 可点且克制 |

通过标准：

```text
每张背景总分不低于 8 / 10。
文字可读必须为 2。
若文字可读为 0 或 1，直接返工。
```

---

## 10. 产出物

第一轮背景压力测试应产出：

```text
NagisHeart_BG_Test_Matrix_v1_0.md
P0 background sample images
Android crop record
UI theme recommendation table
返工问题清单
```

如果暂时不做最终图片，也至少需要产出静态样张说明和裁切规则，供 PM 先评估方向。

---

## 11. PM Review Checklist

请 PM 重点确认：

- 第一轮 8 张背景是否足够覆盖主要情绪。
- `openday.jpg`、`bedroom.jpg` 这类非竖屏图是否允许单独裁切导出。
- 是否接受每张背景输出 Dialogue / Choice 两种状态。
- 验收评分标准是否过严或过松。
- 是否需要把 `propose.jpg` 提前加入第一轮，以测试 TRUE END 气质。

