# PM Skill

> 适用角色：PM 一一、PM 一一公司版  
> 对应 Harness：`00_harness/00_project/PM_ROLE_HARNESS.md`

---

## 一、这份 Skill 管什么

本文件不是讲“你是谁”，而是讲：

- 开工先读什么
- 收到输入后怎么入账
- 什么时候更新任务板
- 什么时候更新决策
- 怎么分派
- 怎么停在可交班状态

一句话：这是 PM 的操作手册。

---

## 二、开工前必读

按顺序读取：

1. `README_AI.md`
2. `TASKS.md`
3. `PROJECT_STRUCTURE.md`
4. `00_harness/00_project/working_agreement.md`
5. `00_harness/00_project/agent_registry.md`
6. `00_harness/00_project/PM_ROLE_HARNESS.md`
7. `00_harness/01_governance/inbox.md`
8. `00_harness/01_governance/decision_log.md`
9. `00_harness/02_planning/task_board.md`
10. `00_harness/03_handoffs/latest_status_snapshot.md`

如处于换班前后，再补读：

- `00_harness/03_handoffs/shift_handoff_home.md`
- `00_harness/03_handoffs/shift_handoff_office.md`
- `00_harness/03_handoffs/blocked_items.md`

---

## 三、收到输入后的标准判断

Ant大小姐的输入先归类，再执行后续动作。

输入类型只分四类：

1. `信息补充`
2. `变更请求`
3. `打断`
4. `决策`

### 对应动作

- `信息补充`：写入 `inbox.md`，如影响任务，再更新 `latest_status_snapshot.md`
- `变更请求`：写入 `inbox.md`，判断影响范围，必要时改 `task_board.md`
- `打断`：先写入 `inbox.md`，再立即标记被打断任务状态
- `决策`：必须写入 `decision_log.md`，必要时同步改任务板与快照

---

## 四、PM 的标准执行步骤

每一轮 PM 工作按下面顺序走：

1. 读取最新输入
2. 判断输入类型
3. 判断影响范围：
   - 是否影响 PRD / 剧本 / 设计权威
   - 是否影响当前任务优先级
   - 是否影响交班状态
   - 是否影响多个角色
4. 先更新记录，再口头分派
5. 如涉及拍板，先写 `decision_log.md`
6. 如涉及执行，更新 `task_board.md`
7. 如涉及全局状态，更新 `latest_status_snapshot.md`
8. 如涉及交班，更新对应 handoff
9. 给对应角色下发“单一步骤、单一范围”的任务

---

## 五、PM 分派任务时必须写清的内容

每个分派任务至少要包含：

1. 任务标题
2. 负责人
3. 任务类型
4. 当前范围
5. 依据文件
6. 本轮只做哪一个小步骤
7. 完成标准
8. 如阻塞，回写到哪里

如果这 8 项里缺了 2 项以上，默认视为任务还没分派干净。

---

## 六、PM 的默认 loop 接法

PM 的节奏以 `00_harness/07_scheduler/PM_LOOP.md` 为准。

实际执行时记成一句话：

`先入账，再分派；先收口，再扩散。`

---

## 七、PM 的标准产出

每一轮至少留下一个可追踪结果：

- 一条 inbox 记录
- 一条 decision 记录
- 一项 task 更新
- 一条状态快照更新
- 一条交班更新

不能只在聊天里说，不落文件。

---

## 八、PM 不要做

1. 不要跳过入账直接口头分派
2. 不要把多个变更糊成一个模糊大任务
3. 不要让执行者直接吸收 Ant大小姐输入
4. 不要在没有更新记录时默认“大家都懂了”
5. 不要在未交班状态下让下一班自己猜

---

## 九、停止条件

本轮 PM 工作满足以下条件即可停：

1. 最新输入已经归类
2. 影响范围已经写明
3. 相关记录已经更新
4. 下一步已经明确到具体角色和具体小步骤
5. 当前状态可交班、可恢复
