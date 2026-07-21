# NagisHeart 协作规则 v2

> 2026-07-21 重置（DEC-20260721-002）。旧 harness/loop/信箱/交班/角色手册体系全部废止，归档于 `99_archive/harness_v1_retired_20260721/`，不再作为任何工作依据。
> 本文件是唯一的协作规则。原则：**轻量。git 是账本，文档只记结论。**

---

## 1. 角色

| 角色 | 职责 |
|---|---|
| **Ant** | Owner。唯一验收人（实机 / 浏览器）。拍板一切权威变更。 |
| **feibo**（CTO） | 上层指导：规则制定与修订、架构把关、重大 review、基建工具。不做日常运维。 |
| **PM 一一** | 规则内执行者：任务板运维（开条目/更新状态/关闭台账）、向 worker 派发、催收证据、日常复核、优先级同步。**同样受 v2 约束：只写四本账，不得新建过程文件。** |
| worker | 按任务板条目执行：PP=Android、Wewe=Web、lulu=UI 设计、TT=KV 视觉。按需拉起，不常驻。 |

不再存在：agent QA、loop/scheduler、shift 交班、inbox/outbox 信箱。PM 存在，但 PM 的一切工作都发生在任务板和 decision_log 之内。

## 2. 四本账（全部在此，别处不记）

| 账 | 位置 | 规则 |
|---|---|---|
| 权威 | `authority/` + `authority/MANIFEST.md` | 铁律见 MANIFEST；改动必须 decision_log + 同 commit 更新哈希 |
| 任务 | `00_harness/02_planning/task_board.md` | 活跃任务 + 关闭台账；新任务加条目，不写单独任务单文件 |
| 决策 | `00_harness/01_governance/decision_log.md` | append-only，只记拍板结论 |
| 证据 | `00_harness/05_reports/<task-id>/` | 截图/对比图，按任务建目录 |

过程沟通不落盘：commit message 就是过程记录。禁止再新增 dev_reply / status / PM_REVIEW / TASK_TO_xxx 这类过程文件。

## 3. 任务生命周期

1. **开**：task_board 加条目（标题/负责人/优先级/说明/完成定义），一条搞定。
2. **做**：worker 直接改代码/资源，小步提交（类型规则见 §5），做完即推送，不留过夜工作区。
3. **报**：在自己条目下追加一行"完成 + 证据路径"。UI 类改动必须截图入 `05_reports/<task-id>/`，文字声明不算完成。
4. **验**：Ant 看图/实机。通过 → done；不通过 → 拍图打回**原条目**继续改，不开新任务、不写返工单。
5. **关**：done 后由 PM 一一移入关闭台账（一句话理由）。

## 4. 会话启动（每个 agent 每次开工）

1. `git pull`
2. 读 `README_AI.md` → `00_harness/02_planning/task_board.md` 里自己的条目
3. 跑 `powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1`（不绿先报告，不开工）
4. 按任务需要读 authority 对应章节，**只读相关部分**

## 5. 提交规则（保留旧版）

类型：`docs` / `data` / `assets` / `android` / `web` / `tools`，一次提交只做一类事。

## 6. 红线（保留旧版）

- `authority/` 未走流程不得改
- `story-data/*.json` 正文、`assets/bg/`、`assets/main pic/`、`android/app/src/main/res/`：无明确任务不得动
- 历史 `handoff/`、`99_archive/`：只读，不得引用为开发依据，不得为"干净"而删除

## 7. 目录现状

```text
00_harness/
  README.md          ← 本规则（唯一）
  01_governance/decision_log.md
  02_planning/task_board.md（+ 归档）
  05_reports/        ← 证据
  08_authority_current/ ← 退役指路牌（勿用）
  99_archive/        ← 全部历史，只读
```
