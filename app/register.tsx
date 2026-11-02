import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { colors, spacing, typography, radius } from '@/theme';

export default function RegisterScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} onPress={() => router.back()} />
        <Text style={typography.h3}>Crear Cuenta</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor={colors.textMuted} editable={false} />
        <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor={colors.textMuted} editable={false} />
        <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor={colors.textMuted} editable={false} />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={colors.textMuted} secureTextEntry editable={false} />

        <View style={{ height: spacing.md }} />
        <Button label="Registrarme" onPress={() => { router.replace('/login'); }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 15, color: colors.textPrimary },
});