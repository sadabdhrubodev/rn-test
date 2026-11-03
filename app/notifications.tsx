import { useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
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

async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export default function NotificationsScreen() {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fireTestNotification = async () => {
    setSending(true);
    setStatus(null);
    try {
      const allowed = await ensurePermission();
      if (!allowed) {
        setStatus('Notification permission denied. Allow it from Settings.');
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test notification',
          body: 'Eta ekta test notification.',
        },
        trigger: null,
      });
      setStatus('Test notification sent. Shade namiye dekho.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  const fireCustomNotification = async () => {
    const text = message.trim();
    if (!text) {
      setStatus('Age text area te kichu likho.');
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const allowed = await ensurePermission();
      if (!allowed) {
        setStatus('Notification permission denied. Allow it from Settings.');
        return;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sadab Dhrubo',
          body: text,
        },
        trigger: null,
      });
      setStatus('Notification sent. Shade namiye dekho.');
      setMessage('');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Failed to send notification.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>
        Button press korlei sathe sathe notification ashbe.
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

      <RoundedButton
        title="Go Back"
        variant="outline"
        onPress={() => router.back()}
      />
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
