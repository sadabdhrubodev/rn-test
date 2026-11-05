# Agent Instructions — Sadab Dhrubo Monorepo

## Language rule

- If the user writes in Bangla (Bengali script) or Banglish (Bangla in Roman
  letters), respond in Banglish using Roman letters A–Z/a–z only.
- NEVER output Bengali script characters anywhere: chat, code, file contents,
  commit messages, or terminal output.

## Monorepo layout (do not break)

- App lives in `apps/mobile/` (Expo Router, drawer + stack screens).
- Example shared packages in `packages/ui`, `packages/utils`
  (`@repo/ui`, `@repo/utils`) — scaffold only, app imports them না.
- Sob dependency version root `package.json` er `catalog` field e thake;
  workspace package gulo `"catalog:"` reference use kore. Version change
  lagle sudhu root catalog edit koro, prottek package e na.

## Version bump policy (mandatory)

The in-app updater (`apps/mobile/lib/appUpdate.ts` +
`apps/mobile/components/UpdatePrompt.tsx` +
`apps/mobile/app/update.tsx`) only offers an update when the published
`version.json` has a **higher `versionCode`** than the installed app. Same
code = silent, no popup. So:

- **Every change that alters the built APK MUST bump the version** in
  `apps/mobile/app.json` before finishing:
  - `expo.version`: bump patch (`1.0.7` → `1.0.8`); bump minor for
    features/big UI changes.
  - `expo.android.versionCode`: **always +1, never skip or reuse a number.**
- This applies to: app screens/navigation, components, splash, icons,
  assets, `apps/mobile/app.json`, config plugins, native deps, updater logic,
  `apps/mobile/metro.config.js`.
- This does NOT apply to: `*.md` docs/plans, comments only, CI workflow
  tweaks that don't change APK output, `packages/*` scaffold changes that
  the app does not import (still mention it in the summary).
- The CI workflow (`.github/workflows/build-apk.yml`) generates
  `version.json` from `apps/mobile/app.json` and publishes it with the APK
  to the rolling `latest` release — no manual `version.json` editing needed.
- Never lower `versionCode`. Never ship two different APKs with the same
  `versionCode`.
- After bumping, verify with:
  `adb shell dumpsys package com.example.helowrldApp | grep versionCode`

## Update UX contract (do not break)

- `UpdatePrompt` mounts only after the splash finishes (`splashDone` in
  `apps/mobile/app/_layout.tsx`) so the modal is never hidden behind the splash overlay.
- `checkForUpdate()` runs on launch AND on app foreground (`AppState`);
  it never throws — any failure means "no update".
- `apps/mobile/app/update.tsx` is the manual screen: Check button → available shows
  "Update now" + progress; latest shows
  "App already updated to the latest version."

## Build & verify defaults

- Package manager is `bun` (`bun install --frozen-lockfile`); `bun.lock`
  is the lockfile. Turbo runs workspace tasks (`turbo run typecheck`).
- Release build (run in `apps/mobile/`): `bun run build:apk:release`
  (prebuild `--clean` + `assembleRelease`, arm64-v8a only).
- Typecheck: `turbo run typecheck` must pass (or `bunx tsc --noEmit` inside
  `apps/mobile/`).
- Emulator is `emulator-5554` (arm64-v8a); install with
  `adb -s emulator-5554 install -r apps/mobile/android/app/build/outputs/apk/release/app-release.apk`,
  then launch and check `logcat` for `FATAL EXCEPTION`.
- Do not commit, amend, push, or open PRs unless explicitly asked.
