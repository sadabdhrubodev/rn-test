/** Example shared helpers. Not imported by apps/mobile yet. */

export function formatVersion(versionName: string, versionCode: number): string {
  return `${versionName} (build ${versionCode})`;
}

export function isNewerVersion(remoteCode: number, currentCode: number): boolean {
  return (
    Number.isFinite(remoteCode) &&
    Number.isFinite(currentCode) &&
    remoteCode > currentCode
  );
}
