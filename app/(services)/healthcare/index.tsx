import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHealthcareTheme } from '@/contexts/ScopedThemeProviders';
import { Button } from '@/components/ui/Button';
import { ThemeTransitionGuard } from '@/components/ui/ThemeTransitionGuard';
import { ServiceTypes } from '@/utils/constants';

export default function HealthcareHome() {
  const { tokens, serviceType } = useHealthcareTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
      padding: tokens.spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: tokens.typography.headline,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onBackground,
      marginBottom: tokens.spacing.lg,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: tokens.typography.body,
      color: tokens.colors.onSurfaceVariant,
      marginBottom: tokens.spacing.xl,
      textAlign: 'center',
    },
    themeInfo: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.card,
      marginTop: tokens.spacing.lg,
    },
    themeText: {
      fontSize: tokens.typography.caption,
      color: tokens.colors.onSurface,
      textAlign: 'center',
    },
  });

  return (
    <ThemeTransitionGuard serviceType={ServiceTypes.HEALTHCARE} showLoader>
      <View style={styles.container}>
        <Text style={styles.title}>Healthcare Service</Text>
        <Text style={styles.subtitle}>
          Clean green theme for medical and healthcare services
        </Text>
        
        <Button
          title="Explore Healthcare Services"
          onPress={() => console.log('Navigate to healthcare services')}
          useGradient
        />

        <View style={styles.themeInfo}>
          <Text style={styles.themeText}>
            Active Theme: {serviceType}
          </Text>
          <Text style={styles.themeText}>
            Primary Color: {tokens.colors.primary}
          </Text>
        </View>
      </View>
    </ThemeTransitionGuard>
  );
}