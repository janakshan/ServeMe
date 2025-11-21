import { useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { smoothSlideAnimation } from '@/utils/navigationAnimations';

/**
 * Hook for standardized service layout theme management with scoped theme context
 * Works with any scoped theme provider (Education, Booking, Healthcare, Entertainment)
 */
export function useScopedServiceLayout(tokens: any, serviceType: string) {
  // Handle focus/blur with navigation awareness
  useFocusEffect(
    useCallback(() => {
      // On focus: log the service theme activation
      console.log(`🎨 Service layout active for: ${serviceType}`);
      
      return () => {
        // On blur: cleanup if needed
        console.log(`🧹 Service layout cleanup for: ${serviceType}`);
      };
    }, [serviceType])
  );

  return {
    tokens,
    isTransitioning: false, // Scoped themes don't have transitions
    screenOptions: {
      headerShown: true,
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

/**
 * Education-specific service layout hook
 */
export function useEducationServiceLayout(themeContext: any) {
  return useScopedServiceLayout(themeContext.tokens, themeContext.serviceType);
}

/**
 * Booking-specific service layout hook
 */
export function useBookingServiceLayout(themeContext: any) {
  return useScopedServiceLayout(themeContext.tokens, themeContext.serviceType);
}

/**
 * Healthcare-specific service layout hook
 */
export function useHealthcareServiceLayout(themeContext: any) {
  return useScopedServiceLayout(themeContext.tokens, themeContext.serviceType);
}

/**
 * Entertainment-specific service layout hook  
 */
export function useEntertainmentServiceLayout(themeContext: any) {
  return useScopedServiceLayout(themeContext.tokens, themeContext.serviceType);
}