import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(driver)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="truck/[id]" />
          <Stack.Screen name="request/[id]" />
          <Stack.Screen name="rate/[id]" />
          <Stack.Screen name="chat/[id]" />
        </Stack>
      </AppProvider>
    </AuthProvider>
  );
}