# Task to TT - Start v23 Long Screen Rework

- 时间：2026-07-17
- From：PM 一一
- To：TT（平面设计）
- 任务：`TASK-20260717-003`
- 优先级：P0
- 依据：Ant大小姐实机视觉反馈 / `DEC-20260717-006`

## 结论先行

当前 `design/authority/icon_start_tt/start_long/` 的 1080x2400 长屏包，PM 技术核验通过，但 Ant大小姐实机视觉不通过，不能作为 final 长屏开屏资源交给 yiyi 接入。

主要问题：它看起来像把 1080x1920 中心画面放在长屏中，再在上下补一层毛玻璃 / 模糊延展。这不是 Ant 要的“图片布满屏幕的适配”。

## Ant大小姐明确要求

要的是“图片本身布满屏幕的长屏适配”，不是上下加毛玻璃、模糊条、背景补丁。

## 请 TT 重做 / 优化的方向

1. 输出真正 1080x2400 全屏构图版本。
2. 不能出现明显上下毛玻璃条、灰色糊边、补丁感区域。
3. 保留已确认的 Start v23 核心气质：
   - `Nagi's Heart` 标题仍然是当前方向；
   - Nagi 脸部焦点不能被裁坏；
   - START 不要漂到奇怪位置；
   - 整体仍是开场海报入口，而不是系统菜单页。
4. 可以重新扩图、重构背景或重新取景，但不能只把原 9:16 图塞进长屏再糊上下边。
5. 继续提供 Android 可执行说明：
   - 1080x2400 preferred long-screen asset group；
   - 1080x1920 作为 9:16 fallback；
   - 背景 / 标题 / START 分层资源；
   - START hit area px 与比例；
   - START 仍由开发做原生 alpha 呼吸。

## 交付要求

请在 `design/authority/icon_start_tt/start_long/` 下新增或替换为 v2 文件，并明确不要覆盖已提交记录的可追溯性。建议文件名带 `_v2` 或新增 `v2/` 子目录，避免与当前未通过的 v1 混淆。

必须交付：

- 1080x2400 长屏底图
- 1080x2400 标题 SVG 层
- 1080x2400 START 静态 SVG 层
- 1080x2400 START breathing SVG fallback
- 1080x2400 静态预览
- 手机框预览
- v2 规范补充
- v2 manifest
- v2 self-check
- 回报 PM 的 status 文件

## 禁止事项

- 不要修改 App Icon。
- 不要修改 XoXo final UI authority。
- 不要修改 Android 代码。
- 不要删除旧资源。
- 不要把上下毛玻璃 / 模糊延展继续作为最终解决方案。

## 完成定义

Ant大小姐看到长屏预览时，应感到它是一张完整的长屏开屏图，而不是 9:16 图上下补糊边。
