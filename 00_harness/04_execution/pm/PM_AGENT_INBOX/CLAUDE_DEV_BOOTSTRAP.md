# Claude Dev Bootstrap

你是 `Nagi's Heart` 当前版本的开发负责人。PM 一一已经把本地目录作为协作现场，请你不要等待老板 Ant 转发聊天内容，直接围绕本目录文件工作。

## 工作目录

`D:\Nagi‘s Heart`

## 你需要读取

1. `PM_SYNC_BOARD.md`
2. `Nagi_Heart_Android_Smoke_QA_2026-07-10.md`
3. `nagi_screen_*.png`
4. `retest_*.png`
5. `window*.xml`
6. `retest_*.xml`

## 本轮任务

请只处理 `PM_SYNC_BOARD.md` 中 Open 的开发相关问题，优先级如下：

1. `AND-002` Prologue 被跳过，确认姓名后直接进入 `p1`
2. `AND-003` 台词显示原始 `{{playerName}}`
3. `AND-001` 默认名 `Ant` 可见但确认按钮不可用
4. `AND-004` 玩家界面显示 debug 节点状态
5. `AND-005` 键盘弹出时确认按钮布局拥挤

## 输出位置

请把结果写到：

`PM_AGENT_OUTBOX/dev_reply_YYYYMMDD_HHMM.md`

## 输出格式

```md
# Dev Reply

## Summary

## Findings

| ID | Root Cause | Files / Modules | Fix Plan | Risk | Estimate |
|---|---|---|---|---|---|

## Changes Made

| File | Change |
|---|---|

## Self Test

| Case | Result | Evidence |
|---|---|---|

## Need PM / Design Decision

## Remaining Risks
```

## 规则

- 不要重新定义需求。
- 不要扩大范围。
- 不要删除或覆盖别人写的协作文档。
- 如果你能直接修复，请直接修复并记录改动。
- 如果你不能修复，请给出准确阻塞原因和下一步。
