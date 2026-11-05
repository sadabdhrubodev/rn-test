import { router, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Header left buttons: the hamburger menu is always visible (opens the
 * drawer from any page), plus a back arrow whenever there is history.
 */
export default function HeaderMenuButton() {
  const navigation = useNavigation();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        <Ionicons name="menu" size={24} color="#fff" />
      </Pressable>
      {canGoBack && (
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 4,
    padding: 6,
  },
  pressed: {
    opacity: 0.7,
  },
});
