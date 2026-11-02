import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/theme';

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 16 },
});