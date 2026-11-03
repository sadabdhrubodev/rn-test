import { useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import RoundedButton from '../components/RoundedButton';

// Show the notification even when the app is open in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'sadab-dhrubo-default';
const STEP_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out`)), STEP_TIMEOUT_MS)
    ),
  ]);
}

async function ensurePermission(
  onStep: (step: string) => void
): Promise<boolean> {
  onStep('Checking notification permission…');
  const current = await withTimeout(
    Notifications.getPermissionsAsync(),
    'Permission check'
  );
  if (current.granted) {
    return true;
  }
  onStep('Requesting notification permission…');
  const requested = await withTimeout(
    Notifications.requestPermissionsAsync(),
    'Permission request'
  );
  return requested.granted;
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  // MIUI and other skins silently drop notifications posted without a
  // properly configured channel, so create ours explicitly instead of
  // relying on the library fallback channel.
  await withTimeout(
    Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Sadab Dhrubo notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6200ee',
    }),
    'Channel setup'
  );
}

export default function NotificationsScreen() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [needsSettings, setNeedsSettings] = useState(false);
  const attemptRef = useRef(0);

  const fireNotification = async (title: string, body: string) => {
    const attempt = ++attemptRef.current;
    const alive = () => attemptRef.current === attempt;
    setSending(true);
    setStatus(null);
    setNeedsSettings(false);
    try {
      const allowed = await ensurePermission((step) => {
        if (alive()) {
          setStatus(step);
        }
      });
      if (!alive()) {
        return;
      }
      if (!allowed) {
        setStatus(
          'Notification permission denied. Settings theke allow koro, tarpor abar try koro.'
        );
        setNeedsSettings(true);
        return;
      }
      if (alive()) {
        setStatus('Scheduling notification…');
      }
      await ensureChannel();
      if (!alive()) {
        return;
      }
      await withTimeout(
        Notifications.scheduleNotificationAsync({
          content: { title, body },
          // Channel-aware trigger fires immediately on OUR channel instead
          // of the unreliable fallback channel.
          trigger: { channelId: CHANNEL_ID },
        }),
        'Scheduling'
      );
      if (alive()) {
        setStatus('Notification sent. Shade namiye dekho.');
      }
    } catch (e) {
      if (alive()) {
        setStatus(
          e instanceof Error ? e.message : 'Failed to send notification.'
        );
        setNeedsSettings(true);
      }
    } finally {
      if (alive()) {
        setSending(false);
      }
    }
  };

  const fireTestNotification = () =>
    fireNotification('Test notification', 'Eta ekta test notification.');

  const fireCustomNotification = () => {
    const text = message.trim();
    if (!text) {
      setStatus('Age text area te kichu likho.');
      return;
    }
    setMessage('');
    return fireNotification('Sadab Dhrubo', text);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>
        Button press korle sathe sathe notification ashbe.
      </Text>

      <View style={styles.card}>
        {sending ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <RoundedButton title="Test notification" onPress={fireTestNotification} />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Custom message</Text>
        <TextInput
          style={styles.input}
          placeholder="Ekhane likho…"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />
        <RoundedButton title="Send notification" onPress={fireCustomNotification} />
      </View>

      {status && (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}

      {needsSettings && !sending && (
        <RoundedButton
          title="Open Settings"
          variant="outline"
          onPress={() => Linking.openSettings()}
        />
      )}

      <RoundedButton
        title="Go Back"
        variant="outline"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5ff',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
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
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 100,
    backgroundColor: '#f7f5ff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e3dcff',
    padding: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 14,
  },
  statusCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ede7ff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    color: '#4c1d95',
    textAlign: 'center',
  },
});
