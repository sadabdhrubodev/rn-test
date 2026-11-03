import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MENU = [
  {
    title: 'Details',
    subtitle: 'See the details screen',
    icon: 'document-text' as const,
    route: '/details' as const,
  },
  {
    title: 'Profile',
    subtitle: 'View your profile',
    icon: 'person' as const,
    route: '/profile' as const,
  },
  {
    title: 'Settings',
    subtitle: 'Tweak app preferences',
    icon: 'settings' as const,
    route: '/settings' as const,
  },
    {
      title: 'About',
      subtitle: 'App version and info',
      icon: 'information-circle' as const,
      route: '/about' as const,
    },
    {
      title: 'App Update',
      subtitle: 'Check for and install updates',
      icon: 'arrow-down-circle' as const,
      route: '/update' as const,
    },
  ];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="sparkles" size={36} color="#fff" />
        </View>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>
          Welcome to your Expo app with bottom tab navigation.
        </Text>
      </View>
      {MENU.map((item) => (
        <Pressable
          key={item.route}
          onPress={() => router.push(item.route)}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={22} color="#6200ee" />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f5ff',
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 24,
    padding: 28,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#6200ee',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
