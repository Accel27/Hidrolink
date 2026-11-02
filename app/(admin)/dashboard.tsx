import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function AdminDashboard() {
  const { requests, trucks } = useApp();

  // Calculamos las métricas reales
  const totalTrucks = trucks.length;
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  
  // Simulamos unos ingresos multiplicando el precio por pipa
  const totalRevenue = requests
    .filter(r => r.status === 'completed')
    .reduce((sum, req) => sum + req.totalPrice, 0);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: spacing.lg }}>
        <Text style={typography.h2}>Panel de Control</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Ionicons name="car" size={28} color={colors.primary} />
            <Text style={typography.h1}>{totalTrucks}</Text>
            <Text style={typography.caption}>Camiones</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="water" size={28} color={colors.accent} />
            <Text style={typography.h1}>{totalRequests}</Text>
            <Text style={typography.caption}>Solicitudes Totales</Text>
          </View>
        </View>

        <View style={[styles.metricsRow, { marginTop: -spacing.sm }]}>
          <View style={styles.metricCard}>
            <Ionicons name="checkmark-done" size={28} color={colors.success} />
            <Text style={typography.h1}>{completedRequests}</Text>
            <Text style={typography.caption}>Entregados</Text>
          </View>
          <View style={styles.metricCard}>
            <Ionicons name="cash" size={28} color={colors.success} />
            <Text style={typography.h1}>${totalRevenue.toFixed(2)}</Text>
            <Text style={typography.caption}>Ingresos Simulados</Text>
          </View>
        </View>

        <Text style={[typography.h3, { marginTop: spacing.md }]}>Conductores Registrados</Text>
        
        {trucks.map(driver => (
          <View key={driver.id} style={styles.driverCard}>
            <View style={{ flex: 1 }}>
              <Text style={typography.body}>{driver.driverName}</Text>
              <Text style={typography.bodySm}>Placa: {driver.plate} · Rating: {driver.rating} ⭐</Text>
            </View>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metricsRow: { flexDirection: 'row', gap: spacing.md },
  metricCard: { flex: 1, backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 4 },
  driverCard: { flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
});