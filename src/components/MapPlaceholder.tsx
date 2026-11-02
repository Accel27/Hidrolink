import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';

export function MapPlaceholder({ height = 220 }: { height?: number }) {
  return (
    <View style={[styles.map, { height }]}>
      <Ionicons name="map-outline" size={48} color={colors.primary} />
      <Text style={styles.label}>Mapa de Maracaibo</Text>
      <Text style={styles.sub}>Aquí se mostrarán los camiones en vivo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.primaryDark },
  sub: { fontSize: 12, color: colors.textSecondary },
});