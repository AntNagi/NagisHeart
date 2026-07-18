# Android Drawable UI Resource Manifest

> Owner: XoXo / UI
> Date: 2026-07-17
> Scope: HUD / system UI icons for Android integration
> Status: ready for yiyi integration

## Usage

These XML files are the UI-owned Android VectorDrawable resources for the current final UI authority. yiyi may copy the listed `ic_*.xml` files from this directory into:

`android/app/src/main/res/drawable/`

Do not treat this package as App Icon replacement. `ic_app_mark.xml` remains outside `TASK-20260717-006` because App Icon is still waiting for Ant confirmation.

## Required Icons

| Resource | File | SHA256 | Status |
|---|---|---|---|
| `ic_back` | `ic_back.xml` | `2C47FDAB50B4107DD02B3468486EE09EB491CCBA9B94ACA6C699E8EE9286C19F` | Ready |
| `ic_auto` | `ic_auto.xml` | `DB0C80C5245E6061A4254823CB9099356100232AA993F717B8D756CB73E544D7` | Ready |
| `ic_save` | `ic_save.xml` | `2F9E15F2F0F9EE8136535A4E6B902EFE6291DCA0F9A2657BBED890325085DBEA` | Ready |
| `ic_menu` | `ic_menu.xml` | `764D4EB2FCB49A5B2194C0FEF0901E9BBF2B5C0823E506CD20B4DA717DC44AEA` | Ready |
| `ic_continue` | `ic_continue.xml` | `71034EF7638626EC0CA5A63D85803064BD85E1B677EA111AADA8D5BBE9DB582D` | Ready |
| `ic_settings` | `ic_settings.xml` | `979734DF64C0CC92E01140D3FA685E76F447EFD6F36C81E5AC5F0F21CC4963E9` | Ready |
| `ic_gallery` | `ic_gallery.xml` | `3D1C26733697E662F2BDA154A48DF1EBB5C5172B51F21CD79B893767071948CB` | Ready |
| `ic_chapter` | `ic_chapter.xml` | `8DB9157095EE66E42FAA4F00B8CB6C28E464C3E2F0FABEBC6D8DB8A97D65FAF3` | Ready |
| `ic_skip` | `ic_skip.xml` | `5E91400B6EB98AF36C38791DC8A3FDE52DFA74463DAD38BD351D12EC724803FB` | Ready |
| `ic_backlog` | `ic_backlog.xml` | `234611EB1DA7FA1BC8998D86607F464791CB3B7B024F0E15ECAF94E46831B138` | Ready |
| `ic_lock` | `ic_lock.xml` | `0A653C8E13BDC53098DF8880D089FDA02987C1C37E60EDB6D6C0B89ECE61183C` | Ready |
| `ic_line` | `ic_line.xml` | `B537ECA73D24E91C9A6A253B9846E4F53FC206B1306B7122BAC111997D75B4F5` | Ready |
| `ic_pentagon_ring` | `ic_pentagon_ring.xml` | `F0170B645CD32D99ACD82B9369F885A759A7DB988E5650D5EDF769CCBAABFC52` | Ready |
| `ic_pentagon_fill` | `ic_pentagon_fill.xml` | `458C3CEF562F59977655928162853521EE062090506A87967426A8290A6E8752` | Ready |

## Prologue / Name Background Decision

Use the existing Android resource:

`android/app/src/main/res/drawable-nodpi/splash_bg.png`

It matches the final authority clean remeet background:

`handoff/yiyi_final_visual_slices_20260711/start_flow/splash_layers/splash_bg_remeet_clean_1080x1920.png`

SHA256 for both files:

`710162CEDD549802FF0A6240876B890536EE955FC175FAF4F00D5CA803BA42BB`

No new legacy asset path is needed. Do not add `android/app/src/main/assets/bg/poster_start_nagis_heart_bg_clean.png`; yiyi should route Prologue / Name to the existing `R.drawable.splash_bg`.

## Not Included

- App Icon / launcher replacement.
- TT Start long-screen resources.
- Chapter catalog.
- Chapter ending page.
- Section ending page.
- Old splash/keyart cleanup.
