# Nagi Runtime Harness Architecture Design V1

## 1. 项目定位

Nagi Runtime Harness 是一个面向长期存在型角色 Agent（Long-running
Character Agent）的架构验证项目。

目标不是构建简单聊天机器人，而是验证：

> 如何通过 Harness
> 架构，将角色人格、世界知识、状态、记忆、技能和行为规则资源化，使 Agent
> 具备持续身份和动态上下文理解能力。

------------------------------------------------------------------------

## 2. 背景与问题

早期 Coze 实现：

    Prompt
    +
    Knowledge Base
    +
    Conversation History

存在问题：

### 静态知识无法表达动态世界

知识库可以描述：

-   Nagi是谁；
-   发生过哪些事件；
-   世界有哪些设定。

但无法表达：

-   当前章节；
-   当前关系阶段；
-   当前有效记忆；
-   当前行为约束。

------------------------------------------------------------------------

### Context 管理缺失

大量资料处于平行状态：

    角色资料
    剧情文件
    世界观文件
    关系文件

缺少：

-   状态；
-   优先级；
-   生命周期；
-   关联关系。

导致上下文污染。

------------------------------------------------------------------------

### Prompt 过载

Prompt 同时承担：

-   人格定义；
-   状态管理；
-   剧情判断；
-   检索策略；
-   行为约束。

难以维护。

------------------------------------------------------------------------

# 3. 核心假设

## H1：复杂 Agent 的核心是 Context Runtime

Agent 能力来源：

    Knowledge
    +
    State
    +
    Memory
    +
    Policy
    +
    Runtime

而不是：

    Prompt + RAG

------------------------------------------------------------------------

## H2：资源化优于 Prompt 堆叠

角色能力拆分：

    Personality
    Timeline
    Relationship
    Memory
    Skill
    Policy

由 Runtime 动态组合。

------------------------------------------------------------------------

# 4. 总体架构

    User

    ↓

    Conversation Layer

    ↓

    Nagi Harness Runtime

    ├── Context Engine
    │
    ├── State Manager
    │
    ├── Memory System
    │
    ├── Character Resources
    │
    └── Agent Runtime

    ↓

    LLM

    ↓

    State Update

------------------------------------------------------------------------

# 5. 核心模型

## Character Model

定义：

> Nagi是谁。

包含：

-   Personality
-   Speech Style
-   Behavior Rules
-   Preferences

------------------------------------------------------------------------

## World State Model

定义：

> 当前世界状态。

示例：

``` json
{
  "chapter":5,
  "route":"true_end",
  "location":"apartment"
}
```

------------------------------------------------------------------------

## Relationship Model

定义：

> Nagi与用户关系。

示例：

``` json
{
  "trust":85,
  "intimacy":70,
  "stage":"relationship"
}
```

------------------------------------------------------------------------

## Memory Model

分为：

### Episodic Memory

事件记忆。

### Semantic Memory

长期事实。

### Emotional Memory

情绪影响。

------------------------------------------------------------------------

# 6. Context Engineering

核心原则：

不是：

    全部知识 -> LLM

而是：

    Current State

    +
    Relevant Memory

    +
    Scene Context

    +
    Behavior Policy

    +

    Dynamic Context

根据当前状态动态构建上下文。

------------------------------------------------------------------------

# 7. Agent Runtime

执行流程：

    Receive Input

    ↓

    Scene Understanding

    ↓

    Resolve Context

    ↓

    Generate Response

    ↓

    Update Memory

    ↓

    Update State

------------------------------------------------------------------------

# 8. Harness Resource Design

    nagi-harness

    ├── core
    │   ├── personality
    │   └── behavior_rules
    │
    ├── world
    │   ├── timeline
    │   └── events
    │
    ├── relationship
    │
    ├── memory
    │
    ├── skills
    │
    └── policy

------------------------------------------------------------------------

# 9. 技术路线

## Phase 1：Runtime MVP

目标：

验证：

-   State
-   Context
-   Memory
-   Agent Loop

技术：

LangGraph / Agent Runtime。

------------------------------------------------------------------------

## Phase 2：Harness 化

目标：

验证：

-   Resource Composition
-   Skill Pack
-   Policy Pack
-   动态能力组合

技术：

DeepSeek Harness / Cordis。

------------------------------------------------------------------------

# 10. Eval

## Character Consistency

-   是否符合Nagi人格；
-   是否避免普通恋爱机器人化。

## Timeline Consistency

-   是否理解当前时间线；
-   是否避免未来信息泄露。

## Memory Accuracy

-   是否正确记忆关键事件。

## Relationship Continuity

-   关系是否连续变化。

## Context Efficiency

-   是否减少无效上下文。

------------------------------------------------------------------------

# 11. 8月计划

## 8月20日

项目启动：

-   工程初始化；
-   导入Nagi's Heart资料；
-   确定资源结构。

## 8月21日

完成：

-   Character Schema；
-   State Schema；
-   Resource Schema。

## 8月22日

完成基础Runtime。

## 8月23日

完成Context Engine。

## 8月24日

完成Memory System。

## 8月25日

完成Scene Skill。

## 8月26日

完成Harness资源化。

## 8月27日

测试优化。

## 8月28日

完成第一版Harness Demo。

## 8月29-31日

输出架构总结和实践案例。

------------------------------------------------------------------------

# 12. 交付物

1.  Nagi Runtime Harness Demo
2.  Architecture Design Document
3.  Character Schema
4.  Context Engineering Design
5.  Eval Report
6.  Harness 实践总结

------------------------------------------------------------------------

# 13. 项目价值

验证：

> Harness 架构是否能够支撑复杂长期存在型 Agent。

核心问题：

1.  Context 是否可以工程化管理；
2.  Agent 是否可以拥有稳定连续身份；
3.  Resource Composition 是否优于 Prompt 编排；
4.  Harness 是否可能成为下一代 Agent 应用基础。
