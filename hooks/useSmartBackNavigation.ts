import { useRouter } from 'expo-router';

/**
 * Hook that provides intelligent back navigation for route-group themes
 * Works without global theme context - navigation is handled by route groups
 */
export function useSmartBackNavigation() {
  const router = useRouter();

  /**
   * Smart back navigation for route-group themes
   * Route groups handle their own theme context automatically
   */
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to main app if can't go back
      router.push('/(app)/(tabs)');
    }
  };

  /**
   * Navigate to main app (route group will handle theme automatically)
   */
  const goToMainApp = () => {
    router.push('/(app)/(tabs)');
  };

  /**
   * Navigate to specific service (route group will handle theme automatically)
   */
  const navigateToService = (route: string) => {
    router.push(route as any);
  };

  return {
    goBack,
    goToMainApp,
    navigateToService,
    canGoBack: router.canGoBack(),
  };
}