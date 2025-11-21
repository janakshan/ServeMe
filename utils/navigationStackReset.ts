import { router, useSegments } from 'expo-router';

// Navigation stack reset utilities for complete route group isolation

export interface RouteGroupConfig {
  groupName: string;
  defaultRoute: string;
  resetStack: boolean;
}

// Route group definitions
export const ROUTE_GROUPS: Record<string, RouteGroupConfig> = {
  MAIN_APP: {
    groupName: '(app)',
    defaultRoute: '/(app)/(tabs)/',
    resetStack: true,
  },
  EDUCATION: {
    groupName: '(services)/education',
    defaultRoute: '/(services)/education/',
    resetStack: true,
  },
  BOOKING: {
    groupName: '(services)/booking',
    defaultRoute: '/(services)/booking/',
    resetStack: true,
  },
  HEALTHCARE: {
    groupName: '(services)/healthcare',
    defaultRoute: '/(services)/healthcare/',
    resetStack: true,
  },
  ENTERTAINMENT: {
    groupName: '(services)/entertainment',
    defaultRoute: '/(services)/entertainment/',
    resetStack: true,
  },
  AUTH: {
    groupName: '(auth)',
    defaultRoute: '/(auth)/login',
    resetStack: true,
  },
  MODALS: {
    groupName: '(modals)',
    defaultRoute: '/(modals)/',
    resetStack: false,
  },
};

/**
 * Navigate to a different route group with complete navigation stack reset
 * This ensures each route group acts as an independent "app"
 */
export function navigateToRouteGroup(targetGroup: keyof typeof ROUTE_GROUPS, specificRoute?: string) {
  const groupConfig = ROUTE_GROUPS[targetGroup];
  
  if (!groupConfig) {
    console.warn(`⚠️ Unknown route group: ${targetGroup}`);
    return;
  }

  const targetRoute = specificRoute || groupConfig.defaultRoute;
  
  console.log(`🔄 Navigating to route group: ${targetGroup} -> ${targetRoute}`);
  
  if (groupConfig.resetStack) {
    // Replace the entire navigation stack
    router.replace(targetRoute as any);
  } else {
    // Push onto current stack (for modals, etc.)
    router.push(targetRoute as any);
  }
}

/**
 * Get the current route group from segments
 */
export function getCurrentRouteGroup(segments?: string[]): keyof typeof ROUTE_GROUPS | null {
  // If segments not provided, return null (should be called from within component with useSegments)
  if (!segments) return null;
  
  // Check for specific service groups first
  if (segments.includes('education')) return 'EDUCATION';
  if (segments.includes('booking')) return 'BOOKING';
  if (segments.includes('healthcare')) return 'HEALTHCARE';
  if (segments.includes('entertainment')) return 'ENTERTAINMENT';
  
  // Check for other groups
  if (segments.includes('(services)')) return 'EDUCATION'; // Default service
  if (segments.includes('(auth)')) return 'AUTH';
  if (segments.includes('(modals)')) return 'MODALS';
  if (segments.includes('(app)')) return 'MAIN_APP';
  
  return 'MAIN_APP'; // Default
}

/**
 * Check if we're switching between different route groups
 */
export function isRouteGroupTransition(fromGroup: string | null, toGroup: string | null): boolean {
  if (!fromGroup || !toGroup) return false;
  return fromGroup !== toGroup;
}

/**
 * Navigate back with proper route group awareness
 * If we're at the root of a route group, navigate to main app
 */
export function navigateBackWithReset(segments?: string[]) {
  const currentGroup = getCurrentRouteGroup(segments);
  
  if (currentGroup && currentGroup !== 'MAIN_APP') {
    // If we're in a service or other group, return to main app
    navigateToRouteGroup('MAIN_APP');
  } else {
    // Standard back navigation within the same group
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to main app
      navigateToRouteGroup('MAIN_APP');
    }
  }
}

/**
 * Custom navigation hook that provides route-group-aware navigation functions
 */
export function useRouteGroupNavigation() {
  const segments = useSegments();
  const currentGroup = getCurrentRouteGroup(segments);
  
  return {
    currentGroup,
    segments,
    navigateToService: (service: 'education' | 'booking' | 'healthcare' | 'entertainment') => {
      const groupKey = service.toUpperCase() as keyof typeof ROUTE_GROUPS;
      navigateToRouteGroup(groupKey);
    },
    navigateToMainApp: () => navigateToRouteGroup('MAIN_APP'),
    navigateToAuth: () => navigateToRouteGroup('AUTH'),
    backWithReset: () => navigateBackWithReset(segments),
    isInService: () => currentGroup && ['EDUCATION', 'BOOKING', 'HEALTHCARE', 'ENTERTAINMENT'].includes(currentGroup),
  };
}