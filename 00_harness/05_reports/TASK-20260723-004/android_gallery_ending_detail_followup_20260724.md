# TASK-20260723-004 Android 回忆画廊结局详情 follow-up

日期：2026-07-24  
执行：Sai

## 调整范围

只改 Android 回忆画廊中点击结局卡后的详情页：

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

未改：

- 结局剧情数据
- 结局 BG source of truth
- 画廊卡片墙
- Web
- TT / Start / App Icon
- 资源文件

## 调整内容

Ant 要求：回忆画廊的结局详情，也按剧情到达的结局页样式改。

实现：

- 将 `EndingDetailOverlay()` 从旧的深蓝半透明居中详情卡，改为和剧情到达结局页同方向的 full-screen authority ending layout。
- 使用当前结局自己的 `bgPath` 作为全屏背景，不固定 TRUE END 示例图。
- 叠加结局页同款可读性层：
  - vertical scrim：`0.34 → 0.52@42% → 0.72`
  - center radial deepBlue：alpha `0.12`
  - authorityVoid vertical overlay：`0.36 → 0.22@38% → 0.64`
- 文案排版同步剧情结局页：
  - END tag：`18sp`、Medium、letter-spacing `0.16em`、gold alpha `0.82`
  - tag 下短金线：`178dp × 1dp`、gold alpha `0.48`
  - 标题：serif `33sp`、line-height `1.34`
  - 描述：serif `16sp`、line-height `1.92`、max width `330dp`
  - 解锁提示：`11sp`
  - 底部动作：`返回画廊`，bottom `58dp`

## 校验

- `node tools/validate.js`：PASSED，0 errors / 1 existing warning
- `tools/check-tokens.ps1`：PASSED
