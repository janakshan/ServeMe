// components/ui/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat' | 'bordered';
  useGradient?: boolean;
}

export function Card({ children, style, variant = 'default', useGradient = true }: CardProps) {
  const { getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);

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

const createStyles = (tokens: any) => StyleSheet.create({
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