import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { useThemedStyles } from '@/contexts/ServiceThemeContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  minHeight?: number;
}

export function ScreenHeader({ title, subtitle, minHeight = 160 }: ScreenHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.headerSection, { minHeight }]}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (tokens, layout, variants) =>
  StyleSheet.create({
    headerSection: {
      backgroundColor: tokens.colors.primary,
      paddingBottom: tokens.spacing.lg,
    },
    headerSafeArea: {
      backgroundColor: 'transparent',
      flex: 1,
      justifyContent: 'center',
    },
    headerContent: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
    },
    title: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.bold,
      fontSize: tokens.typography.display,
      textAlign: 'center',
      marginBottom: tokens.spacing.xs,
    },
    subtitle: {
      color: tokens.colors.onPrimary,
      fontWeight: tokens.typography.light,
      fontSize: tokens.typography.body,
      textAlign: 'center',
      opacity: 0.9,
      paddingHorizontal: tokens.spacing.lg,
      lineHeight: tokens.typography.body * 1.3,
    },
  });