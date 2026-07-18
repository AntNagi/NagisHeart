# 执行循环

## 目标

围绕一个已分配任务，完成一个受控小步骤，并把工作区恢复到“已记录、可交班”的状态。

## 触发时机

出现以下任一情况时，执行一次执行循环：

- 某个任务被正式分配给执行者
- PM 更新了已有任务的范围或要求
- 原本阻塞的任务重新被解除阻塞

## 必读输入

按以下顺序读取：

1. `..\00_project\PM_PROJECT_CONTEXT_BRIEF.md`
2. `..\00_project\WORKSPACE_STRUCTURE.md`
3. `..\02_planning\` 下最新相关规划记录
4. `..\04_execution\pm\` 下最新的 PM 分派或说明文件
5. 影响该任务的最新决策或澄清
6. 完成以上之后，再读取当前仓库中最小必要范围的项目文件

## 步骤

1. 确认当前活跃项目，默认是当前 Git 仓库根目录。
2. 确认被分配的具体任务以及预期输出。
3. 确认哪些文件在范围内，哪些文件不在范围内。
4. 如果任务涉及 UI / 交互视觉实现，必须先执行“开发前 UI 权威核对”：
   - 读取 PM 任务中指定的 `..\08_authority_current\` 权威文件与章节；
   - 写清楚本次要实现的具体 UI 目标范围；
   - 写清楚预期效果；
   - 判断任务是“按权威实现”还是“发现权威缺口需回 PM/UI owner”；
   - 若权威缺失、冲突或只来自截图/聊天描述，先回报阻塞，不得自行设计。
5. 只执行一个受控小步骤，例如：
   - 分析一组问题
   - 更新一节规范
   - 实现一个修复切片
   - 核对一组资源映射
6. 对这一步做最小必要验证。
7. 回写以下内容：
   - 改了什么
   - 检查了什么
   - 还剩什么
8. 如果本轮改变了设计、交互、剧情、BG mapping、资源口径或技术规则，必须回写“权威同步状态”：
   - 是否需要同步到 `..\08_authority_current\`
   - 已同步到哪些 authority 文件
   - 若尚未同步，明确写“待 PM 同步/复核，不可交开发实现”
9. 如果本轮是开发 UI 实现，必须回写“UI 权威执行状态”：
   - 已读取的 authority_current 文件与章节；
   - 本次实际实现范围；
   - 与权威一致的点；
   - 无法精确实现的点及 fallback；
   - 需要 Ant 真机确认的点。
10. 每个执行任务收尾时，必须回写“清理 / 归档判断”：
   - 本轮是否新增临时文件、候选文件、旧资源替代品、重复资源或过期实现；
   - 是否发现活跃目录中存在容易误用的旧文件；
   - 建议清理 / 归档哪些路径；
   - 若执行者没有 PM 授权清理，只报告候选，不自行扩大范围清理。
11. 如果阻塞，写明：
   - 阻塞原因
   - 影响了哪些文件或任务
   - 需要什么具体输入才能继续
12. 除非 PM 明确扩充任务，否则不要顺着相邻问题继续往外做。

## 权威文件规则

执行者必须区分“草稿 / 交付包 / authority_current”：

- 设计者输出新 UI / 交互 / 资源规则时，必须说明是否已经同步到 `..\08_authority_current\`。
- 开发者实现时，默认读取 `..\08_authority_current\` 下的权威文件；不要直接按历史 handoff、旧草稿、聊天截图或单次状态报告实现。
- 如果 PM 分派任务引用了尚未进入 `08_authority_current` 的新设计，执行者应先回报阻塞并要求 PM 完成权威同步。
- 如果任务确实只是 candidate / review，不得在回复中称为 final authority。

## 开发前 UI 权威核对硬规则

开发者接到任何 UI 修改任务时，必须先确认：

1. PM 任务单是否指定了最新 authority_current 文件与章节。
2. 本次修改目标是否具体到页面 / 组件 / token。
3. 预期视觉效果是否可描述、可验收。
4. 禁止范围是否清楚。

若以上任一项缺失，开发者不得先动手“试着调一下”。应先回报 PM：缺少权威文件 / 范围 / 预期效果，需要 UI owner 或 PM 补齐。

开发回传时必须包含：

- “已按哪个 authority_current 章节实现”
- “实现范围”
- “未触碰范围”
- “需要真机确认的视觉点”

## 清理 / 归档判断规则

执行者每次完成任务都要判断是否产生或发现 obsolete 内容。

必须在回传中说明：

- `Cleanup status: none`：未发现需要清理的内容；
- 或 `Cleanup candidates:`：列出建议 PM 清理 / 归档的路径和原因；
- 或 `Cleanup done:`：仅当 PM 任务明确授权清理时，列出已归档路径、archive 位置、验证结果。

执行者默认不得删除文件；需要移出活跃目录时，应先由 PM 创建清理任务或在原任务中明确授权。archive 只用于追溯，不得作为开发引用来源。

## 产出

把结果写入对应角色的执行文件、回复文件或验证说明。

产出至少应包含：

- 触达范围
- 当前结果
- 验证状态
- 剩余下一步
- 权威同步状态（若本轮影响 authority）
- UI 权威执行状态（若本轮涉及 UI）
- 清理 / 归档判断状态

## 停止条件

满足以下条件后停止本轮：

- 一个受控小步骤已经完成
- 验证结果已经记录
- PM 和下一班能看懂当前处于什么状态
- 已报告 cleanup status / candidates / done

## 不要做

- 不要直接吸收来自 Ant大小姐的新执行要求
- 不要从一个任务扩成多个新任务
- 不要默认扫描冻结项目
- 不要在循环结束时留下未记录的改动
- 不要把未同步到 `08_authority_current` 的设计变化直接交给开发实现
- 不要在未获 PM / Ant 确认时宣布 final authority
- 不要按截图或聊天印象直接重设计 UI
- 不要在 UI 任务里顺手调整未写入任务范围的相邻组件
- 不要把临时文件、旧候选、废弃资源留在活跃目录且不报告
- 不要未经 PM 授权直接永久删除资源
## Mandatory PM dispatch intake rule

When a worker receives both a PM inbox file and a direct chat/window message, the direct message is the wake-up signal and the inbox file is the source of truth.

Workers must not start from chat memory alone. Before acting, read the exact PM inbox file named in the message, then report back through `PM_AGENT_OUTBOX` with:

- task id;
- files changed;
- verification result;
- blocked items, if any;
- cleanup status.
