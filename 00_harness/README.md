# NagisHeart 协作层索引

> 2026-07-26 重构。**规则正文在根目录 `CLAUDE.md`（唯一事实源），本文件只做索引，不重复规则。**
> Codex 侧入口 `AGENTS.md`（薄壳，随 CLAUDE.md 同步）。

---

## 四本账（全部信息只存在这四处）

| 账 | 位置 | 谁写 |
|---|---|---|
| **权威**（唯一落地依据） | `authority/` + `authority/MANIFEST.md` | lulu / TT 写，Ant 拍板，走 decision_log + 哈希 |
| **任务**（唯一任务来源，含优先级） | `00_harness/02_planning/task_board.md` | PM 一一 维护，worker 在自己条目下追加 |
| **决策**（只记拍板结论） | `00_harness/01_governance/decision_log.md` | feibo / PM，append-only |
| **证据**（截图/复现/体检输出） | `00_harness/05_reports/<task-id>/` | worker / QA |

**过程沟通不落盘**：不写任务单、回报、评审文件；过程写 commit message。

## 角色手册（各岗位的动作序列）

| 角色 | 手册 |
|---|---|
| PM 一一（板面运维 / 任务原子化 / 派发） | `roles/ROLE_PM.md` |
| PP（Android）/ Wewe（Web） | `roles/ROLE_DEV.md` |
| QA（验证仪器） | `roles/ROLE_QA.md` |
| lulu（UI 设计）/ TT（KV） | `roles/ROLE_DESIGN.md` |
| feibo（CTO） | 规则 / 架构 / 裁决 / 根因取证，见 `CLAUDE.md` 角色节 |

## 主循环

```
问题来源：Ant 反馈 / QA 体检脚本扫全场 / QA 按范围复现
        ↓
PM 拆成原子条目上板（一条一现象一验收点，只写范围+权威章节引用）
        ↓
worker 领 3~5 条  →  pre-flight 报权威问题  →  停，等裁决
        ↓                        ↓
   （权威没问题）          （权威有缺失/冲突）→ lulu/TT 补权威 → 走 MANIFEST 流程
        ↓
逐条改 → 逐条复现 → 逐条回报 → push
        ↓
PM 初查：条数对不对 / push 了没        ← 只查这两样，对不上直接打回
        ↓
QA 取证：跑体检脚本 + 人工复现 → 只出「可复现事实」，不下 pass/reject
        ↓
PM 汇总（原样贴 QA 事实，不做裁判）
        ↓
Ant 抽查 1~2 条 → 通过则 PM 关条目入台账
```

**工具坏 ≠ 业务任务失败**：体检脚本不可用时，另开工具 rework 任务，业务任务凭 worker 复现 + QA 人工复现照常流转，不得卡住。

## 目录

```text
00_harness/
  README.md              ← 本索引
  roles/                 ← 角色手册
  01_governance/decision_log.md
  02_planning/task_board.md（+ 归档）
  05_reports/            ← 证据
  99_archive/            ← 历史，只读，其中的旧流程指令一律不得执行
```
