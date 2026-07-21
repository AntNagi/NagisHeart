# Nagi's Heart Status Intake

> 用途：所有角色统一回填最新进度。一一会用本文件收口，不再接受只留在聊天里的进度说明。

## 0. How To Reply

请每个角色把回信写入：

```text
D:\Nagi‘s Heart\PM_AGENT_OUTBOX\status_{role}_{name}_YYYYMMDD_HHMM.md
```

示例：

```text
status_dev_yiyi_20260711_1420.md
status_qa_laud_20260711_1420.md
status_design_xoxo_20260711_1420.md
status_qa_dede_20260711_1420.md
status_design_tt_20260711_1420.md
```

## 1. Required Reading Before Reply

至少阅读：

1. `D:\Nagi‘s Heart\PM_PROJECT_CONTEXT_BRIEF.md`
2. `D:\Nagi‘s Heart\PM_SYNC_BOARD.md`
3. 与本人职责相关的源文档和最新产物。

Android 相关角色还必须注意：

```text
PM 文档区：D:\Nagi‘s Heart
Android 工程：D:\Nagi's Heart\NagisHeart
```

两个路径不是同一个目录。

## 2. Reply Template

```md
# Status Intake - {Role} {Name}

## 1. My Scope

- 我负责什么：
- 我不负责什么：
- 我当前采用的口径：MVP / P0 HiFi / 完整 PRD / 其他

## 2. Latest Progress

| Item | Status | Evidence |
|---|---|---|
|  | Done / In Progress / Blocked / Not Started | 文件、截图、命令、报告、代码路径 |

## 3. Overall Progress

- 总进度：__%
- 已完成：
- 进行中：
- 未开始：
- 我认为当前是否能进入下一阶段：Yes / No

## 4. Remaining Work

| Priority | Task | Owner | Dependency | Estimate |
|---|---|---|---|---|
| P0 / P1 / P2 |  |  |  |  |

## 5. Known Issues / Risks

| ID | Issue | Severity | Evidence | Suggested Next Step |
|---|---|---|---|---|

## 6. Conflicts With Others

请列出你知道的“信息差”：

- 我认为已完成，但其他人可能认为未完成：
- 我认为未完成，但其他人可能认为已完成：
- 需要 PM 统一口径的地方：

## 7. Need PM / Ant Decision

| Decision Needed | Options | Recommendation | Why |
|---|---|---|---|

## 8. Next 3 Actions

1.
2.
3.
```

## 3. PM Evaluation Criteria

一一会按以下标准判断下一步安排：

1. 首体验 P0 是否能走通。
2. 最新源码、最新 APK、最新测试证据是否一致。
3. PRD / Interaction / Design / Tech Task 是否有优先级冲突。
4. 设计结论、开发自测、测试复验是否能互相闭环。
5. 哪些工作应该本轮修，哪些应后置到 Phase 2。

