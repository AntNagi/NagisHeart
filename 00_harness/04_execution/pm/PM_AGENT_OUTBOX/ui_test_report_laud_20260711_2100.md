# 综合 UI / 基础功能测试报告
**Tester:** Laud (Test Engineer)  
**Date:** 2026-07-11 21:00  
**Build:** Latest APK on emulator-5554 (1080×2424)  
**Scope:** 全面 UI 界面 + 基础功能（非故事线内容）

---

## 一、测试范围与方法

逐页面进入 App 所有可达画面，检查：
- 页面渲染 / 布局是否正常
- 导航流转是否正确
- 交互响应是否可用
- 系统返回键行为
- 对照设计规格（CoCo Design Handoff v1.0 / P0 HiFi UI Spec v1.0）的合规性

---

## 二、逐页面测试结果

### 1. Splash 开屏页
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 全屏海报 poster_start_nagis_heart_keyart.png，Crop 填充 |
| 交互 | ✅ | 点击任意位置进入 Start 页面 |
| 标题 | ⚠️ | 海报图片内包含标题，非 Compose 渲染。合规性取决于设计意图 |

### 2. Start 主菜单
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 半透明暗色 overlay + home_main.jpg 背景，5 个文字按钮垂直居中 |
| 标题 | ✅ | "Nagi's Heart"，Serif Italic 38sp，snowWhite |
| 继续故事 | ❌ **BUG** | 详见 NEW-BUG-001 |
| 新的故事 | ✅ | 正确导航到 NameSetup |
| 章节目录 | ✅ | 正确导航到 Chapter，Back 可返回 |
| 回忆画廊 | ✅ | 正确导航到 Gallery，Back 可返回 |
| 系统设置 | ✅ | 正确导航到 Settings，Back 可返回 |
| 按钮样式 | ⚠️ | 纯文字 clickable，无轻切角/五边形按钮样式（BUG-006 未修） |
| 系统返回键 | ✅ | 在 Start 页按返回键正常退出 App |

### 3. NameSetup 姓名输入页
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | nagi_with_cat.jpg 背景 + 渐变 overlay，居中布局 |
| 标题文案 | ✅ | "写下你的名字" + "故事会从这里开始。" |
| 输入框 | ✅ | 居中 BasicTextField，默认值 "Ant"，最大 10 字符 |
| 下划线装饰 | ✅ | 180dp 宽，silverBlue 50% alpha |
| 确认按钮 | ✅ | "进入故事"，paleGold 色。空白时禁用（灰色低透明度） |
| 提示文案 | ✅ | "轻触确认" micro 字号 |
| 键盘处理 | ✅ | `.imePadding()` + IME Done 动作 |
| 系统返回键 | ✅ | 正确返回 Start 页 |
| 缺失项 | ⚠️ | 无 nagiCall 输入框（BUG-002 未修） |

### 4. Prologue 序章页
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 深色背景，居中文字 |
| 文案 | ✅ | 第一句「好麻烦。」正确显示 |
| 交互 | ✅ | 点击逐行推进，结束后进入 Game |
| 路由 | ✅ | NameSetup → Prologue → Game，popUpTo 正确 |

### 5. Game 游戏主界面
| 项目 | 结果 | 说明 |
|---|---|---|
| 背景图 | ✅ | 正确加载 bg asset，Crop 填充 |
| 对话框 | ✅ | 底部对话层，说话人 + 正文，点击推进 |
| {{playerName}} | ✅ | 对话正文中正确替换为 "Ant"（AND-003 已修） |
| HUD 布局 | ✅ | 左：Back + 章节名 / 右：Auto + Save + Menu |
| Back 按钮 | ✅ | 点击返回 Start 主菜单（**BUG-001 已修**） |
| Menu 按钮 | ✅ | 点击弹出 GameMenuOverlay（**BUG-001 已修**） |
| Auto 按钮 | ✅ | 切换自动播放，图标状态变化 |
| Save 按钮 | ✅ | 正确导航到 Save 页 |
| Debug overlay | ✅ | 默认隐藏，长按章节名可切换（AND-004 已修） |
| 系统返回键 | ✅ | 正确返回 Start 主菜单（**改善**：原先直接退出 App） |
| 缺失项 | ⚠️ | HUD 无 Skip 按钮（设计规格要求有 Skip） |

