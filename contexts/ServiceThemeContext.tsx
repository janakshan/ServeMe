import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DesignTokens, professionalAzureTokens, lightTokens, darkTokens } from '@/utils/tokens';
import { ServiceTypes } from '@/utils/constants';

// Gradient definitions for comprehensive theme system
interface GradientDefinition {
  colors: string[];
  direction: { x: number; y: number };
  locations?: number[];
}

interface ThemeGradients {
  header: GradientDefinition;
  card: GradientDefinition;
  button: GradientDefinition;
  background: GradientDefinition;
  surface: GradientDefinition;
  accent: GradientDefinition;
}

// Service-specific theme overrides
interface ServiceThemeOverride {
  colors?: Partial<DesignTokens['colors']>;
  typography?: Partial<DesignTokens['typography']>;
  spacing?: Partial<DesignTokens['spacing']>;
  borderRadius?: Partial<DesignTokens['borderRadius']>;
  shadows?: Partial<DesignTokens['shadows']>;
  gradients?: Partial<ThemeGradients>;
  layout?: 'card-based' | 'clinical' | 'academic' | 'entertainment';
  componentVariants?: {
    button?: 'default' | 'rounded' | 'minimal' | 'clinical';
    input?: 'default' | 'outlined' | 'minimal';
    card?: 'default' | 'elevated' | 'flat' | 'bordered';
  };
}

// Global theme types
type GlobalTheme = 'professional-azure' | 'light' | 'dark';

// Service-specific theme configurations
const serviceThemeConfigs: Record<string, ServiceThemeOverride> = {
  [ServiceTypes.BOOKING]: {
    colors: {
      primary: '#0D47A1',
      primaryDark: '#1565C0',
      primaryLight: '#42A5F5',
      accent: '#2196F3',
    },
    gradients: {
      header: {
        colors: ['#1565C0', '#0D47A1', '#0A3D91'],
        direction: { x: 0, y: 1 }
      },
      card: {
        colors: ['#E3F2FD', '#F0F8FF', '#FFFFFF'],
        direction: { x: 0, y: 1 }
      },
      button: {
        colors: ['#42A5F5', '#0D47A1', '#0A3D91'],
        direction: { x: 0, y: 1 }
      },
      background: {
        colors: ['#F8FAFE', '#F0F6FF'],
        direction: { x: 0, y: 1 }
      },
      surface: {
        colors: ['#FFFFFF', '#F8FAFE'],
        direction: { x: 0, y: 1 }
      },
      accent: {
        colors: ['#64B5F6', '#2196F3', '#1976D2'],
        direction: { x: 0, y: 1 }
      }
    },
    layout: 'card-based',
    componentVariants: {
      button: 'default',
      input: 'default',
      card: 'elevated',
    },
  },
  
  [ServiceTypes.HEALTHCARE]: {
    colors: {
      primary: '#2E7D32',
      primaryDark: '#1B5E20',
      primaryLight: '#66BB6A',
      accent: '#4CAF50',
      success: '#388E3C',
      error: '#D32F2F',
    },
    gradients: {
      header: {
        colors: ['#388E3C', '#2E7D32', '#1B5E20'],
        direction: { x: 0, y: 1 }
      },
      card: {
        colors: ['#E8F5E8', '#F2FBF2', '#FFFFFF'],
        direction: { x: 0, y: 1 }
      },
      button: {
        colors: ['#66BB6A', '#2E7D32', '#1B5E20'],
        direction: { x: 0, y: 1 }
      },
      background: {
        colors: ['#F9FDF9', '#F2F8F2'],
        direction: { x: 0, y: 1 }
      },
      surface: {
        colors: ['#FFFFFF', '#F9FDF9'],
        direction: { x: 0, y: 1 }
      },
      accent: {
        colors: ['#81C784', '#4CAF50', '#388E3C'],
        direction: { x: 0, y: 1 }
      }
    },
    layout: 'clinical',
    componentVariants: {
      button: 'clinical',
      input: 'outlined',
      card: 'flat',
    },
  },
  
  [ServiceTypes.EDUCATION]: {
    colors: {
      primary: '#6A1B9A',
      primaryDark: '#4A148C',
      primaryLight: '#9C27B0',
      accent: '#8E24AA',
      secondary: '#AB47BC',
      info: '#5E35B1',
      success: '#43A047',
      warning: '#FB8C00',
      error: '#E53935',
      background: '#FEFBFF',
      surface: '#FFFFFF',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onSurface: '#1C1B1F',
      onBackground: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
      primaryContainer: '#F2E7FF',
      onPrimaryContainer: '#21005D',
      secondaryContainer: '#F2E7FF',
      onSecondaryContainer: '#1D192B',
      tertiaryContainer: '#FFE0E6',
      onTertiaryContainer: '#31111D',
    },
    gradients: {
      header: {
        colors: ['#8E24AA', '#6A1B9A', '#4A148C'],
        direction: { x: 0, y: 1 }
      },
      card: {
        colors: ['#F2E7FF', '#F8F4FF', '#FFFFFF'],
        direction: { x: 0, y: 1 }
      },
      button: {
        colors: ['#9C27B0', '#6A1B9A', '#4A148C'],
        direction: { x: 0, y: 1 }
      },
      background: {
        colors: ['#FEFBFF', '#F8F4FF'],
        direction: { x: 0, y: 1 }
      },
      surface: {
        colors: ['#FFFFFF', '#FEFBFF'],
        direction: { x: 0, y: 1 }
      },
      accent: {
        colors: ['#CE93D8', '#8E24AA', '#6A1B9A'],
        direction: { x: 0, y: 1 }
      }
    },
    layout: 'academic',
    componentVariants: {
      button: 'rounded',
      input: 'outlined',
      card: 'bordered',
    },
  },
  
  [ServiceTypes.ENTERTAINMENT]: {
    colors: {
      primary: '#E91E63',
      primaryDark: '#AD1457',
      primaryLight: '#F48FB1',
      accent: '#FF4081',
      background: '#FCE4EC',
    },
    gradients: {
      header: {
        colors: ['#EC407A', '#E91E63', '#C2185B'],
        direction: { x: 0, y: 1 }
      },
      card: {
        colors: ['#FCE4EC', '#FFF0F6', '#FFFFFF'],
        direction: { x: 0, y: 1 }
      },
      button: {
        colors: ['#F48FB1', '#E91E63', '#C2185B'],
        direction: { x: 0, y: 1 }
      },
      background: {
        colors: ['#FFFAFC', '#FFF2F7'],
        direction: { x: 0, y: 1 }
      },
      surface: {
        colors: ['#FFFFFF', '#FFFAFC'],
        direction: { x: 0, y: 1 }
      },
      accent: {
        colors: ['#FF80AB', '#FF4081', '#E91E63'],
        direction: { x: 0, y: 1 }
      }
    },
    layout: 'entertainment',
    componentVariants: {
      button: 'rounded',
      input: 'default',
      card: 'elevated',
    },
  },
};

