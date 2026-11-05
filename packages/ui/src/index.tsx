import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

type PillProps = {
  label: string;
  style?: StyleProp<TextStyle>;
};

/** Example shared component. Not imported by apps/mobile yet. */
export function Pill({ label, style }: PillProps) {
  return <Text style={[styles.pill, style]}>{label}</Text>;
}

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

/** Example shared component. Not imported by apps/mobile yet. */
export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#6200ee',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
