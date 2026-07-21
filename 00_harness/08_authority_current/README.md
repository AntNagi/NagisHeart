# 本目录已退役（2026-07-21）

权威文档快照机制已废止：副本必然漂移（本快照三天内即与源文件双向不一致，实证见 feibo 2026-07-21 诊断）。

**当前唯一权威入口：仓库根目录 `authority/`，清单与铁律见 `authority/MANIFEST.md`。**

- 七份权威文档 + 节点匹配表：`authority/`
- KV 资产包（Start V23、Icon V4 safezone）：`design/authority/icon_start_tt/`（受 MANIFEST 同等约束）
- 校验：`powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1`

旧快照内容已整体归档至 `00_harness/99_archive/authority_current_retired_20260721/`，仅供历史追溯，禁止作为开发依据。任何仍指向 `08_authority_current/` 的旧任务单、review、handoff 文档中的路径均已过期，一律以 `authority/` 为准。
