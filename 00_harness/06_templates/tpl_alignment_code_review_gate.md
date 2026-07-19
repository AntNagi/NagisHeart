# Alignment / Code Review Gate Template

Use this template for implementation tasks involving UI, interaction, story flow, routing, save/progress, gallery unlocks, or other user-visible behavior.

## Hard rule

No implementation may start until the pre-implementation alignment table is complete.

For high-risk tasks, multi-section UI tasks, or any task that previously failed real-device verification, the worker must send the pre-implementation alignment table first and wait for PM approval before coding.

`where relevant` is not an acceptable implementation scope by itself. The worker must expand it into a complete checklist of authority sections and mark each section as:

- `implement now`
- `explicitly out of scope`
- `blocked / needs PM or owner decision`

If the checklist is incomplete, the task is not allowed to move to coding.

## Pre-implementation alignment table

| Item | Authority / source | Current code path | Current deviation / risk | Proposed change | Verification point |
| --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |

## Authority section checklist

| Authority section | Read? | Decision | Reason | Affected files/components | Verification |
| --- | --- | --- | --- | --- | --- |
|  | yes/no | implement / out-of-scope / blocked |  |  |  |

## Scope

- Allowed files:
- Forbidden files / areas:
- Dependencies:
- Blockers:
- User-visible acceptance list:

## Post-implementation code review table

| Changed file | Why needed | Authority / acceptance mapping | Risk checked | Verification |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Duplicate / stale implementation check

- Duplicate component paths checked:
- Active runtime path confirmed:
- Stale APK / build variant / install freshness risk:
- If Android: device `lastUpdateTime` or install proof:
- If Web: served URL / viewport / build proof:

## Self-check before review

The worker must answer yes/no:

1. Did I read every authority section named by PM?
2. Did I list every named section in the authority checklist?
3. Did I avoid coding any unchecked section?
4. Did I prove the active runtime path, not just edit a plausible file?
5. Did I check duplicate/stale components?
6. Did I record build/install freshness?
7. Did I avoid touching forbidden scope?
8. Did I identify cleanup candidates?

Any `no` means the task may not be reported as review.

## Cleanup status

- Cleanup status:
- Cleanup candidates:
