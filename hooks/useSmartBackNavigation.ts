import { useRouter } from 'expo-router';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';

/**
 * Hook that provides intelligent back navigation with proper theme management
 * Automatically handles theme stack cleanup during navigation
 */
export function useSmartBackNavigation() {
  const router = useRouter();
  const { 
    themeStack, 
    popServiceTheme, 
    resetToGlobalTheme, 
    activeService 
  } = useServiceTheme();

  /**
   * Smart back navigation that manages theme stack
   */
  const goBack = () => {
    if (themeStack.length > 0) {
      // Pop the theme stack and get the previous theme
      const previousTheme = popServiceTheme();
      
      // Navigate back
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback to main app if can't go back
        resetToGlobalTheme();
        router.push('/(app)/(tabs)');
      }
    } else {
      // No theme stack, reset to global and navigate to main app
      resetToGlobalTheme();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(app)/(tabs)');
      }
    }
  };

  /**
   * Navigate to main app with theme reset
   */
  const goToMainApp = () => {
    resetToGlobalTheme();
    router.push('/(app)/(tabs)');
  };

  /**
   * Navigate to specific service with proper theme management
   */
  const navigateToService = (serviceType: string, route: string) => {
    // The navigation theme manager will handle theme switching
    router.push(route);
  };

  return {
    goBack,
    goToMainApp,
    navigateToService,
    canGoBack: router.canGoBack(),
    hasThemeStack: themeStack.length > 0,
    currentTheme: activeService,
  };
}