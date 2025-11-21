import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';
import { useMainAppTheme } from '@/contexts/MainAppThemeProvider';
import { useAuthTheme } from '@/contexts/AuthThemeProvider';

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
  // Auto-detect available theme context
  let tokens;
  try {
    tokens = useEducationTheme().tokens;
  } catch {
    try {
      tokens = useMainAppTheme().tokens;
    } catch {
      try {
        tokens = useAuthTheme().tokens;
      } catch {
        // Fallback tokens if no theme context available
        tokens = {
          colors: {
            primary: '#6A1B9A',
            onSurface: '#000000',
          }
        };
      }
    }
  }
  
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