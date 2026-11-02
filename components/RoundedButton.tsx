import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
};

/** Pill-shaped button to replace the stock (blocky) React Native Button. */
export default function RoundedButton({
  title,
  onPress,
  variant = 'primary',
  style,
}: Props) {
  const filled = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        filled ? styles.primary : styles.outline,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, filled ? styles.primaryText : styles.outlineText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  primary: {
    backgroundColor: '#6200ee',
    elevation: 4,
    shadowColor: '#6200ee',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#6200ee',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#6200ee',
  },
});
