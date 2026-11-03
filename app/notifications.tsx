import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import RoundedButton from '../components/RoundedButton';

type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: 'cloud-download' | 'checkmark-circle' | 'information-circle';
};

const INITIAL: Notification[] = [
  {
    id: '1',
    title: 'Welcome to Sadab Dhrubo',
    body: 'Thanks for installing the app. Explore the tabs below.',
    time: '2h ago',
    icon: 'information-circle',
  },
  {
    id: '2',
    title: 'Update check finished',
    body: 'Your app is on the latest version. Nothing to do.',
    time: 'Yesterday',
    icon: 'checkmark-circle',
  },
  {
    id: '3',
    title: 'Tip: try the Feedback screen',
    body: 'Tell us what to build next from the Home page.',
    time: '2 days ago',
    icon: 'cloud-download',
  },
];

export default function NotificationsScreen() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const unread = INITIAL.length - readIds.size;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>
        {unread === 0 ? 'You are all caught up.' : `${unread} unread`}
      </Text>
      {INITIAL.map((item) => {
        const read = readIds.has(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() =>
              setReadIds((prev) => new Set(prev).add(item.id))
            }
            style={[styles.card, read && styles.cardRead]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={22} color="#6200ee" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!read && <View style={styles.dot} />}
          </Pressable>
        );
      })}
      <RoundedButton title="Go Back" onPress={() => router.back()} />
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
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardRead: {
    opacity: 0.65,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ede7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  cardBody: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
    marginLeft: 8,
  },
});
