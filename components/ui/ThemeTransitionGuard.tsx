import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';

interface ThemeTransitionGuardProps {
  children: React.ReactNode;
  serviceType?: string | null;
  showLoader?: boolean;
  minTransitionTime?: number;
}

/**
 * Component that guards against theme bleeding during navigation transitions
 * Ensures themes are properly applied before rendering children
 */
export function ThemeTransitionGuard({ 
  children, 
  serviceType = null,
  showLoader = false,
  minTransitionTime = 50 
}: ThemeTransitionGuardProps) {
  const { activeService, isTransitioning, tokens } = useServiceTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Check if we're in the expected theme state
    const isCorrectTheme = activeService === serviceType;
    
    if (isCorrectTheme && !isTransitioning) {
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
  }, [activeService, serviceType, isTransitioning, minTransitionTime]);

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