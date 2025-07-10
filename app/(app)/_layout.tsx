// app/(app)/_layout.tsx - ENSURE THIS EXISTS
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="service" 
        options={{ 
          headerShown: true,
          title: 'Service Details',
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
