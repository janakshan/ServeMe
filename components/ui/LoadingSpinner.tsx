import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useServiceTheme } from '@/contexts/ServiceThemeContext';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  message = "Loading...", 
  size = "large",
  color 
}: LoadingSpinnerProps) {
  const { tokens } = useServiceTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={size} 
        color={color || tokens.colors.primary} 
      />
      <Text style={[styles.message, { color: tokens.colors.onSurface }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});