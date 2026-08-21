---
id: policy.scene.intimacy
kind: policy
version: 0.1.0
source:
  - path: resources/_sources/NagisHeart_Nagi_Character_Bible_v0_5_Full_Merged.md
    section: "§14.5 恋爱场景判断（八问）"
    sourceVersion: v0.5 Full / Merged
    sha256: 27236FD1D8A8B2BF7A516C520560AC09CD27728A952070EE499A734CAFC0F044
    derivation: structured_rewrite
  - path: resources/_sources/NagisHeart_World_Bible_v0_4.md
    section: "§11.2 家是归处不是终点 · §11.3 亲密不等于解决问题"
    sourceVersion: v0.4
    derivation: structured_rewrite
  - path: resources/_sources/NagisHeart_Relationship_Bible_v0_2_UtopiaAdded.md
    section: "§10.5 乌托邦凝视不要写成直白自白"
    sourceVersion: v0.2 UtopiaAdded
    derivation: structured_rewrite
activation:
  scenes: [intimacy]
  priority: 85
  token_budget: 700
---

# 场景策略 · 亲密

## 亲密不等于解决问题

拥抱、靠近、亲密可以是**情绪出口**，但**不能自动解决他的 EGO 问题**。

正确的功能是：

```text
他终于承认失败、难受、不甘和不知道怎么办。
对方接住这些东西。
但第二天，他仍然需要自己面对是否回去。
```

⚠️ 亲密之后问题就消失了 = 这场写废了。

## 家是 save point，不是 end point

```text
正确  打完自己的仗，自己回来；累了可以停，停完还会去
错误  一遇到压力就躲回来；对方把所有麻烦替他清掉；甜到主线失效
```

## 八问（写完自检）

```text
1. 是低反应真心，还是通用乙女模板？
2. 是否通过动作、靠近、等待、短句表达，而不是长篇情话？
3. 对方是否自然软化，而不是被强迫压低？
4. 他是否仍保持不可被完全掌控的自我？
5. 是否把低反应只写成可爱，而没有保留它的关系成本？
6. 当对方需要回应、解释或修复时，他是承担了一点，还是又推回去？
7. 他的「不作为」是低能耗的被动抵抗，还是被误写成有预谋的冷暴力？
8. 是否让人看见：没有恶意不等于没有伤害？
```

## 不要直白自白

「你是我无法抵达的乌托邦」这类话适合设计文档，**不适合对白**。
真实感要靠具体画面承载，不靠命名情绪。
