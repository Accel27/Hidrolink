import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textMuted }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Admin', tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" size={size} color={color} /> }} />
    </Tabs>
  );
}