import { useState } from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import RoundedButton from '../../components/RoundedButton';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const canSend = rating > 0 && message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.thanksCircle}>
          <Ionicons name="checkmark" size={44} color="#fff" />
        </View>
        <Text style={styles.title}>Thanks!</Text>
        <Text style={styles.subtitle}>
          Your {rating}-star feedback was recorded.
        </Text>
        <RoundedButton title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.subtitle}>Rate the app and tell us more.</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={34}
              color="#6200ee"
            />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback here…"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        value={message}
        onChangeText={setMessage}
      />
      <RoundedButton title="Send feedback" onPress={handleSend} />
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>Go Back</Text>
      </Pressable>
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
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    maxWidth: 340,
    minHeight: 130,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e3dcff',
    padding: 14,
    fontSize: 15,
    color: '#222',
    marginBottom: 16,
  },
  thanksCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  back: {
    marginTop: 14,
    padding: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
  },
});
