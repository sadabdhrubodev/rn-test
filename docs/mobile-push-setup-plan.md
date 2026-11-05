# Mobile Push Setup — Plan (expo-notifications + expo-device)

Status: planned, not implemented yet. Backend push er companion doc:
`docs/express-push-plan.md` (FCM credential + `apps/api` flow okhane).

## Locked decisions

- Remote push: **Expo Push Service** (`expo-server-sdk` backend e).
- Mobile package: `expo-notifications` (ache) + `expo-device` (notun).
- Local notification capabilities same thakbe.

## Keno dutai lagbe

| Package | Status | Kaj |
|---|---|---|
| `expo-notifications` | Ache (`catalog:`) | Permission, channel, local fire, `getExpoPushTokenAsync()` |
| `expo-device` | Nai, add hobe | `isDevice` check (emulator token kaj kore na), brand/model (multi-device manage) |

## Phase 0 — Dashboard (age thekei plan e ache)

1. Firebase `google-services.json` → secret `GOOGLE_SERVICES_JSON`.
2. expo.dev free project → **projectId**.

## Phase 1 — Deps (`apps/mobile`)

1. Root catalog e `expo-device` entry (exact version SDK 53 onujayi,
   jemon `~7.1.4` — install er somoy `bunx expo install` resolve korbe).
2. `apps/mobile/package.json` e `"expo-device": "catalog:"`.
3. `bun install` + lockfile verify (`--frozen-lockfile`).
4. Kono Metro/babel change lagbe na (pure native module, autolinked).

## Phase 2 — Token flow (`lib/push.ts` notun + UI wiring)

1. `isDevice` check sobar age — emulator hole token skip + status e
   janiye dao ("Push token sudhu real device e").
2. Permission (`getPermissionsAsync` → na thakle `requestPermissionsAsync`).
3. `getExpoPushTokenAsync({ projectId })` — `extra.eas.projectId`
   theke ashbe (`app.json` e add hobe Phase 3 er plugin step e).
4. `POST <api>/devices { userId, token, device: { brand, model } }` —
   login/push-enable er por. Retry ekbar (network fail hole status e).
5. Tap-action deep link ekhon na (pore): notification tap → app open
   default behavior e thakbe.

## Phase 3 — Config (native change)

1. `plugins/withGoogleServices.js` (notun, ~30 line): prebuild e
   secret theke `google-services.json` `android/app/` e + gradle
   plugin apply.
2. `app.json`: `extra.eas.projectId` add.
3. Version bump (`expo.version` + `android.versionCode` +1) — native
   dep (`expo-device`) + config change, notun APK chara test impossible.

## Phase 4 — Testing (order)

1. `expo.dev/notifications` tool → token e direct push (FCM wiring
   proof, backend chara).
2. Emulator e `isDevice` false path: token skip + status message.
3. Real phone (release APK): permission → token → backend register →
   backend theke per-user push.
4. Foreground banner + tap-open check.

## Risk

- `google-services.json` secret chara Android remote push hobe na;
  local notification e effect nai.
- Emulator e push token test kora jay na — real device lagbei.
- `expo-device` read-only info dey, kono permission lage na.
