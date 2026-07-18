# PM Review - Android UI Real Device Reject

日期：2026-07-18  
负责人：PM 一一  
来源：Ant大小姐实机截图反馈  
关联任务：`TASK-20260717-013`、`TASK-20260717-015`  
结论：当前 Android UI 实机效果不通过，不能转 `done`。

---

## 1. 截图结论

Ant大小姐提供的实机截图显示：当前 Android 实现与 `00_harness/08_authority_current/04_ui/` 中的最新 UI authority 仍存在明显偏差。

### 1.1 HUD 不通过

问题：

- back / auto / save / backlog 图标按钮已经有 backing，但视觉变成了偏厚、偏重的深色八角按钮。
- title chip、icon button、action chip 虽然形式上统一，但整体厚重感、阴影和不透明度超出“final glass HUD 轻玻璃”方向。
- 在亮背景下可见性提高了，但代价是失去轻薄玻璃语言。

权威依据：

- `XoXo_UI_Final_MinSpec_20260712.md` section 15.1：icon button 是 `36 x 36` 轻玻璃底，背景为 `rgba(15,24,39,0.30)` 到 `rgba(15,24,39,0.18)` 的轻渐变，不是厚按钮。
- Android fallback 允许半透明深色渐变 + 1dp 描边 + shadow，但不得改成实心黑按钮、纯白按钮或 Material 默认按钮。

PM 判断：当前实现属于“过度加重 fallback”，不通过。

### 1.2 Dialog 不通过

问题：

- 跳过本节弹窗从可读性角度可用，但视觉仍不像已确认的 final light glass dialog。
- 卡片面积、暗度、边框与 scrim 叠加后显得厚重，接近“大块半透明深色面板”。
- 背景与弹窗层次存在，但缺少 final authority 中更轻、更精致的 glass language。

权威依据：

- `XoXo_UI_Final_MinSpec_20260712.md` section 16.5：设计方向仍是 final light glass dialog。
- Android no-real-blur fallback 可使用 `rgba(27,36,54,0.56)` card 与 `rgba(9,14,24,0.38)` scrim，但明确禁止为了可读性牺牲 final glass language。

PM 判断：当前实现虽然不再是 80% 实底，但视觉仍未达到 authority，需要回修；后续开发任务必须强调“最终视觉必须轻，不是只满足 alpha 数字”。

### 1.3 Speaker name

截图中 speaker name 有轻衬底和金色方向，但在亮背景下仍偏弱，需要实机继续确认：

- 保留 `#E4CA8F` 金色方向；
- 可以增强 text shadow / halo 或轻衬底分离度；
- 不得扩大成厚 name plate 或整条黑底。

---

## 2. PM 对执行质量的判断

这不是单个参数小误差。当前问题反复出现在：

1. yiyi 能按字段和 token 实现，但经常只对齐“数值”，没有对齐“视觉意图”。
2. 设计语言从“裸线不可见”被修成“厚重按钮”，属于从一个极端跳到另一个极端。
3. Dialog 多轮回修后仍未稳定贴近 authority，说明需要更强的 PM/UI gate。

PM 决策：

- 暂不立刻替换 yiyi 的全部 Android 开发职责。
- 但暂停 yiyi 对 UI 的自由发挥和自由调参。
- 后续 UI 修正只允许按 PM / XoXo 给出的明确视觉 acceptance checklist 做机械实现。
- 下一轮 UI 实机仍明显偏离 authority，则建议更换 Android UI 实现人，yiyi 只保留引擎、数据、构建、资源接入等非视觉任务。

---

## 3. 当前任务状态修正

- `TASK-20260717-013`：仍为 `review`，但 PM 实机复核不通过，需要 rework。
- `TASK-20260717-015`：仍为 `review`，但 PM 实机复核不通过，需要 rework。
- 不允许把当前截图状态视为完成。

---

## 4. 下一步建议

新增任务：`TASK-20260718-004 Android UI authority implementation rework / ownership gate`

目标：

1. yiyi 或新 Android UI 开发必须先读取：
   - `00_harness/08_authority_current/04_ui/NagisHeart_UI_Authority_XoXo_v1_0.html`
   - `00_harness/08_authority_current/04_ui/XoXo_UI_Final_MinSpec_20260712.md` section 15 / 16.5
   - 本 PM reject review
2. 开发前输出差异表：当前 Android 实现、authority target、要改的文件、不改的范围。
3. 实现后必须回传真机截图：亮背景 HUD、暗背景 HUD、跳过本节 Dialog、speaker name 在亮背景与复杂背景下的可读性。
4. PM / Ant 通过前，不得转 `done`。

Cleanup status：none。本轮不删除资源。

