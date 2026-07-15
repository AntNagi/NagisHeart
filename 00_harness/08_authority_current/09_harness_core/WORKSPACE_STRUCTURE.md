# Nagi's Heart 工作空间结构

> 家里电脑工作空间：`D:\Nagi's Heart`  
> Git 仓库：`D:\Nagi's Heart\NagisHeart`  
> Git 内活动 Harness：`D:\Nagi's Heart\NagisHeart\00_harness`  
> 维护人：PM 一一

## 1. 工作空间与 Git 的关系

最外层 `D:\Nagi's Heart` 是本机工作空间，里面可以放主项目、冻结项目和本地历史档案；GitHub 仓库根目录是其中的 `NagisHeart/`。

所有需要在家里电脑与公司电脑之间同步的活动文档，都必须位于 `NagisHeart/` Git 仓库内。`00_harness/` 因此正式放在仓库根目录，路径统一写成仓库相对路径 `00_harness/...`。

家里电脑可保留外层 `D:\Nagi's Heart\00_harness` 目录兼容入口，但它只能指向仓库内 Harness，不能再保存第二份可编辑副本。

## 2. 本机工作空间目录

| 目录 | 定位 | 是否进入主 Git |
|---|---|---|
| `NagisHeart/` | 当前持续开发的 Nagi's Heart 主项目仓库 | 是 |
| `NagisHeart/00_harness/` | 当前团队协作、治理、任务、交班与权威候选集 | 是 |
| `20_reference/` | 历史版本、旧剧本、旧设计、截图和迁移前档案 | 否 |
| `notebook/` | 已冻结的旧记事本项目源码 | 否 |
| `notebook-app/` | 已冻结的旧记事本 App 工程 | 否 |

## 3. `00_harness/` 目录职责

| 目录 | 职责 |
|---|---|
| `00_project/` | 项目说明、角色登记、角色 Harness、工作空间结构 |
| `01_governance/` | 决策、变更请求、打断记录 |
| `02_planning/` | 任务板、优先级、当前状态 |
| `03_handoffs/` | 公司/家里交班与跨班次上下文 |
| `04_execution/` | PM、设计、开发、测试的文本执行记录与 Skills |
| `05_reports/` | 审计、测试、验收和验证报告 |
| `06_templates/` | 决策、任务、交班、测试等模板 |
| `07_scheduler/` | PM、Worker、QA、交班等 Loop 规则与 Schedule |
| `08_authority_current/` | 从现有文件中选出的当前权威候选快照与索引 |
| `99_archive/` | 已废弃、被替代的轻量协作文件 |

## 4. Git 收录边界

进入 Git：

- 当前协作规则、角色 Harness、Skills、Loops；
- 当前任务、决策、交班和测试文本；
- 当前权威候选集；
- 仍需追溯的轻量 Markdown 回信。

不进入 Git：

- 历史生成图片、海报迭代、缓存和 `__pycache__`；
- 已被替代的批量设计过程产物；
- 冻结项目与本地历史资料。

不进入 Git 的历史 Harness 快照统一保存在本机 `20_reference/harness_pre_git_migration_20260715/`。

## 5. Agent 默认边界

- 默认代码范围：当前 Git 仓库；
- 默认协作入口：`00_harness/`；
- 默认权威索引：`00_harness/08_authority_current/README.md`；
- 默认历史范围：本机 `20_reference/`，没有明确追溯任务就不读取；
- 默认冻结范围：`notebook/`、`notebook-app/`；
- 不因文件位于同一工作空间就进行全盘扫描。
