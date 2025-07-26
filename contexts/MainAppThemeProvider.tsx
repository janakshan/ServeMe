import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { DesignTokens, professionalAzureTokens } from '@/utils/tokens';
import { ServiceThemeOverride } from '@/contexts/ServiceThemeContext';
import { StyleSheet } from 'react-native';

// Import gradient definition from ServiceThemeContext
import type { GradientDefinition } from '@/contexts/ServiceThemeContext';

// Import theme isolation guards
import { 
  validateThemeContextAccess, 
  ThemeDebugUtils,
  validateRouteGroupBoundary 
} from '@/utils/themeIsolationGuards';

// Main App Theme Context - Uses the default professional azure theme
interface MainAppThemeContextType {
  tokens: DesignTokens;
  layout: 'card-based'; // Main app uses card-based layout
  componentVariants: {
    button: 'default';
    input: 'default';
    card: 'elevated';
  };
  serviceType: 'main-app';
  getGradient: (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent') => GradientDefinition;
}

const MainAppThemeContext = createContext<MainAppThemeContextType | null>(null);

export function MainAppThemeProvider({ children }: { children: ReactNode }) {
  const contextValue = useMemo(() => {
    // Main app uses the professional azure theme as-is
    const tokens = professionalAzureTokens;
    
    // Default gradients for main app
    const defaultGradients = {
      header: {
        colors: ['#1565C0', '#0D47A1', '#0A3D91'],
        direction: { x: 0, y: 1 }
      },
      card: {
        colors: ['#F5F5F5', '#FAFAFA', '#FFFFFF'],
        direction: { x: 0, y: 1 }
      },
      button: {
        colors: ['#42A5F5', '#0D47A1', '#0A3D91'],
        direction: { x: 0, y: 1 }
      },
      background: {
        colors: ['#F8FCFF', '#F0F6FF'],
        direction: { x: 0, y: 1 }
      },
      surface: {
        colors: ['#FFFFFF', '#F8FCFF'],
        direction: { x: 0, y: 1 }
      },
      accent: {
        colors: ['#64B5F6', '#2196F3', '#1976D2'],
        direction: { x: 0, y: 1 }
      }
    };
    
    const getGradient = (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent'): GradientDefinition => {
      return defaultGradients[type];
    };
    
    return {
      tokens,
      layout: 'card-based' as const,
      componentVariants: {
        button: 'default' as const,
        input: 'default' as const,
        card: 'elevated' as const,
      },
      serviceType: 'main-app' as const,
      getGradient,
    };
  }, []);

  return (
    <MainAppThemeContext.Provider value={contextValue}>
      {children}
    </MainAppThemeContext.Provider>
  );
}

export function useMainAppTheme(): MainAppThemeContextType {
  const context = useContext(MainAppThemeContext);
  
  // Enforce strict theme isolation
  validateThemeContextAccess('MainAppTheme', 'main', context);
  validateRouteGroupBoundary('MainAppTheme');
  
  // Debug logging in development
  ThemeDebugUtils.logThemeAccess('MainAppTheme', 'main');
  
  if (!context) {
    throw new Error('useMainAppTheme must be used within a MainAppThemeProvider');
  }
  return context;
}

// Utility hook for main app themed styles (compatible with old useThemedStyles)
export function useMainAppThemedStyles<T extends Record<string, any>>(
  createStyles: (tokens: DesignTokens, layout: ServiceThemeOverride['layout'], variants: ServiceThemeOverride['componentVariants']) => T
): T {
  const { tokens, layout, componentVariants } = useMainAppTheme();
  return useMemo(() => StyleSheet.create(createStyles(tokens, layout, componentVariants)), [tokens, layout, componentVariants, createStyles]);
}