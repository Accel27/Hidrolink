import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router'; // <-- Importante
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function ClientHistory() {
  const { requests, clearRequests } = useApp();

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <Text style={typography.h2}>Mis Pedidos</Text>
        {requests.length > 0 && (
          <Pressable onPress={clearRequests}>
            {/* CAMBIAMOS EL TEXTO AQUÍ */}
            <Text style={{ color: colors.danger, fontWeight: '600' }}>Limpiar Finalizados</Text>
          </Pressable>
        )}
      </View>

      {requests.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="water-outline" size={60} color={colors.textMuted} />
          <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.md }]}>
            Aún no has solicitado agua.
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.md }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={typography.h3}>{item.pipasRequested} pipas de agua</Text>
                <Text style={styles.price}>${item.totalPrice.toFixed(2)}</Text>
              </View>
              <Text style={typography.bodySm}>Camión: {item.truckPlate}</Text>
              
              <View style={styles.statusRow}>
                <Text style={typography.caption}>Estado:</Text>
                <View style={[
                  styles.badge, 
                  { backgroundColor: item.status === 'pending' ? colors.warning : 
                                     item.status === 'accepted' ? colors.primary : 
                                     item.status === 'cancelled' ? colors.danger : colors.success }
                ]}>
                  <Text style={styles.badgeText}>
                    {item.status === 'pending' ? 'Pendiente' : 
                     item.status === 'accepted' ? 'En camino' : 
                     item.status === 'cancelled' ? 'Cancelado' : 'Entregado'}
                  </Text>
                </View>
              </View>

              {/* BOTÓN DE CALIFICAR SI YA FUE ENTREGADO */}
              {item.status === 'completed' && (
                <View style={{ marginTop: spacing.sm, borderTopWidth: 1, borderColor: colors.border, paddingTop: spacing.sm }}>
                  {item.isRated ? (
                    <Text style={{ color: colors.success, fontWeight: '600', textAlign: 'center' }}>✓ Servicio Calificado</Text>
                  ) : (
                    <Pressable 
                      style={{ backgroundColor: colors.accent, padding: spacing.sm, borderRadius: radius.md, alignItems: 'center' }}
                      onPress={() => router.push(`/rate/${item.id}`)}
                    >
                      <Text style={{ color: colors.white, fontWeight: '700' }}>Calificar Servicio</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: colors.primary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.white },
});