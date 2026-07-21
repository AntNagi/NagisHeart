# yiyi 任务单 - 全量产品逻辑与阅读体验修正

> 发起人：PM 一一
> 接收人：developer yiyi
> 日期：2026-07-11 22:39
> 口径：全量产品，不是 MVP

## 1. 你这轮只负责什么

你这轮负责把当前 Android 实现纠正到 PM 最新确认口径上，并明确哪些已经改完、哪些依赖 XoXo 最终规范再落。

你不负责：
- 自己改产品逻辑
- 用旧的 Menu / Continue / Prologue 理解继续做
- 用“代码里已经有类似能力”代替正式闭环

## 2. 先读这些文件

1. `D:\Nagi‘s Heart\PM_PRD_SCRIPT_AUDIT_CONFIRM_20260711.md`
2. `D:\Nagi's Heart\NagisHeart\design\NagisHeart_PRD_v2_0.md`
3. `D:\Nagi's Heart\NagisHeart\design\NagisHeart_Interaction_Design_v1_0.md`
4. `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\status_dev_yiyi_20260711_1230.md`
5. `D:\Nagi‘s Heart\PM_AGENT_OUTBOX\status_qa_laud_20260711_1930.md`
6. 当前 Android 工程源码与 story data

## 3. 本轮必须处理的开发任务

### A. 首次进入 / 后续进入 / Continue Story / New Story 逻辑

必须改成以下正式规则：

- 首次进入唯一流程：
  `开屏页 -> 开场白页 -> 名字设置页 -> 第一章第一页剧情页`
- 后续进入：
  `开屏页 -> 主页`
- 没玩过时，不显示 Continue Story
- Continue Story 读取“上一次退出时的默认进度”
- New Story 重置默认进度，从第一章第一页重开
- New Story 不删除手动存档

请你核查并修正：
- 首页按钮显隐
- 默认进度持久化结构
- Continue Story 入口判定
- Start / Home / Game 之间的路由链路

### B. 手动存档与主页存档进度

必须闭环：
- 手动存档槽位至少 10 个
- HUD 点“存档”后进入手动存档槽列表，由玩家自己选择写入哪个槽
- 若目标槽已有内容，必须弹覆盖确认
- 完成后创建 / 更新手动存档
- 弹出“存档成功”
- 主页“存档进度”列表可见该存档
- 默认进度和手动存档分离，不能混用

### C. HUD 改口径

剧情页 HUD 必须改为：
- 左：返回
- 中：章节标题
- 右：自动播放 / 停止
- 右二：存档
- 最右：剧情回顾

本轮禁止继续保留旧 Menu 作为正式方案。

你需要落地：
- 返回逻辑
- 自动播放切换
- 存档成功反馈
- 剧情回顾入口与面板

### D. 剧情回顾

剧情回顾必须满足：
- 显示“当前小章节从开头到当前句”的全部已播内容
- 包含对白、旁白、玩家选择后的已展示内容
- 不显示未来内容
- 不补入“跳过本节”略过的未读内容

### E. 章节目录 / 单章节回看

这两个能力要和“剧情回顾”彻底分开：

- 章节目录：当前大章下全部小章节列表
- 单章节回看：对已完成或已跳过完成的小章节做完整回看

你需要确认并实现准备：
- 小章节状态枚举：未解锁 / 进行中 / 已完成 / 已跳过完成
- 目录点击行为
- 单章节回看不覆盖当前默认进度、不写入手动存档
- 回看结束后返回目录或原入口
- “跳过本节”中的“本节”正式定义为“当前小章节（section）”，不是整个大章

### F. 对话引号、内部跳转、占位符

必须修：
- 不要代码自动给对白加引号
- `->` 这类内部跳转不能渲染成玩家可见选项
- `{{playerName}}` 不能再裸露
- 任何存在合法 `speaker` 的台词行，一律视为人物对白
- `{{playerName}}` 是合法 `speaker`，与其他角色同级，不能被误判为旁白
- 只有无 `speaker` 行，才允许进入短旁白 / 长旁白 / 连续叙事块判定
- 连续叙事块一旦遇到任意 `speaker` 行，必须强制断开

关于 `nagiCall`，最新 PM 口径如下：
- 本轮先不做 `nagiCall` 设置
- 本轮先不做 `nagiCall` 替换链路
- 名字设置页只保留玩家名输入，不要出现 Nagi 称呼第二输入项
- 一一固定称呼 `Nagi少爷`
- 一一对玩家固定称呼 `Ant大小姐`
- `nagiCall` 相关能力从本轮开发主链移出，不作为本轮阻塞项继续实现

### G. 长旁白 / 短旁白 / 对白 的展示链路

本轮至少要把数据与渲染链路改到可支持正式规则：

- 对白、短旁白、长旁白三种展示模式可区分
- 连续旁白块可合并
- 长旁白可整页展示
- 长旁白超一屏时分页，不滚动
- 提供下一页引导

如果 XoXo 最终视觉细节未回，你也要先把：
- 数据结构
- 模式判断
- 分页机制
- 页面推进逻辑
先做好，不要等视觉稿才开始改底层。

### H. 章节开始页 / 章节结束页

现在不是单层“每章”，而是双层章节结构都要接入：
- 大章（篇 / 部）开始页、结束页
- 小章节（幕 / 节）开始页、结束页

你需要先确认：
- 路由节点如何接入
- 数据结构如何表达大章开始 / 结束页与小章节开始 / 结束页
- 结束页如何更新默认进度
- 结束页不等于手动存档，不弹“存档成功”
- “跳过本节”如何直接落到当前小章节结束页，并把 section 状态记为 skipped_completed

## 4. 你这轮必须给 PM 的输出

请把回信写到：

`D:\Nagi‘s Heart\PM_AGENT_OUTBOX\dev_reply_yiyi_fullscope_YYYYMMDD_HHMM.md`

格式如下：

```md
# yiyi Full Scope Dev Reply

## Summary

## Confirmed Understanding

## Must-Fix Items

| ID | Current Status | Files / Modules | Fix Plan | Dependency | Estimate |
|---|---|---|---|---|---|

## Data Structure Changes Needed

## Routing / Save Logic Changes Needed

## What I Can Implement Before Final Visual Spec

## What Must Wait For XoXo Final Spec

## Risks
```

## 5. 优先级顺序

请按下面顺序排：

1. 首次进入 / Continue Story / New Story / 默认进度逻辑
2. 手动存档与“存档成功”
3. HUD 改口径
4. 剧情回顾
5. 章节目录 / 单章节回看
6. 去引号、去 `->`
7. 长旁白模式与分页链路
8. 双层章节开始页 / 结束页接入

## 6. 边界要求

- 不要自己把“全量”降级回 MVP
- 不要再沿用旧 Menu 方案
- 不要把“源码里已有部分能力”当成任务完成
- 不要只说“能做”，要写清楚文件、模块、依赖和顺序
- 如果当前工程数据结构不够，直接讲清楚要加什么字段

## 7. PM 期望结果

我要的不是一句“收到”，而是：

“你已经按全量产品逻辑重新理解当前工程，并给出准确的实现顺序和阻塞项。”
