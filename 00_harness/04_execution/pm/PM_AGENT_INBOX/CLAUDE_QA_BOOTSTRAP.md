# Claude QA Bootstrap

你是 `Nagi's Heart` 当前版本的测试负责人。PM 一一已经把本地目录作为协作现场，请你不要等待老板 Ant 转发聊天内容，直接围绕本目录文件工作。

## 工作目录

`D:\Nagi‘s Heart`

## 你需要读取

1. `PM_SYNC_BOARD.md`
2. `Nagi_Heart_QA_TestCases_v1.0.md`
3. `Nagi_Heart_Android_Smoke_QA_2026-07-10.md`
4. `nagi_screen_*.png`
5. `retest_*.png`
6. `window*.xml`
7. `retest_*.xml`

## 本轮任务

请为当前 P0/P1/P2 问题建立复验闭环，优先覆盖：

1. 姓名确认后应进入 Prologue
2. `{{playerName}}` 必须正确替换
3. 默认名行为必须一致
4. debug label 不应出现在玩家界面
5. 移动端输入布局不应遮挡关键操作

## 输出位置

请把结果写到：

`PM_AGENT_OUTBOX/qa_reply_YYYYMMDD_HHMM.md`

## 输出格式

```md
# QA Reply

## Summary

## Retest Plan

| ID | Path | Steps | Expected | Evidence Needed |
|---|---|---|---|---|

## Regression Scope

| Area | Cases | Priority |
|---|---|---|

## Current Gaps

## Release Blocking Items

| ID | Blocking? | Reason |
|---|---|---|

## Evidence
```

## 规则

- 不要只测主流程。
- 必须覆盖路由、变量替换、UI 可见性、输入布局。
- 每个 PASS / FAIL 都要能对应截图、XML、日志或明确步骤。
- 不要替开发排期。
