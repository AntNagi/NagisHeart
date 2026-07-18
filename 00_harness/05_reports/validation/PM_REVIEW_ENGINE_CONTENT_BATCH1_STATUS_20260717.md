# PM Review - Engine / Content Batch1 Legacy Status

## Review Target

- Old task: `00_harness/04_execution/pm/PM_AGENT_INBOX/TASK_TO_YIYI_20260713_ENGINE_CONTENT_BATCH1.md`
- Old reply: `00_harness/04_execution/pm/PM_AGENT_OUTBOX/dev_reply_yiyi_engine_content_batch1_20260713.md`
- Review date: 2026-07-17

## PM Conclusion

The old engine/content batch was attempted, but it is not fully closed in the current repository.

New UI authority supersedes old UI-fix items, but story content, scene BG mapping, and interaction rules still need follow-up.

## Current Evidence

### 1. Story wording

Old reply said `好卖` no longer existed in `nodes.json`.

Current repository still contains:

- `story-data/nodes.json`: `会长想让我去，是因为我好卖吧。`

PM conclusion: not closed in runtime data. PM has now merged the source-authority wording into the script design files as:

- `会长想让我去，是因为我有用吧。`

Runtime data should sync from this source-authority line.

### 2. Scene BG mapping

Old reply said:

- `u20j -> vs_u20_goal.jpg`
- `wc_offer -> living_room.jpg`

Current repository:

- `u20j` still points to `assets/bg/bg_u20j_worldcup_goal_kick.jpg`
- `wc_offer` still points to `assets/bg/back.jpg`
- `living_room.jpg` exists.
- `vs_u20_goal.jpg` does not exist under `assets/bg/` or Android assets.

PM conclusion:

- `wc_offer -> living_room.jpg` has now been merged into the BG mapping design authority files.
- `u20j -> vs_u20_goal.jpg` cannot be applied blindly because the target asset is missing. Need confirm whether to add the missing asset, use a different existing file, or keep current mapping.

### 3. Choice / autoAdvance visibility

Old reply said `getVisibleChoices()` filtered `autoAdvance`, blank label, and `→`.

Current `StoryEngine.kt` only filters conditions:

```kotlin
return choices.filter { choice ->
    choice.condition?.let { conditionParser.evaluate(it, state) } ?: true
}
```

Current `nodes.json` still contains many `label: "→"` and `autoAdvance: true` entries. The data entries may be valid as engine control markers, but they must not render as visible player choices.

PM conclusion: code path needs repair or explicit proof from another layer. Treat as not closed.

### 4. Backlog / story recap

Old reply said Backlog logic needed real-device retest. Earlier full-scope reports also called out selected choices and chapter scoping as partial / unresolved.

PM conclusion: not closed. Needs focused audit and, if necessary, repair.

### 5. `nagiCall`

Current `nodes.json` still contains many `{{nagiCall}}` placeholders. However PM previously paused `nagiCall` for this round.

PM conclusion: do not treat `nagiCall` as current P0 unless Ant大小姐 reopens it. Track as deferred content/product cleanup.

## New Task

Created `TASK-20260717-009`:

- Title: 剧情文案 / 章节 BG / 交互规则遗留项闭环
- Owner: yiyi + PM
- Status: ready

PM pre-merge before runtime task:

- `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`
- `00_harness/08_authority_current/03_script/Nagis_Heart_SCRIPT_V15_Calibrated.md`
- `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`
- `00_harness/08_authority_current/05_visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`


## Scope Guard

This task must not be mixed with:

- XoXo final UI authority revisions.
- TT Start long-screen visual work.
- App Icon.
- Gradle wrapper / emulator setup.
- Old resource deletion.
