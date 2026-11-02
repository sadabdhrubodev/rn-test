# HelloWorldApp

Minimal "Hello World" React Native app built with [Expo](https://expo.dev) (TypeScript) and [Expo Router](https://docs.expo.dev/router/introduction/) stack navigation.

## Screens

- **Home (`/`)** — Shows "Hello World", a short welcome text, and a "Go to Details" button.
- **Details (`/details`)** — Shows "Details Screen" and a "Go Back" button.

## Get started

```bash
bun install
bun run start
```

Run on a device with Expo Go, or press `a` for Android emulator / `w` for web.

## Android APK via GitHub Actions

Push to `main` (or trigger manually via **Actions → Build Android APK → Run workflow**) to:

1. `bun install --frozen-lockfile`
2. `npx expo prebuild --platform android --clean`
3. `./gradlew assembleRelease --no-daemon`
4. Upload `android/app/build/outputs/apk/release/app-release.apk` (+ `version.json`) as the `app-release` artifact and to the `latest` release (the in-app updater checks `version.json` on launch).

Workflow file: `.github/workflows/build-apk.yml`.

## Project structure

```
.
├── app/
│   ├── _layout.tsx      # Stack navigator (Home + Details)
│   ├── index.tsx        # Home screen
│   └── details.tsx      # Details screen
├── app.json             # Expo config (android.package = com.example.helowrldApp)
├── lib/appUpdate.ts     # In-app update check + download logic
├── components/UpdatePrompt.tsx  # Update dialog UI
├── plugins/withArm64Only.js     # Config plugin: arm64-v8a-only builds
├── babel.config.js
├── tsconfig.json
├── package.json
└── .github/workflows/build-apk.yml
```
