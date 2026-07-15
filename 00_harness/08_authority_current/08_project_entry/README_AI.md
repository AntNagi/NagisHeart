# AI Collaboration Rules

> Read this file before working in this repository.  
> This project is one shared workspace used by multiple AI collaborators and humans. Do not assume the whole repository should be scanned or edited.

---

## 1. Default Working Scope

Start with these files:

1. `README_AI.md` - collaboration and read/write rules.
2. `TASKS.md` - current task board and handoff notes.
3. `PROJECT_STRUCTURE.md` - file map and document authority rules.

Then read only the files needed for the specific task.

Do not scan the whole repository by default.

PM collaboration materials live inside this repository under `00_harness/`. If a task mentions PM agent inbox/outbox, sync board, status intake, handoff, authority files, or PM audit notes, read from the relevant files under `00_harness/`.


---

## 2. Current Project Zones

This repository has not yet been physically reorganized into `docs-current/`, `docs-archive/`, or `assets-large/`. Until that cleanup happens, use the current paths as zones:

| Zone | Current paths | Default behavior |
|---|---|---|
| Coordination board | `README_AI.md`, `TASKS.md`, `PROJECT_STRUCTURE.md` | Always read first. May update when coordinating work. |
| PM collaboration workspace | `00_harness/` | Read only when the task involves PM sync, agent inbox/outbox, governance, handoff, authority files, or project coordination history. |
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

- Product scope: read `design/NagisHeart_PRD_v2_0.md`.
- Interaction rules: read `design/NagisHeart_Interaction_Design_v1_0.md`.
- Script source: read targeted sections of `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`; do not load the full script unless necessary.
- Story logic: read the relevant `story-data/*.json` file.
- Background/mood mapping: read `story-data/scene_visuals.json` and, if needed, `design/NagisHeart_SCRIPT_V15_BG_Mapping_CoCo_XoXo_v1_2.md`.
- UI spec: read `handoff/yiyi_final_visual_slices_20260711/XoXo_UI_Final_MinSpec_20260712.md` and `design/CoCo_Design_Handoff_20260713.md`.
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

- `story-data/*.json`
- `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`
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
