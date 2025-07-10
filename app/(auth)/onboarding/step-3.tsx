// app/(auth)/onboarding/step-3.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { secureStorage } from '../../../services/storage/secureStorage';

export default function OnboardingStep3() {
  const handleGetStarted = async () => {
    // Mark onboarding as completed
    await secureStorage.setOnboardingStatus('completed');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ready to Start?</Text>
        <Text style={styles.description}>
          Join thousands of users who trust our platform for their daily needs
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Get Started" 
          onPress={handleGetStarted}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
  },
});