import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMainAppTheme } from '@/contexts/MainAppThemeProvider';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { useAuthTheme } from '@/contexts/AuthThemeProvider';
import type { DesignTokens } from '@/utils/tokens';
import type { ServiceThemeOverride } from '@/contexts/ServiceThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  useGradient?: boolean;
  themeType?: 'main-app' | 'education' | 'booking' | 'healthcare' | 'entertainment' | 'auth';
}

// Hook to get the appropriate theme based on themeType
function useButtonTheme(themeType?: ButtonProps['themeType']) {
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

export function Button({ 
  title, 
  onPress, 
  style, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  useGradient = true,
  themeType
}: ButtonProps) {
  const theme = useButtonTheme(themeType);
  
  // Fallback if no theme context is available
  if (!theme) {
    return (
      <TouchableOpacity
        style={[fallbackStyles.button, style]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <Text style={fallbackStyles.text}>{title}</Text>
      </TouchableOpacity>
    );
  }

  const { getGradient } = theme;
  const styles = createThemedStyles(theme.tokens, theme.layout, theme.componentVariants);

  const buttonGradient = getGradient('button');

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
  ];

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? styles.primaryText.color : styles.outlineText.color} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </>
  );

  if (variant === 'primary' && useGradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.button, style]}
      >
        <LinearGradient
          colors={buttonGradient.colors as readonly [string, string, ...string[]]}
          start={{ x: buttonGradient.direction.x, y: buttonGradient.direction.y }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientButton, disabled && styles.disabled]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

// Fallback styles when no theme context is available
const fallbackStyles = StyleSheet.create({
  button: {
    backgroundColor: '#0D47A1',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const createThemedStyles = (
  tokens: DesignTokens, 
  layout: ServiceThemeOverride['layout'], 
  variants: ServiceThemeOverride['componentVariants']
) => StyleSheet.create({
  button: {
    paddingVertical: tokens.spacing.buttonPadding.vertical,
    paddingHorizontal: tokens.spacing.buttonPadding.horizontal,
    borderRadius: tokens.borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  gradientButton: {
    paddingVertical: tokens.spacing.buttonPadding.vertical,
    paddingHorizontal: tokens.spacing.buttonPadding.horizontal,
    borderRadius: tokens.borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  secondary: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semibold,
  },
  primaryText: {
    color: tokens.colors.onPrimary,
  },
  secondaryText: {
    color: tokens.colors.onSurface,
  },
  outlineText: {
    color: tokens.colors.primary,
  },
  disabledText: {
    color: tokens.colors.onSurfaceVariant,
  },
});