// Global theme configurations
const globalThemeConfigs: Record<GlobalTheme, DesignTokens> = {
  'professional-azure': professionalAzureTokens,
  'light': lightTokens,
  'dark': darkTokens,
};

interface ServiceThemeContextType {
  // Current theme state
  activeService: string | null;
  globalTheme: GlobalTheme;
  tokens: DesignTokens;
  layout: ServiceThemeOverride['layout'];
  componentVariants: ServiceThemeOverride['componentVariants'];
  gradients: ThemeGradients;
  
  // Theme switching functions
  setGlobalTheme: (theme: GlobalTheme) => void;
  setActiveService: (service: string | null) => void;
  
  // Utility functions
  getServiceTheme: (service: string) => DesignTokens;
  resetToGlobalTheme: () => void;
  
  // Gradient utilities
  getGradient: (type: keyof ThemeGradients) => GradientDefinition;
  getServiceGradient: (service: string, type: keyof ThemeGradients) => GradientDefinition;
  createServiceCardGradient: (serviceType: string) => string[];
}

const ServiceThemeContext = createContext<ServiceThemeContextType | null>(null);

interface ServiceThemeProviderProps {
  children: ReactNode;
  defaultGlobalTheme?: GlobalTheme;
  defaultService?: string | null;
}

export function ServiceThemeProvider({ 
  children, 
  defaultGlobalTheme = 'professional-azure',
  defaultService = null 
}: ServiceThemeProviderProps) {
  const [globalTheme, setGlobalTheme] = useState<GlobalTheme>(defaultGlobalTheme);
  const [activeService, setActiveService] = useState<string | null>(defaultService);

  // Compute merged theme tokens
  const computeThemeTokens = (global: GlobalTheme, service: string | null): DesignTokens => {
    const baseTheme = globalThemeConfigs[global];
    
    if (!service || !serviceThemeConfigs[service]) {
      return baseTheme;
    }
    
    const serviceOverride = serviceThemeConfigs[service];
    
    return {
      colors: { ...baseTheme.colors, ...serviceOverride.colors },
      typography: { ...baseTheme.typography, ...serviceOverride.typography },
      spacing: { ...baseTheme.spacing, ...serviceOverride.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...serviceOverride.borderRadius },
      shadows: { ...baseTheme.shadows, ...serviceOverride.shadows },
    };
  };

  // Get current computed tokens
  const tokens = computeThemeTokens(globalTheme, activeService);
  
  // Get current layout and component variants
  const currentServiceConfig = activeService ? serviceThemeConfigs[activeService] : null;
  const layout = currentServiceConfig?.layout || 'card-based';
  const componentVariants = currentServiceConfig?.componentVariants || {
    button: 'default',
    input: 'default',
    card: 'elevated',
  };

  // Default gradient definitions
  const defaultGradients: ThemeGradients = {
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
      colors: ['#FAFAFA', '#F5F5F5'],
      direction: { x: 0, y: 1 }
    },
    surface: {
      colors: ['#FFFFFF', '#FAFAFA'],
      direction: { x: 0, y: 1 }
    },
    accent: {
      colors: ['#64B5F6', '#2196F3', '#1976D2'],
      direction: { x: 0, y: 1 }
    }
  };

  // Get current gradients with fallback to defaults
  const gradients: ThemeGradients = {
    ...defaultGradients,
    ...(currentServiceConfig?.gradients || {})
  };

  // Utility function to get theme for any service
  const getServiceTheme = (service: string): DesignTokens => {
    return computeThemeTokens(globalTheme, service);
  };

  // Reset to global theme (no service override)
  const resetToGlobalTheme = () => {
    setActiveService(null);
  };

  // Gradient utility functions
  const getGradient = (type: keyof ThemeGradients): GradientDefinition => {
    return gradients[type];
  };

  const getServiceGradient = (service: string, type: keyof ThemeGradients): GradientDefinition => {
    const serviceConfig = serviceThemeConfigs[service];
    if (serviceConfig?.gradients?.[type]) {
      return serviceConfig.gradients[type];
    }
    return defaultGradients[type];
  };

  const createServiceCardGradient = (serviceType: string): string[] => {
    switch (serviceType) {
      case 'education':
        return ['#F3E5F5', '#FAF0FF', '#FFFFFF'];
      case 'men_saloon':
        return ['#FFF3E0', '#FFF8F0', '#FFFFFF'];
      case 'vehicle_repair':
        return ['#E8F5E8', '#F2FBF2', '#FFFFFF'];
      case 'cleaning':
        return ['#E0F2F1', '#F0F9F8', '#FFFFFF'];
      case 'parcel':
        return ['#FFF3E0', '#FFF8F0', '#FFFFFF'];
      case 'food_delivery':
        return ['#FFEBEE', '#FFF5F5', '#FFFFFF'];
      case 'booking':
        return ['#E3F2FD', '#F0F8FF', '#FFFFFF'];
      case 'healthcare':
        return ['#E8F5E8', '#F2FBF2', '#FFFFFF'];
      case 'entertainment':
        return ['#FCE4EC', '#FFF0F6', '#FFFFFF'];
      default:
        return ['#F5F5F5', '#FAFAFA', '#FFFFFF'];
    }
  };

  const contextValue: ServiceThemeContextType = {
    activeService,
    globalTheme,
    tokens,
    layout,
    componentVariants,
    gradients,
    setGlobalTheme,
    setActiveService,
    getServiceTheme,
    resetToGlobalTheme,
    getGradient,
    getServiceGradient,
    createServiceCardGradient,
  };

  return (
    <ServiceThemeContext.Provider value={contextValue}>
      {children}
    </ServiceThemeContext.Provider>
  );
}

// Custom hook to use the service theme context
export function useServiceTheme(): ServiceThemeContextType {
  const context = useContext(ServiceThemeContext);
  
  if (!context) {
    throw new Error('useServiceTheme must be used within a ServiceThemeProvider');
  }
  
  return context;
}

// Utility hook for component styling
export function useThemedStyles<T extends Record<string, any>>(
  createStyles: (tokens: DesignTokens, layout: ServiceThemeOverride['layout'], variants: ServiceThemeOverride['componentVariants']) => T
): T {
  const { tokens, layout, componentVariants } = useServiceTheme();
  return createStyles(tokens, layout, componentVariants);
}

// Higher-order component for theme-aware components
export function withServiceTheme<P extends object>(
  Component: React.ComponentType<P & { theme: ServiceThemeContextType }>
) {
  return function ThemedComponent(props: P) {
    const theme = useServiceTheme();
    return <Component {...props} theme={theme} />;
  };
}