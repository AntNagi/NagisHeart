# Task to TT - Start v23 Long Screen V2 Font Rework

- 时间：2026-07-17
- From：PM 一一
- To：TT（平面设计）
- 任务：`TASK-20260717-003`
- 优先级：P0
- 来源：Ant大小姐视觉反馈 / `DEC-20260717-008`

## 结论先行

V2 的“真全屏构图适配”方向比 V1 正确，但当前 V2 视觉不通过，原因有两项：

1. 字体 / 标题层 / START 字感变了；
2. 构图裁切也变了，Nagi 的下巴没有按已确认画面关系完整展示出来。

Ant大小姐明确反馈：“怎么字体全变了！！打回去打回去！”

这次不能把问题理解成“全屏裁切不行”。正确理解是：

- 真全屏构图方向保留；
- 但标题、START、字幕等文字层必须保持已确认 Start v23 的字体和层效果；
- 不允许因为长屏适配导致字体观感变成另一套。
- 即便使用原图重新裁切，也必须把 Nagi 的下巴展示出来，不能只保眼睛和脸部近景而切掉关键下巴轮廓。

## 必改内容

1. 保留 1080x2400 真全屏构图，不回退到 V1 的上下毛玻璃 / 模糊延展。
2. 标题 `Nagi's Heart` 的字体、描边、阴影、比例、质感必须回到已确认 Start v23。
3. `Blue Lock:`、装饰线、小方块、`START`、`Tap to start` 的字感也必须与已确认 v23 保持一致。
4. 若 V2 当前 PNG preview 与 SVG layer 渲染不一致，必须以已确认 v23 的 SVG / 字体层为准，重新输出 V3 preview。
5. 不要重新设计字体，不要换标题样式，不要把长屏适配做成另一套视觉 identity。
6. 调整长屏 crop / framing，确保 Nagi 的下巴在长屏画面中被展示出来，并尽量保留已确认 Start v23 中脸部、下巴、START 的关系。

## 交付要求

请在 `design/authority/icon_start_tt/start_long/` 下新增 V3，建议目录：

`design/authority/icon_start_tt/start_long/v3/`

必须交付：

- 1080x2400 长屏底图 / 背景
- 1080x2400 标题 SVG 层
- 1080x2400 START 静态 SVG 层
- 1080x2400 START breathing SVG fallback
- 1080x2400 静态预览
- 手机框预览
- V3 规范补充
- V3 manifest
- V3 self-check
- 回报 PM 的 status 文件

## 禁止事项

- 不要使用 V1 上下毛玻璃 / 模糊延展。
- 不要更换已确认 Start v23 字体 / 字感。
- 不要修改 App Icon。
- 不要修改 XoXo final UI authority。
- 不要修改 Android 代码。
- 不要删除旧资源。

## 完成定义

Ant大小姐看到 V3 时，应同时满足：

1. 图片是布满屏幕的真长屏适配；
2. 字体 / 标题 / START 仍然是已确认的 Start v23 视觉语言，不像换了一套字体；
3. Nagi 的下巴被展示出来，长屏裁切不破坏已确认的人物焦点关系。
