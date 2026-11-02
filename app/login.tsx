import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function LoginScreen() {
  
  const { setRole, setTruckId } = useAuth(); 

  const enterAs = (role: 'client' | 'driver' | 'admin') => {
    setRole(role);
    
   
    if (role === 'client') {
      router.replace('/(client)/home');
    } else if (role === 'driver') {
      setTruckId('t1'); // <-- Asignamos el camión A12BC3D
      router.replace('/(driver)/home');
    } else {
      router.replace('/(admin)/dashboard');
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="water" size={44} color={colors.white} />
        </View>
        <Text style={styles.brand}>Hidrolink</Text>
        <Text style={styles.tagline}>Agua a tu puerta, cuando la necesites</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionLabel}>Bienvenido</Text>
        <Text style={styles.hint}>Selecciona tu tipo de usuario para ingresar</Text>

        <Button label="Ingresar como Cliente" onPress={() => enterAs('client')} />
        <Button label="Ingresar como Conductor" variant="secondary" onPress={() => enterAs('driver')} />
        <Button label="Ingresar como Administrador" variant="outline" onPress={() => enterAs('admin')} />

        <View style={{ height: spacing.md }} />
        <Button label="Crear una cuenta nueva" variant="ghost" onPress={() => router.push('/register')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  logo: {
    width: 88, height: 88, borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  brand: { ...typography.h1, fontSize: 34, color: colors.primaryDark },
  tagline: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
  form: { gap: spacing.md, paddingBottom: spacing.lg },
  sectionLabel: { ...typography.h3, textAlign: 'center' },
  hint: { ...typography.caption, textAlign: 'center', marginBottom: spacing.sm },
});