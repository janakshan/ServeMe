import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import { ServiceTypes } from '@/utils/constants';

const ThemeDemo = () => {
  const { activeService, globalTheme, setActiveService, setGlobalTheme } = useServiceTheme();
  const styles = useThemedStyles(createStyles);

  const services = [
    { key: ServiceTypes.BOOKING, label: 'Booking' },
    { key: ServiceTypes.HEALTHCARE, label: 'Healthcare' },
    { key: ServiceTypes.EDUCATION, label: 'Education' },
    { key: ServiceTypes.ENTERTAINMENT, label: 'Entertainment' },
  ];

  const globalThemes = [
    { key: 'professional-azure', label: 'Professional Azure' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Demo</Text>
      <Text style={styles.subtitle}>Current: {activeService || 'Global'} ({globalTheme})</Text>
      
      <Text style={styles.sectionTitle}>Global Themes</Text>
      <View style={styles.buttonRow}>
        {globalThemes.map((theme) => (
          <TouchableOpacity
            key={theme.key}
            style={[
              styles.button,
              globalTheme === theme.key && styles.activeButton
            ]}
            onPress={() => setGlobalTheme(theme.key)}
          >
            <Text style={[
              styles.buttonText,
              globalTheme === theme.key && styles.activeButtonText
            ]}>
              {theme.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Service Themes</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            !activeService && styles.activeButton
          ]}
          onPress={() => setActiveService(null)}
        >
          <Text style={[
            styles.buttonText,
            !activeService && styles.activeButtonText
          ]}>
            None
          </Text>
        </TouchableOpacity>
        {services.map((service) => (
          <TouchableOpacity
            key={service.key}
            style={[
              styles.button,
              activeService === service.key && styles.activeButton
            ]}
            onPress={() => setActiveService(service.key)}
          >
            <Text style={[
              styles.buttonText,
              activeService === service.key && styles.activeButtonText
            ]}>
              {service.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.cardTitle}>Theme Preview</Text>
        <Text style={styles.cardText}>
          This card shows how the current theme affects the appearance.
          Switch between different services to see the color and styling changes.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (tokens, layout, variants) => StyleSheet.create({
  container: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background,
  },
  title: {
    fontSize: tokens.typography.headline1,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.xl,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  button: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.button,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    ...tokens.shadows.sm,
  },
  activeButton: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  buttonText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.medium,
    color: tokens.colors.onSurface,
  },
  activeButtonText: {
    color: tokens.colors.onPrimary,
    fontWeight: tokens.typography.bold,
  },
  previewCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.card,
    padding: tokens.spacing.cardPadding.vertical,
    marginTop: tokens.spacing.lg,
    borderWidth: 2,
    borderColor: tokens.colors.primary,
    ...tokens.shadows.md,
  },
  cardTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.md,
  },
  cardText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: tokens.typography.body * tokens.typography.normal,
  },
});

export default ThemeDemo;