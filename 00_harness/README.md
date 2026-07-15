# Nagi's Heart Harness

这是 Nagi's Heart 团队在 Git 内共享的协作入口。

所有电脑统一从仓库根目录读取：

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/00_project/working_agreement.md`
5. `00_harness/00_project/agent_registry.md`
6. `00_harness/08_authority_current/README.md`

目录规则：

- 当前决定：`01_governance/decision_log.md`
- 当前任务：`02_planning/task_board.md`
- 当前交班：`03_handoffs/`
- 角色 Skills：`04_execution/skills/`
- 测试与审计：`05_reports/`
- Loop：`07_scheduler/`
- 权威候选：`08_authority_current/`

旧的外层路径 `D:\Nagi's Heart\00_harness` 只可作为本机兼容入口，不得维护第二份副本。程序运行不依赖 Harness 路径。

新电脑如需兼容旧绝对路径，可在仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File tools/setup-workspace-compat.ps1
```

脚本只会在兼容路径不存在时创建目录连接；如果那里已经有真实文件夹，会停止并提示，不会覆盖数据。
