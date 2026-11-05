# Sadab Dhrubo — Turborepo Monorepo

Expo React Native app (`apps/mobile`) + example shared packages, managed
with [Bun workspaces](https://bun.sh/docs/install/workspaces) (versions
centralized in the root `catalog`) and
[Turborepo](https://turbo.build/repo) pipelines.

## Get started

```bash
bun install            # root theke — sob workspace install hoy
bun run start           # mobile dev server (turbo -> apps/mobile)
bun run android         # dev build + emulator
bun run typecheck       # sob workspace e tsc
```

## Android APK via GitHub Actions

Push to `main` (or trigger manually via **Actions → Build Android APK → Run workflow**) to:

1. `bun install --frozen-lockfile` (root)
2. `bunx expo prebuild --platform android --clean` (in `apps/mobile`)
3. `./gradlew assembleRelease --no-daemon`
4. Upload `apps/mobile/android/app/build/outputs/apk/release/app-release.apk` (+ `version.json`) as the `app-release` artifact and to the `latest` release (the in-app updater checks `version.json` on launch).

Workflow file: `.github/workflows/build-apk.yml`.

## Project structure

```
.
├── apps/
│   └── mobile/              # Expo app (Sadab Dhrubo, com.example.helowrldApp)
│       ├── app/             # Expo Router routes (drawer + stack screens)
│       ├── assets/ components/ lib/ plugins/
│       ├── app.json         # Expo config (version + versionCode ekhane bump hoy)
│       ├── metro.config.js  # Monorepo watchFolders wiring
│       ├── babel.config.js  # reanimated plugin last e thakte hobe
│       └── package.json     # Deps "catalog:" diye root theke ase
├── packages/
│   ├── ui/                  # Example shared components (@repo/ui, scaffold only)
│   └── utils/               # Example shared helpers (@repo/utils, scaffold only)
├── package.json             # Workspaces + catalog (sob version ekhane) + turbo scripts
├── turbo.json               # Pipeline: build / typecheck / clean / android / start
└── .github/workflows/build-apk.yml
```

## Versions (catalog)

Sob dependency version root `package.json` er `catalog` field e thake.
Workspace package gulo `"catalog:"` reference use kore — version change
lagle sudhu root catalog edit kore `bun install` chalalei hoy.
