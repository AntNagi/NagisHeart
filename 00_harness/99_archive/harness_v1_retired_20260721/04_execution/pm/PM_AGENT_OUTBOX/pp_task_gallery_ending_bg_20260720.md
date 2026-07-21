# PP任务：回忆画廊结局页使用剧情BG

**来源**：Ant 实机反馈 2026-07-20
**优先级**：P1
**设计权威**：`design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md` § 7

---

## 问题

回忆画廊的结局详情页（EndingDetailOverlay）使用硬编码的 `endingBgMap`，与剧情到达结局时的背景图不一致。画廊不应有独立的结局BG，必须与剧情BG保持一致。

## 改动要求

### 1. 删除硬编码 endingBgMap

`GalleryScreen.kt` 第36-41行的 `endingBgMap` 删除。

### 2. 从 scene_visuals.json 读取结局BG

结局背景统一从 `scene_visuals.json` 中对应结局节点（`end_true`、`end_good`、`end_normal`、`end_bad`）的 `bg` 字段读取。

具体方式：
- `EndingDefinition` 里已有 `endingNode` 字段（如 `"end_good"`）
- 用 `endingNode` 查 `scene_visuals` 拿到 `bg` 路径
- 通过 ViewModel 暴露，传入 GalleryItem

### 3. 画廊卡片缩略图适配

`MemoryCard` 和 `EndingDetailOverlay` 中 `Image` 增加 `alignment = Alignment.TopCenter`，优先露出人脸：

```kotlin
Image(
    painter = ...,
    contentDescription = null,
    contentScale = ContentScale.Crop,
    alignment = Alignment.TopCenter,
    modifier = Modifier.fillMaxSize()
)
```

## 不要做

- 不改 EndingDefinition 数据结构
- 不改 EndingOverlay（剧情内结局页）
- 不改 scene_visuals.json
- 不改 story-data JSON
- 不新增结局专用背景图
