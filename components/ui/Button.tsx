import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  useGradient?: boolean;
}

export function Button({ 
  title, 
  onPress, 
  style, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  useGradient = true
}: ButtonProps) {
  const { getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);

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
          colors={buttonGradient.colors}
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

const createStyles = (tokens: any) => StyleSheet.create({
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