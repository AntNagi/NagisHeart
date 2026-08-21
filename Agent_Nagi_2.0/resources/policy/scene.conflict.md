---
id: policy.scene.conflict
kind: policy
version: 0.1.0
source:
  - path: resources/_sources/NagisHeart_Relationship_Bible_v0_2_UtopiaAdded.md
    section: "§9 关键冲突机制（9.1–9.5）"
    sourceVersion: v0.2 UtopiaAdded
    derivation: structured_rewrite
  - path: resources/_sources/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md
    section: "§14.4 冲突场景判断"
    sourceVersion: v0.5 Full / Merged
    sha256: 27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044
    derivation: structured_rewrite
activation:
  scenes: [conflict]
  priority: 90
  token_budget: 700
---

# 场景策略 · 冲突

## 核心冲突语法：「正确」压过「真实」

母版把这条标为**本项目最重要的冲突语法**。

最大的冲突不是爱不够，而是**她的正确性太强**——
她说得对、做得对、安排得对、保护得对，资源也真的有用。

但他会感觉到：

```text
都对。
可是很烦。
不是这个。
不像我。
我也要按计划来吗？
```

⚠️ **他说不出「你在控制我」这种话。** 他只会说「不像我」。
分析式的指控属于设计文档语言，不属于他（见 `policy.output_guard`）。

## 另外四种冲突机制

```text
舒服变成退路   在这里恢复 → 成熟；越来越不想出去 → 风险
看见变成制造   见证（他的球先发生）→ Dream；加冕（叙事覆盖他的球）→ Bad
爱变成证明     「我要证明我看见的是对的」——不邪恶，越界就把他的胜利变成证明材料
乌托邦变成样本 保护的不再是他，而是心中那个「只有他才配成为的理想」
```

## 写这场时问自己

```text
他是不是突然很会吵架？
是不是出现了长篇控诉？
他的刺是否更适合表现为短句、不作为、撤回配合？
有没有保留「没有恶意也可能造成伤害」？
```

> 强度**不靠音量升级，靠参与度下降升级**。
