import { Stack, useSegments } from 'expo-router';
import { useEffect, useRef, useCallback } from 'react';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import { ServiceTypes } from '@/utils/constants';
import { serviceScreenOptions } from '@/utils/navigationAnimations';

// Map route segments to service types
const ROUTE_TO_SERVICE_MAP: Record<string, string> = {
  'education': ServiceTypes.EDUCATION,
};

export default function ServicesLayout() {
  const segments = useSegments();
  const { setActiveService, activeService, resetToGlobalTheme } = useServiceTheme();
  const lastServiceRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced theme setter to prevent rapid switching
  const debouncedSetTheme = useCallback((serviceType: string | null) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (serviceType) {
        console.log(`🎯 Services Layout: Setting theme to ${serviceType} (route-based)`);
        setActiveService(serviceType);
      } else {
        console.log(`🎯 Services Layout: Resetting to global theme (route-based)`);
        resetToGlobalTheme();
      }
      lastServiceRef.current = serviceType;
    }, 50); // 50ms debounce
  }, [setActiveService, resetToGlobalTheme]);

  // Route-based theme management
  useEffect(() => {
    // Check if we're in a service route
    const isInServices = segments.includes('(services)');
    
    if (!isInServices) {
      // Not in services, reset to global theme
      if (lastServiceRef.current !== null) {
        console.log(`🔄 Services Layout: Left services area, resetting theme`);
        debouncedSetTheme(null);
      }
      return;
    }

    // Find the current service from segments
    let currentService: string | null = null;
    for (const segment of segments) {
      if (ROUTE_TO_SERVICE_MAP[segment]) {
        currentService = ROUTE_TO_SERVICE_MAP[segment];
        break;
      }
    }

    // Only update theme if service changed
    if (currentService && currentService !== lastServiceRef.current) {
      console.log(`🔄 Services Layout: Route changed to ${currentService}`);
      debouncedSetTheme(currentService);
    } else if (!currentService && lastServiceRef.current) {
      // In services but no specific service detected, might be transitioning
      console.log(`🔄 Services Layout: In services but no specific service detected`);
    }
  }, [segments, debouncedSetTheme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Stack screenOptions={serviceScreenOptions}>
      <Stack.Screen name="education" options={serviceScreenOptions} />
    </Stack>
  );
}