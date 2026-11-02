import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function TruckDetail() {
  const { id } = useLocalSearchParams();
  const { trucks } = useApp();
  
  const truck = trucks.find(t => t.id === id);

  if (!truck) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={typography.h3}>Camión no encontrado</Text>
          <Button label="Volver" onPress={() => router.back()} style={{ marginTop: 20 }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} onPress={() => router.back()} />
          <Text style={typography.h3}>Detalle del Camión</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={typography.h2}>{truck.plate}</Text>
            <View style={styles.badge}>
              <Ionicons name="star" size={14} color={colors.accent} />
              <Text style={styles.badgeText}>{truck.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={typography.bodySm}>Conductor: {truck.driverName}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.priceRow}>
            <Text style={typography.body}>Precio por pipa</Text>
            <Text style={styles.price}>${truck.pricePerPipa.toFixed(2)}</Text>
          </View>
          <Text style={typography.caption}>Capacidad máxima: {truck.capacityPipas} pipas</Text>
        </View>

        <Button 
          label="Solicitar Servicio" 
            onPress={() => router.push(`/request/${truck.id}`)}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 20, fontWeight: '700', color: colors.primary },
});