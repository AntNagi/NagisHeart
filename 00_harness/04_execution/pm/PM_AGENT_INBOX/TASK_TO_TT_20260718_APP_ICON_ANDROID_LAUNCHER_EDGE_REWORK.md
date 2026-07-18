# TASK TO TT - App Icon Android launcher edge rework

日期：2026-07-18  
PM：一一  
执行人：TT  
任务：`TASK-20260718-007`

---

## 0. 来源

Ant大小姐实机反馈：Android launcher 上 `Nagi's Heart` 图标出现明显黑边 / 黑块，对比旁边 App 图标显得不干净。

截图现象：

- launcher 外层圆形区域里，Nagi 图标四周出现黑色边缘；
- 图标主体显得像被缩进在一个小方形里；
- 不是当前已确认“第三版”方向本身被否定，而是 Android launcher / adaptive icon 适配不通过。

---

## 1. PM 初步判断

当前 Android 已接入 TT confirmed 第三版，但 launcher 实机黑边可能来自：

1. adaptive icon background 为深色底，在系统圆形 mask 下露出；
2. foreground 安全区过小，主体没有铺满 launcher 预期视觉区域；
3. legacy `ic_launcher_round.png` 仍在 Android 密度目录中，部分 launcher / fallback 可能取到旧 round PNG；
4. 当前导出缺少“真实 launcher 圆形 / 圆角 / themed 背景”预览闭环。

因此本任务不是重做 icon 概念，而是重做 Android launcher 适配导出。

---

## 2. 保留方向

必须保留 Ant大小姐已确认的第三版方向：

- TT icon 总览图顶部第三张 / 右上 `rounded rect mask preview`
- `rounded rect v2 decorated`
- master：`design/authority/icon_start_tt/icon/master/app_icon_tt_candidate_1024.png`

不得换成其他 icon 概念，不得换人物，不得换回旧 icon。

---

## 3. 需要 TT 输出

请输出一个新的 Android launcher fix 包，建议路径：

`design/authority/icon_start_tt/icon/android_launcher_rework/`

至少包含：

1. 新 adaptive foreground / background 资源：
   - mdpi / hdpi / xhdpi / xxhdpi / xxxhdpi
   - foreground 主体需要扩大到 launcher 圆形 mask 下视觉合理；
   - background 不得露出黑边 / 黑块，可用浅色、延展背景或与图标主体协调的底。
2. legacy `ic_launcher.png` 必要时同步更新。
3. 圆形 launcher 预览：
   - 模拟 Android round mask；
   - 模拟常见圆角 squircle mask；
   - 对比当前黑边问题。
4. manifest：
   - 文件清单；
   - 尺寸；
   - SHA256；
   - 推荐给 yiyi 的接入口径。
5. self check：
   - 无黑边；
   - 主体不缩成小方块；
   - 透明/背景在 round mask 下安全；
   - 保留第三版气质。

---

## 4. 禁止范围

不得修改：

- Android 代码；
- Android 资源；
- Web；
- story-data；
- BG mapping；
- TT Start；
- UI authority；
- App Icon 已确认概念。

TT 只交设计 / 资源候选包，由 PM / Ant 确认后再给 yiyi 接入。

---

## 5. 回传要求

回传写入：

`00_harness/04_execution/pm/PM_AGENT_OUTBOX/status_design_tt_app_icon_android_launcher_edge_rework_20260718.md`

回传必须包含：

- 预览图路径；
- 新资源包路径；
- 是否仍保留第三版概念；
- 是否解决黑边；
- 给 yiyi 的接入说明；
- cleanup candidates：旧 `ic_launcher_round.png` 是否仍建议删除。

