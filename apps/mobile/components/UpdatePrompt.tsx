import { useEffect, useState } from 'react';
import { AppState, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { checkForUpdate, downloadAndInstallApk, type RemoteVersion } from '../lib/appUpdate';

type Phase =
  | { kind: 'idle' }
  | { kind: 'available'; remote: RemoteVersion }
  | { kind: 'downloading'; remote: RemoteVersion; progress: number }
  | { kind: 'error'; remote: RemoteVersion; message: string };

/**
 * Checks the GitHub release on launch and offers a one-tap APK update.
 * Silent unless a newer version is actually available.
 */
export default function UpdatePrompt() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  useEffect(() => {
    let cancelled = false;
    const runCheck = async () => {
      const result = await checkForUpdate();
      if (cancelled || !result.available) {
        return;
      }
      // Never override an in-progress download/error dialog.
      setPhase((current) =>
        current.kind === 'idle'
          ? { kind: 'available', remote: result.remote }
          : current
      );
    };
    runCheck();
    // If the app was already open when a release went out, checking again
    // on foreground means the popup shows as soon as the user opens the app.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        runCheck();
      }
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  if (phase.kind === 'idle') {
    return null;
  }

  const dismiss = () => setPhase({ kind: 'idle' });

  const startDownload = async () => {
    if (phase.kind !== 'available') {
      return;
    }
    const { remote } = phase;
    setPhase({ kind: 'downloading', remote, progress: 0 });
    try {
      await downloadAndInstallApk(remote.apkUrl, (fraction) =>
        setPhase({ kind: 'downloading', remote, progress: fraction })
      );
      // System installer is now open; hide the prompt behind it.
      setPhase({ kind: 'idle' });
    } catch (e) {
      setPhase({
        kind: 'error',
        remote,
        message: e instanceof Error ? e.message : 'Download failed',
      });
    }
  };

  const percent =
    phase.kind === 'downloading' ? Math.round(phase.progress * 100) : 0;
  const versionLabel =
    phase.kind === 'available' || phase.kind === 'downloading'
      ? phase.remote.versionName
      : '';

  return (
    <Modal transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {phase.kind === 'error' ? (
            <>
              <Text style={styles.title}>Update failed</Text>
              <Text style={styles.message}>{phase.message}</Text>
              <View style={styles.row}>
                <Pressable style={styles.secondaryButton} onPress={dismiss}>
                  <Text style={styles.secondaryText}>Close</Text>
                </Pressable>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    setPhase({ kind: 'available', remote: phase.remote })
                  }
                >
                  <Text style={styles.primaryText}>Retry</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Update available</Text>
              <Text style={styles.message}>
                A new version ({versionLabel}) is ready. Update now?
              </Text>
              {phase.kind === 'downloading' ? (
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${percent}%` }]}
                  />
                </View>
              ) : null}
              <Text style={styles.percent}>
                {phase.kind === 'downloading' ? `${percent}%` : ' '}
              </Text>
              <View style={styles.row}>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={dismiss}
                  disabled={phase.kind === 'downloading'}
                >
                  <Text style={styles.secondaryText}>Later</Text>
                </Pressable>
                <Pressable
                  style={styles.primaryButton}
                  onPress={startDownload}
                  disabled={phase.kind === 'downloading'}
                >
                  <Text style={styles.primaryText}>
                    {phase.kind === 'downloading' ? 'Downloading…' : 'Update now'}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e5e5',
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#6200ee',
  },
  percent: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
    marginBottom: 12,
    minHeight: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
