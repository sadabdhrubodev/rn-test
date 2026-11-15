# NestJS + oRPC API — Plan (mobile app er sathe connected)

Status: planned, not implemented yet. `apps/api` scaffold ekhono hoyni —
ekhane sudhu plan thakbe, code na.

## Purpose

Monorepo te ekta NestJS backend (`apps/api`) add kora hobe, jeta mobile
app (`apps/mobile`, Expo SDK 53) er sathe oRPC diye end-to-end
type-safe connect thakbe. Ei doc ekta self-contained, tool-agnostic
engineering plan — kono specific AI agent/model er upor depend kore na.

## Locked decisions

- Backend `apps/api` tei thakbe (monorepo, alada repo na) — **NestJS +
  Drizzle (latest RC) + PostgreSQL**. `docs/auth-plan.md` ar
  `docs/express-push-plan.md` er decisions er sathe consistent.
- API layer: **oRPC** — type-safe RPC. Mobile client ar NestJS server
  dutoi **ek shared contract** theke types pay; kono hand-written REST
  contract ba `fetch` URL string na.
- Integration: official **`@orpc/nest`** — `ORPCModule.forRoot()` +
  `@Implement` decorator. Express adapter (default `platform-express`),
  `bootstrap()` e `bodyParser: false`.
- **Contract-first**: contract `packages/contract` e thakbe (pure types +
  Zod schemas + procedure routes, handler chara). Server implement kore,
  mobile oi contract theke type-safe client banay. RN bundle e server
  code jabe na.
- Validation: **Zod** (oRPC Standard Schema support, native).
- Auth: **token-based** (`auth-plan.md` onujayi opaque token). oRPC er
  context/middleware e `Authorization: Bearer` resolve kore `user`;
  protected procedure e `.use()` guard.
- Client data layer: `@orpc/client` + `RPCLink` (fetch) +
  `@orpc/tanstack-query` (React hooks, caching/loading state).

## Architecture

```
apps/mobile (Expo SDK 53)              apps/api (NestJS + @orpc/nest)
  @orpc/client + RPCLink + tanstack-query   @Implement(contract.x) → Drizzle → PostgreSQL
        │                                              ▲
        └──────── type-safe call ──────────────────────┘
        ▲                          ▲
        └────── packages/contract (@repo/contract) ────┘
                 (shared contract + Zod schemas, types only)
```

## Monorepo layout (change summary)

```
apps/
  api/                        # NestJS + @orpc/nest (contract implement)
  mobile/                     # Expo app — @orpc/client + tanstack-query add
packages/
  contract/                   # @repo/contract — oRPC contract + Zod (shared)
  ui/ utils/                  # unchanged
```

- `turbo.json` e `api` er jonno task add (`typecheck` / `build` /
  `start` persistent no-cache).
- Root `package.json` e `@repo/contract` workspace already `packages/*`
  er under e chole asbe; api dev script root e add.

## Package list (exact)

| Package | Kothay | Kaj |
|---|---|---|
| `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` | `apps/api` | NestJS framework |
| `reflect-metadata`, `rxjs` | `apps/api` | Nest peer/runtime |
| `@orpc/server` | `apps/api` | Implement contract, middleware, `ORPCError`, `onError` |
| `@orpc/contract` | `apps/api` + `packages/contract` | Contract define (types/routing) |
| `@orpc/nest` | `apps/api` | NestJS integration (`ORPCModule`, `@Implement`) |
| `@orpc/client` | `apps/mobile` | Type-safe client (`createORPCClient`, `RPCLink`) |
| `@orpc/tanstack-query` | `apps/mobile` | React hooks integration |
| `@tanstack/react-query` | `apps/mobile` | Query cache (peer dep) |
| `@orpc/openapi` | `apps/api` (optional, pore) | Same router theke auto OpenAPI spec + Scalar UI |
| `zod` | `packages/contract` (shared) | Input/output validation schema |
| `drizzle-orm` (latest RC) + `drizzle-kit` + `postgres` | `apps/api` | DB access (already locked) |
| `bcryptjs` | `apps/api` | Password hash (already locked) |

Sob version root `catalog` e add hobe; workspace gulo `"catalog:"`
reference korbe. Mobile side `@orpc/*` + `@tanstack/react-query` pure JS
deps — kono native module na, so **APK version bump lagbe na** (tokhon
lagbe jokhon `expo-secure-store` auth step e asbe).

## Phase 0 — Workspace setup

1. Root `catalog` e sob version entry + `bun install` + lockfile verify
   (`--frozen-lockfile`).
2. `packages/contract` scaffold (`@repo/contract`, `tsconfig.json`
   strict + mobile/api dui side e compatible).
3. `apps/api` scaffold: `NestFactory.create(AppModule,
   { bodyParser: false })`, port `3000`, `.env` e `DATABASE_URL` +
   local dev DB (`sadab_dhrubo_dev`).
