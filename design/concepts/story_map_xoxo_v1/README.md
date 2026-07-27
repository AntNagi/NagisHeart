# 剧情地图 §27 authority reference

本目录是 UI MinSpec §27 与 `DEC-20260725-001`、`DEC-20260727-006`
锁定的人工参考资产包。正式 reference 保持在
`design/concepts/story_map_xoxo_v1/`，不迁入 Android、Web 或报告目录。

## 正式清单

- 展示参考：`NagisHeart_StoryMap_Overview_v4.png` 与八份
  `NagisHeart_StoryMap_Page_01..08_*_v7.png`。
- 坐标权威：与上述页面对应的九份 SVG。允许人工读取并把坐标、路径顶点、
  `side`、节点及配图尺寸转写为原生布局常量。
- 同源生成脚本：`generate_story_map_two_pages_v4.py` 与
  `generate_story_map_chapter_pages_v7.py`。
- 脚本输入：`covers/chapter_01.jpg` 至 `covers/chapter_08.jpg`；其余输入读取
  仓库现有 `assets/bg/` 与系统背景文件。

目录中未列入上述范围的 v1–v6、候选图、contact sheet、Memory Garden、
World Map、Square 方案及旧 generator 均为本地历史过程资产，不属于 §27
正式 reference；`.gitignore` 仅阻止它们进入本 reference 提交，不删除本地文件。

## Runtime 禁令

本目录下 PNG、SVG、generator 和 `covers/`：

- 只供 authority HTML 展示、人工设计对照、坐标审计和验收；
- 禁止复制到 Android `res/`、`assets/`、Web runtime 或任何 APK/发布包；
- 禁止在运行时直接加载；
- 禁止从预览 PNG/SVG 裁切运行时缩略图或把整张参考图作为点击热区底图。

正式实现必须按 UI MinSpec §27 使用原生 UI 重建，并通过
`chapters.json → sections[].startNode → scene_visuals.json[startNode].bg`
读取真实背景。

## 文件校验

以下为 2026-07-28 正式 reference 文件的 MD5：

| 文件 | MD5 |
|---|---|
| `NagisHeart_StoryMap_Overview_v4.png` | `00752787A29F62D59E6649F2FC649848` |
| `NagisHeart_StoryMap_Overview_v4.svg` | `EF9F7E1E6CF0493F8812724E5BF671B5` |
| `NagisHeart_StoryMap_Page_01_FirstMeet_v7.png` | `445E84B9CBA86C29FBA7554AF8FBC1DE` |
| `NagisHeart_StoryMap_Page_01_FirstMeet_v7.svg` | `072CF3517EF3725442E02A919EBECCF6` |
| `NagisHeart_StoryMap_Page_02_Relationship_v7.png` | `343AD094ACA205EAECE03100B48A9DBC` |
| `NagisHeart_StoryMap_Page_02_Relationship_v7.svg` | `2452E222F597592A024CC1C807EB16F6` |
| `NagisHeart_StoryMap_Page_03_Elimination_v7.png` | `6A293F6346C9EAB834B1DBFC3ED9036C` |
| `NagisHeart_StoryMap_Page_03_Elimination_v7.svg` | `186D5B2120CAB7FAD8BEC7F8F2B5D4EC` |
| `NagisHeart_StoryMap_Page_04_WorldCup_v7.png` | `31C78D3913FE560007E1DD2033138630` |
| `NagisHeart_StoryMap_Page_04_WorldCup_v7.svg` | `69A713827195B36D29413A1CBCA1EF46` |
| `NagisHeart_StoryMap_Page_05_Homecoming_v7.png` | `ABC2AE501D95A2865E908F3A8E691EAA` |
| `NagisHeart_StoryMap_Page_05_Homecoming_v7.svg` | `4A9FA0ADA704DA3228C524885492D600` |
| `NagisHeart_StoryMap_Page_06_Manchester_v7.png` | `6961F13A62BEB1E6338D622E166C9A46` |
| `NagisHeart_StoryMap_Page_06_Manchester_v7.svg` | `6DFDA3966B8BAA0204C01C55CF87C9AC` |
| `NagisHeart_StoryMap_Page_07_Holiday_v7.png` | `B1828CB37EDEE9CBDAA53528FC226EFC` |
| `NagisHeart_StoryMap_Page_07_Holiday_v7.svg` | `CB8E4BBBB41010EDA42A1D9B68AAC6AC` |
| `NagisHeart_StoryMap_Page_08_WorldCenter_v7.png` | `2FE6E2827E161381E3F81DB26041E24E` |
| `NagisHeart_StoryMap_Page_08_WorldCenter_v7.svg` | `0827FD8929C06EDF32685451C45D311B` |
| `generate_story_map_chapter_pages_v7.py` | `4655268C41C097B5D4FED6B9DC420B5C` |
| `generate_story_map_two_pages_v4.py` | `AF8DC7C7E65AF67776439F08F0B389D4` |

`covers/` 八份输入图的 MD5：

| 文件 | MD5 |
|---|---|
| `chapter_01.jpg` | `D1771472DE15E6A20F13BE8333492664` |
| `chapter_02.jpg` | `0B05A15DE69C9BB0946A9C173278CC9D` |
| `chapter_03.jpg` | `BB83D79477CE835AB1EFCE41994C5FED` |
| `chapter_04.jpg` | `593313BE0D55B2034E65256AB05BEDE4` |
| `chapter_05.jpg` | `A40763731441EB800636D2BA5F250EEF` |
| `chapter_06.jpg` | `35663C0C412B7D1223728261ED49D01D` |
| `chapter_07.jpg` | `140FA7C5042C90E88469D7A0B7C6D473` |
| `chapter_08.jpg` | `406B3BEB02A9BC943059317CD033EBF0` |
