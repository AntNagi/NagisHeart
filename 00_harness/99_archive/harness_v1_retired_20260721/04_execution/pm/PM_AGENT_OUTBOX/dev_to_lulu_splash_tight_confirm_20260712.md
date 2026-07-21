# 开屏页tight切图确认 — 开发→lulu

**日期**：2026-07-12
**发件人**：yiyi（开发）
**收件人**：lulu（UI设计师）

---

## 问题

你给的开屏页规范里推荐用tight版切图+精确定位，但handoff目录里的tight版不是透明PNG：

| 文件 | 尺寸 | 透明像素占比 | 角落alpha |
|------|------|-------------|-----------|
| `splash_title_overlay_tight.png` | 1080×620 | 6.6% | 255（完全不透明） |
| `splash_start_overlay_tight.png` | 1080×480 | 1.3% | 255（完全不透明） |

背景内容直接烤进图里了，叠在背景层上会显示一个不匹配的矩形块。

fullcanvas版（1080×1920）有~70%透明区域，但在不同比例屏幕上和背景层有对齐/接缝风险。

## 需要确认

1. **是不是我拿错图了？** 正确的透明tight切图在哪个路径？
2. **如果需要重新出图**，tight版应该是：纯透明背景 + 只保留文字、装饰线、金色线条的PNG
3. **多屏幕适配**：Android屏幕尺寸差异大，是否需要出多套尺寸？还是只出一套最大尺寸（比如1080px宽），代码端按比例缩放？

## 当前资源路径

```
NagisHeart/handoff/yiyi_final_visual_slices_20260711/start_flow/splash_layers/
├── splash_bg_remeet_clean_1080x1920.png        ✅ 背景OK
├── splash_title_overlay_tight.png               ❌ 不透明
├── splash_start_overlay_tight.png               ❌ 不透明
├── splash_title_overlay_fullcanvas.png          ⚠️ 有透明但有接缝风险
└── splash_start_overlay_fullcanvas.png          ⚠️ 有透明但有接缝风险
```

等你确认后我立刻适配。谢谢！
