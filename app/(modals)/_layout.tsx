// app/(modals)/_layout.tsx - CREATE THIS FILE to fix missing route warning
import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="notification" 
        options={{ 
          presentation: 'modal',
          title: 'Notifications'
        }} 
      />
      <Stack.Screen 
        name="service-selection" 
        options={{ 
          presentation: 'modal',
          title: 'Select Service'
        }} 
      />
    </Stack>
  );
}