### 6. GameMenuOverlay 游戏内菜单
| 项目 | 结果 | 说明 |
|---|---|---|
| 菜单项 | ✅ | Save / Load / Backlog / Settings / Return to Title |
| 导航 | ✅ | 各项正确导航到对应页面 |
| 关闭 | ✅ | 点击菜单外区域 dismiss |

### 7. Save 存档页
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 6 个存档槽位，纵向列表 |
| 空槽位 | ✅ | 显示 "空" |
| 存档操作 | ⚠️ | UI 显示存档成功（槽位填充），但数据未持久化到磁盘。详见 NEW-BUG-001 |
| Back 按钮 | ✅ | 返回 Game |

### 8. Backlog 回看页
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 对话历史列表 |
| 说话人 | ✅ | {{playerName}} 正确替换为 "Ant"（BUG-003 已修） |
| Back 按钮 | ✅ | 返回 Game |

### 9. Chapter 章节目录
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 纵向列表，Chapter → Section 层级 |
| 标题栏 | ✅ | Back + "章节目录" 居中 |
| 已读节点 | ✅ | ◆ paleGold + 可点击跳转 |
| 未读节点 | ⚠️ | ◇ 降低透明度，但**显示真实标题**（BUG-004 未修，应显示 "???"） |
| Scope 标记 | ✅ | DREAM/STAY/BAD/M/J 各有对应颜色 |
| Back 按钮 | ✅ | 返回 Start |

### 10. Gallery 回忆画廊
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 2×2 网格卡片布局 |
| 已解锁结局 | ✅ | 显示结局名称 + 标签 |
| 锁定结局 | ⚠️ | 显示 "?" + "未解锁"（BUG-007 部分修复，规格要求 "???" + 雾面遮罩） |
| Back 按钮 | ✅ | 返回 Start |

### 11. Settings 设置页
| 项目 | 结果 | 说明 |
|---|---|---|
| 渲染 | ✅ | 5 个设置项纵向列表 |
| 文字速度 | ✅ | Slider 控件 |
| 自动速度 | ✅ | Slider 控件 |
| BGM 音量 | ✅ | Slider 控件 |
| 显示模式 | ✅ | 切换选项 |
| 数据管理 | ✅ | 清除数据功能 |
| Back 按钮 | ✅ | 返回上一页 |

---

## 三、导航流转总结

```
Splash ──tap──▸ Start (5-button menu)
                 ├─ 继续故事 ──▸ ❌ NameSetup (应去 SaveLoad)
                 ├─ 新的故事 ──▸ NameSetup ──▸ Prologue ──▸ Game
                 ├─ 章节目录 ──▸ Chapter ──◂ Back
                 ├─ 回忆画廊 ──▸ Gallery ──◂ Back
                 └─ 系统设置 ──▸ Settings ──◂ Back

Game
 ├─ HUD Back ──▸ Start ✅
 ├─ HUD Save ──▸ Save ──◂ Back
 ├─ HUD Menu ──▸ MenuOverlay
 │               ├─ Save ──▸ Save
 │               ├─ Load ──▸ SaveLoad
 │               ├─ Backlog ──▸ Backlog
 │               ├─ Settings ──▸ Settings
 │               └─ Return to Title ──▸ Start
 ├─ HUD Auto ──▸ toggle auto mode
 └─ System Back ──▸ Start ✅

NameSetup ──System Back──▸ Start ✅
```

---

## 四、新发现 BUG

### NEW-BUG-001 (P0)：存档不持久化 + 继续故事失效

**现象：**
- 游戏中通过 HUD Save 存档后，UI 显示存档槽位已填充
- 但存档文件未写入磁盘（`files/saves/` 目录为空）
- 导致 "继续故事" 按钮判定 `hasAnySave()` = false，跳转到 NameSetup（同 "新的故事"）
- 玩家无法通过 "继续故事" 恢复进度

