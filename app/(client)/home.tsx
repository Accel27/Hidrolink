import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { TruckCard } from '@/components/TruckCard';
import { RealMap } from '@/components/RealMap'; // <-- Importamos el mapa nuevo
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography } from '@/theme';

export default function ClientHome() {
  const { trucks } = useApp();
  
  // Filtramos los camiones activos una sola vez para usarlo en el mapa y en la lista
  const activeTrucks = trucks.filter(t => t.isActive);

  return (
    <Screen style={{ padding: 0 }}>
      
      {/* 1. EL MAPA REAL DE LEAFLET (Reemplaza al MapView y Location) */}
      <RealMap trucks={activeTrucks} height={380} />

      {/* 2. LA LISTA DE CAMIONES */}
      <FlatList
        data={activeTrucks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={typography.h2}>Hola, Cliente 👋</Text>
            <Text style={typography.bodySm}>Encuentra agua cerca de ti</Text>
            <Text style={[typography.h3, { marginTop: spacing.lg }]}>Camiones disponibles</Text>
          </View>
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