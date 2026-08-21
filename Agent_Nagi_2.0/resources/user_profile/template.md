---
id: user_profile.template
kind: relationship
version: 0.1.0
source:
  - path: resources/_sources/NagisHeart_Ant_Character_Bible_v0_5_UtopiaAdded.md
    section: "§0 使用说明 · §1 基础资料（逐项标注的可变量）· §2 外貌与身体感"
    sourceVersion: v0.5 UtopiaAdded
    derivation: structured_rewrite
activation:
  # 模板本身不进 Context。玩家**填好的实例**按 user_profile.rendered 进上下文。
  context: false
  consumers: [user_profile_renderer]
  instance_token_budget: 250
notes: |
  Q16 裁决（Ant，2026-08-21）：按现有 Ant 来，但具体人设不写死，留空白给玩家补充。

  母版自身就是这么设计的——Ant Bible §0：
  「不是玩家可见设定卡，也不是为了把女主写成固定姓名、固定人格、固定人生经历的
   不可改角色……所有玩家可见正文都必须保留可替换性。」

  分工：
    关系**结构**（她在关系里的位置、爱的方式、危险）→ relationship/canon.core.md，常驻，不可改
    具体**人设**（名字、外貌、习惯、生活细节）      → 本模板，玩家填，可空

  留空是允许的。凪本来就不主动追问细节——空白字段不渲染，不要用占位词填充，
  更不要让凪去猜。
---

# 玩家档案模板

> 全部字段**可留空**。留空的字段不进上下文，凪不会知道、也不会追问。
> 母版对这些项的口径是「内部视觉参考」「不在玩家可见正文中强行固定」，
> 因此这里填什么都不会与设定冲突。

## 称呼（建议至少填这一组）

```yaml
playerName:  ""        # 凪怎么称呼你。留空则用「你」
nagiCall:    ""        # 你怎么称呼凪。留空则用「凪」
```

## 外貌与体态（可选）

母版口径：身高 160cm 左右是**内部视觉参考**，不锁死；体重不建议写进可见正文。
与凪 190cm 的体型差需要明显，但**「她小」是相对身高而言，不是人格弱**。

```yaml
appearance:  ""        # 一两句即可。凪不会长篇描述外貌
height:      ""        # 可留空
```

## 习惯与生活（可选）

这里填的是**凪会注意到的东西**——他记不住抽象设定，但会记住具体反应。

```yaml
habits:      ""        # 作息、口味、小动作、容易被戳到的点
work:        ""        # 在忙什么。母版底层定位是资源方/投资人，但不必照搬
livingSpace: ""        # 你们待在一起的地方是什么样
```

## 其他

```yaml
notes:       ""        # 任何你希望凪知道的事
```

---

## 不在此模板内、也不可由玩家改的

以下属于**关系结构**，由 `relationship.canon.core` 固定：

```text
她最早看见他的光，也最有能力把那束光推向世界。
她的爱是路径，他的心是终点。
她给他归处，但归处不能变成笼子。
她想把他送到最高处，但最高处必须由他自己踢出来。
```

改这些等于改这段关系本身，不属于玩家自定义范围。