4. `turbo.json` e `api` tasks + root scripts (`dev:api`, `typecheck`).

## Phase 1 — Contract (`packages/contract`)

Pure definitions, handler chara:

```ts
// packages/contract/src/auth.ts
import { oc } from '@orpc/contract'
import { z } from 'zod'

export const me = oc
  .route({ method: 'GET', path: '/auth/me' })
  .output(z.object({ id: z.string(), email: z.string(), name: z.string().nullable() }))
  .errors({ UNAUTHORIZED: {} })

export const contract = oc.router({
  auth: { signup: ..., login: ..., me, logout: ... },
  user: { ... },
  devices: { ... },   // push-plan er device register (pore)
})
```

- `.route()` dewa thakle `@orpc/openapi` theke same router diye auto
  OpenAPI spec + Scalar UI pai (debug/web admin er jonno).
- Zod schemas ekhanei — validation ek source of truth.

## Phase 2 — Backend (`apps/api`)

1. `AppModule` e `ORPCModule.forRoot({ ... })` import; `context` e
   `ExecutionContext` theke Express request ber kore initial context e
   `request` dey.
2. Controller e `@Implement(contract.x)` diye procedure implement —
   NestJS guard/interceptor normal moto chole (auth-plan er Bearer
   middleware ekhanei boshe).
3. Auth middleware/guard: `Authorization` header parse → token hash DB
   lookup → `context.user` set; protected procedure e `.use(auth)`.
   Login/signup/logout Drizzle diye (auth-plan schema: `users`,
   `sessions`, kono expiry na).
4. Error handling: `onError` interceptor + `ORPCError`
   (`UNAUTHORIZED`, `BAD_REQUEST`) — client e type-safe error union.
5. Endpoint mapping: auth-plan er list (`/auth/me`, `/auth/signup`,
   `/auth/login`, `/auth/logout`) oRPC procedure hisebe.

## Phase 3 — Mobile client (`apps/mobile`)

1. `lib/orpc.ts` (notun): `RPCLink` + `createORPCClient(link)` — `url`
   ekhanei config (dev: emulator `10.0.2.2:3000`, real phone LAN IP;
   prod API domain), `headers` e SecureStore token attach.
2. `lib/api.ts` (auth-plan e planned) er `authedFetch` wrapper er jaygay
   oRPC client boshe — `401` path same thakbe (token clear + login
   redirect).
3. TanStack Query wrapper: `QueryClientProvider` + `@orpc/tanstack-query`
   hooks — screen gulo `useQuery`/`useMutation` diye data anbe.
4. Login/signup flow auth-plan er `lib/auth.ts` + `AuthContext` er
   sathe mile jabe — sudhu transport oRPC hobe.

## Phase 4 — Push tie-in (pore, ekhon plan e)

- `devices` router (`register`, `unregister`) contract e already chilo —
  push-plan er `POST /devices` oRPC procedure hoye jabe.
- `notify` router backend-internal use er jonno (expo-server-sdk) —
  ekhono implement na.

## Phase 5 — Testing (order)

1. `apps/api` local run → curl diye oRPC endpoint check.
2. `@orpc/openapi` Scalar UI te procedure list + request test.
3. Typecheck sob workspace (`turbo run typecheck`) — contract e ekta
   field change korle mobile + server dui side e TYPE ERROR ashe.
4. App dev build: login → me → logout flow, token persist, `401` →
   login redirect.
5. Contract change kore (jemon `user.name` add) type-safe break proof.

## Phase 6 — Release

- Pure JS dep bole apatoto version bump na (sudhu `apps/api` deploy +
  mobile code push notun build).
- Auth step (`expo-secure-store`) ashle `expo.version` + `versionCode`
  +1 (root `CLAUDE.md` policy).

## Risk / note

- **Expo SDK 53 fetch**: RPCLink er basic query/mutation
  (non-streaming JSON) thik ache; **SSE/streaming** (asyncIteratorObject)
  e RN er non-streaming fetch issue (oRPC docs: SDK 53–55 note).
  Streaming lagle fetch polyfill ba WebSocket link
  (`@orpc/client/websocket`) — initial scope e lagbe na.
- oRPC **v2 beta** ache (package rename: `@orpc/react` → `@orpc/next`,
  `@orpc/openapi-client` → `@orpc/openapi` merge). Plan **stable v1
  (latest)** e — beta thekano, pore migration guide onujayi jump.
- `contract` package theke client side e **type-only import** dhorbo
  (`import type`), nahole RN bundle e server code mix hobe.
- Dev API URL LAN IP diye dite hoy — `lib/orpc.ts` e ek jaygay thakbe.
- NestJS `bodyParser: false` na dile oRPC er bracket-notation parser
  NestJS urlencoded parser er sathe clash korbe — always off.
