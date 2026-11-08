import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { TruckCard } from '@/components/TruckCard';
import { RealMap } from '@/components/RealMap';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography } from '@/theme';

export default function ClientHome() {
  const { trucks } = useApp();
  const activeTrucks = trucks.filter(t => t.isActive);

  return (
    <Screen style={{ padding: 0, backgroundColor: colors.background }}>
      
      {/* 1. MAPA FIJO */}
      <RealMap trucks={activeTrucks} height={380} />

      {/* 2. TÍTULOS FIJOS */}
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
        <Text style={typography.h2}>Hola, Cliente 👋</Text>
        <Text style={typography.bodySm}>Encuentra agua cerca de ti</Text>
        <Text style={[typography.h3, { marginTop: spacing.md }]}>Camiones disponibles</Text>
      </View>

      {/* 3. SOLO LA LISTA TIENE SCROLL */}
      <FlatList
        data={activeTrucks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
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