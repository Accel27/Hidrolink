import { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useApp } from '@/contexts/AppContext'; // <-- NUEVO
import { colors, spacing, typography, radius } from '@/theme';

export default function RequestScreen() {
  const { id } = useLocalSearchParams();
  const { trucks, createRequest } = useApp(); // <-- NUEVO
  const truck = trucks.find(t => t.id === id) || trucks[0];

  const [pipas, setPipas] = useState('10'); // Ahora sí dejamos escribir
  const total = Number(pipas || 0) * truck.pricePerPipa;

  const handleConfirm = () => {
    // Creamos el pedido real
    const randomLat = 10.6427 + (Math.random() - 0.5) * 0.02;
    const randomLng = -71.6125 + (Math.random() - 0.5) * 0.02;
    createRequest({
      id: Math.random().toString(), // ID aleatorio
      clientName: 'Cliente Demo',
      clientAddress: 'Maracaibo, Zulia',
      truckPlate: truck.plate,
      truckId: truck.id,
      pipasRequested: Number(pipas),
      totalPrice: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      clientLat: randomLat,
      clientLng: randomLng,
    });
    
    router.replace('/(client)/history'); // Lo enviamos al historial
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} onPress={() => router.back()} />
        <Text style={typography.h3}>Nueva Solicitud</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, gap: spacing.xl, marginTop: spacing.lg }}>
        <View style={styles.infoBox}>
          <Text style={typography.body}>Camión: <Text style={{ fontWeight: '700' }}>{truck.plate}</Text></Text>
          <Text style={typography.bodySm}>Precio por pipa: ${truck.pricePerPipa.toFixed(2)}</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={typography.h3}>¿Cuántas pipas necesitas?</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={pipas}
            onChangeText={setPipas} // Ahora sí es funcional
          />
        </View>

        <View style={styles.totalBox}>
          <Text style={typography.body}>Total estimado</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Confirmar Solicitud" onPress={handleConfirm} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoBox: { backgroundColor: colors.primaryLight, padding: spacing.lg, borderRadius: radius.md, gap: 4 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 18, fontWeight: '600' },
  totalBox: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: 24, fontWeight: '700', color: colors.primary },
});