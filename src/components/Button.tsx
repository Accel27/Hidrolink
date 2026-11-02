import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.accent },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: colors.primaryLight },
  danger: { backgroundColor: colors.danger },
  label: { fontSize: 15, fontWeight: '600' },
  primaryLabel: { color: colors.white },
  secondaryLabel: { color: colors.white },
  outlineLabel: { color: colors.primary },
  ghostLabel: { color: colors.primaryDark },
  dangerLabel: { color: colors.white },
});