# Backend-theke User-wise Push — Plan

Status: planned, not implemented yet. Express app er CI pore hobe.

## Locked decisions

- Backend `apps/api` te thakbe (monorepo, alada repo na) — **NestJS +
  Drizzle (latest RC) + PostgreSQL**.
- Production send sobsomoy backend theke, user-wise.
- App e **local notification capabilities o thakbe** (niche alada
  section) — backend charao app nije schedule/fire korte parbe.

## Architecture

```
apps/mobile  →  POST apps/api/devices {userId, expoPushToken}
apps/api     →  POST .../notify {userId, title, body}
              →  Expo Push API → FCM → phone
packages/*   →  untouched (app-backend shared code lagle pore)
```

FCM sorasori use hobe na. App e `expo-notifications` ache, tai
**Expo Push Service** use hobe — backend sudhu Expo API te POST korbe.

## Phase 0 — Dashboard kaj (manual)

1. Firebase console (console.firebase.google.com): notun project +
   Android app (`com.example.helowrldApp`) → `google-services.json`
   download. Repo te commit na — GitHub secret `GOOGLE_SERVICES_JSON`
   (base64) e rakhte hobe.
2. expo.dev: free project create kore **projectId** copy. EAS Build
   lagbe na — sudhu push token er identity er jonno.

## Phase 1 — App (`apps/mobile`)

1. `plugins/withGoogleServices.js` (~30 line, notun): prebuild er somoy
   secret theke `google-services.json` `android/app/` e bosabe + gradle
   plugin apply korbe. Plugin chara `android/` regenerate hole file ta
   muche jabe.
2. `app.json`: `extra.eas.projectId` add (Phase 0 er Expo projectId).
   `expo-notifications` plugin ja ache tai thakbe.
3. `lib/push.ts` (notun): permission →
   `getExpoPushTokenAsync({ projectId })` →
   `POST <api>/devices`. Call hobe login/Notifications screen er
   "Enable push" button theke. Tap-action deep link ekhon na (pore).
4. Local Test button + channel/timeout code **same thakbe** —
   diagnostic tool hisebe.
5. Version bump (`expo.version` + `android.versionCode` +1) — native
   change, notun APK chara push test kora jabe na.

## Phase 2 — Backend (`apps/api`, pore)

- NestJS + TypeScript, DB Drizzle ORM (latest RC) + PostgreSQL, dep
  `expo-server-sdk` (root catalog entry).
- `POST /devices` `{userId, token}` → validate + upsert. Table:
  `userId ↔ token[]` (ek user er multiple device thakte pare).
  Schema + migration Drizzle diye (`drizzle-kit generate`).
- `POST /notify` `{userId, title, body, data?}` → oi user er token ber
  kore chunk + send + receipts check; `DeviceNotRegistered` token delete.
- Duitar endpoint ei simple bearer auth (nahole je keu push pathate
  parbe).
- Package naam `@repo/api`; `turbo.json` e api task
  (`build`/`start` persistent no-cache/`typecheck`).
- **CI ekhon na — pore hobe** (ei doc er bahire).

## Local notification capabilities (app-side, thakbe)

Backend push er pasapashi app nijeo local notification fire korte
parbe — internet/backend charai. Already implemented
(`apps/mobile/app/(drawer)/notifications.tsx`):

- **Test button** — press korlei static test notification fire hoy
  (permission auto-check + HIGH importance channel
  `sadab-dhrubo-default` + MAX priority, jate MIUI silently drop na kore).
- **Custom message** — text area te likhe Send chaple oi text body te
  notification ase; pathanor por field clear hoy.
- **Status + timeout** — prottek step (checking → requesting →
  scheduling → sent-at time) status card e dekha jay; native call hang
  korle 15–60s timeout e error + Open Settings button ase.
- **Foreground banner** — app khola thakleo banner + list e show hoy
  (`setNotificationHandler`).
- **Battery note** — page tei hint ache: MIUI delay korle Settings >
  Apps > Sadab Dhrubo > Battery saver “No restrictions” + Autostart on.

Pore chaile local schedule o add kora jabe (jemon daily reminder —
`trigger: { seconds, repeats: true }`), kintu backend push er sathe
conflict hobe na: channel alada rakha jabe (`local-reminders`).

## Phase 3 — Testing (order)

1. Backend chara: expo.dev/notifications tool theke token e push
   (FCM wiring proof).
2. `apps/api` local run + curl register → notify → real phone e check.
3. Derite asle MIUI battery note: Settings > Apps > Sadab Dhrubo >
   Battery saver e "No restrictions" + Autostart on.

## Phase 4 — Release

Push → CI (google-services secret niye) release build → popup diye
phone update → Notifications screen theke push enable → backend theke
per-user test push.

## Risk

- `google-services.json` secret hisebe ditei hobe, nahole Android
  remote push kaj korbe na (local test notification e effect nai).
- Expo Push API free tier fair-use limit e chole (~hajar device fine);
  lakh-scale lagle tokhon FCM direct e jete hobe.
- iOS scope er baire (sudhu Android package + FCM).
