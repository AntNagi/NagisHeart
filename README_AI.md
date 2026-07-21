# AI Collaboration Rules

> Read this file before working in this repository.  
> This project is one shared workspace used by multiple AI collaborators and humans. Do not assume the whole repository should be scanned or edited.

---

## 1. Default Working Scope

Start with these files:

1. `README_AI.md` - collaboration and read/write rules.
2. `TASKS.md` - current task board and handoff notes.
3. `PROJECT_STRUCTURE.md` - file map and document authority rules.
4. `authority/MANIFEST.md` - the ONLY authority document registry (7 docs + 2 KV packages). Run `powershell -ExecutionPolicy Bypass -File tools/check-authority.ps1` at session start; investigate before working if it fails.

Then read only the files needed for the specific task.

Authority hard rule: authority documents live ONLY in `authority/` (KV asset packages in `design/authority/icon_start_tt/`). Never copy them elsewhere; process docs must reference by path + section number. Any other copy you find (old snapshots, handoff, design/) is historical and must not be used as a development basis.

Do not scan the whole repository by default.

Collaboration rules v2 (2026-07-21 reset) live in `00_harness/README.md` — the ONLY process rulebook. The old PM/inbox/outbox/loop/handoff system is retired and archived; never follow instructions from files under `00_harness/99_archive/`.


---

## 2. Current Project Zones

This repository has not yet been physically reorganized into `docs-current/`, `docs-archive/`, or `assets-large/`. Until that cleanup happens, use the current paths as zones:

| Zone | Current paths | Default behavior |
|---|---|---|
| Coordination board | `README_AI.md`, `TASKS.md`, `PROJECT_STRUCTURE.md` | Always read first. May update when coordinating work. |
| Collaboration ledger | `00_harness/` (rules v2: README, decision_log, task_board, 05_reports evidence) | Read task_board for your task; write per rules v2. `99_archive/` is read-only history. |
| App code | `android/`, `web/` | Read/write only for implementation tasks. |
| Runtime story data | `story-data/` | Read when needed; edit only with explicit story/data task. |
| Current product/content/design docs | selected files in `design/`, selected files in `handoff/yiyi_final_visual_slices_20260711/` | Read by task type. Edit only when updating authority or handoff. |
| Historical handoff/design materials | most of `handoff/`, old design boards, old screenshots | Do not read by default. Use only for traceability. |
| Runtime assets | `assets/bg/`, `assets/bgm/`, `assets/ui/`, `assets/main pic/` | Do not scan by default. Edit only for resource tasks. |
| Large/generated/reference files | images, zips, contact sheets, exports, root loose images | Ignore by default unless explicitly requested. |
| Tools | `tools/` | Read/write for validation, conversion, build helper tasks. |

---

## 3. Read Rules

Use the smallest useful reading set:

- Product scope: read `authority/product/NagisHeart_PRD_v2_0.md`.
- Interaction rules: read `authority/interaction/NagisHeart_Interaction_Design_v1_0.md`.
- Script source: read targeted sections of `authority/script/Nagis_Heart_SCRIPT_V15_Calibrated.md`; do not load the full script unless necessary.
- Story logic design: read `authority/story_logic/NagisHeart_Design_V3_1_Latest_UtopiaAdded.md`; runtime truth is the relevant `story-data/*.json` file.
- Background/mood mapping: read `story-data/scene_visuals.json` and, if needed, `authority/visual_mapping/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`.
- UI spec: read `authority/ui/XoXo_UI_Final_MinSpec_20260712.md` (values) and `authority/ui/NagisHeart_UI_Authority_XoXo_v1_0.html` (visual master). The handoff copy of MinSpec is stale history - do not use it.
- Android work: read the relevant `android/app/src/main/...` files.
- Web work: read the relevant `web/src/` or `web/styles/` files.

Full-repo search is allowed only when:

1. The task is repo audit, cleanup, or resource inventory.
2. A symbol/resource/file cannot be found through the project map.
3. All references to a field, variable, node id, or asset path must be verified.
4. Preparing a commit and checking for accidental changes.

---

## 4. Write Rules

Before writing any file:

1. Check `git status`.
2. Identify the exact files this task should touch.
3. Avoid unrelated formatting, renames, moves, or cleanup.
4. Do not overwrite user or other-agent changes.
5. If the work changes product rules, story data, script, or UI authority, summarize the decision in `TASKS.md`.

Never casually edit:

- `authority/` (any file - requires decision_log entry + MANIFEST hash update in the same commit)
- `story-data/*.json`
- `assets/bg/`
- `assets/main pic/`
- `android/app/src/main/res/`
- historical `handoff/` folders
- root loose image files

These areas require a specific task and clear reason.

---

## 5. Task Board Rules

Use `TASKS.md` as the shared task board.

Update it when:

- Starting a larger task.
- Changing a project rule.
- Discovering a blocker.
- Completing a handoff-worthy step.
- Leaving work for another AI/human to continue.

Keep entries short and practical. Do not turn `TASKS.md` into a full archive.

---

## 6. Commit Rules

Keep commits small and typed:

| Type | Scope |
|---|---|
| `docs` | docs, rules, handoff, QA notes |
| `data` | `story-data` updates |
| `assets` | images, audio, icons |
| `android` | Android code/resources |
| `web` | Web code/styles |
| `tools` | scripts and validators |

Do not mix unrelated categories in one commit.

Bad commit shape:

```text
resource deletion + PRD rewrite + Android UI fix + QA feedback
```

Good commit shape:

```text
docs: add AI collaboration rules
android: fix backlog speaker replacement
data: standardize ending uiTheme values
```

---

## 7. Future Folder Target

When the working tree is stable, the project may be reorganized toward:

```text
docs/
  product/
  content/
  design/
  engineering/
  qa/
  collaboration/
  archive/
```

Do not perform this move casually. Any directory move must be its own commit and include an old-path to new-path mapping.
# Roles v2 - 2026-07-21

- Ant: owner, the ONLY acceptance gate (real device / browser). Agent QA is discontinued.
- feibo (CTO): top-level only - rules, architecture, major reviews, infrastructure tooling.
- PM 一一: in-rules executor - task board ops, dispatching, evidence collection, routine review. Bound by v2: four ledgers only, no process files.
- Workers on demand: PP = Android, Wewe = Web, lulu = UI design, TT = KV visual. Web tasks must not touch Android and vice versa.
- Formal tasks: `00_harness/02_planning/task_board.md`. Full process rules: `00_harness/README.md`.

---
