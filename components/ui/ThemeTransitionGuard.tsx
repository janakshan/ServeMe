import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { useMainAppTheme } from '@/contexts/MainAppThemeProvider';
import { useAuthTheme } from '@/contexts/AuthThemeProvider';

interface ThemeTransitionGuardProps {
  children: React.ReactNode;
  serviceType?: string | null;
  showLoader?: boolean;
  minTransitionTime?: number;
}

/**
 * Component that guards against theme bleeding during navigation transitions
 * Works with route-group themes - each route group has its own theme context
 */
export function ThemeTransitionGuard({ 
  children, 
  serviceType = null,
  showLoader = false,
  minTransitionTime = 50 
}: ThemeTransitionGuardProps) {
  // Auto-detect available theme context
  let tokens, activeService = null;
  try {
    const themeContext = useEducationTheme();
    tokens = themeContext.tokens;
    activeService = themeContext.serviceType;
  } catch {
    try {
      const themeContext = useMainAppTheme();
      tokens = themeContext.tokens;
      activeService = 'main';
    } catch {
      try {
        const themeContext = useAuthTheme();
        tokens = themeContext.tokens;
        activeService = 'auth';
      } catch {
        // Fallback if no theme context available
        tokens = {
          colors: {
            primary: '#6A1B9A',
            background: '#FFFFFF',
          }
        };
      }
    }
  }
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // For route-group themes, we're always in the correct theme context
    // Since each route group has its own theme provider
    const isCorrectTheme = serviceType ? activeService === serviceType : true;
    
    if (isCorrectTheme) {
      // Add minimum transition time to ensure smooth visual transition
      timeoutId = setTimeout(() => {
        setIsReady(true);
      }, minTransitionTime);
    } else {
      setIsReady(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeService, serviceType, minTransitionTime]);

  // Show loading state during transitions
  if (!isReady && showLoader) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tokens.colors.background,
      }}>
        <ActivityIndicator 
          size="large" 
          color={tokens.colors.primary} 
        />
      </View>
    );
  }

  // Render nothing during transitions if loader is disabled
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version
 */
export function withThemeTransitionGuard<P extends object>(
  Component: React.ComponentType<P>,
  serviceType?: string | null,
  options: { showLoader?: boolean; minTransitionTime?: number } = {}
) {
  return function GuardedComponent(props: P) {
    return (
      <ThemeTransitionGuard 
        serviceType={serviceType}
        showLoader={options.showLoader}
        minTransitionTime={options.minTransitionTime}
      >
        <Component {...props} />
      </ThemeTransitionGuard>
    );
  };
}