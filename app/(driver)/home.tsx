import { View, Text, StyleSheet, Switch, Pressable, SectionList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { RealMap } from '@/components/RealMap';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography, radius } from '@/theme';

export default function DriverHome() {
  const { requests, updateRequestStatus, trucks, toggleTruckAvailability, messages, refreshTrucks, isRefreshing } = useApp();
  const { truckId } = useAuth();

  const myTruck = trucks.find(t => t.id === truckId);
  const myPlate = myTruck ? myTruck.plate : 'Sin camion';
  const isAvailable = myTruck?.isActive || false; 

  const myRequests = requests.filter(r => r.truckId === truckId);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const acceptedRequests = myRequests.filter(r => r.status === 'accepted');

  const sections = [
    { title: 'En Camino', data: acceptedRequests },
    { title: 'Solicitudes Pendientes', data: pendingRequests },
  ].filter(sec => sec.data.length > 0);

  return (
    <Screen style={{ padding: 0, backgroundColor: colors.background }}>
      
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="tanker-truck" size={22} color={colors.white} />
          </View>
          <View>
            <Text style={typography.caption}>Conductor</Text>
            <Text style={typography.h3}>Jose Perez</Text>
          </View>
        </View>
        <Pressable style={styles.iconButton} onPress={() => router.push('/(driver)/profile')}>
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <RealMap 
        trucks={isAvailable && myTruck ? [myTruck] : []} 
        height={320} 
        isDriverView={isAvailable}
        requests={isAvailable ? [...pendingRequests, ...acceptedRequests] : acceptedRequests} 
      />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
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

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refreshTrucks(true)} colors={[colors.primary]} />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[typography.h3, { marginTop: spacing.sm, marginBottom: spacing.sm, color: title === 'En Camino' ? colors.primary : colors.textPrimary }]}>
            {title}
          </Text>
        )}
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

        ListEmptyComponent={() => (
          <Text style={[typography.bodySm, { textAlign: 'center', marginTop: spacing.xl }]}>
            {!isAvailable ? 'Activate para recibir solicitudes.' : 'No hay solicitudes nuevas por ahora.'}
          </Text>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  iconButton: { padding: spacing.sm, backgroundColor: colors.background, borderRadius: radius.full },
  toggleCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  requestCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm, marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: colors.success },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  actionBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  notificationBadge: { backgroundColor: colors.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notificationText: { color: colors.white, fontSize: 11, fontWeight: 'bold' },
});