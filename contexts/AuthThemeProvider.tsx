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

// Auth Theme Context - Uses the default professional azure theme for auth screens
interface AuthThemeContextType {
  tokens: DesignTokens;
  layout: 'card-based'; // Auth uses card-based layout
  componentVariants: {
    button: 'default';
    input: 'default';
    card: 'elevated';
  };
  serviceType: 'auth';
  getGradient: (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent') => GradientDefinition;
  createServiceCardGradient: (serviceType: string) => readonly [string, string, string];
}

const AuthThemeContext = createContext<AuthThemeContextType | null>(null);

export function AuthThemeProvider({ children }: { children: ReactNode }) {
  const contextValue = useMemo(() => {
    // Auth uses the professional azure theme as-is
    const tokens = professionalAzureTokens;
    
    // Default gradients for auth screens
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

    const createServiceCardGradient = (serviceType: string): readonly [string, string, string] => {
      switch (serviceType) {
        case 'education':
          return ['#F3E5F5', '#FAF0FF', '#FFFFFF'] as const;
        case 'men_saloon':
          return ['#FFF3E0', '#FFF8F0', '#FFFFFF'] as const;
        case 'vehicle_repair':
          return ['#E8F5E8', '#F2FBF2', '#FFFFFF'] as const;
        case 'cleaning':
          return ['#E0F2F1', '#F0F9F8', '#FFFFFF'] as const;
        case 'parcel':
          return ['#FFF3E0', '#FFF8F0', '#FFFFFF'] as const;
        case 'food_delivery':
          return ['#FFEBEE', '#FFF5F5', '#FFFFFF'] as const;
        case 'booking':
          return ['#E3F2FD', '#F0F8FF', '#FFFFFF'] as const;
        case 'healthcare':
          return ['#E8F5E8', '#F2FBF2', '#FFFFFF'] as const;
        case 'entertainment':
          return ['#FCE4EC', '#FFF0F6', '#FFFFFF'] as const;
        default:
          return ['#F5F5F5', '#FAFAFA', '#FFFFFF'] as const;
      }
    };
    
    return {
      tokens,
      layout: 'card-based' as const,
      componentVariants: {
        button: 'default' as const,
        input: 'default' as const,
        card: 'elevated' as const,
      },
      serviceType: 'auth' as const,
      getGradient,
      createServiceCardGradient,
    };
  }, []);

  return (
    <AuthThemeContext.Provider value={contextValue}>
      {children}
    </AuthThemeContext.Provider>
  );
}

export function useAuthTheme(): AuthThemeContextType {
  const context = useContext(AuthThemeContext);
  
  // Enforce strict theme isolation
  validateThemeContextAccess('AuthTheme', 'auth', context);
  validateRouteGroupBoundary('AuthTheme');
  
  if (!context) {
    throw new Error('useAuthTheme must be used within an AuthThemeProvider');
  }
  return context;
}

// Utility hook for auth themed styles (compatible with old useThemedStyles)
export function useAuthThemedStyles<T extends Record<string, any>>(
  createStyles: (tokens: DesignTokens, layout: ServiceThemeOverride['layout'], variants: ServiceThemeOverride['componentVariants']) => T
): T {
  const { tokens, layout, componentVariants } = useAuthTheme();
  return useMemo(() => StyleSheet.create(createStyles(tokens, layout, componentVariants)), [tokens, layout, componentVariants, createStyles]);
}