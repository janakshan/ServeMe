// app/index.tsx - SIMPLIFIED VERSION for debugging
import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  console.log('🚀 Index redirect logic:', {
    isAuthenticated,
    hasCompletedOnboarding,
    redirecting: isAuthenticated ? '/(app)/(tabs)' : !hasCompletedOnboarding ? '/(auth)/onboarding' : '/(auth)/login'
  });

  // Redirect based on auth state
  if (isAuthenticated) {
    console.log('✅ Redirecting to main app');
    return <Redirect href="/(app)/(tabs)" />;
  }

  if (!hasCompletedOnboarding) {
    console.log('📚 Redirecting to onboarding');
    return <Redirect href="/(auth)/onboarding" />;
  }

  console.log('🔐 Redirecting to login');
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});