import { Stack, useSegments } from 'expo-router';
import { useEffect, useRef, useCallback } from 'react';
import { serviceScreenOptions } from '@/utils/navigationAnimations';
import { useRouteGroupNavigation } from '@/utils/navigationStackReset';

export default function ServicesLayout() {
  const segments = useSegments();
  const { currentGroup, isInService } = useRouteGroupNavigation();
  
  // Log current route group for debugging
  useEffect(() => {
    if (isInService()) {
      console.log(`🎯 Services Layout: In service group ${currentGroup}`);
    }
  }, [currentGroup, isInService]);

  return (
    <Stack screenOptions={serviceScreenOptions}>
      <Stack.Screen name="education" options={serviceScreenOptions} />
      <Stack.Screen name="booking" options={serviceScreenOptions} />
      <Stack.Screen name="healthcare" options={serviceScreenOptions} />
      <Stack.Screen name="entertainment" options={serviceScreenOptions} />
    </Stack>
  );
}