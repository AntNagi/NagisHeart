# DeDe Web QA 取证：TASK-20260726-002 / TASK-20260726-003

- 日期：2026-07-28
- QA：DeDe（Web-only 取证）
- 仓库：`D:\Nagi's Heart\NagisHeart`
- 测试版本水印：`#cc033dd · 07-28 00:21 +未提交`
- 测试入口：`http://127.0.0.1:3000/web/`（独立 origin，用于无存档前置条件）
- Code touched: no
- Cleanup status: none

> 口径：本文只记录可复现事实。视觉是否最终合格由 PM 汇总、Ant 抽查。

## 1. 开工与工具记录

- 【已验证】`git pull`：`Already up to date.`
- 【已验证】`powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1`：全部 authority 条目 `OK`，结尾 `AUTHORITY CHECK PASSED.`
- 【已验证】`node tools/ui-check.js` 不可用：进程立即退出，`Error: Cannot find module 'puppeteer'`，exit code 1。
- 按 `DEC-20260727-002` 与 `ROLE_QA.md`，上述为工具问题，不作为 TASK-20260726-002/003 的业务失败；本轮改用人工复现与截图取证。

## 2. 取证结果表

| 任务 / 验收点 | 机械结果 | 实际事实 | 证据 |
|---|---|---|---|
| 002：主页系统级三层暗层 | PASS（computed style） | `.start-screen-overlay` 实际为白色高光 + 径向暗角 + 垂直暗层三层 background-image，参数与 `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §1 一致 | 本报告 §3.1；`home_no_save_393x852.png`、`home_no_save_430x932.png` |
| 002：主页“继续故事 / 读取存档进度”文字 | OBSERVED | 有默认进度的 `localhost` origin 中，两项实际显示，颜色均为 `rgb(247,249,252)`、opacity 1；截图中可辨认 | `home_with_continue_app430x720.png` |
| 002：存档页返回按钮在亮背景上 | NEEDS ANT VISUAL CHECK | DOM 中按钮未禁用、可见区域 `36x36`、颜色 `rgb(247,249,252)`；但两张精确移动截图的顶部亮色区域中，箭头轮廓几乎无法辨认 | `save_empty_393x852.png`、`save_empty_430x932.png` |
| 002：存档页空状态次要文字 | OBSERVED | 两行均显示，颜色 `rgb(247,249,252)`；截图中可读 | 同上 |
| 003：无手动存档时主页“存档进度”可点 | PASS（行为） | 按钮 count 1、`disabled=false`；点击后出现“存档进度 / 选择进度”页面 | 本报告 §3.2 |
| 003：无手动存档空状态 | PASS（行为/DOM） | 显示“还没有手动存档。 / 你可以在剧情中随时保存。”；`.save-slot-row` 数量为 0；未观察到弹窗/toast 或空白槽 | 两张 `save_empty_*` 截图 |
| 移动端 393x852 | PASS（尺寸/交互） | `window.innerWidth=393`、`innerHeight=852`、`#app=393x852`；入口可点、空状态可达 | `home_no_save_393x852.png`、`save_empty_393x852.png` |
| 移动端 430x932 | PASS（尺寸/交互） | 同一 tab 调整后 `window.innerWidth=430`、`innerHeight=932`、`#app=430x932`；入口可点、空状态可达 | `home_no_save_430x932.png`、`save_empty_430x932.png` |
| Console error/warn | PASS（日志） | `tab.dev.logs({levels:['error','warn']})` 返回 `[]` | 本报告 §4 |

## 3. 逐条复现

### 3.1 TASK-20260726-002：系统页暗层与文字/返回入口

现象：主页暗层已呈三层结构；主页操作文字显示；存档空状态文字显示。存档页顶部返回箭头的 DOM 可点击，但截图中在亮背景上几乎无法辨认。

复现：

1. 启动 `node web/serve.js`。
2. 浏览器设置为 `393x852`，打开 `http://127.0.0.1:3000/web/`。
3. 点击 Start，进入无存档主页。
4. 截图并读取 `.start-screen-overlay` computed `background-image`。
5. 点击“存档进度”，观察顶部返回按钮与两行空状态文字。
6. 在同一 tab 切换为 `430x932`，重复截图。
7. 另用已有默认进度的 `http://localhost:3000/web/` 打开主页，观察“继续故事 / 读取存档进度”。

