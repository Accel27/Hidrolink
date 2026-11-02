import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { colors, spacing, typography, radius } from '@/theme';

export default function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.white} />
        </View>
        <Text style={typography.h2}>AdminLuis</Text>
        <Text style={typography.bodySm}>adminluarxxo@hidrolink.com</Text>

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