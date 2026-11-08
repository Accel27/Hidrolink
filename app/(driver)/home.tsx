import { View, Text, StyleSheet, Switch, Pressable, SectionList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { RealMap } from '@/components/RealMap';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography, radius } from '@/theme';

export default function DriverHome() {
  const { requests, updateRequestStatus, trucks, toggleTruckAvailability, messages } = useApp();
  const { truckId } = useAuth();

  const myTruck = trucks.find(t => t.id === truckId);
  const myPlate = myTruck ? myTruck.plate : 'Sin camión';
  const isAvailable = myTruck?.isActive || false; 

  const myRequests = requests.filter(r => r.truckId === truckId);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'accepted');

  // 1. Agrupamos los datos en secciones con sus títulos
  const sections = [
    { title: 'En Camino', data: acceptedRequests },
    { title: 'Solicitudes Pendientes', data: pendingRequests },
  ].filter(sec => sec.data.length > 0); // Ocultamos la sección si está vacía

  return (
    <Screen style={{ padding: 0 }}>
      
      {/* MAPA FIJO */}
      <RealMap 
        trucks={isAvailable && myTruck ? [myTruck] : []} 
        height={350} 
        isDriverView={isAvailable}
        requests={isAvailable ? [...pendingRequests, ...acceptedRequests] : acceptedRequests} 
      />

      {/* HEADER Y SWITCH FIJOS */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md }}>
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
      </View>

      {/* LISTA CON SECCIONES (Títulos + Tarjetas) */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        
        // Renderiza los títulos ("En Camino", "Solicitudes Pendientes")
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[typography.h3, { marginTop: spacing.md, marginBottom: spacing.sm, color: title === 'En Camino' ? colors.primary : colors.textPrimary }]}>
            {title}
          </Text>
        )}

        // Renderiza las tarjetas
        renderItem={({ item: req }) => {
          const isAccepted = req.status === 'accepted';
          const unreadCount = messages.filter(m => m.requestId === req.id && m.senderId !== 'driver' && !m.isRead).length;

          return (
            <View style={[styles.requestCard, isAccepted && { borderColor: colors.primary, marginBottom: spacing.md }]}>
              
              <View style={styles.row}>
                <Text style={typography.body}>{req.clientName}</Text>
                <Text style={styles.price}>${req.totalPrice.toFixed(2)}</Text>
              </View>
              
              <Text style={typography.bodySm}>{req.pipasRequested} pipas · {req.clientAddress}</Text>
              
              {isAccepted ? (
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                  <Pressable 
                    onPress={() => router.push(`/chat/${req.id}`)}
                    style={{ flex: 1, backgroundColor: colors.primaryLight, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                  >
                    <Ionicons name="chatbubbles" size={18} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>Chat</Text>
                    {unreadCount > 0 && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationText}>{unreadCount}</Text>
                      </View>
                    )}
                  </Pressable>

                  <Pressable 
                    style={{ flex: 1, backgroundColor: colors.success, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' }} 
                    onPress={() => updateRequestStatus(req.id, 'completed')}
                  >
                    <Text style={{ color: colors.white, fontWeight: '600' }}>Entregado</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.actions}>
                  <Pressable style={styles.actionBtn} onPress={() => updateRequestStatus(req.id, 'cancelled')}>
                    <Text style={{ color: colors.danger, fontWeight: '600' }}>Rechazar</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => updateRequestStatus(req.id, 'accepted')}>
                    <Text style={{ color: colors.white, fontWeight: '600' }}>Aceptar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}

        // Si no hay pedidos en absoluto
        ListEmptyComponent={() => (
          <Text style={[typography.bodySm, { textAlign: 'center', marginTop: spacing.xl }]}>
            {!isAvailable ? 'Actívate para recibir solicitudes.' : 'No hay solicitudes nuevas por ahora.'}
          </Text>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  requestCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: colors.success },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  actionBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  notificationBadge: { backgroundColor: colors.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notificationText: { color: colors.white, fontSize: 11, fontWeight: 'bold' },
});