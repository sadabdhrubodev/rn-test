# Agent Instructions — HelloWorldApp

## Language rule

- If the user writes in Bangla (Bengali script) or Banglish (Bangla in Roman
  letters), respond in Banglish using Roman letters A–Z/a–z only.
- NEVER output Bengali script characters anywhere: chat, code, file contents,
  commit messages, or terminal output.

## Version bump policy (mandatory)

The in-app updater (`lib/appUpdate.ts` + `components/UpdatePrompt.tsx` +
`app/update.tsx`) only offers an update when the published `version.json`
has a **higher `versionCode`** than the installed app. Same code = silent,
no popup. So:

- **Every change that alters the built APK MUST bump the version** in
  `app.json` before finishing:
  - `expo.version`: bump patch (`1.0.1` → `1.0.2`); bump minor for
    features/big UI changes.
  - `expo.android.versionCode`: **always +1, never skip or reuse a number.**
- This applies to: app screens/navigation, components, splash, icons,
  assets, `app.json`, config plugins, native deps, updater logic.
- This does NOT apply to: `*.md` docs/plans, comments only, CI workflow
  tweaks that don't change APK output (still mention it in the summary).
- The CI workflow (`.github/workflows/build-apk.yml`) generates
  `version.json` from `app.json` and publishes it with the APK to the
  rolling `latest` release — no manual `version.json` editing needed.
- Never lower `versionCode`. Never ship two different APKs with the same
  `versionCode`.
- After bumping, verify with:
  `adb shell dumpsys package com.example.helowrldApp | grep versionCode`

## Update UX contract (do not break)

- `UpdatePrompt` mounts only after the splash finishes (`splashDone` in
  `app/_layout.tsx`) so the modal is never hidden behind the splash overlay.
- `checkForUpdate()` runs on launch AND on app foreground (`AppState`);
  it never throws — any failure means "no update".
- `app/update.tsx` is the manual screen: Check button → available shows
  "Update now" + progress; latest shows
  "App already updated to the latest version."

## Build & verify defaults

- Package manager is `bun` (`bun install --frozen-lockfile`); `bun.lock`
  is the lockfile.
- Release build: `npm run build:apk:release` (prebuild `--clean` +
  `assembleRelease`, arm64-v8a only).
- Typecheck: `npx tsc --noEmit` must pass.
- Emulator is `emulator-5554` (arm64-v8a); install with
  `adb -s emulator-5554 install -r android/app/build/outputs/apk/release/app-release.apk`,
  then launch and check `logcat` for `FATAL EXCEPTION`.
- Do not commit, amend, push, or open PRs unless explicitly asked.
