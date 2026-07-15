# Status Intake - Design TT

## 1. My Scope

- 我负责什么：开屏海报平面成品，包含单张底图、顶部标题艺术字、START 文字型操作、最终 1080x1920 PNG。
- 我不负责什么：首页 / 主菜单 UI，Android 接入实现，开发端叠字。
- 当前口径：独立开屏页，不是首页；只有 START；标题必须烘焙进 PNG。

## 2. Latest Progress

| Item | Status | Evidence |
|---|---|---|
| 读取最新 brief | Done | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\brief_to_tt_opening_poster_20260711_1509.md` |
| 用户补充参考 | Done | 参考图重点已吸收：`Blue Lock:` 小字 + 顶部超大 `Nagi's Heart`，但不采用粉色主题、不做 START 按钮 |
| 主推版 | Done | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_v15_main_remeet_1080x1920.png` |
| 尺寸校验 | Done | 1080x1920, RGB, PNG |
| 旧版处理 | Done | v1-v14 均视为过程稿；不建议接入 Android |

## 3. Deliverables

| Version | Recommendation | Base Image | Output Path | Notes |
|---|---|---|---|---|
| `v15_main_remeet` | 主推 | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\remeet.jpg` | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_v15_main_remeet_1080x1920.png` | 全屏底图；顶部 `Blue Lock:` + 大标题 `Nagi's Heart`; START 为文字型，无按钮框 |

## 4. Remaining Work

| Priority | Task | Owner | Dependency | Estimate |
|---|---|---|---|---|
| P0 | Ant / XoXo 确认 v15 是否通过 | Ant / XoXo | 查看主推 PNG | 5-10 分钟 |
| P0 | 接入 Android 开屏 | yiyi | PM 确认采用 v15 后，以新文件名加入 assets 并更新 `SplashScreen.kt` | 10-20 分钟 |

## 5. Known Issues / Risks

| ID | Issue | Severity | Evidence | Suggested Next Step |
|---|---|---|---|---|
| TT-OPEN-004 | `remeet` 本身是脸部近景，开屏气质偏冷静凝视，不是全身 KV | P1 | `remeet.jpg` | 若 Ant 要更正式的乙女开屏，可后续再换全身/半身干净底图 |
| TT-OPEN-005 | v15 尚未接入 Android | P0 | 文件仍在 `PM_AGENT_OUTBOX` | yiyi 接入后再验收 |

## 6. Need PM / Ant Decision

| Decision Needed | Options | Recommendation | Why |
|---|---|---|---|
| 是否采用 v15 | A. 采用；B. 微调标题；C. 换底图 | 推荐 A 或 B | 已符合“顶部大标题 + remeet 全屏底图 + 非粉色 + 非按钮 START”的最新要求 |
| Android 接入方式 | A. 覆盖旧开屏；B. 新增 v15 文件并改引用 | 推荐 B | 保留旧图便于回滚 |

## 7. Next 3 Actions

1. Ant / XoXo 查看 `opening_poster_v15_main_remeet_1080x1920.png`。
2. 若只需微调，请明确是标题大小、标题位置、装饰符号、还是 START 层级。
3. 确认通过后交 yiyi 接入 Android 开屏。
