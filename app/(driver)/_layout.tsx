import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function DriverLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textMuted }}>
      <Tabs.Screen name="home" options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <Ionicons name="car" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}