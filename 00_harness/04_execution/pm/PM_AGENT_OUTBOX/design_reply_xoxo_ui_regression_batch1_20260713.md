# XoXo UI Regression Batch 1 Reply

## Locked Visual Fixes

| Scene | Final BG | Theme | Status | Note |
|---|---|---|---|---|
| `u20j` / U-20日本代表战·被日本看见 | `assets/bg/vs_u20_goal.jpg` | `dark` | 正式锁定 | 按 Ant 最新口径，不再沿用当前错误球场图，也不再优先用旧 `goal.jpg` / `bg_u20j_worldcup_goal_kick.jpg`。这一段要的是“被日本看见”的主高光比赛图。 |
| `c6a` / 聚少离多·从高光到淘汰 | `assets/bg/goal.jpg`（本轮不改 BG） | `dark` | 主题正式锁定 / BG 暂沿用 | 本轮先锁内页主题为 `dark`，不要再跑浅色。这个场景当前重点是低谷感与可读性；BG 若后续要升级，再单独换更低潮的比赛图。 |
| `bad_last` / 5连回头 | `assets/bg/bg_bad_impact_kick_cutin.jpg` | `dark` | 临时代用锁定 | 这张图只适合“强情绪 cut-in / 短时冲击”，不适合长段持续阅读常驻 BG。若这一段在实现里是长旁白或连续多屏正文，后续应补一张“雨后训练场外 / 冷光通道 / 赛后低谷”替代图。 |
| `wc_offer` / 豪门来信 | `assets/bg/living_room.jpg` | `dark` | 正式锁定 | 这段语境已经偏“回家 / 客厅 / 等待 / 收到来信后的居家承接”，不该继续用 `back.jpg` 那种商务出发行李图。统一改成 `living_room`。 |
| `wc_roster` / 追加名单·前锋 / 首发 / MD语境 | `assets/bg/bar.png` | `dark` | 正式锁定 | 当前 `dining_room.jpg` 语境不对。既然文本已经进入“前锋 / 首发 / MD / 被点名 / 微妙对话”这类更私密、更带情绪的段落，就改成 `bar`，不要再保留泛用餐桌图。 |

## UI / 视觉补充口径

1. 这批修正只处理 BG 与 theme，不处理脚本文案、节点跳转、程序 bug。
2. `bg_bad_impact_kick_cutin` 不要被当作通用常驻阅读背景；它是情绪插图，不是稳定正文底图。
3. 带“回家 / 公寓 / 客厅 / 等待 / 收留 / 同居余温”的段落，优先落 `living_room`，不要再用酒店、走廊、商务大堂替代。
4. 带“首发 / 前锋 / 被点名 / 微醺 / 私密对话 / 近距离观察”的段落，允许优先落 `bar`，不要硬塞 `dining_room`。
5. 这一批默认内页主题以 `dark` 为准，不做 `auto`。

## Needs Ant Confirmation

- 本批 5 个点里，没有必须卡住开发的新增视觉拍板项，可以先按上表执行。
- 唯一保留项：如果 `bad_last` 后续被证明不是短 cut-in，而是长阅读场景，则需要补一张正式替代 BG；那时再请 Ant 看替代图方向即可。