**影响范围：**
- "继续故事" 功能完全失效
- 退出 App 后存档丢失
- SaveLoad("load") 页面无数据可加载

**根因定位：**
- `SaveManager.save()` 调用 `slotFile(slot.id).writeText(json.encodeToString(slot))`
- `slotFile()` 返回 `File(context.filesDir, "saves/slot_$slotId.json")`
- saves 目录已被 mkdirs() 创建，但 slot_*.json 文件不存在
- 疑似 `SaveSlot` 序列化失败或 `save()` 被调用时 slot 数据不完整

**复现步骤：**
1. 新游戏 → 进入 Game → HUD Save → 选择空槽位保存
2. 返回 Start → 点击 "继续故事"
3. 实际导航到 NameSetup，而非 SaveLoad

---

## 五、此前 BUG 状态更新

| Bug | 优先级 | 状态 | 本轮验证 |
|---|---|---|---|
| BUG-001 | P0 | ✅ **已修复** | HUD 现有 Back + Menu 按钮，系统返回键也正确返回 Start |
| BUG-002 | P0 | ❌ 未修 | nagiCall 仍无实现，NameSetup 仍仅有单输入框 |
| BUG-003 | — | ✅ 已修复 | Backlog 说话人正确替换 |
| BUG-004 | P1 | ❌ 未修 | Chapter 锁定节点仍显示真实标题 |
| BUG-005 | P1 | ⚠️ 未复验 | 本轮未进入 Choice 画面 |
| BUG-006 | P1 | ❌ 未修 | Start 菜单按钮仍为纯文字，无轻切角 |
| BUG-007 | P2 | ⚠️ 部分修复 | Gallery 锁定显示 "?" + "未解锁"，规格要求 "???" + 雾面遮罩 |
| BUG-008 | — | ✅ 已修复 | Debug overlay 默认隐藏 |

---

## 六、设计合规差异总结

| 设计规格要求 | 当前实现 | 差异等级 |
|---|---|---|
| Start 菜单：轻切角按钮 | 纯文字 clickable，无按钮样式 | P1 |
| HUD：Skip 按钮 | HUD 无 Skip，仅通过 Menu 可能无法快进 | P2 |
| Chapter 锁定节点："???" 替代 | 显示真实标题，仅降低透明度 | P1 |
| Gallery 锁定："???" + 雾面遮罩 | 显示 "?" + "未解锁"文字 | P2 |
| nagiCall 输入框 | 不存在 | P0 |
| 五边形 shape language | 未在 Start/Choice 等处体现 | P2 |

---

## 七、综合结论

### 基础功能
- **页面渲染：** 全部 11 个页面均可正常渲染，无崩溃、无白屏
- **导航流转：** 除 "继续故事" 外，所有导航路径正确
- **系统返回键：** 各页面行为正确（NameSetup → Start、Game → Start）
- **HUD 交互：** Back / Auto / Save / Menu 均可用（BUG-001 已修）
- **模板替换：** {{playerName}} 在对话 + Backlog 均正确替换

### 阻断项
1. **NEW-BUG-001 存档不持久化（P0）**：玩家存档丢失，"继续故事" 失效
2. **BUG-002 nagiCall 未实现（P0）**：51 处模板无法替换

### 改善项（本轮确认已修复）
- BUG-001 HUD Back/Menu ✅
- BUG-003 Backlog 说话人替换 ✅
- BUG-008 Debug overlay 隐藏 ✅

### 建议优先级
1. **P0 紧急修复：** NEW-BUG-001 存档持久化 → 这是玩家最基础的游戏体验
2. **P0 功能补全：** BUG-002 nagiCall 实现
3. **P1 设计合规：** BUG-004 / BUG-006 Chapter + Start 样式
4. **P2 精修：** BUG-007 Gallery / HUD Skip / 五边形 shape

---

*— Laud, Test Engineer*  
*Report: ui_test_report_laud_20260711_2100.md*
