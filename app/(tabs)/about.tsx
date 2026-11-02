import * as Application from 'expo-application';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const versionName = Application.nativeApplicationVersion ?? 'unknown';
  const versionCode = Application.nativeBuildVersion ?? 'unknown';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.subtitle}>
        Minimal Hello World app built with Expo and React Native.
      </Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>App</Text>
          <Text style={styles.value}>HelloWorld</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>{versionName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Build</Text>
          <Text style={styles.value}>{versionCode}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f5ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: '#777',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6200ee',
  },
});
