# cc 任务单：BGM 资源接入候选判断 - 2026-07-16

> 负责人：cc
> 协调：公司一一 / PM
> 状态：ready
> 来源：公司电脑工作区差异审计

## 1. 背景

公司电脑清理 workspace 时，已删除未跟踪的临时文档、CoCo 遗留审计和根目录散图。

当前唯一保留的本地候选改动是 BGM 接入相关内容：

- `assets/bgm/bgm.mp3`
- `android/app/build.gradle.kts`
- `tools/validate.js`

这些改动不属于文档整理任务，也未提交。

## 2. 当前本地差异

`android/app/build.gradle.kts` 当前增加了：

- `syncBgmAssets`
- `preBuild` 依赖 `syncBgmAssets`

`tools/validate.js` 当前增加了：

- `scene_visuals.json` 中 `bgm` 字段的资源存在性检查
- 后续检查编号顺延

`assets/bgm/bgm.mp3` 当前是未跟踪文件。

## 3. cc 需要判断

1. 首版是否需要 BGM 资源进入仓库。
2. `story-data/scene_visuals.json` 中的 `bgm/bgm.mp3` 是否是正式路径。
3. Android 构建是否应该从根目录 `assets/bgm` 同步到 `android/app/src/main/assets/bgm`。
4. `tools/validate.js` 是否应该保留 BGM 引用检查。

## 4. 输出要求

cc 给出三选一结论：

- `保留并提交`
- `修改后提交`
- `丢弃本地改动`

如果选择保留或修改后提交，请说明需要一起提交的文件清单。

## 5. 禁止事项

- 不要把 BGM 改动混进文档 / harness 提交。
- 不要顺手提交未登记素材。
- 不要改 UI / PRD / Script / CoreDesign。
