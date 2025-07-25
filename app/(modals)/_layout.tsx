import { Stack } from 'expo-router';
import { modalScreenOptions } from '@/utils/navigationAnimations';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={modalScreenOptions}>
      <Stack.Screen 
        name="notification" 
        options={{ 
          ...modalScreenOptions,
          title: 'Notifications'
        }} 
      />
      <Stack.Screen 
        name="service-selection" 
        options={{ 
          ...modalScreenOptions,
          title: 'Select Service'
        }} 
      />
    </Stack>
  );
}