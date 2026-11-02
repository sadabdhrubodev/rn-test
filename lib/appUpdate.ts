import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

// Single place to change if the repo ever moves.
const GITHUB_REPO = 'sadabdhrubo1997/rn-hello-world';
// Published next to app-release.apk by the GitHub workflow (see
// .github/workflows/build-apk.yml "Generate version.json" step).
const VERSION_URL = `https://github.com/${GITHUB_REPO}/releases/latest/download/version.json`;
// Fallback when the workflow has not published version.json yet.
const APK_URL = `https://github.com/${GITHUB_REPO}/releases/latest/download/app-release.apk`;

export type RemoteVersion = {
  versionCode: number;
  versionName: string;
  apkUrl: string;
};

export type UpdateCheckResult =
  | { available: true; remote: RemoteVersion; currentVersionName: string }
  | { available: false };

function currentBuildNumber(): number {
  const raw = Application.nativeBuildVersion;
  const parsed = raw != null ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Returns whether a newer APK is published. Never throws — any failure
 * (offline, Expo Go, dev client, bad payload) means "no update".
 */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  if (Platform.OS !== 'android') {
    return { available: false };
  }
  // Inside Expo Go / dev builds the installed version is meaningless and
  // downloading an APK makes no sense.
  if (Constants.appOwnership === 'expo') {
    return { available: false };
  }
  const currentVersionCode = currentBuildNumber();
  const currentVersionName = Application.nativeApplicationVersion ?? 'unknown';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let res: Response;
    try {
      res = await fetch(VERSION_URL, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (!res.ok) {
      return { available: false };
    }
    const remote = (await res.json()) as Partial<RemoteVersion>;
    if (
      typeof remote.versionCode !== 'number' ||
      !Number.isFinite(remote.versionCode)
    ) {
      return { available: false };
    }
    if (remote.versionCode > currentVersionCode) {
      return {
        available: true,
        remote: {
          versionCode: remote.versionCode,
          versionName: String(remote.versionName ?? remote.versionCode),
          apkUrl: typeof remote.apkUrl === 'string' ? remote.apkUrl : APK_URL,
        },
        currentVersionName,
      };
    }
    return { available: false };
  } catch {
    return { available: false };
  }
}

/**
 * Downloads the APK (reporting 0..1 progress) and opens the system
 * installer. Resolves once the installer is launched.
 */
export async function downloadAndInstallApk(
  apkUrl: string,
  onProgress: (fraction: number) => void
): Promise<void> {
  const targetUri = (FileSystem.cacheDirectory ?? '') + 'app-release.apk';
  const task = FileSystem.createDownloadResumable(
    apkUrl,
    targetUri,
    {},
    (progress) => {
      if (progress.totalBytesExpectedToWrite > 0) {
        onProgress(
          progress.totalBytesWritten / progress.totalBytesExpectedToWrite
        );
      }
    }
  );
  const result = await task.downloadAsync();
  if (!result || result.status !== 200) {
    throw new Error(`Download failed (status ${result?.status ?? 'unknown'})`);
  }
  const contentUri = await FileSystem.getContentUriAsync(result.uri);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    type: 'application/vnd.android.package-archive',
  });
}
