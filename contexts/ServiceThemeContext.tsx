import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DesignTokens, professionalAzureTokens, lightTokens, darkTokens } from '@/utils/tokens';
import { ServiceTypes } from '@/utils/constants';

// Service-specific theme overrides
interface ServiceThemeOverride {
  colors?: Partial<DesignTokens['colors']>;
  typography?: Partial<DesignTokens['typography']>;
  spacing?: Partial<DesignTokens['spacing']>;
  borderRadius?: Partial<DesignTokens['borderRadius']>;
  shadows?: Partial<DesignTokens['shadows']>;
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
    layout: 'clinical',
    componentVariants: {
      button: 'clinical',
      input: 'outlined',
      card: 'flat',
    },
  },
  
  [ServiceTypes.EDUCATION]: {
    colors: {
      primary: '#7B1FA2',
      primaryDark: '#4A148C',
      primaryLight: '#BA68C8',
      accent: '#9C27B0',
      info: '#673AB7',
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
  
  // Theme switching functions
  setGlobalTheme: (theme: GlobalTheme) => void;
  setActiveService: (service: string | null) => void;
  
  // Utility functions
  getServiceTheme: (service: string) => DesignTokens;
  resetToGlobalTheme: () => void;
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

  // Utility function to get theme for any service
  const getServiceTheme = (service: string): DesignTokens => {
    return computeThemeTokens(globalTheme, service);
  };

  // Reset to global theme (no service override)
  const resetToGlobalTheme = () => {
    setActiveService(null);
  };

  const contextValue: ServiceThemeContextType = {
    activeService,
    globalTheme,
    tokens,
    layout,
    componentVariants,
    setGlobalTheme,
    setActiveService,
    getServiceTheme,
    resetToGlobalTheme,
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