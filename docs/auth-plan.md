# Token-based Auth — Plan (simple)

Status: planned, not implemented yet. Backend ekhono banano hoyni —
ekhane sudhu plan thakbe, code na.

## Locked decisions

- Auth style: **token-based, simple**. Kono auth library na
  (Better Auth bad).
- Backend session er against e opaque token generate korbe; app sei
  token phone e store korbe; prottek request er header e token jabe.
- Login method: email + password only. OAuth thakbe na.
- Backend: `apps/api` (NestJS + Drizzle latest RC + PostgreSQL) —
  ekhono scaffold hoyni, age seta lagbe.
- App: `expo-secure-store` (token storage, native) + plain `fetch`.

## Token design (simple)

- Login/signup success e server `crypto.randomBytes(32)` diye opaque
  token banay, tar SHA-256 hash DB `sessions` table e rakhe
  (`userId`, `tokenHash`, `createdAt`).
- **Token er kono expiry nai — lifetime token.** `expiresAt` column
  thakbe na, ar server expiry check korbe na. Token sudhu logout
  (session row delete) ba manual revoke e invalid hobe.
- Phone e **raw token** jay (ekbar, response e); DB te sudhu hash
  thake — DB leak holeo token use kora jabe na.
- Prottek authed request: `Authorization: Bearer <token>`.
- Server middleware hash miliye `userId` ber kore; na mille `401`.
- Logout: server session row delete + phone theke token delete.

## Package list (exact)

| Package | Kothay | Kaj |
|---|---|---|
| `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` | `apps/api` | API framework |
| `reflect-metadata`, `rxjs` | `apps/api` | Nest peer/runtime |
| `drizzle-orm` (latest RC) | `apps/api` | DB access (pg dialect) |
| `drizzle-kit` (latest RC) | `apps/api` dev | Migration generate |
| `postgres` | `apps/api` | pg driver (native chara) |
| `bcryptjs` | `apps/api` | Password hash (pure JS, native build jhamela nai) |
| `expo-secure-store` | `apps/mobile` (notun, native) | Token storage on phone |
| `expo-server-sdk` | `apps/api` (pore, push er somoy) | Per-user push send (ekhon na) |

Sob version root `catalog` theke ashbe. `expo-secure-store` native
module bole app side e version bump + notun APK lagbe.

## Flow overview

```
App launch → Splash → SecureStore token check + GET /auth/me
  ├── token NAI / 401  →  Login screen (Signup link soho)
  └── token OK         →  Drawer Home (user logged in)
```

## Phase 0 — Dependency (order)

1. `apps/api` scaffold age sesh koro (NestJS + Drizzle + pg).
2. Local pg lagbe (already ache — `sadabdhrubo` user e connect hoy)
   — migration + dev test er jonno alada DB (jemon
   `sadab_dhrubo_dev`).

## Phase 1 — Backend (`apps/api`)

1. Schema (`drizzle/schema.ts`): `users` (`id`, `email` unique,
   `passwordHash`, `createdAt`), `sessions` (`id`, `userId` FK,
   `tokenHash` unique, `createdAt`). Kono expiry column nai.
2. `drizzle-kit generate` → migration SQL review → local pg te migrate.
3. Endpoints (prefix `/auth`):
   - `POST /auth/signup` `{ email, password, name? }` → validate
     (email format, password min 8) → bcryptjs hash → user create →
     session+token issue → `{ user, token }`.
   - `POST /auth/login` `{ email, password }` → verify → notun
     session+token issue (purano device er token o valid thakbe) →
     `{ user, token }`.
   - `GET /auth/me` (Bearer guard) → `{ user }`.
   - `POST /auth/logout` (Bearer guard) → session delete → `{ ok: true }`.
4. Rate-limit login/signup (simple in-memory, brute force thekano) —
   ek line-er middleware level, pore Redis e newa jabe.

## Phase 2 — Mobile app auth flow design (`apps/mobile`)

### New files

- `lib/api.ts` — `API_BASE_URL` ek jaygay (dev: emulator `10.0.2.2`,
  real phone LAN IP; prod: API domain) + `authedFetch()` wrapper:
  SecureStore theke token niye `Authorization` header lagay, `401`
  pele token clear kore caller ke janay.
- `lib/auth.ts` — token get/set/delete (`expo-secure-store`) +
  `signup/login/me/logout` API call + `AuthContext`
  (`{ user, loading, signIn, signUp, signOut }`).
- `app/(drawer)/login.tsx` — hidden drawer route: email + password,
  error text, loading, "Signup" link.
- `app/(drawer)/signup.tsx` — hidden drawer route: name + email +
  password, validation, success hole auto-login + Home.
- Profile screen: logged-in user er email + Logout button.

### Launch + guard flow (`app/_layout.tsx`)

1. Splash cholakalin token load + `GET /auth/me` background e.
2. `splashDone` howar por:
   - `loading` → kichu dekhabo na (splash overlay thake).
   - user nai → `router.replace('/login')`.
   - user ache → normal drawer Home.
3. `signOut()` er por token delete + `router.replace('/login')`.
4. Kono API call e `401` → token clear + Login screen.

### Push integration (pore, kintu design ready)

- Login/signup success er por `POST /devices { userId, expoPushToken }`
  — token ekhon user-er sathe linked, backend theke per-user push
  (ekta alada step e `expo-server-sdk` diye) er sathe mile jabe.
- Logout e device token unregister (optional, pore).

### Screen-level rules

- Login/Signup: hamburger thakbe na — logged-out user drawer menu
  dekhbe na.
- Drawer menu sudhu logged-in obosthay reachable; guard root level e.
- Form validation client side, server error message sorasori dekhano.

## Phase 3 — Testing

1. API local + pg: curl signup → login → me (200) → logout → me (401).
2. Wrong password / bad token / revoked token → 401 path check.
3. App dev build: signup/login/logout flow, restart diye token persist check.
4. Backend theke session delete kore revoke test (app 401 → login).
5. Push token `userId` soho jacche kina check (pore push step e).

## Phase 4 — Release

Push → CI release build → popup update → phone e login flow test.
`expo-secure-store` native dep bole version bump policy onujayi
`expo.version` + `versionCode` +1.

## Risk / note

- Backend er `DATABASE_URL` secret hisebe lagbe (local `.env`, prod e
  pore backend CI te). Password kokhono plain text e jabe na, DB te
  sudhu bcrypt hash + token hash.
- Dev API URL LAN IP diye dite hoy — `lib/api.ts` e ek jaygay thakbe.
- Token lifetime bole expiry/refresh niye kono kaj nai. Ek device theke
  logout korle sudhu oi device er token invalid hobe; onno device er
  token cholte thakbe.
