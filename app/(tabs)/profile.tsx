import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>S</Text>
      </View>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.row}>
          <Text style={styles.label}>Name: </Text>Sadab Dhrubo
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Email: </Text>sadab@example.com
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Member since: </Text>2026
        </Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 8,
    backgroundColor: '#f7f5ff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ede7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#6200ee',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
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
  row: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#6200ee',
  },
});
