import { useEffect, useRef } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import { ServiceTypes } from '@/utils/constants';

/**
 * Hook that automatically manages theme switching based on navigation routes
 * Provides navigation-aware theme management to prevent theme bleeding
 */
export function useNavigationThemeManager() {
  const router = useRouter();
  const segments = useSegments();
  const { setActiveService, resetToGlobalTheme, activeService } = useServiceTheme();
  
  // Use refs to store the latest function references without causing re-renders
  const setActiveServiceRef = useRef(setActiveService);
  const resetToGlobalThemeRef = useRef(resetToGlobalTheme);
  
  // Add throttling to prevent rapid theme switching
  const lastUpdateRef = useRef<number>(0);
  const THROTTLE_DELAY = 100; // 100ms throttle
  
  // Update refs when functions change
  setActiveServiceRef.current = setActiveService;
  resetToGlobalThemeRef.current = resetToGlobalTheme;

  useEffect(() => {
    const currentPath = segments.join('/');
    
    // Determine expected service based on route
    let expectedService: string | null = null;
    
    if (currentPath.includes('services/education')) {
      expectedService = ServiceTypes.EDUCATION;
    } else if (currentPath.includes('services/booking')) {
      expectedService = ServiceTypes.BOOKING;
    } else if (currentPath.includes('services/healthcare')) {
      expectedService = ServiceTypes.HEALTHCARE;
    } else if (currentPath.includes('services/entertainment')) {
      expectedService = ServiceTypes.ENTERTAINMENT;
    } else if (currentPath.includes('(app)') || currentPath.includes('(auth)')) {
      expectedService = null; // Main app or auth should use global theme
    }

    // Only update if there's a mismatch and enough time has passed (throttling)
    if (expectedService !== activeService) {
      const now = Date.now();
      if (now - lastUpdateRef.current > THROTTLE_DELAY) {
        lastUpdateRef.current = now;
        
        if (expectedService === null) {
          resetToGlobalThemeRef.current();
        } else {
          setActiveServiceRef.current(expectedService);
        }
      }
    }
  }, [segments, activeService]); // Removed function dependencies

  return {
    currentPath: segments.join('/'),
    expectedService: activeService,
  };
}

/**
 * Hook for service-specific components to ensure correct theme context
 */
export function useServiceThemeGuard(expectedService: string | null) {
  const { activeService, setActiveService } = useServiceTheme();
  
  // Use ref to store stable function reference
  const setActiveServiceRef = useRef(setActiveService);
  setActiveServiceRef.current = setActiveService;
  
  useEffect(() => {
    if (activeService !== expectedService) {
      setActiveServiceRef.current(expectedService);
    }
  }, [expectedService, activeService]); // Removed function dependency

  return {
    isCorrectTheme: activeService === expectedService,
    activeService,
  };
}