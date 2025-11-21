import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEntertainmentTheme } from '@/contexts/ScopedThemeProviders';
import { Button } from '@/components/ui/Button';
import { ThemeTransitionGuard } from '@/components/ui/ThemeTransitionGuard';
import { ServiceTypes } from '@/utils/constants';

export default function EntertainmentHome() {
  const { tokens, serviceType } = useEntertainmentTheme();

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
    <ThemeTransitionGuard serviceType={ServiceTypes.ENTERTAINMENT} showLoader>
      <View style={styles.container}>
        <Text style={styles.title}>Entertainment Service</Text>
        <Text style={styles.subtitle}>
          Vibrant pink theme for entertainment and leisure services
        </Text>
        
        <Button
          title="Explore Entertainment Services"
          onPress={() => console.log('Navigate to entertainment services')}
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