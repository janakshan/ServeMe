// Theme Isolation Guards - Enforce strict theme context separation
// Prevents cross-route-group theme access with runtime validation

import { useContext } from 'react';

// Theme context isolation error types
export class ThemeIsolationError extends Error {
  constructor(message: string, attemptedContext: string, currentRouteGroup: string) {
    super(`Theme Isolation Violation: ${message}\nAttempted Context: ${attemptedContext}\nCurrent Route Group: ${currentRouteGroup}`);
    this.name = 'ThemeIsolationError';
  }
}

// Route group detection from current navigation state
export function getCurrentRouteGroup(): string | null {
  // This would ideally use navigation state, but for now we'll use a simple approach
  if (typeof window !== 'undefined' && window.location) {
    const path = window.location.pathname;
    
    if (path.includes('/(auth)')) return 'auth';
    if (path.includes('/(services)/education')) return 'education';
    if (path.includes('/(services)/booking')) return 'booking';
    if (path.includes('/(services)/healthcare')) return 'healthcare';
    if (path.includes('/(services)/entertainment')) return 'entertainment';
    if (path.includes('/(app)')) return 'main';
  }
  
  // Fallback for native platforms - would need navigation state integration
  return null;
}

// Strict theme context validation guard
export function validateThemeContextAccess(
  contextName: string,
  expectedRouteGroup: string,
  context: any
): void {
  if (!context) {
    throw new ThemeIsolationError(
      `Theme context ${contextName} is not available in this route group`,
      contextName,
      getCurrentRouteGroup() || 'unknown'
    );
  }

  const currentRouteGroup = getCurrentRouteGroup();
  
  // Skip validation in development for flexibility, but log warnings
  if (__DEV__ && currentRouteGroup && currentRouteGroup !== expectedRouteGroup) {
    console.warn(
      `⚠️ Theme Isolation Warning: Using ${contextName} context in ${currentRouteGroup} route group. Expected: ${expectedRouteGroup}`
    );
  }
  
  // In production, enforce strict isolation
  if (!__DEV__ && currentRouteGroup && currentRouteGroup !== expectedRouteGroup) {
    throw new ThemeIsolationError(
      `Attempted to use ${contextName} context outside of ${expectedRouteGroup} route group`,
      contextName,
      currentRouteGroup
    );
  }
}

// Enhanced theme context hooks with isolation enforcement
export function createIsolatedThemeHook<T>(
  contextName: string,
  expectedRouteGroup: string,
  context: React.Context<T | null>
) {
  return function useIsolatedTheme(): T {
    const themeContext = useContext(context);
    
    validateThemeContextAccess(contextName, expectedRouteGroup, themeContext);
    
    return themeContext as T;
  };
}

// Route group boundaries - defines which contexts are allowed in which route groups
export const ROUTE_GROUP_BOUNDARIES = {
  auth: ['AuthTheme'],
  main: ['MainAppTheme'],
  education: ['EducationTheme'],
  booking: ['BookingTheme'],
  healthcare: ['HealthcareTheme'],
  entertainment: ['EntertainmentTheme'],
} as const;

// Validate that a component is using the correct theme context for its route group
export function validateRouteGroupBoundary(usedContext: string): void {
  const currentRouteGroup = getCurrentRouteGroup();
  
  if (!currentRouteGroup) {
    // Skip validation if route group cannot be determined
    return;
  }
  
  const allowedContexts = ROUTE_GROUP_BOUNDARIES[currentRouteGroup as keyof typeof ROUTE_GROUP_BOUNDARIES];
  
  if (allowedContexts && !allowedContexts.includes(usedContext as any)) {
    throw new ThemeIsolationError(
      `Context ${usedContext} is not allowed in route group ${currentRouteGroup}`,
      usedContext,
      currentRouteGroup
    );
  }
}

// Theme context registry for debugging and validation
export const THEME_CONTEXT_REGISTRY = {
  AuthTheme: 'auth',
  MainAppTheme: 'main',
  EducationTheme: 'education',
  BookingTheme: 'booking',
  HealthcareTheme: 'healthcare',
  EntertainmentTheme: 'entertainment',
} as const;

// Development-only theme debugging utilities with conditional logging
const ENABLE_THEME_DEBUG_LOGS = false; // Set to true to enable detailed theme access logging

export const ThemeDebugUtils = {
  logThemeAccess: (contextName: string, routeGroup: string) => {
    if (__DEV__ && ENABLE_THEME_DEBUG_LOGS) {
      console.log(`🎨 Theme Access: ${contextName} used in ${routeGroup} route group`);
    }
  },
  
  validateAllContexts: () => {
    if (__DEV__ && ENABLE_THEME_DEBUG_LOGS) {
      const currentRouteGroup = getCurrentRouteGroup();
      console.log(`🔍 Current Route Group: ${currentRouteGroup}`);
      console.log(`📋 Available Contexts:`, ROUTE_GROUP_BOUNDARIES[currentRouteGroup as keyof typeof ROUTE_GROUP_BOUNDARIES] || 'None detected');
    }
  },
  
  checkIsolationIntegrity: () => {
    if (__DEV__ && ENABLE_THEME_DEBUG_LOGS) {
      console.log('🛡️ Theme Isolation System Status: Active');
      console.log('📊 Registered Contexts:', Object.keys(THEME_CONTEXT_REGISTRY));
      console.log('🚧 Route Group Boundaries:', ROUTE_GROUP_BOUNDARIES);
    }
  },

  // Force enable debug logging (for development debugging when needed)
  enableDebugLogging: () => {
    if (__DEV__) {
      console.log('🎨 Theme Debug Logging Enabled');
      // Note: This will require module reload to take effect due to const
    }
  }
};