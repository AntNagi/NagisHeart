# CoCo 设计交接日志 — 2026-07-13

交接人：lulu（PM 侧 AI 设计协调）
接手人：CoCo（公司端设计师）

---

## 背景

PM 给 XoXo（codex 设计师）提了系统级页面和剧情内页的完整设计规范需求。XoXo 交付了两版：
- **v2.0**：`design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` — 交互式高保真 mockup，剧情内页的 light/dark 方案可用
- **v1.0 缺页版**：`design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` — 补了缺失的系统级页面

PM 确认的最终决策：系统级页面以 **v1 缺页版** 为准，剧情内页以 **v2.0** 为准。长旁白和剧情回顾两页两版都不行，由 lulu 重新设计。

---

## 已完成 & 已交付开发（yiyi）的规范

### 1. 开屏页
- 三层结构：背景（无暗层）+ TT 标题切图 + TT START 切图
- TT 定位（1080×1920）：标题 x=81,y=86,w=898,h=290；START x=388,y=1730,w=305,h=86
- 切图资源在 `handoff/yiyi_final_visual_slices_20260711/start_flow/splash_layers/`
- **注意**：handoff 目录里的 tight 版切图背景没抠干净（非透明 PNG），PM 已自行替换到 Android assets

### 2. 开场白页
- 背景：开屏同源图 + 暗层 `rgba(19,32,51,0.32)`
- 结构：顶部「开场白 · 01/08」（金色装饰线 + 菱形）→ 居中正文（Serif 31sp）→ 正文下分割线 + 署名（金色斜体）→ 底部「轻触继续」+ 菱形

### 3. 名字设置页
- 背景同上
- 结构：顶部「开始之前」→ 主标题「写下你的名字」（Serif 34sp）→ 副标题 → 下划线输入（金色线 + 菱形）→ 底部「进入故事」+ 装饰线 +「轻触确认」
- 只保留玩家名输入，不做 nagiCall

### 4. 主页
- 背景同上（有暗层）
- 顶部：沿用开屏页同一张标题切图，同坐标
- 底部：继续故事/新的故事 + 四个次级入口（存档/章节目录/回忆画廊/系统设置）

### 5. 弹窗规范（全局通用）
- 半透明深底 `rgba(27,36,54,0.32)` + 描边 `rgba(255,255,255,0.12)` + 模糊 20dp + 圆角 24dp
- 遮罩 `rgba(9,14,24,0.32)`
- 标题 Serif 28sp，正文 Sans 16sp，文字按钮右对齐
- **禁止系统原生白框 Dialog**

### 6. 大章节 / 小章节开始页
- 背景：当前剧情 bg + 渐变暗层
- 海报式布局，内容靠左下角：kicker 标签 → 章/节编号 → 大标题 → 底部提示
- 大章更重（多行标题+导语），小章节更轻（短标题）
- 不做框/卡片，文字靠阴影+轻底衬保证可读性

### 7. 大章节 / 小章节结束页
- 结构同开始页，kicker 改为 CHAPTER/SECTION CLEAR
- 底部增加操作按钮行：返回目录（次要）+ 进入下一章/节（主要）

### 8. 剧情内页系统级规范（Light / Dark）
- 默认 dark，light 只在 mapping 标注时使用，不做 auto
- 完整 token 表：--text, --sub, --soft, --strong, --hud, --hud-soft, --overlay, --gold
- HUD 导航栏：五边形衬底按钮 + Serif 标题 chip
- 对白框：渐隐衬底（非实框），角色名条带金色五边形
- 选项页：切角选项行 + 金色五边形装饰
- 切角设计语言：--cut-sm (8px) / --cut-md (14px)，不用圆角替代

### 9. 长旁白页（lulu 重新设计）
- **无框渐隐式**：不做矩形框，用 radial mask 让衬底边缘自然消散
- 衬底：`rgba(16,24,39,0.28)` + blur(16dp)
- 高度自适应 280~760，超出分页
- Serif 16sp，行高 30sp

### 10. 剧情回顾页（lulu 重新设计）
- **整页沉浸式**：不做浮层/卡片，直接重暗层 `rgba(19,32,51,0.52)` 保证可读性
- 文字直接排在暗化背景上
- speaker 标签金色 `#D7BE86`

---

## 仍待补设计的项目

参见 `handoff/yiyi_final_visual_slices_20260711/XoXo_Design_Pending_For_Dev_20260712.md`：

1. **跳过本节入口最终视觉** — 位置、常态/点击态、避让关系
2. **章节目录最终样式** — 页面布局、四种状态视觉区分、滚动/聚焦
3. **长旁白最终字体拍板** — 中文字体确认、页码/翻页提示样式
4. **存档/章节目录/回忆画廊/系统设置** — 布局已有（v2.0），需校准暗层/浮层到统一值：
   - 背景统一用开屏同源图
   - 暗层：`rgba(19,32,51,0.32)`
   - 浮层：`rgba(27,36,54,0.26)` + 描边 `rgba(255,255,255,0.10)`

---

## 关键设计文件索引

| 文件 | 说明 |
|------|------|
| `design/NagisHeart_P0_HiFi_Design_XoXo_v2_0.html` | v2.0 高保真 mockup（剧情内页 light/dark 基准） |
| `design/NagisHeart_Missing_Pages_Preview_XoXo_v1_0.html` | v1 缺页预览（系统级页面基准） |
| `design/exports/missing_pages_single/` | 缺页版各页单独截图 |
| `handoff/yiyi_final_visual_slices_20260711/` | 开发交付目录 |
| `handoff/.../XoXo_Dev_Ready_Spec_20260712.md` | 可直接开发的产品规则 |
| `handoff/.../XoXo_UI_Final_MinSpec_20260712.md` | UI 最终精简规范（最全的数值文档） |
| `handoff/.../XoXo_Design_Pending_For_Dev_20260712.md` | 仍需补设计的项目 |
| `assets/ui/svg/` | 图标 SVG 源文件 |
| `assets/ui/android/drawable/` | 图标 Android drawable XML |

---

## 给 CoCo 的建议

1. **优先处理待补设计项**，尤其是章节目录页 — 开发在等
2. 长旁白和剧情回顾的"无框"方案已给开发，但还没看到实现效果，需要你跟进验收
3. 存档/回忆画廊/系统设置三页的暗层校准是快活，可以先做
4. 所有系统级页面的视觉语言以 v1 缺页版为准，不要用 v2.0 的开屏/主页那套
5. 剧情内页的 light/dark token 已经定好了，不要改值，只需要确认在各种 bg 上的可读性
