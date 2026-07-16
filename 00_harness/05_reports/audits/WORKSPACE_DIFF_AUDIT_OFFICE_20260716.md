# 公司电脑工作区差异审计 - 2026-07-16

> 执行人：公司一一 / Codex
> 范围：公司电脑 `C:\Users\ant.wang\Desktop\NagisHeart`
> 目的：把公司电脑工作区状态对齐到 Git / 家里电脑 harness 结构，避免资源删除、临时文档、BGM 改动混入权威文档提交。

## 1. 已完成处理

- 已读取并按 harness 入口重新整理根入口文档：
  - `TASKS.md`
  - `PROJECT_STRUCTURE.md`
- 已提交并推送：
  - `58ff72c docs: align workspace entry docs with harness`
- 已清理暂存区：
  - 资源删除、代码修改、BGM 改动均未进入提交。
- 已恢复工作区中被误删的 Git 受管资源文件：
  - Android launcher round icons
  - `assets/bg/`
  - `assets/main pic/`
  - 历史 `handoff/` 视觉/切图资源

## 2. 当前仍存在的本地差异

### 2.1 BGM 接入候选改动

当前仍有两个受管文件修改：

- `android/app/build.gradle.kts`
- `tools/validate.js`

对应未跟踪资源：

- `assets/bgm/bgm.mp3`

判断：

- 这是一组 BGM 资源接入候选改动。
- 不属于本次 workspace / harness 文档整理提交。
- 需要由开发或 PM 另开任务确认是否纳入仓库。

### 2.2 本地未跟踪文档

当前未跟踪：

- `docs/`
- `design/CoCo_UI_Resource_Audit_NagisHeart_v1_0.md`
- `design/CoCo_UI_Resource_Audit_v1_0.md`

判断：

- `docs/` 是公司侧历史中间稿 / 临时权威文档尝试，不是当前正式权威入口。
- CoCo 已停用；CoCo 审计文档只能作为历史参考，不应自动进入当前权威链。
- 后续如要吸收内容，应由 PM / 一一按 harness 任务逐项迁入，不能整包提交。

### 2.3 本地未跟踪图片

当前未跟踪：

- `call_QY8uVOwolZhSV64YQ5fKwnvR.png`
- `nagi_wallpaper_1280x720.png`
- `poster.jpg`

判断：

- 尚未归类，不应提交。
- 需要确认用途后再决定放入 `assets/`、`handoff/`、`design/`，或仅本地保留。

## 3. 不要做的事

- 不要提交历史资源删除。
- 不要把 `docs/` 整包当作当前权威文档提交。
- 不要把 CoCo 文档重新放回当前设计任务链。
- 不要把 BGM 改动混进文档 / harness 提交。
- 不要运行 `tools/setup-workspace-compat.ps1`，除非明确需要兼容旧绝对路径。

## 4. 建议下一步

1. 家里电脑拉取 `main`，确认入口文档与 harness 结构一致。
2. PM / 家里一一复核是否需要保留公司侧 `docs/` 中的 PRD / Script / CoreDesign 中间稿。
3. 开发另开 BGM 接入任务，再决定是否提交 `assets/bgm/bgm.mp3`、Gradle 同步和 validate 校验。
4. 未跟踪图片先保持本地，不归类、不提交。
