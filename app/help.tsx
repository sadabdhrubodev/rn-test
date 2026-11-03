import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import RoundedButton from '../components/RoundedButton';

const FAQS = [
  {
    question: 'How do I check for app updates?',
    answer:
      'Open the App Update screen from Home or Settings and tap "Check for update". If a newer version exists you can download and install it from there.',
  },
  {
    question: 'Why did I not get an update popup?',
    answer:
      'The popup only appears when the published version has a higher build number than your installed app. If both are the same, you are already up to date.',
  },
  {
    question: 'How do I go back to the previous screen?',
    answer:
      'Use the back arrow in the header, the Go Back button on stack screens, or your phone system back button.',
  },
  {
    question: 'Where do I send feedback?',
    answer:
      'Use the Feedback screen from the Home page to rate the app and send us a message.',
  },
];

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & FAQ</Text>
      <Text style={styles.subtitle}>Tap a question to see the answer.</Text>
      {FAQS.map((item, index) => {
        const open = openIndex === index;
        return (
          <View key={item.question} style={styles.card}>
            <Pressable
              onPress={() => setOpenIndex(open ? null : index)}
              style={styles.row}
            >
              <Text style={styles.question}>{item.question}</Text>
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#6200ee"
              />
            </Pressable>
            {open && <Text style={styles.answer}>{item.answer}</Text>}
          </View>
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
    width: '100%',
    maxWidth: 340,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginRight: 8,
  },
  answer: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    lineHeight: 20,
  },
});
