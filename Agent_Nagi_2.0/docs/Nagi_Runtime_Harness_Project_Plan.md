# Nagi Runtime Harness 项目立项书

## 1. 项目名称

Nagi Runtime Harness

一个基于 Harness 架构的角色型 Agent 实验项目。

## 2. 项目背景

早期 Nagi 角色 Agent 采用：

-   Prompt 描述人格和行为
-   Knowledge Base 存储资料
-   Chat History 保存对话

但存在问题：

-   静态知识无法表达动态世界状态；
-   剧情、关系、记忆缺少结构化关联；
-   Prompt 承担过多状态管理职责；
-   Agent 无法准确理解当前时间线。

本项目基于 Harness、Context Engineering 和 Agent Runtime
思路，重新构建一个具备持续身份的 Nagi Agent。

目标：

> 从 Prompt 驱动角色，升级为状态、资源和上下文驱动角色。

## 3. 项目目标

2026 年 8 月底完成第一版完整 Harness 版本 Nagi Agent。

实现：

-   人格一致性；
-   剧情状态理解；
-   关系状态管理；
-   长期记忆；
-   Context 动态组装；
-   Harness 化资源管理。

## 4. 核心架构

    Character Resources
            ↓
    Context Management
            ↓
    Harness Runtime
            ↓
    Agent Decision
            ↓
    Memory / State Update

资源包括：

-   Personality
-   Timeline
-   Relationship
-   Memory
-   World State
-   Behavior Rules
-   Scene Skills

## 5. 技术路线

第一版采用：

-   LangGraph / Agent Runtime 作为执行基础；
-   Harness 思想组织资源；
-   后续验证 DeepSeek Harness / Cordis 迁移可能。

架构：

    User Input

    ↓

    Nagi Harness

    ├── Character Resource Layer
    ├── State Manager
    ├── Context Builder
    ├── Memory System
    └── Agent Runtime

    ↓

    Nagi Response

    ↓

    State Update

## 6. 开发计划

### 8月20日

项目启动。

完成： - 技术方案确定； - 项目结构建立； - 导入 Nagi's Heart 资料。

### 8月21日

完成： - Character Schema； - State Schema； - Resource 结构。

### 8月22日

完成基础 Agent Runtime。

实现：

输入 → 状态读取 → Context加载 → Nagi回复

### 8月23日

完成 Context Builder。

实现： - 根据章节加载资料； - 根据关系加载记忆； - 根据场景选择规则。

### 8月24日

完成 Memory System。

实现： - 事件记录； - 重要记忆保存； - 状态更新。

### 8月25日

完成 Scene Skill。

支持： - 日常聊天； - 剧情事件； - 情绪冲突； - 关系推进。

### 8月26日

Harness 化整理。

完成： - Resource Pack； - Skill Pack； - Policy Pack。

### 8月27日

测试优化：

重点： - 人格一致性； - 时间线正确性； - 关系状态； - 记忆准确性。

### 8月28日

完成第一版 Harness Demo。

包含： - 对话体验； - 状态展示； - Memory 展示； - Resource 管理。

### 8月29-31日

复盘： - LangGraph方案评价； - Harness抽象评价； - DSH/Cordis迁移实验。

## 7. 验收标准

### 人格一致性

Nagi： - 保持核心性格； - 避免普通恋爱机器人化； - 符合既定角色逻辑。

### 状态一致性

Agent理解： - 当前章节； - 当前关系； - 已发生事件； - 未发生事件。

### Context能力

相比旧 Coze Agent：

-   不依赖超长 Prompt；
-   不依赖全量知识注入；
-   能动态选择有效信息。

### Harness能力

资源可以独立管理：

-   Personality；
-   Timeline；
-   Memory；
-   Skill。

## 8. 项目价值

本项目验证：

> Harness 架构是否能够支撑复杂长期存在型 Agent。

核心问题：

1.  Context 是否可以工程化管理；
2.  Agent 是否可以拥有稳定连续身份；
3.  Resource Composition 是否优于 Prompt 堆叠；
4.  Harness 是否可能成为下一代 Agent 应用基础。

## 9. 后续方向

如果第一版成功：

-   接入 DeepSeek Harness / Cordis；
-   验证动态 Resource Composition；
-   探索角色 Agent Runtime；
-   总结 Harness 实践方法。

## 10. 实现收尾清单（2026-08-21）

按当前代码与定稿技术方案对账，后续工作只按此清单收口：

- [x] LangGraph StateGraph、条件边、Guard 重试与 fallback
- [x] Context / Memory 基础实现与资源加载
- [x] API、SSE、BYOK 透传、鉴权、限流、thread 单写锁
- [x] SQLite Domain Store 与保存导入导出接口
- [x] GraphState 运行时结构校验
- [x] Canon / Live namespace、分池检索、embedding 版本与来源坐标契约
- [x] Checkpoint 恢复、time travel、幂等与 thread 并发锁 Eval
- [x] 30 条角色 Eval 清单、离线 Guard Eval runner 与框架测试入口
- [x] 开源聊天客户端选型记录、CORS 适配与本地 API Demo
- [x] 全量 typecheck、lint、test 与本地启动验收
- [x] LangGraph Runtime Adapter 与 DSH 外层接缝记录
- [ ] Canon 事件正文烘焙：需要 Ant/Claude 提供或确认事件改写口径后执行
