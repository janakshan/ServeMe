import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { DesignTokens, professionalAzureTokens } from '@/utils/tokens';
import { ServiceTypes } from '@/utils/constants';

// Import service-specific theme configurations from the existing context
import { serviceThemeConfigs, ServiceThemeOverride } from './ServiceThemeContext';

// Import gradient definition type
import type { GradientDefinition } from './ServiceThemeContext';

// Import theme isolation guards
import { 
  validateThemeContextAccess, 
  ThemeDebugUtils,
  validateRouteGroupBoundary 
} from '@/utils/themeIsolationGuards';

// Base interface for all scoped theme contexts
interface ScopedThemeContextType {
  tokens: DesignTokens;
  layout: ServiceThemeOverride['layout'];
  componentVariants: ServiceThemeOverride['componentVariants'];
  gradients: ServiceThemeOverride['gradients'];
  serviceType: string;
  getGradient: (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent') => GradientDefinition;
}

// Education Theme Context
const EducationThemeContext = createContext<ScopedThemeContextType | null>(null);

export function EducationThemeProvider({ children }: { children: ReactNode }) {
  const contextValue = useMemo(() => {
    const serviceConfig = serviceThemeConfigs[ServiceTypes.EDUCATION];
    const baseTheme = professionalAzureTokens;
    
    const tokens: DesignTokens = {
      colors: { ...baseTheme.colors, ...serviceConfig.colors },
      typography: { ...baseTheme.typography, ...serviceConfig.typography },
      spacing: { ...baseTheme.spacing, ...serviceConfig.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...serviceConfig.borderRadius },
      shadows: { ...baseTheme.shadows, ...serviceConfig.shadows },
      gradients: baseTheme.gradients,
    };

    const getGradient = (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent'): GradientDefinition => {
      if (serviceConfig.gradients && serviceConfig.gradients[type]) {
        return serviceConfig.gradients[type];
      }
      // Fallback to default gradients if not defined in service config
      const defaultGradients = {
        header: { colors: ['#8E24AA', '#6A1B9A', '#4A148C'], direction: { x: 0, y: 1 } },
        card: { colors: ['#F2E7FF', '#F8F4FF', '#FFFFFF'], direction: { x: 0, y: 1 } },
        button: { colors: ['#9C27B0', '#6A1B9A', '#4A148C'], direction: { x: 0, y: 1 } },
        background: { colors: ['#FEFBFF', '#F8F4FF'], direction: { x: 0, y: 1 } },
        surface: { colors: ['#FFFFFF', '#FEFBFF'], direction: { x: 0, y: 1 } },
        accent: { colors: ['#CE93D8', '#8E24AA', '#6A1B9A'], direction: { x: 0, y: 1 } }
      };
      return defaultGradients[type];
    };

    return {
      tokens,
      layout: serviceConfig.layout || 'academic',
      componentVariants: serviceConfig.componentVariants || {
        button: 'rounded',
        input: 'outlined',
        card: 'bordered',
      },
      gradients: serviceConfig.gradients,
      serviceType: ServiceTypes.EDUCATION,
      getGradient,
    };
  }, []);

  return (
    <EducationThemeContext.Provider value={contextValue}>
      {children}
    </EducationThemeContext.Provider>
  );
}

export function useEducationTheme(): ScopedThemeContextType {
  const context = useContext(EducationThemeContext);
  
  // Enforce strict theme isolation
  validateThemeContextAccess('EducationTheme', 'education', context);
  validateRouteGroupBoundary('EducationTheme');
  
  if (!context) {
    throw new Error('useEducationTheme must be used within an EducationThemeProvider');
  }
  return context;
}

// Booking Theme Context
const BookingThemeContext = createContext<ScopedThemeContextType | null>(null);

export function BookingThemeProvider({ children }: { children: ReactNode }) {
  const contextValue = useMemo(() => {
    const serviceConfig = serviceThemeConfigs[ServiceTypes.BOOKING];
    const baseTheme = professionalAzureTokens;
    
    const tokens: DesignTokens = {
      colors: { ...baseTheme.colors, ...serviceConfig.colors },
      typography: { ...baseTheme.typography, ...serviceConfig.typography },
      spacing: { ...baseTheme.spacing, ...serviceConfig.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...serviceConfig.borderRadius },
      shadows: { ...baseTheme.shadows, ...serviceConfig.shadows },
      gradients: baseTheme.gradients,
    };

    const getGradient = (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent'): GradientDefinition => {
      if (serviceConfig.gradients && serviceConfig.gradients[type]) {
        return serviceConfig.gradients[type];
      }
      // Fallback to default booking gradients
      const defaultGradients = {
        header: { colors: ['#1565C0', '#0D47A1', '#0A3D91'], direction: { x: 0, y: 1 } },
        card: { colors: ['#E3F2FD', '#F0F8FF', '#FFFFFF'], direction: { x: 0, y: 1 } },
        button: { colors: ['#42A5F5', '#0D47A1', '#0A3D91'], direction: { x: 0, y: 1 } },
        background: { colors: ['#F8FCFF', '#F0F6FF'], direction: { x: 0, y: 1 } },
        surface: { colors: ['#FFFFFF', '#F8FCFF'], direction: { x: 0, y: 1 } },
        accent: { colors: ['#64B5F6', '#2196F3', '#1976D2'], direction: { x: 0, y: 1 } }
      };
      return defaultGradients[type];
    };

    return {
      tokens,
      layout: serviceConfig.layout || 'card-based',
      componentVariants: serviceConfig.componentVariants || {
        button: 'default',
        input: 'default',
        card: 'elevated',
      },
      gradients: serviceConfig.gradients,
      serviceType: ServiceTypes.BOOKING,
      getGradient,
    };
  }, []);

  return (
    <BookingThemeContext.Provider value={contextValue}>
      {children}
    </BookingThemeContext.Provider>
  );
}

export function useBookingTheme(): ScopedThemeContextType {
  const context = useContext(BookingThemeContext);
  
  // Enforce strict theme isolation
  validateThemeContextAccess('BookingTheme', 'booking', context);
  validateRouteGroupBoundary('BookingTheme');
  
  if (!context) {
    throw new Error('useBookingTheme must be used within a BookingThemeProvider');
  }
  return context;
}

// Healthcare Theme Context
const HealthcareThemeContext = createContext<ScopedThemeContextType | null>(null);

export function HealthcareThemeProvider({ children }: { children: ReactNode }) {
  const contextValue = useMemo(() => {
    const serviceConfig = serviceThemeConfigs[ServiceTypes.HEALTHCARE];
    const baseTheme = professionalAzureTokens;
    
    const tokens: DesignTokens = {
      colors: { ...baseTheme.colors, ...serviceConfig.colors },
      typography: { ...baseTheme.typography, ...serviceConfig.typography },
      spacing: { ...baseTheme.spacing, ...serviceConfig.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...serviceConfig.borderRadius },
      shadows: { ...baseTheme.shadows, ...serviceConfig.shadows },
      gradients: baseTheme.gradients,
    };

    const getGradient = (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent'): GradientDefinition => {
      if (serviceConfig.gradients && serviceConfig.gradients[type]) {
        return serviceConfig.gradients[type];
      }
      // Fallback to default healthcare gradients
      const defaultGradients = {
        header: { colors: ['#4CAF50', '#2E7D32', '#1B5E20'], direction: { x: 0, y: 1 } },
        card: { colors: ['#E8F5E8', '#F2FBF2', '#FFFFFF'], direction: { x: 0, y: 1 } },
        button: { colors: ['#66BB6A', '#2E7D32', '#1B5E20'], direction: { x: 0, y: 1 } },
        background: { colors: ['#F8FFF8', '#F0F8F0'], direction: { x: 0, y: 1 } },
        surface: { colors: ['#FFFFFF', '#F8FFF8'], direction: { x: 0, y: 1 } },
        accent: { colors: ['#81C784', '#4CAF50', '#2E7D32'], direction: { x: 0, y: 1 } }
      };
      return defaultGradients[type];
    };

    return {
      tokens,
      layout: serviceConfig.layout || 'clinical',
      componentVariants: serviceConfig.componentVariants || {
        button: 'clinical',
        input: 'minimal',
        card: 'flat',
      },
      gradients: serviceConfig.gradients,
      serviceType: ServiceTypes.HEALTHCARE,
      getGradient,
    };
  }, []);

  return (
    <HealthcareThemeContext.Provider value={contextValue}>
      {children}
    </HealthcareThemeContext.Provider>
  );
}

export function useHealthcareTheme(): ScopedThemeContextType {
  const context = useContext(HealthcareThemeContext);
  
  // Enforce strict theme isolation
  validateThemeContextAccess('HealthcareTheme', 'healthcare', context);
  validateRouteGroupBoundary('HealthcareTheme');
  
  if (!context) {
    throw new Error('useHealthcareTheme must be used within a HealthcareThemeProvider');
  }
  return context;
}

// Entertainment Theme Context
const EntertainmentThemeContext = createContext<ScopedThemeContextType | null>(null);

export function EntertainmentThemeProvider({ children }: { children: ReactNode }) {
  const contextValue = useMemo(() => {
    const serviceConfig = serviceThemeConfigs[ServiceTypes.ENTERTAINMENT];
    const baseTheme = professionalAzureTokens;
    
    const tokens: DesignTokens = {
      colors: { ...baseTheme.colors, ...serviceConfig.colors },
      typography: { ...baseTheme.typography, ...serviceConfig.typography },
      spacing: { ...baseTheme.spacing, ...serviceConfig.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...serviceConfig.borderRadius },
      shadows: { ...baseTheme.shadows, ...serviceConfig.shadows },
      gradients: baseTheme.gradients,
    };

    const getGradient = (type: 'header' | 'card' | 'button' | 'background' | 'surface' | 'accent'): GradientDefinition => {
      if (serviceConfig.gradients && serviceConfig.gradients[type]) {
        return serviceConfig.gradients[type];
      }
      // Fallback to default entertainment gradients
      const defaultGradients = {
        header: { colors: ['#FF4081', '#E91E63', '#AD1457'], direction: { x: 0, y: 1 } },
        card: { colors: ['#FCE4EC', '#FFF0F6', '#FFFFFF'], direction: { x: 0, y: 1 } },
        button: { colors: ['#F48FB1', '#E91E63', '#AD1457'], direction: { x: 0, y: 1 } },
        background: { colors: ['#FFF8FB', '#FFF0F5'], direction: { x: 0, y: 1 } },
        surface: { colors: ['#FFFFFF', '#FFF8FB'], direction: { x: 0, y: 1 } },
        accent: { colors: ['#F8BBD9', '#FF4081', '#E91E63'], direction: { x: 0, y: 1 } }
      };
      return defaultGradients[type];
    };

    return {
      tokens,
      layout: serviceConfig.layout || 'entertainment',
      componentVariants: serviceConfig.componentVariants || {
        button: 'rounded',
        input: 'outlined',
        card: 'bordered',
      },
      gradients: serviceConfig.gradients,
      serviceType: ServiceTypes.ENTERTAINMENT,
      getGradient,
    };
  }, []);

  return (
    <EntertainmentThemeContext.Provider value={contextValue}>
      {children}
    </EntertainmentThemeContext.Provider>
  );
}

export function useEntertainmentTheme(): ScopedThemeContextType {
  const context = useContext(EntertainmentThemeContext);
  
  // Enforce strict theme isolation
  validateThemeContextAccess('EntertainmentTheme', 'entertainment', context);
  validateRouteGroupBoundary('EntertainmentTheme');
  
  if (!context) {
    throw new Error('useEntertainmentTheme must be used within an EntertainmentThemeProvider');
  }
  return context;
}

// Utility hook for scoped themed styles - STRICT ISOLATION ENFORCED
export function useScopedThemedStyles<T extends Record<string, any>>(
  createStyles: (tokens: DesignTokens, layout: ServiceThemeOverride['layout'], variants: ServiceThemeOverride['componentVariants']) => T,
  context: ScopedThemeContextType
): T {
  // Validate that context is explicitly provided (no auto-detection)
  if (!context) {
    throw new Error(
      'useScopedThemedStyles: context parameter is required. ' +
      'Auto-detection has been disabled for theme isolation. ' +
      'Please explicitly provide the theme context (e.g., useEducationTheme())'
    );
  }

  // Validate context has required properties
  if (!context.tokens || !context.layout || !context.componentVariants) {
    throw new Error(
      'useScopedThemedStyles: Invalid theme context provided. ' +
      'Context must have tokens, layout, and componentVariants properties.'
    );
  }

  return useMemo(() => {
    try {
      return createStyles(context.tokens, context.layout, context.componentVariants);
    } catch (error) {
      console.error('Error creating scoped themed styles:', error);
      throw new Error(`Failed to create themed styles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [context, createStyles]);
}

// DEPRECATED: Auto-detection styled hook - will be removed
// @deprecated Use explicit theme context hooks instead
export function useScopedThemedStylesDeprecated<T extends Record<string, any>>(
  createStyles: (tokens: DesignTokens, layout: ServiceThemeOverride['layout'], variants: ServiceThemeOverride['componentVariants']) => T
): T {
  console.warn(
    '⚠️ DEPRECATED: Auto-detection theme styling is deprecated and will be removed. ' +
    'Please use explicit theme context hooks with useScopedThemedStyles.'
  );
  
  // This would contain the old auto-detection logic, but it's disabled for isolation
  throw new Error(
    'Auto-detection theme styling is disabled. ' +
    'Please use explicit theme context: useScopedThemedStyles(createStyles, useEducationTheme())'
  );
}