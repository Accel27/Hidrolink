import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function DriverProfile() {
  const { truckId } = useAuth();
  const { trucks } = useApp();
  
  // Buscamos los datos reales del camión del conductor logueado
  const myTruck = trucks.find(t => t.id === truckId);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Ionicons name="car" size={40} color={colors.white} />
        </View>
        <Text style={typography.h2}>José Pérez</Text>
        <Text style={typography.bodySm}>Camión: {myTruck?.plate || 'Cargando...'}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md }}>
          <Ionicons name="star" size={24} color={colors.accent} />
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary }}>
            {myTruck?.rating.toFixed(1)} / 5.0
          </Text>
        </View>

        <View style={{ height: spacing.xxl }} />
        
        <Button label="Cerrar Sesión" variant="danger" onPress={() => router.replace('/login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: spacing.xxl, gap: spacing.sm },
  avatar: { width: 80, height: 80, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
});