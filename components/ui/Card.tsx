// components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMainAppTheme } from '@/contexts/MainAppThemeProvider';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { useAuthTheme } from '@/contexts/AuthThemeProvider';
import type { DesignTokens } from '@/utils/tokens';
import type { ServiceThemeOverride } from '@/contexts/ServiceThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat' | 'bordered';
  useGradient?: boolean;
  themeType?: 'main-app' | 'education' | 'booking' | 'healthcare' | 'entertainment' | 'auth';
}

// Hook to get the appropriate theme based on themeType
function useCardTheme(themeType?: CardProps['themeType']) {
  try {
    if (themeType === 'main-app') {
      return useMainAppTheme();
    } else if (themeType === 'education') {
      return useEducationTheme();
    } else if (themeType === 'auth') {
      return useAuthTheme();
    } else {
      // Auto-detect: try main app first, then education, then auth
      try {
        return useMainAppTheme();
      } catch {
        try {
          return useEducationTheme();
        } catch {
          try {
            return useAuthTheme();
          } catch {
            return null;
          }
        }
      }
    }
  } catch (error) {
    return null;
  }
}

export function Card({ children, style, variant = 'default', useGradient = true, themeType }: CardProps) {
  const theme = useCardTheme(themeType);
  
  // Fallback if no theme context is available
  if (!theme) {
    return (
      <View style={[fallbackStyles.card, fallbackStyles[variant], style]}>
        {children}
      </View>
    );
  }

  const { getGradient } = theme;
  const styles = createThemedStyles(theme.tokens, theme.layout, theme.componentVariants);

  const cardGradient = getGradient('card');

  if (useGradient) {
    return (
      <LinearGradient
        colors={cardGradient.colors}
        start={{ x: cardGradient.direction.x, y: cardGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles[variant], style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
}

// Fallback styles when no theme context is available
const fallbackStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 28,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  default: {
    backgroundColor: '#FFFFFF',
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  flat: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  bordered: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

const createThemedStyles = (
  tokens: DesignTokens, 
  layout: ServiceThemeOverride['layout'], 
  variants: ServiceThemeOverride['componentVariants']
) => StyleSheet.create({
  card: {
    borderRadius: tokens.borderRadius.card,
    padding: tokens.spacing.cardPadding.vertical,
    paddingHorizontal: tokens.spacing.cardPadding.horizontal,
    ...tokens.shadows.sm,
  },
  default: {
    backgroundColor: tokens.colors.surface,
  },
  elevated: {
    backgroundColor: tokens.colors.surface,
    ...tokens.shadows.md,
  },
  flat: {
    backgroundColor: tokens.colors.surface,
    ...tokens.shadows.none,
  },
  bordered: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.sm,
  },
});