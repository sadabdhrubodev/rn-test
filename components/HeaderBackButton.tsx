import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Always-visible back button for the native navigation header.
 * Goes back when history exists, otherwise returns to Home.
 */
export default function HeaderBackButton() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <Pressable
      onPress={handleBack}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 4,
    padding: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});
