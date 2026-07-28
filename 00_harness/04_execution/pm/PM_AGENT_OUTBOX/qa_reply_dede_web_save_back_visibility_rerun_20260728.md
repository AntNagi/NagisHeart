# DeDe Web QA Reply — Save Back Visibility Rerun

- Date: 2026-07-28
- Scope: `TASK-20260726-002` 返回入口 rework 小范围复测
- Relevant commits: `5cad927`, `d4990db`
- Platform: Web only
- Code touched: no

## Result

| Check | 393x852 | 430x932 | Evidence result |
|---|---|---|---|
| 精确视口真实生效 | PASS (`innerWidth=393`, `innerHeight=852`, `#app=393x852`) | PASS (`innerWidth=430`, `innerHeight=932`, `#app=430x932`) | Mechanical PASS |
| 存档空状态顶部返回箭头在亮背景上可辨识 | 箭头在左上角可直接辨识 | 箭头在左上角可直接辨识 | OBSERVED; screenshots attached |
| 返回按钮存在、可见、可用 | `display:flex`, `visibility:visible`, `opacity:1`, `disabled=false`, `36x36` | `display:flex`, `visibility:visible`, `opacity:1`, `disabled=false`, `36x36` | Mechanical PASS |
| 点击返回主页 | 点击后出现主页“存档进度”，且“选择进度”消失 | 点击后出现主页“存档进度”，且“选择进度”消失 | Mechanical PASS |
| Console error/warn | 0 | 0 | Mechanical PASS |

## Reproduction

1. Open `http://127.0.0.1:3000/web/`.
2. Enter Start, arrive at Home.
3. Click `存档进度`.
4. Confirm the empty-state page shows `还没有手动存档。` and `你可以在剧情中随时保存。`.
5. At each exact viewport, capture the top-left return arrow and inspect its rendered state.
6. Click `←`.
7. Confirm Home is restored.
8. Read Console entries filtered to `error`, `warn`, and `warning`.

## Evidence

- `00_harness/05_reports/validation/web_qa_dede_save_back_visibility_rerun_20260728/save_empty_back_393x852.png`
- `00_harness/05_reports/validation/web_qa_dede_save_back_visibility_rerun_20260728/save_empty_back_430x932.png`

Rendered return control facts for both viewports:

- Text color: `rgba(247, 249, 252, 0.94)`
- Background includes a dark linear-gradient layer plus a light radial highlight.
- Position: `x=14`, `y=4`
- Size: `36x36`
- Enabled: yes

Compared with the prior failure evidence, the rerun screenshots show a distinct dark button surface around the light arrow, so the arrow no longer blends into the bright page background. Final aesthetic acceptance remains with Ant/PM if required by the project workflow.

## Not covered

- No full Web regression.
- No Android testing.
- No other system pages, story flow, save persistence, or resource/network matrix.

## Cleanup

- Temporary viewport override reset after testing.
- Browser test tab finalized.
- No source, resource, Android, story-data, authority, or archive files modified.
- Cleanup status: complete.
