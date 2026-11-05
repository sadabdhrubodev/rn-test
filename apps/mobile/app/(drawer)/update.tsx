import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Application from 'expo-application';
import {
  checkForUpdate,
  downloadAndInstallApk,
  type RemoteVersion,
} from '../../lib/appUpdate';
import RoundedButton from '../../components/RoundedButton';

type Phase =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'available'; remote: RemoteVersion }
  | { kind: 'downloading'; remote: RemoteVersion; progress: number }
  | { kind: 'upToDate'; remoteVersion: string }
  | { kind: 'error'; message: string };

export default function UpdateScreen() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  const currentVersionName = Application.nativeApplicationVersion ?? 'unknown';
  const currentVersionCode = Application.nativeBuildVersion ?? 'unknown';

  const handleCheck = async () => {
    setPhase({ kind: 'checking' });
    try {
      const result = await checkForUpdate();
      if (result.available) {
        setPhase({ kind: 'available', remote: result.remote });
      } else {
        setPhase({ kind: 'upToDate', remoteVersion: currentVersionName });
      }
    } catch (e) {
      setPhase({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Update check failed',
      });
    }
  };

  const handleUpdate = async () => {
    if (phase.kind !== 'available') {
      return;
    }
    const { remote } = phase;
    setPhase({ kind: 'downloading', remote, progress: 0 });
    try {
      await downloadAndInstallApk(remote.apkUrl, (fraction) =>
        setPhase({ kind: 'downloading', remote, progress: fraction })
      );
      setPhase({ kind: 'idle' });
    } catch (e) {
      setPhase({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Download failed',
      });
    }
  };

  const percent =
    phase.kind === 'downloading' ? Math.round(phase.progress * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Update</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Installed version</Text>
        <Text style={styles.value}>
          {currentVersionName} (build {currentVersionCode})
        </Text>
      </View>

      {phase.kind === 'available' && (
        <View style={styles.card}>
          <Text style={styles.label}>New version available</Text>
          <Text style={styles.value}>
            {phase.remote.versionName} (build {phase.remote.versionCode})
          </Text>
        </View>
      )}

      {phase.kind === 'upToDate' && (
        <View style={[styles.card, styles.successCard]}>
          <Text style={styles.successText}>
            App already updated to the latest version.
          </Text>
        </View>
      )}

      {phase.kind === 'error' && (
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorText}>{phase.message}</Text>
        </View>
      )}

      {phase.kind === 'downloading' && (
        <View style={styles.card}>
          <Text style={styles.label}>Downloading update… {percent}%</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
      )}

      {phase.kind === 'checking' ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : phase.kind === 'available' ? (
        <RoundedButton title="Update now" onPress={handleUpdate} />
      ) : phase.kind === 'downloading' ? (
        <RoundedButton title={`Downloading… ${percent}%`} onPress={() => {}} />
      ) : (
        <RoundedButton title="Check for update" onPress={handleCheck} />
      )}

      {(phase.kind === 'available' ||
        phase.kind === 'upToDate' ||
        phase.kind === 'error') && (
        <Pressable onPress={handleCheck} style={styles.retry}>
          <Text style={styles.retryText}>Check again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f7f5ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  successCard: {
    borderColor: '#22c55e',
    borderWidth: 1,
  },
  successText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15803d',
    textAlign: 'center',
  },
  errorCard: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
    textAlign: 'center',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e5e5e5',
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#6200ee',
  },
  retry: {
    marginTop: 16,
    padding: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
  },
});
