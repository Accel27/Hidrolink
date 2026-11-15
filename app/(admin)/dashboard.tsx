import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function AdminDashboard() {
  const { requests, trucks } = useApp();

  const totalTrucks = trucks.length;
  const totalRequests = requests.length;
  
  const completed = requests.filter(r => r.status === 'completed').length;
  const pending = requests.filter(r => r.status === 'pending').length;
  const cancelled = requests.filter(r => r.status === 'cancelled').length;
  
  const totalRevenue = requests
    .filter(r => r.status === 'completed')
    .reduce((sum, req) => sum + req.totalPrice, 0);

  const getBarWidth = (count: number) => {
    if (totalRequests === 0) return '0%';
    return `${(count / totalRequests) * 100}%`;
  };

  return (
    <Screen style={{ padding: 0, backgroundColor: colors.background }}>
      
      {/* HEADER DEL ADMINISTRADOR */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={typography.caption}>Administrador</Text>
            <Text style={typography.h3}>Control General</Text>
          </View>
        </View>
        <Pressable style={styles.iconButton} onPress={() => router.push('/(admin)/profile')}>
          <Ionicons name="person-circle-outline" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {/* TARJETAS DE METRICAS */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Ionicons name="car" size={24} color={colors.primary} />
            <Text style={typography.h2}>{totalTrucks}</Text>
            <Text style={typography.caption}>Camiones</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="water" size={24} color={colors.accent} />
            <Text style={typography.h2}>{totalRequests}</Text>
            <Text style={typography.caption}>Pedidos</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="cash" size={24} color={colors.success} />
            <Text style={typography.h2}>${totalRevenue.toFixed(1)}</Text>
            <Text style={typography.caption}>Ingresos</Text>
          </View>
        </View>

        {/* GRAFICO DE BARRAS */}
        <View style={styles.chartCard}>
          <Text style={[typography.h3, { marginBottom: spacing.md }]}>Estado de los Pedidos</Text>
          
          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Completados</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: getBarWidth(completed), backgroundColor: colors.success }]} />
            </View>
            <Text style={styles.barValue}>{completed}</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Pendientes</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: getBarWidth(pending), backgroundColor: colors.warning }]} />
            </View>
            <Text style={styles.barValue}>{pending}</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.barLabel}>Cancelados</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: getBarWidth(cancelled), backgroundColor: colors.danger }]} />
            </View>
            <Text style={styles.barValue}>{cancelled}</Text>
          </View>
        </View>

        {/* TOP CONDUCTORES */}
        <Text style={typography.h3}>Top Conductores</Text>
        
        {trucks.sort((a, b) => b.rating - a.rating).map((driver, index) => (
          <View key={driver.id} style={styles.driverCard}>
            <View style={styles.rankCircle}>
              <Text style={{ color: index === 0 ? colors.accent : colors.textMuted, fontWeight: 'bold' }}>#{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={typography.body}>{driver.driverName}</Text>
              <Text style={typography.bodySm}>Placa: {driver.plate}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textPrimary }}>{driver.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={16} color={colors.accent} />
            </View>
          </View>
        ))}
      </ScrollView>
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
    backgroundColor: '#1E293B', // Color oscuro para el admin
    alignItems: 'center', justifyContent: 'center',
  },
  iconButton: {
    padding: spacing.sm, backgroundColor: colors.background, borderRadius: radius.full,
  },
  metricsRow: { flexDirection: 'row', gap: spacing.sm },
  metricCard: { flex: 1, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 4 },
  chartCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  barLabel: { width: 80, fontSize: 12, color: colors.textSecondary },
  barTrack: { flex: 1, height: 12, backgroundColor: colors.background, borderRadius: radius.full, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.full },
  barValue: { width: 20, fontSize: 12, fontWeight: 'bold', textAlign: 'right', color: colors.textPrimary },
  driverCard: { flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: spacing.md },
  rankCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
});