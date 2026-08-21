# Pre-flight 问题清单

> 依 `CLAUDE.md`「开工前必须先对照、先报问题」。本清单是问题，不是打勾。
> 每条标 `【已验证】`/`【推断】`。未裁决的问题不得「按理解补」。

## 已裁决项（2026-08-20 Ant）

### Q1 — 用户关系起点
- 等级：【已验证】`story-data/endings.json` 四个结局的关系语义互不相容
  （TRUE=并肩发光 / GOOD=不对称的完美 / NORMAL=普通情侣 / BAD=不再让你靠近）。
- 裁决：普通使用者不继承游戏主角关系。采用 CanonWorld / UserRelationship 双关系模型；结局只影响 CanonWorld 中凪与游戏主角的既成关系。

### Q2 — Agent 专用资源包
- 等级：【已验证】`CLAUDE.md` 红线 + `authority/MANIFEST.md` 铁律第 1 条
  明文禁止复制权威内容到其他位置。
- 裁决：批准建立 Agent 专用资源包。资源仅随服务端部署，不下发客户端；每条保留来源坐标与哈希。

### Q3 — 人格事实源
- 裁决：Personality、Speech、Behavior 直接参考 Ant 指定的人设文件，不做 fic-writing 与 V17 的自动融合，V17 只作为剧情 Canon 来源之一。
- 已登记：`resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md`。
- 【已验证】文件版本为 v0.5 Full / Merged，包含 §18「给 Character Agent / Harness 的最小核心摘要」。
- SHA-256：`27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044`。

## 当前阻塞项

无。Q3a 已因人设文件入库并登记而解除。

## 非阻塞但需尽早定

### Q4 — 剧本三个版本并存，未指定 Agent 事实源
- 等级：【已验证】`authority/script/` 下有 V15_Calibrated、V16_Final、
  V17_RelationshipFriction_Calibrated 三份。
- 【已验证】`authority/MANIFEST.md` #3 指定**剧本母版 = V17**。
- 结论：Agent 也用 V17，V15/V16 视为历史。此条已可自解，登记备查。

### Q5 — Eval 无 golden set，验收标准不可执行
- 等级：【已验证】立项书 §7 与架构书 §10 全部是形容词，无判据。
- 影响：8/27「测试优化」将无尺可量。
- 建议：8/21 先写 20–30 条对抗性用例，两类为主：
  1. **诱导 OOC**：把凪往「普通恋爱机器人」上带（追问喜不喜欢、要甜言蜜语、
     要主动关心），看是否守住低反应/嫌麻烦的底。
  2. **套时间线**：问未发生的事、问别人的视角、问剧情外的设定，看是否编造。
- 现状：`evals/golden_set.md` 已起头，待填。

### Q6 — LangGraph 与 DSH 的嵌套边界
- 等级：【推断】待验方式：后续实现 `LangGraphRuntimeAdapter`，由 DSH 激活资源后调用同一 Nagi StateGraph。
- 背景：LangGraph 的 checkpointer 会把 state 结构绑到它自己的持久化格式上。
  若直接用它存 Memory，Phase 2 迁移要重写。
- 建议：DSH 管 Resource / Skill / Policy 组合；LangGraph 管 thread、checkpoint 与恢复；长期 Memory 使用独立 Domain Store，避免双重状态源。

### Q7 — 排期风险
- 等级：【推断】依据是 Context Engine 与 Memory 各只排一天。
- 这两块是本项目唯一的真难点（其余是脚手架）。建议把 8/25「Scene Skill」
  压缩，把时间挪给 8/23–8/24。Scene Skill 在 Context Engine 做对之后
  基本是配置工作。

---

## 2026-08-20 增补（V2 / 附录 A 之后）

### Q8 — Resources 公开问题已消解
- 裁决：Agent 专用资源包仅随服务端部署，不进入开源聊天客户端产物，也不提供下载接口。

### Q9 — 50 用户规模的向量检索性能
- 等级：【推断】待验方式：按 50 个用户身份的目标数据量，在最终长驻 Node 平台实测内存、启动重载与查询耗时。
- 若超限：再评估预筛 + 精排或外部向量存储，不提前引入。

### Q10 — Provider 浏览器 CORS 问题已消解
- 裁决：模型请求统一由 Nagi 服务端发起，浏览器不直连 Provider；CORS 不再是 Provider 选型条件。
- 国产模型首选具体厂商仍由首个 Provider 实现任务确定。

### Q11 — 云部署延后
- 裁决：当前阶段仅本地开发与验证，上线时再采购云服务器。
- 已定容量：首发最多 50 个用户身份，不代表 50 并发。
- 上线阶段再按当时实付价格选择中国内地轻量云服务器，不阻塞当前开发。

### Q12 — 记忆隔离是事故级风险
- 等级：【推断】待验方式：针对性单测——两个同步码互相查不到对方记忆
- 服务端任何一处查询漏掉同步码过滤 = 记忆串台
- **此项不可砍**，排期紧张时优先保它
