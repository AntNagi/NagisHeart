# Nagi's Heart PM Project Context Brief

> Owner: PM 一一  
> Date: 2026-07-11  
> Purpose: 一一先统一项目事实源，再向设计、开发、测试收集最新进度，减少信息差。

## 1. Current Working Areas

| Area | Path | Notes |
|---|---|---|
| PM / 剧情设计资料 | `D:\Nagi‘s Heart` | 当前 Codex PM 工作区，含 Design V3.1、SCRIPT V14、QA 冒烟、截图、PM 协作文件 |
| Android 工程 | `D:\Nagi's Heart\NagisHeart` | 注意这里是英文直引号 `'`，不是 PM 工作区的弯引号 `‘` |
| 旧 Web 原型 | `D:\Nagi-otome` | `.claude/launch.json` 指向这里的 `http-server` |

## 2. Product Baseline

Nagi's Heart 是单男主日乙视觉小说，不是国乙养成、抽卡、数值战斗或多男主卡池产品。

核心循环：

```text
剧情阅读 -> 关键选择 -> 变量累积 -> 路线分歧 -> 结局达成 -> 图鉴 / 回想 / 二周目回收
```

体验核心：

```text
玩家如何爱 Nagi。
玩家是否真正看见他。
玩家的爱是否让 Nagi 更成为 Nagi。
```

移动端竖屏是主版本。Web 可独立实现，但产品规则必须一致。

## 3. Required Source Documents

| Type | File | Why It Matters |
|---|---|---|
| PRD | `D:\Nagi's Heart\NagisHeart\design\NagisHeart_PRD_v2_0.md` | 产品定位、MVP、页面结构、验收标准 |
| Interaction | `D:\Nagi's Heart\NagisHeart\design\NagisHeart_Interaction_Design_v1_0.md` | 页面流程、交互规则、移动端适配、MVP 交互验收 |
| Story Design | `D:\Nagi‘s Heart\NagisHeart_Design_V3_1_Latest.md` | 当前剧情结构、变量、分流、结局判定 |
| Android Handoff | `D:\Nagi's Heart\NagisHeart\ANDROID_DEV_HANDOFF.md` | Android 工程、数据驱动架构、StoryEngine 说明 |
| Tech Tasks | `D:\Nagi's Heart\NagisHeart\design\TECH_TASKS_v1.1.md` | 底层规则任务拆解，MVP / Phase 2 / Phase 3 边界 |
| UI Design | `D:\Nagi's Heart\NagisHeart\design\XoXo_P0_HiFi_UI_Review_v1_1.md` | XoXo 对 P0 HiFi UI 的设计判断 |
| QA Audit | `D:\Nagi's Heart\NagisHeart\QA_Design_Compliance_Audit_Laud_v1.md` | Laud 对 yiyi latest 的设计实现审计 |
| PM Board | `D:\Nagi‘s Heart\PM_SYNC_BOARD.md` | 当前 PM 阻塞项和协作规则 |

## 4. MVP Baseline From PRD / Interaction

MVP 至少应覆盖：

1. 启动 / 主页。
2. 名字设置。
3. 开场白 / Prologue。
4. 第一部主线 `Prologue -> p1 -> p2 -> c1a -> c1b -> u20j`。
5. 选择出现、选择反馈、变量效果、路由推进。
6. 四结局基础达成。
7. 自动存档 / 手动存档 / 读取。
8. Backlog 可打开并记录已播放文本。
9. 章节地图基础入口。
10. 图鉴 / Gallery 基础入口与锁定态。
11. 设置页基础项。

重要边界：

- `TECH_TASKS_v1.1.md` 将 LINE 特殊演出降为 Phase 2：MVP 保留 `mode` 字段，遇到 `line` 可降级为 VN 播放。
- 但 PRD / Interaction 仍把 LINE 视作重要产品体验。各角色回报时必须说明自己采用的是 MVP 口径还是完整 PRD 口径。

## 5. Current Known Evidence

| Source | Current Conclusion |
|---|---|
| `Nagi_Heart_Android_Smoke_QA_2026-07-10.md` | 旧安装包中 AND-001/002/003/004/005 存在 |
| `PM_AGENT_OUTBOX\qa_reply_20260711_1315.md` | 当前模拟器包仍未通过默认名、Prologue、debug label 等复验；但可能不是最新源码 |
| `PM_AGENT_OUTBOX\design_reply_20260711_1327.md` | XoXo 认为五项首体验问题均需本轮修复 |
| `D:\Nagi's Heart\NagisHeart\QA_Design_Compliance_Audit_Laud_v1.md` | Laud 另发现 HUD/Menu/Auto/Skip/nagiCall/Backlog/视觉等更大范围问题 |
| `D:\Nagi's Heart\NagisHeart` git status | Android 工程存在大量未提交新增/修改文件，说明各方工作已经推进但未统一收口 |

## 6. Current Open Questions

1. yiyi 最新源码与模拟器已安装包是否一致？
2. Laud 的最新审计是否已经覆盖 yiyi 最新修复，还是覆盖旧 build？
3. XoXo 的 UI v1.1 是否已被 Ant老板确认采用？
4. DeDe 与 Laud 的测试分工是否重复，还是一个做产品 QA、一个做实现验收？
5. TT 是否只负责平面/图标/KV，还是也要纳入 P0 UI 验收？
6. 当前目标是“先过 Android vertical slice”，还是“P0 HiFi 全面验收”？

## 7. PM Intake Rule

所有角色请不要只说“已完成很多”或“基本 OK”。必须按 `PM_STATUS_INTAKE.md` 回填：

- 最新进度。
- 总进度百分比。
- 已完成证据。
- 未完成任务。
- 阻塞与依赖。
- 与其他人结论不一致的地方。
- 下一步需要 PM / Ant老板裁决的事项。

