# NagisHeart Task Board

> Shared lightweight board for humans, Codex, Claude, CoCo, and other project agents.  
> Keep this short. Detailed reasoning belongs in the relevant PRD, spec, audit, or handoff document.

---

## Current Rules

- Start every session by reading `README_AI.md`, then this file, then `PROJECT_STRUCTURE.md`.
- Do not scan the whole repository unless the task explicitly needs repo-wide audit/search.
- Do not move or delete large assets, historical handoff folders, or story data without explicit task scope.
- Keep commits small and category-specific.

---

## Current State

- `PROJECT_STRUCTURE.md` exists as the current file map and authority index.
- `README_AI.md` defines AI collaboration read/write rules.
- This task board is the shared coordination surface.
- The working tree on the office computer is currently dirty with unrelated resource/code changes. Do not stage broad changes.
- The local docs commit may be ahead of `origin/main` if GitHub push from the office network fails.

---

## Active Tasks

| ID | Owner | Status | Task |
|---|---|---|---|
| DOC-001 | yiyi / PM | in progress | Establish project structure, read/write rules, and AI collaboration board. |
| DOC-002 | next home session | pending | Pull or recover the office-side docs commit, then continue consolidating CURRENT docs. |
| DOC-003 | next home session | pending | Locate the home-computer-only bug feedback/update document and fold it into the document update trace. |
| GOV-001 | PM | pending | Decide final folder reorganization plan before moving any files. |

---

## Do Not Touch Without Confirmation

- `story-data/*.json`
- `design/Nagis_Heart_SCRIPT_V15_Calibrated.md`
- `assets/bg/`
- `assets/main pic/`
- historical `handoff/` folders
- root loose image files
- broad resource deletions currently visible in the office working tree

---

## Next Recommended Step

On the home computer:

1. Read `README_AI.md`.
2. Read `TASKS.md`.
3. Read `PROJECT_STRUCTURE.md`.
4. Find the unpushed home-computer test bug feedback document.
5. Create a short update trace before editing PRD / Interaction / UI spec.
