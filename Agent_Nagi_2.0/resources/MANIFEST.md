# Agent Character Resources — 清单与派生规则

> **只随服务端部署，从不下发客户端。** 判据：把客户端产物解包，不应能重建出凪的人格资料。

## 事实源

| 用途 | 源文件 | 状态 |
|---|---|---|
| **Personality / Speech / Behavior** | `core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md` | ✅ 已入库并登记 |
| **Canon 剧情** | `authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md`（剧本母版） | 引用，不复制 |
| **Canon 运行时真值** | `story-data/*.json` | 引用，不复制 |

**Character Bible 是 Personality / Speech / Behavior 的唯一直接事实源**（NRH-20260820-018）。
V17 仍是剧本母版与 Canon 剧情来源之一，但**不再单独承担凪的台词风格权威**。
**不做多来源自动融合**——冲突时停下问 Ant，不许「按理解补」。

- SHA-256：`27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044`【已验证】
- 仓库级登记：`00_harness/01_governance/decision_log.md` DEC-20260820-001 +
  `authority/MANIFEST.md`「相关但不在本目录的权威关系」

## 红线

- 本目录**不放 authority 原文**，只放**结构化转写**与**抽取结果**。禁止 verbatim 复制
- 每条资源必带 `source`：源路径 + 章节坐标 + 源版本 + 哈希
- **源文件变化 → 哈希失配 → 构建失败 → 强制重新派生。** 不许静默沿用
- Character Bible 本身是 Ant 自有合并稿，非 authority 复制品，故不触发铁律第 1 条

## 资源格式

Markdown + YAML front-matter：

```markdown
---
id: core.personality.base
kind: personality            # personality | speech | behavior_rule | timeline
                             # | event | relationship | style_anchor | policy
version: 1.0.0
source:
  path: resources/core/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md
  section: "§18 给 Character Agent / Harness 的最小核心摘要"
  sourceVersion: v0.5 Full / Merged
  sha256: 27236FD1...
  derivation: structured_rewrite    # structured_rewrite | extract | computed
                                    # 禁止 verbatim_copy
activation:
  always: true
  priority: 100                     # 0–100，预算不足时从低分砍起
  tokenBudget: 1500
---

（正文）
```

`activation.when` 用**自写受限求值器**（属性访问 / 比较 / 布尔 / 字面量），
**不许 `eval` / `new Function`**，由 ESLint 强制。

## 目录

| 目录 | 内容 | 状态 |
|---|---|---|
| `core/` | 人设母版 + 派生的 personality / speech / behavior | 母版已入库，派生待做（8/21+）|
| `world/` | `timeline.md` 剧情骨架；`events/` 事件条目 | 待做 |
| `relationship/` | `baseline.true_end.md` —— 结局已定 TRUE END，**只进 CanonWorld** | 待做 |
| `style_anchors/` | 凪真实台词样本。**防 OOC 的主力**，目标 ≥ 30 段 | 待做 |
| `policy/` | `output_guard.md` 禁用词与判据；`scene.*.md` 场景策略 | 待做 |

## 关系模型（易错，单列）

**CanonWorld ≠ UserRelationship**（V4 §1.2）：

- `CanonWorld` —— 凪经历过什么。结局 TRUE END 只写在这里
- `UserRelationship` —— 凪跟**当前使用者**现在如何。**从零起步**

⚠️ **禁止把 TRUE END 的终局亲密度赋给任何新使用者。**
`relationship/baseline.*.md` 描述的是 CanonWorld 里凪与游戏主角的既成关系，
**不是新使用者的初始值**。
