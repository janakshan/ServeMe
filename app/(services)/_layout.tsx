// app/(services)/_layout.tsx - CREATE THIS FILE to fix missing route warning
import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="booking" options={{ headerShown: false }} />
    </Stack>
  );
}