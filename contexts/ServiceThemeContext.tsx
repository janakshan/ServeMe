import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
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
export interface ServiceThemeOverride {
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

// Export type aliases for convenience
export type ThemeLayout = ServiceThemeOverride['layout'];
export type ThemeVariants = ServiceThemeOverride['componentVariants'];

// Global theme types
type GlobalTheme = 'professional-azure' | 'light' | 'dark';

// Service-specific theme configurations
const serviceThemeConfigs: Record<string, ServiceThemeOverride> = {
  
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
      border: '#79747E',
      divider: '#CAC4D0',
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
  
  // Navigation-aware theme state
  themeStack: string[];
  previousService: string | null;
  isTransitioning: boolean;
  
  // Theme switching functions
  setGlobalTheme: (theme: GlobalTheme) => void;
  setActiveService: (service: string | null) => void;
  pushServiceTheme: (service: string) => void;
  popServiceTheme: () => string | null;
  
  // Navigation-aware functions
  onNavigationFocus: (service: string) => void;
  onNavigationBlur: () => void;
  resetThemeStack: () => void;
  
  // Utility functions
  getServiceTheme: (service: string) => DesignTokens;
  resetToGlobalTheme: () => void;
  
  // Gradient utilities
  getGradient: (type: keyof ThemeGradients) => GradientDefinition;
  getServiceGradient: (service: string, type: keyof ThemeGradients) => GradientDefinition;
  createServiceCardGradient: (serviceType: string) => readonly [string, string, string];
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
  const [themeStack, setThemeStack] = useState<string[]>([]);
  const [previousService, setPreviousService] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Memoized theme computation for performance
  const tokens = useMemo(() => {
    const baseTheme = globalThemeConfigs[globalTheme];
    console.log(`🎨 Computing tokens for globalTheme: ${globalTheme}, activeService: ${activeService}`);
    
    if (!activeService || !serviceThemeConfigs[activeService]) {
      console.log(`🎨 Using base theme (no service override)`);
      console.log(`🎨 Base theme primary color: ${baseTheme.colors.primary}`);
      return baseTheme;
    }
    
    const serviceOverride = serviceThemeConfigs[activeService];
    console.log(`🎨 Applying service override for: ${activeService}`);
    console.log(`🎨 Service primary color: ${serviceOverride.colors?.primary}`);
    
    const computedTheme = {
      colors: { ...baseTheme.colors, ...serviceOverride.colors },
      typography: { ...baseTheme.typography, ...serviceOverride.typography },
      spacing: { ...baseTheme.spacing, ...serviceOverride.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...serviceOverride.borderRadius },
      shadows: { ...baseTheme.shadows, ...serviceOverride.shadows },
      gradients: baseTheme.gradients, // Include gradients from base theme
    };
    
    console.log(`🎨 Computed theme primary color: ${computedTheme.colors.primary}`);
    return computedTheme;
  }, [globalTheme, activeService]);
  
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

  // Memoized utility function to get theme for any service
  const getServiceTheme = useCallback((service: string): DesignTokens => {
    const baseTheme = globalThemeConfigs[globalTheme];
    
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
      gradients: baseTheme.gradients, // Include gradients from base theme
    };
  }, [globalTheme]);

  // Memoized callback functions for performance - using functional updates
  const pushServiceTheme = useCallback((service: string) => {
    setIsTransitioning(true);
    
    // Update previous service tracking using functional updates
    setActiveService(currentService => {
      if (currentService && currentService !== service) {
        setPreviousService(currentService);
        setThemeStack(prev => [...prev, currentService]);
      }
      
      // Small delay to ensure smooth transition
      setTimeout(() => setIsTransitioning(false), 100);
      
      return service;
    });
  }, []); // No dependencies - uses functional updates

  const popServiceTheme = useCallback((): string | null => {
    setIsTransitioning(true);
    
    let returnValue: string | null = null;
    
    setThemeStack(prev => {
      const [previousTheme] = prev.slice(-1);
      const newStack = prev.slice(0, -1);
      returnValue = previousTheme || null;
      
      setActiveService(currentService => {
        setPreviousService(currentService);
        setTimeout(() => setIsTransitioning(false), 100);
        return previousTheme || null;
      });
      
      return newStack;
    });
    
    return returnValue;
  }, []); // No dependencies - uses functional updates

  // Navigation-aware functions - optimized to avoid dependencies
  const onNavigationFocus = useCallback((service: string) => {
    setActiveService(currentService => {
      if (service !== currentService) {
        setIsTransitioning(true);
        
        if (currentService && currentService !== service) {
          setPreviousService(currentService);
          setThemeStack(prev => [...prev, currentService]);
        }
        
        setTimeout(() => setIsTransitioning(false), 100);
        return service;
      }
      return currentService;
    });
  }, []); // No dependencies

  const onNavigationBlur = useCallback(() => {
    // Don't automatically pop on blur - let explicit navigation handle this
    // This prevents premature theme switching during navigation transitions
  }, []);

  const resetThemeStack = useCallback(() => {
    setThemeStack([]);
    setPreviousService(null);
    setActiveService(null);
    setIsTransitioning(false);
  }, []);

  // Reset to global theme (no service override) - using functional updates for stability
  const resetToGlobalTheme = useCallback(() => {
    setIsTransitioning(true);
    setActiveService(currentService => {
      setPreviousService(currentService);
      setTimeout(() => setIsTransitioning(false), 100);
      return null;
    });
  }, []); // No dependencies - uses functional updates

  // Enhanced setActiveService with transition management - using functional updates for stability
  const enhancedSetActiveService = useCallback((service: string | null) => {
    setActiveService(currentService => {
      if (service === currentService) {
        console.log(`🎨 Theme: Service ${service} already active, no change needed`);
        return currentService;
      }
      
      console.log(`🎨 Theme: Switching from ${currentService} to ${service}`);
      setIsTransitioning(true);
      setPreviousService(currentService);
      setTimeout(() => setIsTransitioning(false), 100);
      
      return service;
    });
  }, []); // No dependencies - uses functional updates

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

  const contextValue: ServiceThemeContextType = {
    activeService,
    globalTheme,
    tokens,
    layout,
    componentVariants,
    gradients,
    themeStack,
    previousService,
    isTransitioning,
    setGlobalTheme,
    setActiveService: enhancedSetActiveService,
    pushServiceTheme,
    popServiceTheme,
    onNavigationFocus,
    onNavigationBlur,
    resetThemeStack,
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