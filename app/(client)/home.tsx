import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { TruckCard } from '@/components/TruckCard';
import { RealMap } from '@/components/RealMap';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function ClientHome() {
  const { trucks, refreshTrucks, isRefreshing } = useApp();
  const activeTrucks = trucks.filter(t => t.isActive);

  return (
    <Screen style={{ padding: 0, backgroundColor: colors.background }}>
      
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={typography.caption}>Bienvenido de vuelta,</Text>
            <Text style={typography.h3}>Cliente Demo</Text>
          </View>
        </View>
        <Pressable style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.badge} />
        </Pressable>
      </View>

      <RealMap trucks={activeTrucks} height={340} />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
        <Text style={[typography.h3, { marginBottom: 4 }]}>Camiones disponibles</Text>
        <Text style={typography.bodySm}>Encuentra agua cerca de tu ubicación</Text>
      </View>

      <FlatList
        data={activeTrucks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refreshTrucks(true)} colors={[colors.primary]} />
        }
        ListEmptyComponent={() => (
          <Text style={[typography.bodySm, { textAlign: 'center', marginTop: spacing.xl }]}>
            No hay camiones disponibles en este momento.
          </Text>
        )}
        renderItem={({ item }) => (
          <TruckCard 
            truck={item} 
            onPress={() => router.push(`/truck/${item.id}`)} 
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  iconButton: {
    padding: spacing.sm, backgroundColor: colors.background, borderRadius: radius.full,
  },
  badge: {
    position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger,
  }
});