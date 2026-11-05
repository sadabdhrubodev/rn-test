# `@repo/ui`

Example shared UI package (scaffold only — `apps/mobile` does not import
it yet).

To wire it into the app later:

```ts
import { Pill } from '@repo/ui';
```

No extra Metro config is needed beyond `apps/mobile/metro.config.js`
(`watchFolders` already covers the workspace root).
