# @nagi/runtime-langgraph — L4 编排（本项目的主实验对象）

LangGraph.js `StateGraph`。**不是可有可无的依赖，是被验证的对象本身**（V4 §0）。

## 边界

- 只负责：编排、运行状态、条件边、重试、checkpoint、事件流
- **不负责**：人格规则、关系阈值、prompt 拼装 —— 那些在 `resources/` 与 `config/`
- 节点只调 `@nagi/core` 的 Ports，**不直接读文件、不直接跑 SQL**（ESLint 强制）
- 条件边只读明确字段（`guard.decision` / `generation.attempt` / provider error type）。
  **禁止在 edge router 里写「trust > 80 就主动表白」这类角色逻辑**

## Graph State 是工作台，不是数据库

禁止放入：API key、完整资源正文、全量向量、数据库连接、不可序列化对象。
API key 经运行时依赖注入，只活在本次请求作用域，**不进 checkpoint**（V4 §4）。

## Checkpoint 与 Domain Store 分工

| | 管什么 |
|---|---|
| Checkpointer | 流程状态：super-step 快照、待执行节点、pending writes、恢复位置 |
| Domain Store | 长期数据：Canon / Live 记忆、turns、UserRelationship、向量、导出导入 |

首版可共用同一个 SQLite 文件，**但表与访问接口必须分离**。
不把领域数据塞进 checkpoint——会导致每步序列化体积持续膨胀，且被框架格式绑死（V4 §7.3）。

## 首版采用范围

主动用：`StateGraph`、conditional edges、checkpoint、state history、custom streaming。
保留不强用：interrupt、subgraph、并行 fan-out。

> **没有真实需求时不为了展示框架而增加复杂度。**
> 「为展示框架滥用复杂功能」是 V4 §16 明列的风险。

## 完成判据（V4 §14.1）

不是「文件齐」，而是：
**人为让 `generate_candidate` 之后的节点失败，重新调用能从 checkpoint 恢复，
并能通过 Debug API 解释整轮路径。**
