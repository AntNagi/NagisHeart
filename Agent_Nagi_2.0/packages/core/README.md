# @nagi/core — L0–L3 领域逻辑

**零依赖纯 TypeScript。** 不碰 LangGraph、HTTP、数据库、UI、文件系统。
外部能力一律经 `src/ports/` 注入。

## 判据

> **core 必须能在 Node 里裸跑单测**——不起服务、不连数据库、不碰浏览器。

```bash
npm run test:core
```

这条不是洁癖。V4 §13.2 要评价 LangGraph，前提是**能把框架摘出来对比**；
框架一旦渗进 core，评价就无从做起。`eslint.config.js` 强制这条边界。

它已经救过一次场：方案从 Python 改 TS、从纯客户端改客户端+服务端，
**L0–L3 的算法一字未改**。

## 结构

| 目录 | 职责 |
|---|---|
| `domain/` | `CanonWorldState` / `UserRelationshipState` / `SessionState` 与不变式 |
| `resources/` | front-matter 解析、schema 校验、`activation` 受限求值器 |
| `context/` | **本项目核心**：activation 求值 → 预算装箱 → 渲染 Context Blocks |
| `memory/` | Canon / Live 分层、混合排序检索、记忆抽取的解析 |
| `guard/` | 硬规则检查、OOC 判据解析 |
| `ports/` | 对外接口：`ChatProvider` / `EmbeddingProvider` / `MemoryStore` / `StateStore` / `ResourceSource` |

## 两条易错

1. **`activation.when` 不许用 `eval` / `new Function`**，用自写受限求值器。
   资源文件是事实源，不该有执行任意代码的能力。
2. **数值不直接进 prompt。** 关系状态先渲染成可表演的自然语言——
   给模型 `trust: 85` 它不知道怎么演（V4 §9）。
