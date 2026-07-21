# yiyi Engine / Content Fix Batch 1

> 发起人：PM 一一  
> 接收人：developer yiyi  
> 日期：2026-07-13

## 先说明边界

这一轮你只处理：

- 程序 bug
- 解析 bug
- story-data / scene_visuals 接入错误
- 当前 Android 包与最新脚本不一致的问题

剧本设定与台词内容里能由 PM 直接修的部分，我已经先改进源数据了。你要做的是把工程里的实际运行链路纠正到最新数据和规则上。

## 你必须处理的问题

### A. 章节开始页点击失效

用户实机截图：
- `第一部 U-20日本代表战·被日本看见`
- 页面显示“轻触继续”，但实际点不动

请排查：
- 开始页容器是否被透明层挡住
- 点击热区是否没有绑定推进事件
- HUD / overlay / loading state 是否拦截 pointer input

### B. 选项解析错误

当前实机存在三类问题：

1. `→` 被渲染成了玩家可见选项  
   - 这是内部自动推进占位，不该显示

2. 部分选项把括号动作、心理描写直接当成选项文案  
   - 例如“（被他歪头看过来的样子击中，愣在原地）”

3. 出现空白 / 占位感选项  
   - 说明 choice 过滤逻辑不完整

请修正：
- `autoAdvance` choice 不可见
- 空 label / 占位 label / 纯内部过渡 choice 不渲染
- choice label 与 response text 的职责分开

### C. 剧情回顾 / Backlog 内容乱序、重复、错义

用户已明确指出：

- 剧情回顾里前后因果错了
- 出现重复段落
- 同一段混入不该出现的内容
- 某些 recap 把未来或其他分支的文案串进来

请排查并修正：
- Backlog 记录是否严格按“当前实际走过的节点顺序”追加
- choice response 是否被重复写入
- 切 scene / 切 section 时是否错误复用旧列表
- recap 是否误读了未走分支

### D. `speaker` / narration 识别规则

最新口径要同时满足两点：

1. 有合法 `speaker` 的正常台词，不能误判成旁白
2. 但如果台词内容本身只是括号里的动作 / 心理描写，剧本侧已经开始拆回旁白；程序不要再把这种格式继续污染成“角色名 + 大段括号”

当前你需要保证：

- 引擎不擅自加引号
- 引擎不把括号包装成额外对白样式
- 按最新 story-data 渲染，不要缓存旧节点文本

### E. 当前包与最新 story-data 不一致

PM 已直接修过这些内容源，请你确保工程实际读取的是最新版本：

1. 柠檬茶段落中，括号心理描写已拆为旁白，不应再显示成 `Nagi` 的对白
2. 初次来公寓时，一一应更早出场
3. `NEL` 开始前，不应提前知道完整机制
4. `前锋 / 首发` 不应再显示 `**MD**` 样式
5. `会长想让我去，是因为我好卖吧。` 这句已改口径，不要继续跑旧文案

### F. scene_visuals / 场景映射修正

按 Ant大小姐 最新口径落实：

1. `U-20日本代表战·被日本看见`
   - BG：`vs_u20_goal`

2. `聚少离多·从高光到...`
   - theme：`dark`

3. `5连回天`
   - BG：`bg_bad_impact_kick_cutin`

4. `景门来信`
   - BG：`living_room`

5. `前锋 / 首发 / MD 语境` 那段
   - BG：`bar`

## 重点文件

优先自查这些位置：

- `D:\Nagi's Heart\NagisHeart\story-data\nodes.json`
- `D:\Nagi's Heart\NagisHeart\story-data\scene_visuals.json`
- `D:\Nagi's Heart\NagisHeart\android\app\src\main\java\com\antnagi\nagisheart\ui\viewmodel\GameViewModel.kt`
- `D:\Nagi's Heart\NagisHeart\android\app\src\main\java\com\antnagi\nagisheart\ui\screen\GameScreen.kt`
- `D:\Nagi's Heart\NagisHeart\android\app\src\main\java\com\antnagi\nagisheart\ui\screen\BacklogScreen.kt`
- `D:\Nagi's Heart\NagisHeart\android\app\src\main\java\com\antnagi\nagisheart\ui\component\DialogueLayer.kt`

## 输出要求

请写回：

`D:\Nagi‘s Heart\PM_AGENT_OUTBOX\dev_reply_yiyi_engine_content_batch1_20260713.md`

格式建议：

```md
# yiyi Engine Content Batch 1 Reply

## Confirmed

## Fix Plan

| Issue | Root Cause | Files | Status |
|---|---|---|---|

## Data Synced

## Need Retest
```
