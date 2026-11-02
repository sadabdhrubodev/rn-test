# Auto-Update via S3/R2 — Implementation Plan

Status: planned, not implemented yet.

## Problem

Repo ta private. Ekhon `lib/appUpdate.ts` ei URL gulo hit kore:

- `https://github.com/<owner>/<repo>/releases/latest/download/version.json`
- `https://github.com/<owner>/<repo>/releases/latest/download/app-release.apk`

Private repo te unauthenticated request 404 khay, tai installed app theke update check kaaj korbe na. App er moddhe GitHub token rakha jabe na (APK theke token extract kora jay).

## Solution overview

Repo private thakbe. Shudhu build output (`version.json` + APK) ekta public-read bucket e upload hobe (Cloudflare R2 ba AWS S3). App token chara sorasori bucket URL theke check/download korbe.

```
GitHub Actions (private repo)
        |
        | aws s3 cp / rclone
        v
Public bucket  ->  version.json
               ->  apk/app-v<versionCode>.apk
        ^
        | HTTPS GET (no auth)
        |
Installed app (lib/appUpdate.ts)
```

## Confirmed decisions

Ei duto confirm korte hobe implementation shuru korar age:

1. Provider: Cloudflare R2 (recommended, free egress) naki AWS S3?
2. Public URL: custom domain (recommended) naki R2 `r2.dev` subdomain / S3 website endpoint?

Custom domain hole ekta stable base URL pawa jay, jemon `https://updates.example.com`. `r2.dev` e rate limit ache, tai production e custom domain better.

## Target design

### version.json (shape same thakbe)

```json
{
  "versionCode": 2,
  "versionName": "1.0.1",
  "apkUrl": "https://updates.example.com/apk/app-v2.apk"
}
```

`apkUrl` absolute URL hobe, tai app side e fallback logic er dorkar nai.

### Object keys

- `version.json` — always latest
- `apk/app-v<versionCode>.apk` — versioned, overwrite hoy na

Versioned APK key use korar karon: same key overwrite korle CDN/browser cache purano APK dite pare. Versioned key te `Cache-Control: public, max-age=31536000, immutable` safely deya jay.

Optional: `app-release.apk` alias o rakha jay latest er jonno, kintu app `version.json` er `apkUrl` use korbe.

### Cache headers

| Object | Cache-Control |
| --- | --- |
| `version.json` | `no-store` (must, nahole purano version cache hoye update miss hobe) |
| `apk/app-v<code>.apk` | `public, max-age=31536000, immutable` |

Upload order: age APK, pore `version.json`. Eta na hole client notun version dekhe 404 APK download korte pare.

## Bucket setup (one-time, manual)

### R2 variant

1. Bucket create koro, e.g. `rn-hello-world-dist`.
2. Public access on koro:
   - quick path: `r2.dev` public URL enable, or
   - recommended: custom domain (`updates.example.com`) Cloudflare DNS diye.
3. R2 API token create koro with Object Read & Write, shudhu ei bucket e scoped.
4. Token theke `Account ID`, `Access Key ID`, `Secret Access Key` note koro.
5. Endpoint hobe: `https://<account-id>.r2.cloudflarestorage.com`.

### S3 variant

1. Bucket create koro (region note koro).
2. Public read on:
   - Block Public Access off (ba sudhu dorkari policy allow), ar
   - bucket policy te shudhu `version.json` ar `apk/*` er `s3:GetObject` allow koro. Puro bucket public na korai better.
3. IAM user/role create koro with `s3:PutObject` + `s3:DeleteObject` on `arn:aws:s3:::<bucket>/version.json` ar `arn:aws:s3:::<bucket>/apk/*`.
4. Access key note koro.
5. Custom domain chaile CloudFront + ACM lagbe; na chaile `https://<bucket>.s3.<region>.amazonaws.com` diyeo chalbe.

CORS config er dorkar nai — request native app theke jay, browser theke na.

## GitHub repo secrets

R2:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

S3:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`

Custom domain base URL ta workflow e env hisebe rakho, e.g. `DIST_BASE_URL: https://updates.example.com`.

## Code changes

### 1. `lib/appUpdate.ts`

- `GITHUB_REPO` / `VERSION_URL` / `APK_URL` constants badle:

