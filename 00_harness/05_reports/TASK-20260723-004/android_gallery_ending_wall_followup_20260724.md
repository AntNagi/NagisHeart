# TASK-20260723-004 Android 回忆画廊 follow-up 调整

日期：2026-07-24  
执行：Sai

## 调整范围

只改 Android 回忆画廊布局：

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

未改：

- 剧情正文
- BG mapping
- Web
- TT / Icon / Start
- 结局解锁逻辑

## 本次数值调整

根据 Ant 反馈“四张图看起来短”，调整如下：

- 卡片比例：`9 / 13.2` → `9 / 16`
- 顶部区域：`top 66dp` → `58dp`
- 底部留白：`bottom 28dp` → `20dp`
- 面板内 padding：`start/end/top/bottom = 12dp`
- 标题区到 grid 间距：`12dp` → `8dp`
- 同列卡片间距：`10dp` → `8dp`

目的：

- 让卡片更接近正式竖图比例；
- 让 soft-screen 整体上移并向下扩；
- 收紧面板内无效留白，让图片高度更饱满；
- grid 可用高度随之放大，避免四张结局卡显得短。

## 校验

- `node tools/validate.js`：PASSED，0 errors / 1 existing warning
- `tools/check-tokens.ps1`：PASSED
