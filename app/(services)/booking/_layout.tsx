// app/(services)/booking/_layout.tsx - CREATE THIS FILE
import { Stack } from 'expo-router';

export default function BookingServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          title: 'Booking Service'
        }} 
      />
      
    </Stack>
  );
}
