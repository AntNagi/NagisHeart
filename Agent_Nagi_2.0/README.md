# Nagi Runtime Harness

LangGraph 驱动的长期存在型角色 Agent。用「长期人格 + 持续关系 + 长期记忆」这个高难场景，
验证 Agent 框架是否真正提供工程价值。

**唯一落地依据**：[`docs/Nagi_Runtime_Harness_Technical_Design_V4_LangGraph.md`](docs/Nagi_Runtime_Harness_Technical_Design_V4_LangGraph.md)（已定稿）
V1 / V2 / V3 均已作废，只作历史保留，**不得作为开发依据**。

---

## 开工必读

1. 读 V4 技术方案。**代码与本文冲突时以 V4 为准**
2. 读 [`docs/DECISIONS.md`](docs/DECISIONS.md) —— 决策全在这里，别凭记忆
3. 读 [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md) —— 未决项不许「按理解补」
4. 变更走 DECISIONS.md 立条目，**不再出 V5**

## 这个项目在验证什么

不是「做出一个能聊天的 Nagi」。必须回答（V4 §0）：

1. StateGraph 是否比手写流程更清楚地表达角色运行状态与分支？
2. Checkpoint 能否支持会话恢复、故障续跑、状态回放与人格漂移定位？
3. Store / Memory 接缝是否适合 Canon 与 Live 长期记忆？
4. Streaming、重试、条件边与可观测性是否降低自研成本？
5. LangGraph 能否作为有状态 Runtime 嵌入 DSH？

**最终报告必须同时评价「角色效果」和「框架能力」，不能只报 Demo 能运行。**
如果实测表明 LangGraph 只增加胶水，报告必须如实记录——这也是有效结论。

## 目录

| 路径 | 职责 | 改这里等于 |
|---|---|---|
| `resources/` | L0 人格 / 剧情 / 策略。**只随服务端部署，从不下发客户端** | 改凪的性格与知识，**不碰代码** |
| `config/` | 预算、权重、阈值、Provider | 改行为参数，**不碰代码** |
| `packages/core/` | L0–L3 领域逻辑。**零依赖纯 TS** | 改装配与记忆算法 |
| `packages/runtime-langgraph/` | L4 编排。**本项目的主实验对象** | 改流程 |
| `packages/server/` | API / 鉴权 / 限流 / 持久化实现 | 改接口与存储 |
| `packages/integrations/chat-client/` | 开源聊天客户端的选型、配置与薄适配 | 换前端 |
| `scripts/bake-canon.ts` | 预烘焙 Canon 记忆与向量 | — |
| `evals/` | `cases/` 角色 Eval，`framework/` 框架 Eval | 改验收尺子 |
| `var/` | 运行时产物（DB、向量）。**已 gitignore** | — |

## 三条不许破的线

1. **`packages/core` 不许 import LangGraph / HTTP / 数据库 / UI / fs。**
   判据：core 必须能在 Node 里裸跑单测。
   框架若渗进 core，§13.2 的框架评价就没法做——**这是架构保证，不是洁癖**。
   由 `eslint.config.js` 强制。

2. **人格规则、关系阈值不许写进 Graph 节点。**
   一律由 `resources/` 与 `config/` 声明。节点只调 Ports。

3. **资源正文、system prompt 永不下发客户端。**
   判据：把客户端产物解包，不应能重建出凪的人格资料。

## 本地开发

当前阶段**仅本地开发与验证**（D9 / NRH-20260820-019），云服务器上线时再采购。

```bash
npm install
cp .env.example .env      # 填开发自测用的 key
npm run typecheck
npm run lint              # 会检查上面第 1 条边界
npm run dev
```

BYOK：正式使用时每位使用者配自己的 key，随请求透传，服务端**不落库、不写日志**。
`.env` 里的 key 只用于开发自测。

## 状态

脚手架已建（2026-08-20）。实现按 V4 §15 排期推进，从 8/21 的 core ports 与 Graph State 开始。
