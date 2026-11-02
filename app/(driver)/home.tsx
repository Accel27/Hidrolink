import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { RealMap } from '@/components/RealMap';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography, radius } from '@/theme';

export default function DriverHome() {
  const { requests, updateRequestStatus, trucks, toggleTruckAvailability } = useApp();
  const { truckId } = useAuth();

  const myTruck = trucks.find(t => t.id === truckId);
  const myPlate = myTruck ? myTruck.plate : 'Sin camión';
  const isAvailable = myTruck?.isActive || false; 

  const myRequests = requests.filter(r => r.truckId === truckId);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'accepted');

  return (
    <Screen style={{ padding: 0 }}>
      
      {/* MAPA FIJO ARRIBA (Fuera del ScrollView) */}
      <RealMap 
        trucks={isAvailable && myTruck ? [myTruck] : []} 
        height={400} 
        isDriverView={isAvailable}
        requests={isAvailable ? [...pendingRequests, ...acceptedRequests] : acceptedRequests} 
      />

      {/* SOLO LAS TARJETAS TIENEN SCROLL */}
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl }}>
        
        <View style={styles.header}>
          <View>
            <Text style={typography.h2}>Panel Conductor</Text>
            <Text style={typography.bodySm}>Camión: {myPlate}</Text>
          </View>
        </View>

        <View style={styles.toggleCard}>
          <View>
            <Text style={typography.h3}>Estado de servicio</Text>
            <Text style={typography.bodySm}>{isAvailable ? 'Recibiendo solicitudes' : 'Desconectado'}</Text>
          </View>
          <Switch 
            value={isAvailable} 
            onValueChange={(val) => toggleTruckAvailability(truckId!, val)} 
            trackColor={{ true: colors.primary, false: colors.border }} 
          />
        </View>

        {acceptedRequests.length > 0 && (
          <View style={{ gap: spacing.md }}>
            <Text style={[typography.h3, { color: colors.primary }]}>En Camino</Text>
            {acceptedRequests.map(req => (
              <View key={req.id} style={[styles.requestCard, { borderColor: colors.primary }]}>
                <View style={styles.row}>
                  <Text style={typography.body}>{req.clientName}</Text>
                  <Text style={styles.price}>${req.totalPrice.toFixed(2)}</Text>
                </View>
                <Text style={typography.bodySm}>{req.pipasRequested} pipas · {req.clientAddress}</Text>
                <Pressable 
                  style={[styles.actionBtn, { backgroundColor: colors.success, marginTop: spacing.sm }]} 
                  onPress={() => updateRequestStatus(req.id, 'completed')}
                >
                  <Text style={{ color: colors.white, fontWeight: '600' }}>Marcar como Entregado</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Text style={typography.h3}>Solicitudes Pendientes</Text>
        {!isAvailable ? (
          <Text style={typography.bodySm}>Actívate para recibir solicitudes.</Text>
        ) : pendingRequests.length === 0 ? (
          <Text style={typography.bodySm}>No hay solicitudes nuevas.</Text>
        ) : (
          pendingRequests.map(req => (
            <View key={req.id} style={styles.requestCard}>
              <View style={styles.row}>
                <Text style={typography.body}>{req.clientName}</Text>
                <Text style={styles.price}>${req.totalPrice.toFixed(2)}</Text>
              </View>
              <Text style={typography.bodySm}>{req.pipasRequested} pipas · {req.clientAddress}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.actionBtn} onPress={() => updateRequestStatus(req.id, 'cancelled')}>
                  <Text style={{ color: colors.danger, fontWeight: '600' }}>Rechazar</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => updateRequestStatus(req.id, 'accepted')}>
                  <Text style={{ color: colors.white, fontWeight: '600' }}>Aceptar</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  requestCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: colors.success },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  actionBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
});