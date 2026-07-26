# TASK-20260723-004 Android 回忆画廊四结局错落竖图展墙

日期：2026-07-23  
执行：Sai

## 改动范围

只改 Android 回忆画廊 UI 呈现：

- `android/app/src/main/java/com/antnagi/nagisheart/ui/screen/GalleryScreen.kt`

未改：

- 剧情正文
- BG mapping
- Web
- TT Start / App Icon
- 结局解锁逻辑

## 实现内容

按 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §25 与 HTML `screen-gallery` 实现：

- 回忆画廊只展示四个结局：
  - TRUE
  - GOOD
  - NORMAL
  - BAD
- 移除旧 `LazyVerticalGrid` 横向缩略卡列表。
- 改为固定两列错落竖图展墙：
  - 左列：TRUE / NORMAL
  - 右列：GOOD / BAD
  - 右列整体下移 `14dp`
  - 列间距 `12dp`
  - 同列卡间距 `10dp`
- 卡片比例：
  - `aspectRatio(9f / 13.2f)`
  - `cutSmall`
  - padding `13dp`
- 页面 shell：
  - top `66dp`
  - bottom `28dp`
  - 左右 `16dp`
  - 内 padding：top `16dp`，left/right `16dp`，bottom `20dp`
  - 无滚动容器 / 无滚动条
- Header：
  - title：`回忆画廊`
  - title：Serif `34sp`，lineHeight `1.2`
  - progress：`已解锁 x / 4`，`14sp`，letterSpacing `0.08em`
- 图片 crop：
  - TRUE：`BiasAlignment(0f, -0.32f)`，对应 HTML `center 34%`
  - GOOD：`BiasAlignment(0f, -0.40f)`，对应 HTML `center 30%`
  - NORMAL：`BiasAlignment(0f, -0.64f)`，对应 HTML `center 18%`
  - BAD：`BiasAlignment(0f, 0.28f)`，对应 HTML `center 64%`
- 文本：
  - ending tag：`10sp`，gold，letterSpacing `0.14em`，单行
  - ending title：默认 `16sp`，Serif，单行
  - GOOD 长标题：`13sp`，letterSpacing `-0.02em`，单行
- 卡片遮罩：
  - vertical gradient：
    - `0%`：`authorityVoid` alpha `0.02`
    - `46%`：`authorityVoid` alpha `0.04`
    - `100%`：`authorityVoid` alpha `0.72`

## 校验

- `node tools/validate.js`：通过，0 errors / 1 existing warning。
- `tools/check-tokens.ps1`：通过。

## 截图阻塞

本机仍无法产出 Android 实机/模拟器截图：

- `android/gradlew.bat` 不存在；
- `android/gradle/wrapper/gradle-wrapper.jar` 不存在；
- 系统未找到可用 Gradle。

因此本报告没有附 Android 截图。需要 Ant / 有 Android 构建环境的机器补一张回忆画廊截图，验收重点：

1. 四个结局卡同屏完整出现；
2. 无滚动条；
3. 卡片为竖图，不是横卡；
4. GOOD 标题保持一行；
5. TRUE / GOOD / NORMAL / BAD 使用各自结局 BG。
