import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { Truck } from '@/types';

export function TruckCard({ truck, onPress }: { truck: Truck; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View style={styles.avatar}>
        <Ionicons name="water-outline" size={28} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.plate}>{truck.plate}</Text>
        <Text style={styles.driver}>{truck.driverName}</Text>
        <View style={styles.row}>
          <Ionicons name="star" size={12} color={colors.accent} />
          <Text style={styles.rating}>{truck.rating.toFixed(1)}</Text>
          <Text style={styles.price}>${truck.pricePerPipa.toFixed(2)} / pipa</Text>
        </View>
      </View>
      <View style={[styles.dot, { backgroundColor: truck.isActive ? colors.success : colors.textMuted }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48, height: 48, borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  plate: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  driver: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  rating: { fontSize: 12, color: colors.textSecondary, marginRight: 8 },
  price: { fontSize: 12, fontWeight: '600', color: colors.primaryDark },
  dot: { width: 10, height: 10, borderRadius: radius.full },
});