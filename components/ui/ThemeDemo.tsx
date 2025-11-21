import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Theme demo component - disabled for route-group theme architecture
 * Each route group has its own isolated theme context
 */
const ThemeDemo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Demo</Text>
      <Text style={styles.message}>
        Route-group theme isolation is active.{'\n'}
        Navigate between different routes to see theme changes.{'\n'}
        Each service has its own isolated theme context.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
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

export default ThemeDemo;