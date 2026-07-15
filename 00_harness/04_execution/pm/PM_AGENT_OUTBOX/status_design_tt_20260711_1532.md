# Status Intake - Design TT

## 1. My Scope

- 我负责什么：本轮只负责《Nagi's Heart》开屏海报平面成品，包含底图选择、画面调色、标题艺术字、START 操作文字、最终 1080x1920 PNG 输出。
- 我不负责什么：首页 / 主菜单 UI、Continue / Chapter / Gallery / Settings 等系统入口、Android 接入实现、Compose 浮层文字实现。
- 我当前采用的口径：XoXo `brief_to_tt_opening_poster_20260711_1509.md`。本次是“开屏海报”，不是首页。

## 2. Latest Progress

| Item | Status | Evidence |
|---|---|---|
| 读取 XoXo 开屏 brief | Done | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\brief_to_tt_opening_poster_20260711_1509.md` |
| 候选底图筛选 | Done | 候选范围按 brief：`pillow`、`nagi_with_cat`、`birthday_crown`、`hug`、`remeet`; contact sheet: `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_candidates_contact_sheet.jpg` |
| 主推版开屏海报 | Done | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_v1_main_pillow_1080x1920.png` |
| 尺寸校验 | Done | 已用 Pillow 校验：`1080 x 1920`, `RGB`, PNG |
| Android 工程接入 | Not Started | 目前未覆盖 `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\poster_start_nagis_heart_keyart.png`; 需要 yiyi 或 PM 确认后替换 / 新增映射 |

## 3. Deliverables

| Version | Recommendation | Base Image | Output Path | Notes |
|---|---|---|---|---|
| `v1_main_pillow` | 主推 | `D:\Nagi's Heart\NagisHeart\android\app\src\main\assets\bg\pillow.jpg` | `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_v1_main_pillow_1080x1920.png` | 竖版整页海报；`Nagi's Heart` 已作为标题艺术字烘焙进 PNG；仅保留 `START` 和弱化 `Tap to start` |

## 4. Overall Progress

- 总进度：85%
- 已完成：主推版开屏海报 PNG；标题艺术字烘焙；START 文字型操作；无 Continue / Chapter / Gallery / Settings；尺寸已校验。
- 进行中：等待 XoXo / Ant 老板确认是否采用 `v1_main_pillow`。
- 未开始：确认后交 yiyi 接入 Android，替换现有开屏图或以新文件名接入 `SplashScreen.kt`。
- 我认为当前是否能进入下一阶段：Yes for visual review；No for Android final，因为尚未接入工程。

## 5. Remaining Work

| Priority | Task | Owner | Dependency | Estimate |
|---|---|---|---|---|
| P0 | XoXo / Ant 老板确认主推版是否通过 | XoXo / Ant | 查看 `opening_poster_v1_main_pillow_1080x1920.png` | 5-10 分钟 |
| P0 | 将确认后的 PNG 接入 Android 开屏 | yiyi | PM 指定替换现有 `poster_start_nagis_heart_keyart.png` 还是新增版本文件 | 10-20 分钟 |
| P1 | 如不通过，最多补 1-2 张不同底图备选 | TT | 需要明确否决原因：底图、标题位置、色调、START 层级 | 每张 20-30 分钟 |

## 6. Known Issues / Risks

| ID | Issue | Severity | Evidence | Suggested Next Step |
|---|---|---|---|---|
| TT-OPEN-001 | 当前成品还未接入 Android，不能算工程交付完成 | P0 | 输出在 `PM_AGENT_OUTBOX`，未写入 Android assets | PM 确认后由 yiyi 接入 |
| TT-OPEN-002 | 标题艺术字使用本地排版烘焙，若后续要改字形需要 TT 重新导出 PNG | P1 | 标题已烧进 `opening_poster_v1_main_pillow_1080x1920.png` | 采用图片成品，不让开发端叠普通字体 |
| TT-OPEN-003 | 是否使用 `pillow` 作为开屏主底图需要 XoXo / Ant 老板确认 | P1 | Brief 允许 `pillow`，TT 当前主推该底图 | 若觉得过于近景，可改用 `nagi_with_cat` 或 `remeet` 做备选 |

## 7. Conflicts With Others

- 本次没有继续沿用 Android 现有 `poster_start_nagis_heart_keyart.png`，因为 XoXo brief 要求重新明确“开屏海报”而不是首页 UI。
- 当前 TT 产物是完整 PNG 成品，不依赖 yiyi 在 Compose 上层叠标题或 START。
- 需要 PM 统一口径：接入时是直接替换现有 `poster_start_nagis_heart_keyart.png`，还是保留旧图并新增 `opening_poster_v1_main_pillow_1080x1920.png` 到 Android assets。

## 8. Need PM / Ant Decision

| Decision Needed | Options | Recommendation | Why |
|---|---|---|---|
| 是否采用主推版 | A. 采用 `v1_main_pillow`; B. 要 TT 出备选；C. 回到现有旧开屏图 | 推荐 A | 已符合 brief 的整页海报、标题烘焙、单 START、1080x1920 |
| Android 接入方式 | A. 覆盖旧 `poster_start_nagis_heart_keyart.png`; B. 新增文件并改 `SplashScreen.kt` 引用 | 推荐 B | 保留旧图可回滚，也能清楚标记版本 |
| 是否需要备选图 | A. 不需要；B. 追加 `nagi_with_cat`; C. 追加 `remeet` | 推荐 A，除非 Ant 老板觉得近景不合适 | brief 要优先 1 张主推，避免大量相似小改 |

## 9. Next 3 Actions

1. PM / XoXo / Ant 查看主推 PNG：`D:\Nagi‘s Heart\PM_AGENT_OUTBOX\tt_opening_poster\opening_poster_v1_main_pillow_1080x1920.png`。
2. 若确认通过，请 yiyi 以新文件名接入 Android 开屏，并把 `SplashScreen.kt` 引用从旧 `poster_start_nagis_heart_keyart.png` 切到新图。
3. 若不通过，请只给一个明确修改方向：换底图、调标题位置、调色调、或调 START 层级；TT 再补最多 2 张备选。