```ts
const DIST_BASE_URL = 'https://updates.example.com';
const VERSION_URL = `${DIST_BASE_URL}/version.json`;
const APK_URL = `${DIST_BASE_URL}/apk/app-release.apk`; // fallback only
```

- `checkForUpdate()` logic same thakbe (versionCode compare, 15s timeout, never throws).
- `downloadAndInstallApk()` same thakbe (public URL, auth header lagbe na).
- `Constants.appOwnership === 'expo'` guard same thakbe.

### 2. `.github/workflows/build-apk.yml`

- `Generate version.json` step e `apkUrl` = `${DIST_BASE_URL}/apk/app-v${versionCode}.apk`.
- Notun upload step (release publish er age):

S3/R2 duitar jonnoi `aws` CLI kaaj kore (R2 S3-compatible):

```yaml
- name: Upload to bucket
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
    AWS_DEFAULT_REGION: auto
    ENDPOINT: https://${{ secrets.R2_ACCOUNT_ID }}.r2.cloudflarestorage.com
  run: |
    aws s3 cp android/app/build/outputs/apk/release/app-release.apk \
      "s3://${{ secrets.R2_BUCKET }}/apk/app-v${VERSION_CODE}.apk" \
      --endpoint-url "$ENDPOINT" \
      --cache-control "public, max-age=31536000, immutable"
    aws s3 cp version.json \
      "s3://${{ secrets.R2_BUCKET }}/version.json" \
      --endpoint-url "$ENDPOINT" \
      --content-type "application/json" \
      --cache-control "no-store"
```

- `VERSION_CODE` step-level env hisebe `app.json` theke ber koro, jate `version.json` ar upload key mis-match na hoy.
- GitHub Release publish steps rakha jay (private repo, internal record hisebe), kintu app tar upor depend korbe na.
- `main` push e upload hobe; tag build eo upload korba kina seta decide korte hobe (recommendation: duitai, same versioned key).

### 3. Signature / package continuity

- Same signing key thakle update install smoothly hobe. CI te debug keystore hole release APK signature change hote pare — eita alada issue, kintu update flow er jonno must same signer.

## Verification plan

1. Bucket theke unauthenticated GET:

```bash
curl -i https://updates.example.com/version.json
curl -I https://updates.example.com/apk/app-v2.apk
```

Check: 200, correct `Cache-Control`, `Content-Type: application/json` for version.json.

2. `versionCode` bump koro (`app.json` → `expo.android.versionCode`), push `main`, CI green dekho.

3. Bucket e notun object ar updated `version.json` confirm koro.

4. Emulator e purano versionCode er APK install koro, app launch koro:
   - update prompt ase
   - download progress hoy
   - system installer open hoy
   - install er por notun versionCode dekha jay

5. Negative tests:
   - bucket URL wrong / offline → app crash korbe na, silently "no update"
   - `version.json` malformed → no update
   - `versionCode` same → no prompt

## Rollback

- App e baked URL change korle purano installed app rollback pabe na; tai bucket/FQDN ta stable rakho.
- Emergency e `version.json` e purano `versionCode` diye APK URL purano versioned key e point koro, tahole keu notun update pabe na.
- CI upload step fail korle app er kichu hoy na; GitHub Release e artifact thakbe.

## Risks

- Public APK link shareable — jkeu download korte parbe. Eta accept kora hocche (APK already user er phone e thake, secret kichu nai).
- `version.json` cache bhul hole update miss hobe — tai `no-store` mandatory.
- Same object key overwrite + CDN cache = stale APK; versioned key diye solve.
- Signing key mismatch hole install fail korbe — CI signing key stable korte hobe.

## Files touched (implementation)

- `lib/appUpdate.ts` — bucket URLs
- `.github/workflows/build-apk.yml` — versionCode env, `apkUrl`, upload steps
- `docs/auto-update-s3-r2-plan.md` — ei doc update
- `README.md` — update flow er short note (optional)

## Open questions

1. R2 naki S3?
2. Custom domain ki ache? Na thakle `r2.dev` diye start kore pore domain e move korba?
3. Tag builds theke bucket e upload korba, naki shudhu `main` push?
4. APK er jonno versioned key er sathe `app-release.apk` alias o rakhte chao?
