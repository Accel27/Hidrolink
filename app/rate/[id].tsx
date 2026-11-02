import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useApp } from '@/contexts/AppContext';
import { colors, spacing, typography } from '@/theme';

export default function RateScreen() {
  const { id } = useLocalSearchParams();
  const { requests, rateRequest } = useApp();
  const [stars, setStars] = useState(5); // Por defecto 5 estrellas

  const request = requests.find(r => r.id === id);

  const handleRate = () => {
    if (request) {
      rateRequest(request.id, request.truckId, stars);
      router.back();
    }
  };

  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="water" size={60} color={colors.primary} style={{ marginBottom: spacing.lg }} />
      
      <Text style={[typography.h2, { textAlign: 'center' }]}>¿Cómo fue tu servicio?</Text>
      <Text style={[typography.bodySm, { textAlign: 'center', marginBottom: spacing.xl }]}>
        Califica al conductor del camión {request?.truckPlate}
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setStars(star)}>
            <Ionicons 
              name={star <= stars ? "star" : "star-outline"} 
              size={40} 
              color={star <= stars ? colors.accent : colors.border} 
            />
          </Pressable>
        ))}
      </View>

      <View style={{ width: '100%' }}>
        <Button label="Enviar Calificación" onPress={handleRate} />
        <Button label="Cancelar" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
      </View>
    </Screen>
  );
}