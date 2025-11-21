import { StyleSheet } from 'react-native';
import { DesignTokens } from './tokens';
import { ServiceThemeOverride } from '@/contexts/ServiceThemeContext';

// Route-group-specific style utilities to prevent cross-group theme access

export interface RouteGroupStyleConfig {
  tokens: DesignTokens;
  layout: ServiceThemeOverride['layout'];
  componentVariants: ServiceThemeOverride['componentVariants'];
  serviceType: string;
}

// Base style creator function type
export type StyleCreator<T extends Record<string, any>> = (
  tokens: DesignTokens, 
  layout: ServiceThemeOverride['layout'],
  variants: ServiceThemeOverride['componentVariants']
) => T;

// Education-specific style utilities
export class EducationStyles {
  static create<T extends Record<string, any>>(
    styleCreator: StyleCreator<T>,
    config: RouteGroupStyleConfig
  ): T {
    if (config.serviceType !== 'education') {
      throw new Error('EducationStyles can only be used within Education route group');
    }
    return StyleSheet.create(styleCreator(config.tokens, config.layout, config.componentVariants));
  }

  static createHeader(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens) => ({
        header: {
          backgroundColor: tokens.colors.primary,
          borderBottomWidth: 0,
          elevation: 4,
          shadowColor: tokens.colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        headerTitle: {
          color: tokens.colors.onPrimary,
          fontSize: tokens.typography.title,
          fontWeight: tokens.typography.semibold,
        },
      }),
      config
    );
  }

  static createCard(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens, layout, variants) => ({
        card: {
          backgroundColor: tokens.colors.surface,
          borderRadius: variants?.card === 'bordered' ? tokens.borderRadius.lg : tokens.borderRadius.card,
          padding: tokens.spacing.cardPadding.vertical,
          marginVertical: tokens.spacing.sm,
          marginHorizontal: tokens.spacing.md,
          borderWidth: variants?.card === 'bordered' ? 1 : 0,
          borderColor: tokens.colors.border,
          ...tokens.shadows.md,
        },
      }),
      config
    );
  }
}

// Booking-specific style utilities
export class BookingStyles {
  static create<T extends Record<string, any>>(
    styleCreator: StyleCreator<T>,
    config: RouteGroupStyleConfig
  ): T {
    if (config.serviceType !== 'booking') {
      throw new Error('BookingStyles can only be used within Booking route group');
    }
    return StyleSheet.create(styleCreator(config.tokens, config.layout, config.componentVariants));
  }

  static createHeader(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens) => ({
        header: {
          backgroundColor: tokens.colors.primary,
          borderBottomWidth: 0,
          elevation: 6,
          shadowColor: tokens.colors.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
        headerTitle: {
          color: tokens.colors.onPrimary,
          fontSize: tokens.typography.title,
          fontWeight: tokens.typography.bold,
        },
      }),
      config
    );
  }

  static createCard(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens, layout, variants) => ({
        card: {
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.borderRadius.card,
          padding: tokens.spacing.cardPadding.vertical,
          marginVertical: tokens.spacing.sm,
          marginHorizontal: tokens.spacing.md,
          ...tokens.shadows.lg, // Elevated cards for booking
        },
      }),
      config
    );
  }
}

// Healthcare-specific style utilities
export class HealthcareStyles {
  static create<T extends Record<string, any>>(
    styleCreator: StyleCreator<T>,
    config: RouteGroupStyleConfig
  ): T {
    if (config.serviceType !== 'healthcare') {
      throw new Error('HealthcareStyles can only be used within Healthcare route group');
    }
    return StyleSheet.create(styleCreator(config.tokens, config.layout, config.componentVariants));
  }

  static createHeader(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens) => ({
        header: {
          backgroundColor: tokens.colors.primary,
          borderBottomWidth: 1,
          borderBottomColor: tokens.colors.border,
          elevation: 2,
          shadowColor: tokens.colors.primary,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
        },
        headerTitle: {
          color: tokens.colors.onPrimary,
          fontSize: tokens.typography.title,
          fontWeight: tokens.typography.medium,
        },
      }),
      config
    );
  }

  static createCard(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens, layout, variants) => ({
        card: {
          backgroundColor: tokens.colors.surface,
          borderRadius: variants?.card === 'flat' ? tokens.borderRadius.sm : tokens.borderRadius.card,
          padding: tokens.spacing.cardPadding.vertical,
          marginVertical: tokens.spacing.sm,
          marginHorizontal: tokens.spacing.md,
          borderWidth: 1,
          borderColor: tokens.colors.border,
          // Minimal shadow for clinical look
          ...tokens.shadows.sm,
        },
      }),
      config
    );
  }
}

// Entertainment-specific style utilities
export class EntertainmentStyles {
  static create<T extends Record<string, any>>(
    styleCreator: StyleCreator<T>,
    config: RouteGroupStyleConfig
  ): T {
    if (config.serviceType !== 'entertainment') {
      throw new Error('EntertainmentStyles can only be used within Entertainment route group');
    }
    return StyleSheet.create(styleCreator(config.tokens, config.layout, config.componentVariants));
  }

  static createHeader(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens) => ({
        header: {
          backgroundColor: tokens.colors.primary,
          borderBottomWidth: 0,
          elevation: 8,
          shadowColor: tokens.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        headerTitle: {
          color: tokens.colors.onPrimary,
          fontSize: tokens.typography.title,
          fontWeight: tokens.typography.bold,
        },
      }),
      config
    );
  }

  static createCard(config: RouteGroupStyleConfig) {
    return this.create(
      (tokens, layout, variants) => ({
        card: {
          backgroundColor: tokens.colors.surface,
          borderRadius: variants?.card === 'bordered' ? tokens.borderRadius.xl : tokens.borderRadius.card,
          padding: tokens.spacing.cardPadding.vertical,
          marginVertical: tokens.spacing.md,
          marginHorizontal: tokens.spacing.md,
          borderWidth: variants?.card === 'bordered' ? 2 : 0,
          borderColor: tokens.colors.accent,
          ...tokens.shadows.lg,
        },
      }),
      config
    );
  }
}

// Type guard functions to ensure proper usage
export function isEducationContext(config: RouteGroupStyleConfig): boolean {
  return config.serviceType === 'education';
}

export function isBookingContext(config: RouteGroupStyleConfig): boolean {
  return config.serviceType === 'booking';
}

export function isHealthcareContext(config: RouteGroupStyleConfig): boolean {
  return config.serviceType === 'healthcare';
}

export function isEntertainmentContext(config: RouteGroupStyleConfig): boolean {
  return config.serviceType === 'entertainment';
}