实际：

- `.start-screen-overlay`：
  - `linear-gradient(rgba(255,255,255,0.04), transparent 18%, transparent 70%, rgba(255,255,255,0.02))`
  - `radial-gradient(at 50% 38%, transparent 0 18%, rgba(19,32,51,0.38) 62%, rgba(19,32,51,0.72) 100%)`
  - `linear-gradient(rgba(19,32,51,0.52), rgba(19,32,51,0.34) 42%, rgba(19,32,51,0.78))`
- 无默认进度 origin：主页未显示“继续故事”，符合 `authority/product/NagisHeart_PRD_v2_0.md` §20.1 的显示条件。
- 有默认进度 origin：显示“继续故事 / 读取存档进度”，两项 computed color 均为 `rgb(247,249,252)`、opacity 1。
- 存档页返回按钮：`disabled=false`，rect `x=14,y=4,w=36,h=36`，computed color `rgb(247,249,252)`；截图顶部仍难以辨认箭头。
- 空状态两行文字 computed color 均为 `rgb(247,249,252)`，实际可读。

权威：

- `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §1：系统级页面采用三层暗层，并规定主/次/弱文字色。
- 同文件 §5：主页叠系统级暗层，主/次操作文字遵循指定颜色；“存档进度”可见可点。
- 同文件 §22.3：存档空状态沿用系统级背景暗层、保留返回入口。

等级：【已验证】（浏览器人工复现、computed style、截图）。

### 3.2 TASK-20260726-003：无手动存档入口与空状态

现象：无任何存档的独立 origin 中，“存档进度”入口可点击；点击后进入存档空状态，未渲染空白槽。

复现：

1. 使用未产生存档的 `http://127.0.0.1:3000/web/`。
2. Start -> 主页。
3. 定位 button“存档进度”，记录 count/disabled。
4. 点击该按钮。
5. 读取空状态文字与 `.save-slot-row` 数量。

实际：

- 按钮 count：1。
- `disabled=false`。
- 点击后出现：标题“存档进度”、heading“选择进度”。
- 文案：`还没有手动存档。` / `你可以在剧情中随时保存。`
- `.save-slot-row`：0。
- 未观察到自动创建存档、错误弹窗、toast 或留在主页无响应。

权威：

- `authority/product/NagisHeart_PRD_v2_0.md` §20.1/§20.2。
- `authority/interaction/NagisHeart_Interaction_Design_v1_0.md` §23.3/§29.2。
- `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` §5/§22.3。

等级：【已验证】（两个精确移动视口人工点击与 DOM 取证）。

## 4. Console / Resource

- Console error/warn：`[]`。
- 入口脚本 `web/src/main.js` 已挂载。
- 14 个 CSS 样式表已挂载。
- Start/主页关键图片均 `complete=true`、natural size `1080x1920`。
- Browser 当前接口未提供完整 HTTP request/status 列表；未虚报全量 200。已观察资源均完成，Console 未出现 404/error。

## 5. 截图/证据路径

目录：`00_harness/05_reports/validation/web_qa_dede_002_003_20260728/`

- `home_no_save_393x852.png`
- `save_empty_393x852.png`
- `home_no_save_430x932.png`
- `save_empty_430x932.png`
- `home_with_continue_app430x720.png`（已有默认进度 origin；实际 app 430x720，未标成精确 430x932）

附注：目录中另有一次中间截图 `home_with_continue_430x932.png`，其实际 runtime 为 1280x720 / app 430x720；正式引用以上述 `home_with_continue_app430x720.png` 为准。

## 6. 未覆盖项

- 未做 Android 测试。
- 未覆盖章节目录、回忆画廊、系统设置等其他系统级页面的完整人工遍历；本轮严格限定 002/003 指定主页与存档流程。
- 未制造手动存档后复测非空存档列表；本轮前置条件是“无手动存档”。
- UI 体检脚本因缺少 `puppeteer` 无法运行；已人工复现，不将工具错误归因于业务。
- 存档页返回箭头的最终视觉可接受性留给 PM/Ant 依据截图抽查。

