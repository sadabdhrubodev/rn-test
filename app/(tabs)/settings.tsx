import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.label}>Notifications</Text>
            <Text style={styles.hint}>Get updates and alerts</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#ccc', true: '#6200ee' }}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.label}>Dark mode</Text>
            <Text style={styles.hint}>Easier on the eyes at night</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: '#6200ee' }}
          />
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
    marginBottom: 16,
    color: '#222',
  },
  card: {
    width: '100%',
    maxWidth: 340,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
