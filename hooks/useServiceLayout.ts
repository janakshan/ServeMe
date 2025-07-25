import { useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';
import { smoothSlideAnimation } from '@/utils/navigationAnimations';

/**
 * Hook for standardized service layout theme management
 * Handles proper theme switching, cleanup, and navigation awareness
 */
export function useServiceLayout(serviceType: string) {
  const { 
    setActiveService, 
    tokens, 
    onNavigationFocus, 
    onNavigationBlur,
    isTransitioning 
  } = useServiceTheme();

  // Use refs to avoid dependency issues
  const setActiveServiceRef = useRef(setActiveService);
  const onNavigationFocusRef = useRef(onNavigationFocus);
  const onNavigationBlurRef = useRef(onNavigationBlur);
  
  // Update refs
  setActiveServiceRef.current = setActiveService;
  onNavigationFocusRef.current = onNavigationFocus;
  onNavigationBlurRef.current = onNavigationBlur;

  // Handle focus/blur with navigation awareness - using stable refs
  useFocusEffect(
    useCallback(() => {
      // On focus: set the service theme
      console.log(`🎨 Setting theme for service: ${serviceType}`);
      onNavigationFocusRef.current(serviceType);
      
      return () => {
        // On blur: let navigation handle cleanup
        onNavigationBlurRef.current();
      };
    }, [serviceType]) // Only serviceType dependency
  );

  // Cleanup on unmount - using stable ref
  useEffect(() => {
    return () => {
      // Only reset if this service is still active
      console.log(`🧹 Cleaning up theme for service: ${serviceType}`);
      setActiveServiceRef.current(null);
    };
  }, [serviceType]); // Only serviceType dependency

  return {
    tokens,
    isTransitioning,
    screenOptions: {
      headerStyle: {
        backgroundColor: tokens.colors.primary,
      },
      headerTintColor: tokens.colors.onPrimary,
      headerTitleStyle: {
        fontWeight: '600' as const,
      },
      headerBackTitleVisible: false,
      ...smoothSlideAnimation, // Add smooth slide transitions to service screens
    }
  };
}