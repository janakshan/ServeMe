import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

/**
 * Debug component to test education theme
 * Works with route-group theme architecture
 */
export function EducationThemeTest() {
  const { tokens, serviceType } = useEducationTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.surface }]}>
      <Text style={[styles.title, { color: tokens.colors.onSurface }]}>
        Education Theme Test
      </Text>
      <Text style={[styles.message, { color: tokens.colors.onSurfaceVariant }]}>
        Service Type: {serviceType}{'\n'}
        Primary Color: {tokens.colors.primary}{'\n'}
        Theme is working correctly! 🎉
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});