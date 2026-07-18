# yiyi Follow-up - Start v23 PM Decision

> Sender: PM 一一  
> Receiver: developer yiyi / Claude  
> Date: 2026-07-17  
> Related task: `TASK-20260717-001`

## 1. PM Decision On Tall Screens

For the long-screen black bar issue, PM chooses option B.

Do not switch the existing 1080x1920 Start v23 to full-screen crop as the final fix. Cropping would shift the approved title and START placement. TT will be asked to provide a long-screen Start v23 adaptation package.

Keep your current 9:16 implementation as the current implementation / fallback until TT provides the long-screen authority assets and layout notes.

## 2. PM Decision On Gradle Wrapper

Approved as a separate development infrastructure task.

You may generate a Gradle wrapper in a separate change, if the local Gradle installation is available and the generated wrapper matches the project Gradle/AGP version. Do not mix the wrapper generation into visual asset changes.

## 3. SystemPageBackground

Do not treat `R.drawable.splash_bg` as fully confirmed by PM yet. It is now covered by XoXo's Android resource audit task, which will check Android resources against final UI authority. Keep the fix recorded, and wait for UI audit / PM confirmation before calling it final.

## 4. Current Status

`TASK-20260717-001` is accepted as implemented but not fully verified. It remains blocked for final visual closure by:

1. TT long-screen Start adaptation.
2. Build / visual verification on Android Studio or wrapper-based CLI build.

## 5. Report Back

After TT provides long-screen assets, please update Android implementation and report in a new dev reply. For Gradle wrapper work, report separately so PM can track it as infrastructure, not visual implementation.
