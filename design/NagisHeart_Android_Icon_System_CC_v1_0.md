# Nagi's Heart · Android Icon System for CC v1.0

> 文档类型：Android 图标系统 / 工程开工版  
> 提交对象：CC Engineer / CoCo  
> 目标：统一所有 HUD、功能入口、节点和状态图标，建立 Blue Lock 感但不直接复制官方 Logo。

---

## 1. 图标设计原则

图标系统使用：

```text
细线图标
+ 五边形几何托底
+ 冷白 / 蓝灰 / 玫瑰金状态色
```

不使用：

- X / 交叉装饰。
- 大圆角底。
- 粗填充图标。
- 贴纸图标。
- 直接复制 Blue Lock 官方 Logo。

五边形来源于 Blue Lock 视觉语言，但当前项目使用原创抽象五边形 / 锁格符号。

---

## 2. 基础规格

| 项目 | 规格 |
|---|---|
| 图标画布 | 24 x 24 dp |
| HUD 触控区 | 48 x 48 dp |
| 线宽 | 1.4-1.6 dp |
| 端点 | round 或 square 均可，但全套统一 |
| 默认颜色 Light | `#6E7A89` / `#AEBAC8` |
| 默认颜色 Dark | `#C9D1DC` |
| Active | `#BFA08A` |
| Disabled | 38% alpha |
| 背景托底 | 五边形极淡水印，可选 |

---

## 3. 五边形基础标记

### 3.1 Pentagon Mark

用途：

- HUD 托底。
- Choice 左侧标记。
- Chapter 当前节点。
- Lock / Gallery 未解锁标记。
- 背景水印。

建议 Compose Path：

```kotlin
fun Path.pentagon(size: Size) {
    val w = size.width
    val h = size.height
    moveTo(w * 0.50f, h * 0.04f)
    lineTo(w * 0.94f, h * 0.36f)
    lineTo(w * 0.78f, h * 0.90f)
    lineTo(w * 0.22f, h * 0.90f)
    lineTo(w * 0.06f, h * 0.36f)
    close()
}
```

### 3.2 Pentagon Ring

用途：

- 标题前小标。
- Choice marker。
- Current node。

表现：

```text
外五边形 1.4dp stroke
中心留空
可加极弱玫瑰金或蓝灰点
```

---

## 4. Icon List

### 4.1 HUD Icons

| Icon | 用途 | 视觉建议 |
|---|---|---|
| `Back` | 返回 | 左箭头，细线，五边形弱托底 |
| `Menu` | 菜单 | 三条横线，细线，避免汉堡按钮太重 |
| `Auto` | 自动播放 | 简化播放三角 / 字母 A 首版可临时 |
| `Skip` | 跳读 | 双箭头，细线 |
| `Backlog` | 历史记录 | 文档线框 |
| `Save` | 存档入口 | 书签 / 存档卡 |

HUD 首版可以先使用字母 `A` / `S` 占位，但最终应替换为图标。

### 4.2 Navigation Icons

| Icon | 用途 | 视觉建议 |
|---|---|---|
| `Home` | 回首页 | 极简屋形，不可可爱 |
| `Chapter` | 章节地图 | 时间轴 + 五边形节点 |
| `Gallery` | 图鉴 | 相框 / 图片线框 |
| `Settings` | 设置 | 细线齿轮 |
| `Close` | 关闭 | 不使用 X 装饰；关闭动作可使用简洁斜线，但只在关闭语义出现 |

说明：X 只能作为关闭功能图标，不可作为装饰。

### 4.3 State Icons

| Icon | 用途 | 视觉建议 |
|---|---|---|
| `ChoiceMark` | 选项标记 | 五边形环 |
| `CurrentNode` | 当前章节节点 | 五边形实心 / 玫瑰金轻亮 |
| `ReadNode` | 已读节点 | 蓝灰五边形 |
| `Locked` | 未解锁 | 五边形 + 小锁孔 |
| `Unread` | 未读 | 低亮五边形点 |
| `TrueEnd` | TRUE 状态 | 五边形 + 淡金微光 |
| `BadEnd` | Bad 状态 | 五边形 + 枯玫瑰红 |

### 4.4 LINE Icons

| Icon | 用途 | 视觉建议 |
|---|---|---|
| `LineBack` | LINE 返回 | 细箭头 |
| `Typing` | 输入中 | 三点，可保留圆点语义 |
| `Read` | 已读 | 文字 `read` 优先，不强行做图标 |
| `MessageChoice` | 聊天选项 | 小五边形标记 |

---

## 5. 图标状态

| 状态 | 颜色 | 背景 |
|---|---|---|
| default light | `#6E7A89` 80% | 无或五边形 8% |
| default dark | `#C9D1DC` 82% | 无或五边形 10% |
| active | `#BFA08A` 90% | 五边形 12-16% |
| pressed | alpha -10% | 位移 1dp |
| disabled | 38% alpha | 不使用纯灰块 |

---

## 6. 工程实现建议

### 6.1 Compose 组件

```kotlin
@Composable
fun NagiIconButton(
    icon: NagiIcon,
    state: NagiIconState = NagiIconState.Default,
    onClick: () -> Unit
)
```

### 6.2 参数

```kotlin
data class NagiIconStyle(
    val color: Color,
    val markColor: Color,
    val showPentagonMark: Boolean,
    val alpha: Float
)
```

### 6.3 绘制方式

优先级：

1. Compose `ImageVector`。
2. Compose Canvas custom path。
3. SVG 导入。

不建议第一阶段使用位图图标，除非是最终品牌 Logo。

---

## 7. 图标验收标准

```text
一眼看起来是同一套。
不出现不明 X 装饰。
五边形符号存在但不过量。
图标不抢背景。
暗色背景上可读。
浅色背景上不脏。
触控区域足够。
```

