# 任务板

> 用途：当前唯一正式任务源。  
> 原则：只有写进本文件、明确负责人和状态的事项，才算正式可执行任务。  
> 新任务追加在最上方。

---

### TASK-20260717-001
- 项目：NagisHeart
- 标题：接入 TT Start v23 分层开屏页
- 来源：Ant大小姐确认 TT 开屏页 OK / `DEC-20260717-001`
- 负责人：yiyi（Android 开发）
- 状态：ready
- 优先级：P0
- 当前动作：yiyi 按 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260717_START_V23_INTEGRATION.md` 接入 Android Start v23，并回写开发报告
- 涉及文件：`design/authority/icon_start_tt/start/`、Android Start 页相关实现文件、Android 资源文件
- 依赖：不依赖 App Icon 最终确认；不得扩大到 XoXo UI 合版或未确认页面
- 完成定义：Android 显示 TT v23 Start 海报入口；START 以 1.6s alpha 呼吸；透明点击热区进入既有叙事入口；旧五按钮菜单不出现在 Start poster；构建或阻塞原因有明确证据
- 最新更新时间：2026-07-17

### TASK-20260716-001
- 项目：NagisHeart
- 标题：判断 BGM 资源接入候选是否进入首版
- 来源：公司电脑工作区差异审计 / `WORKSPACE_DIFF_AUDIT_OFFICE_20260716.md`
- 负责人：cc（开发）
- 状态：ready
- 优先级：P1
- 当前动作：检查 `assets/bgm/bgm.mp3`、`android/app/build.gradle.kts`、`tools/validate.js` 是否应作为一组 BGM 接入改动保留并提交
- 涉及文件：`assets/bgm/bgm.mp3`、`android/app/build.gradle.kts`、`tools/validate.js`、`story-data/scene_visuals.json`
- 依赖：PM 已授权公司一一清理非技术遗留；技术接入由 cc 判断
- 完成定义：cc 明确结论为 `保留并提交` / `修改后提交` / `丢弃本地改动`，并说明原因
- 最新更新时间：2026-07-16

### TASK-20260715-002
- 项目：NagisHeart
- 标题：整理 App Icon 与 Start 页设计权威候选包
- 来源：Ant大小姐 2026-07-15 权威文件整理要求
- 负责人：TT（平面设计）
- 状态：review
- 优先级：P0
- 当前动作：Start v23 已确认可进入开发接入并已拆给 yiyi；App Icon 仍等待 Ant大小姐最终确认
- 涉及文件：TT 历史 icon / Start 页设计稿、底图、切图、预览与实现规范
- 依赖：Ant大小姐确认 Icon 五边形装饰强度及是否将 Icon/Start 整包提升为最终权威
- 完成定义：TT 自主选出候选权威版，并交付设计方案说明、预览效果图、底图、关键切图、完整尺寸与实现方法；历史版本与最终采用版关系可追溯
- 最新更新时间：2026-07-17

### TASK-20260715-001
- 项目：NagisHeart
- 标题：合并三份已确认 UI 设计为单一权威候选版
- 来源：Ant大小姐 2026-07-15 设计合版要求 / `DEC-20260715-001`
- 负责人：XoXo（主 UI 设计）
- 状态：review
- 优先级：P0
- 当前动作：XoXo 已按 `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_XOXO_20260717_UI_AUTHORITY_REVISION.md` 完成局部修订：开屏改用 TT 方案、主页去顶部标题、设置页小字/数值右置；其余页面保持通过，等待 PM / Ant 复核
- 涉及文件：三份指定 HTML 源文件、合版输出 HTML、合版记录
- 依赖：XoXo 完成局部修订后回报 PM；章节目录、大章结束页、小节结束页仍 pending
- 完成定义：输出单一可浏览权威候选 HTML 和逐页来源记录；已通过页面保持原设计；未通过/待确认页面未被擅自补写；完成两轮自检后回报 PM 一一
- 最新更新时间：2026-07-17

## 任务状态

- `pending`：已记录，但暂未进入可执行状态
- `ready`：已澄清，可以开始执行
- `in_progress`：已有明确负责人正在做
- `blocked`：被阻塞，需要额外输入或条件
- `review`：执行已完成，等待 PM / QA / 设计复核
- `done`：已确认完成

---

## 字段说明

- `任务编号`：建议格式如 `TASK-20260715-001`
- `项目`：默认填 `NagisHeart`
- `标题`：一句话说明任务是什么
- `来源`：来自哪条输入、哪次决策或哪份交班
- `负责人`：PM / 设计 / 开发 / 测试中的具体角色
- `状态`：必须使用上面的 6 个状态之一
- `优先级`：`P0` / `P1` / `P2`
- `当前动作`：当前这轮要做的单个受控小步骤
- `涉及文件`：最小必要文件范围
- `依赖`：没有写 `无`
- `完成定义`：达到什么条件算这一任务完成
- `最新更新时间`：最后一次刷新时间

---

## 任务模板

### TASK-YYYYMMDD-XXX
- 项目：NagisHeart
- 标题：
- 来源：
- 负责人：
- 状态：pending
- 优先级：P1
- 当前动作：
- 涉及文件：
- 依赖：无
- 完成定义：
- 最新更新时间：
