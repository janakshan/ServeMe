import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Debug component for route-group theme testing
 * Disabled for route-group theme architecture - each route group has its own isolated theme
 */
export function ThemeDebugger() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Debugger</Text>
      <Text style={styles.message}>
        Route-group theme isolation is active.{'\n'}
        Each route group has its own theme context.{'\n'}
        No global theme switching needed.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});