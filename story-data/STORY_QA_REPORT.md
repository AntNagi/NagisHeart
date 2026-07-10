# Story QA Report — Golden Playthrough v2.0

> 生成时间: 2026-07-10
> 数据版本: V15 Calibrated + Design V3.1 + Distance Semantic Split
> 工具: tools/golden-playthrough.js + tools/validate.js

---

## 执行摘要

| 路径 | 预期结局 | 实际结局 | 状态 |
|------|----------|----------|------|
| A. Dream TRUE | end_true | end_true | ✅ PASS |
| B. Dream GOOD | end_good | end_good | ✅ PASS |
| C. Stay NORMAL | end_normal | end_normal | ✅ PASS |
| D. Bad | end_bad | end_bad | ✅ PASS |

**结果: 全部四条路径语义正确。**

---

## 已修复的 P0 缺陷：distance 语义混用

### 问题（v1.0 报告）

V15 剧本第三部有 7 个 auto-advance 场景使用 `distance` 变量记录叙事必经的距离变化，导致所有路径 distance 累积 ≥ 9，BAD END 阈值 `distance >= 6` 截杀所有结局。

### 修复方案（PM 决策 Option B）

将 `distance` 拆分为两个语义独立的变量：

| 变量 | 含义 | 来源 | 参与结局判定 |
|------|------|------|-------------|
| `distance` | 玩家行为造成的心理距离 | 玩家选择 | ✅ 是 |
| `narrativeDistance` | 剧情必经事件的客观距离 | auto-advance | ❌ 否 |

### 修改的节点

7 个 auto-advance 的 distance 效果改为 narrativeDistance：

| 节点 | 原效果 | 新效果 | 叙事含义 |
|------|--------|--------|----------|
| e_depart | distance+1 | narrativeDistance+1 | NEL闭关送别 |
| c6a | distance+1 | narrativeDistance+1 | 世界杯出征 |
| e_curry | distance-1 | narrativeDistance-1 | 回忆柠檬茶 |
| e_bday | distance+1 | narrativeDistance+1 | 异国生日 |
| e_hug | distance+2 | narrativeDistance+2 | 失联后重逢 |
| e_intimate | distance+2 | narrativeDistance+2 | 同居转折 |
| side_b_return | distance+3 | narrativeDistance+3 | 世界杯归来 |

保留为 `distance` 的：`bad_cold` distance+2（玩家后果）

### 附加修复

- `bad_match`: personalHonor 从 true 改为 false（"让全世界看见你"是控制，不是个人荣誉）
- `nagiNameIndependent`: 从 dream_match auto-advance 移除，改为玩家有意义选择触发：
  - transfer_contract: "最后那个答案，你自己说"
  - e_agency_launch: "这不是为了你一个人，是我本来就想做"

---

## 四路径终态详情

### A. TRUE END（温柔 M-dream, antCompress=false）

```
path = dream       | control = -4      | distance = -1
narrativeDistance = 9 | witnessFlag = true | personalHonor = true
nagiNameIndependent = true | antLightSeen = true | antFragileSeen = true
loveNotHabit = 7   | nagiCare = 3      | egoHold = 9
trueFlag = 1       | finalChoice = witness | mj = M
```

ending_resolver 匹配: TRUE END（trueFlag >= 1 && distance <= 3 && witnessFlag && personalHonor && nagiNameIndependent && !antCompress）

### B. GOOD END（M-dream, antCompress=true）

```
path = dream       | control = -4      | distance = -1
narrativeDistance = 9 | witnessFlag = true | personalHonor = true
nagiNameIndependent = true | antLightSeen = true | antFragileSeen = true
loveNotHabit = 6   | nagiCare = 3      | egoHold = 9
antCompress = true  | finalChoice = witness | mj = M
```

ending_resolver 匹配: GOOD END（path==="dream" && witnessFlag && personalHonor && antCompress）

### C. NORMAL END（stay 路径）

```
path = stay        | control = 0       | distance = -1
narrativeDistance = 9 | nagiNameIndependent = true
antLightSeen = true | antFragileSeen = true
loveNotHabit = 4   | nagiCare = 3      | egoHold = 3
finalChoice = ordinary | mj = M
```

ending_resolver 匹配: fallback → end_normal

### D. BAD END（高控制, bad 路径）

```
path = bad         | control = 12      | distance = 3
narrativeDistance = 9 | badLock = true    | nagiRebel = true
nagiDiscomfortSeed = true | nagiNameIndependent = true
antLightSeen = true | habitDepend = 2
loveNotHabit = 1   | nagiCare = 1      | finalChoice = coronation
```

ending_resolver 匹配: BAD END（badLock === true）

---

## Validator 结果

```
15/15 checks PASSED — 0 errors, 0 warnings
```

包含：flow chain、router targets、choice transitions、reachability、dead-end、variable consistency、conditions、nagiCall context、ID uniqueness、chapter sections、ending judgement、bg assets、ending path reachability、ending title consistency、sub-node FN chain integrity

---

## 待 PM 确认事项

1. **distance 阈值范围**: 拆分后玩家 distance 范围约 -4 ~ +19。当前阈值 BAD: `badLock===true`, TRUE: `distance<=3`。TRUE 路径 A 中 distance=-1，BAD 路径 D 中 distance=3（来自 bad_cold+2 和 club_media+1）。阈值是否需要调整？

2. **narrativeDistance 用途**: 当前不参与任何判定，仅作为记录。未来是否需要用于 UI 表现（如"距离感"视觉效果）？
