# HelloWorldApp

Minimal "Hello World" React Native app built with [Expo](https://expo.dev) (TypeScript) and [Expo Router](https://docs.expo.dev/router/introduction/) stack navigation.

## Screens

- **Home (`/`)** — Shows "Hello World", a short welcome text, and a "Go to Details" button.
- **Details (`/details`)** — Shows "Details Screen" and a "Go Back" button.

## Get started

```bash
npm install
npx expo start
```

Run on a device with Expo Go, or press `a` for Android emulator / `w` for web.

## Android APK via GitHub Actions

Push to `main` (or trigger manually via **Actions → Build Android APK → Run workflow**) to:

1. `npx expo prebuild --platform android --clean`
2. `./gradlew assembleDebug --no-daemon`
3. Upload `android/app/build/outputs/apk/debug/app-debug.apk` as the `app-debug` artifact.

Workflow file: `.github/workflows/build-apk.yml`.

## Project structure

```
.
├── app/
│   ├── _layout.tsx      # Stack navigator (Home + Details)
│   ├── index.tsx        # Home screen
│   └── details.tsx      # Details screen
├── app.json             # Expo config (android.package = com.example.helloworldapp)
├── babel.config.js
├── tsconfig.json
├── package.json
└── .github/workflows/build-apk.yml
```
