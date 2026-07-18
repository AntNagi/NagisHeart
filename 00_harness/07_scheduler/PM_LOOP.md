# PM 循环

## 目标

把 Ant大小姐的输入和项目当前状态，转化为可追踪的记录、明确的任务优先级，以及团队下一步清晰动作。

## 触发时机

出现以下任一情况时，执行一次 PM 循环：

- Ant大小姐提出了新需求、修正、想法、打断或拍板决定
- 执行者反馈了阻塞
- 执行者完成了一个有意义的小步骤
- 一个班次开始或即将结束
- 当前任务优先级变得不清晰

## 必读输入

先读取以下内容：

1. `..\00_project\PM_PROJECT_CONTEXT_BRIEF.md`
2. `..\00_project\WORKSPACE_STRUCTURE.md`
3. `..\02_planning\PM_SYNC_BOARD.md`
4. `..\02_planning\PM_STATUS_INTAKE.md`
5. `..\02_planning\PM_STATUS_REQUEST_LOG.md`
6. `..\04_execution\pm\` 下最新相关文件
7. 最新的执行回复、测试回复、设计回复等相关文件

## 步骤

1. 接收并记录 Ant大小姐的新输入。
2. 判断输入类型，归为以下之一：
   - 信息补充
   - 变更请求
   - 打断请求
   - 正式决策
3. 确认受影响项目，默认是 `NagisHeart`。
4. 判断这条输入是否改变了：
   - 范围
   - 优先级
   - 权威文件
   - 当前分工
5. 更新对应的规划记录或治理记录。
6. 判断团队下一步需要的是：
   - 无动作，仅记录
   - 一个执行者任务
   - 多角色联动任务
   - 阻塞排查与升级
7. 如果需要推进工作，就创建或更新任务，并注明必须读取的文件。
8. 如果本轮涉及设计、交互、剧情、BG mapping、资源口径等权威变化，必须先完成“权威同步检查”：
   - 确认源文件已经更新；
   - 确认对应文件已同步到 `..\08_authority_current\`；
   - 确认 `decision_log.md` 或 PM review 记录了生效范围；
   - 未完成权威同步前，不得把该变化派给开发实现。
9. 如果本轮涉及 UI 设计调整，必须额外执行“UI 谨慎变更检查”：
   - 先核对当前最新 UI authority，而不是只看截图或聊天描述；
   - 明确这是“修正实现偏差”还是“修改设计规则”；
   - 若是修改设计规则，先交 UI owner 更新权威文件，不得直接让开发猜样式；
   - 记录本次改动的具体目标、影响页面、不得触碰范围、预期视觉效果；
   - 只有权威文件已更新且 PM review 通过，才允许进入开发实现。
10. 如果要派发开发 UI 任务，任务单必须写明：
   - 必读 `..\08_authority_current\` 中的具体权威文件与章节；
   - 本次只允许修改的 UI 范围；
   - 预期效果与验收口径；
   - 禁止自行扩展、重设计、按旧 handoff 或截图自由发挥。
11. 每轮 PM_LOOP 都必须执行“清理 / 归档判断”：
   - 判断本轮是否产生了被打回、废弃、过期、重复、容易误用的文件或资源；
   - 判断是否有旧候选、旧资源、临时预览、历史实现仍留在活跃目录，可能误导后续开发；
   - 需要保留追溯但不得再作为开发依据的内容，移入 `..\99_archive\` 下的合适目录，并写明 archive README；
   - 不可直接删除仍需追溯的历史材料；永久删除必须另开 PM 清理任务并得到明确确认；
   - 清理结果必须写入 PM review / `decision_log.md` / `task_board.md` / `latest_status_snapshot.md` 中至少对应项。
12. 如果这次变化影响多个角色，先更新当前项目状态摘要，再让其他人继续。
13. 只有在“下一位负责人”和“下一步动作”都清楚时，才结束本轮。

## 权威同步硬规则

凡是设计或规则变化被 PM 接受为 review / authority / 可开发依据，必须同步到 `..\08_authority_current\`。

- UI / 视觉变化：同步到 `..\08_authority_current\04_ui\`
- 产品 / 交互变化：同步到 `..\08_authority_current\01_product\` 或 `..\08_authority_current\02_interaction\`
- 剧本文案变化：同步到 `..\08_authority_current\03_script\`
- BG / visual mapping 变化：同步到 `..\08_authority_current\05_visual_mapping\`
- 运行数据权威变化：同步到 `..\08_authority_current\06_runtime_story_data\`
- 技术架构变化：同步到 `..\08_authority_current\07_technical\`

PM 分派开发任务前必须检查：

1. 开发要读的 authority 文件是否在 `08_authority_current` 中存在。
2. 最新设计改动是否已经进入对应 authority 文件。
3. 任务单中引用的是 authority_current，而不是历史草稿或单次聊天。
4. UI 改动是否已经写清楚“目标范围 + 预期效果 + 禁止范围”。
5. 如果是修 UI，PM 必须判断是开发没有按权威实现，还是权威本身需要 UI owner 先修订。

如果权威文件还没同步，本轮 PM_LOOP 的下一步应先是“同步权威 / 补 PM review”，而不是派开发。

## 清理 / 归档硬规则

每次 PM 收口、任务转 review / done、设计方案被打回、资源口径变更、开发适配完成后，都必须判断是否需要清理。

默认策略：

1. 活跃目录只保留当前权威、当前候选、当前可执行资源。
2. 被打回 / 废弃 / 过期 / 重复 / 易误用的文件，先移入 `..\99_archive\`，不直接永久删除。
3. archive 内必须保留原路径结构或 README，说明：
   - 为什么归档；
   - 归档日期；
   - 替代的当前权威或当前活跃路径；
   - 禁止开发直接引用 archive。
4. PM 给开发派任务时，必须明确“只读 authority_current 和活跃目录，不引用 archive”。
5. 若清理涉及 runtime 资源，PM 必须先确认 active code / active mapping 没有引用旧资源，或明确把修复引用作为前置任务。
6. 若暂时不能清理，必须在 PM review 或状态快照中写明“暂缓清理原因”和“下次清理触发条件”。

## UI 谨慎变更硬规则

当前项目测试资源有限，Ant大小姐是真机主验收人。为了避免反复试错消耗测试成本，UI 变化必须按以下顺序推进：

1. 先看权威：读取 `08_authority_current/04_ui/` 的最新 UI authority 与 min spec。
2. 再定性质：
   - 如果实现偏离权威，派开发按权威修正；
   - 如果权威不足或需要改变设计，先派 UI owner 更新 authority。
3. 再写范围：任务必须说明只改哪些页面 / 组件 / token，不改哪些相邻内容。
4. 再写预期：任务必须说明真机上应看到什么效果，例如“图标与 title/action chip 同属 glass HUD，而不是厚按钮”。
5. 最后才开发：开发不得根据截图自行重设计 UI，不得绕过 authority_current。

## 产出

至少更新以下其中之一：

- 规划记录
- PM 分派文件 / 任务文件
- 状态快照或交班说明
- 审计记录或升级说明
- 清理 / 归档记录（若本轮产生或发现 obsolete 文件）

## 停止条件

满足以下条件后停止本轮：

- 输入已被记录
- 负责人已明确
- 下一步动作已写明
- 没有仍然停留在聊天里的隐性歧义
- 已判断是否需要清理 / 归档；需要清理但尚未执行时，已写明原因和触发条件

## 不要做

- 不要把原始聊天意图直接丢给执行者而不入账
- 不要把范围变化只留在对话里
- 不要分派“大而模糊”的任务，能拆成单个受控小步骤就先拆
- 不要让开发按未同步到 `08_authority_current` 的设计变化实现
- 不要把设计草稿、历史 handoff 或临时截图当成可开发权威
- 不要让被打回 / 废弃 / 过期资源长期留在活跃目录误导后续任务
- 不要把 archive 当成开发可引用目录
## Mandatory dispatch channel rule

When PM assigns or reprioritizes work to an active worker who has a chat/window available, PM must use both channels:

1. write the formal task / reply / dispatch file under `00_harness/04_execution/pm/PM_AGENT_INBOX/`;
2. send a short direct message to that worker's active window/thread, pointing to the exact file and stating the execution order.

Writing a file alone is not enough when the worker is expected to act immediately. If a direct window/thread is unavailable, PM must record that explicitly in `PM_SYNC_BOARD.md` and the task handoff.

Direct message must include:

- task id(s);
- exact inbox file path;
- execution order;
- prohibited scope;
- required reply / cleanup status.
