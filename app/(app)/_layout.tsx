// app/(app)/_layout.tsx - Instant navigation for main app
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';
import { instantScreenOptions } from '../../utils/navigationAnimations';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={instantScreenOptions}>
      <Stack.Screen name="(tabs)" options={instantScreenOptions} />
    </Stack>
  );
}
