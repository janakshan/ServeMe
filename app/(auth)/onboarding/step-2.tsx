// app/(auth)/onboarding/step-2.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../../../components/ui/Button';

export default function OnboardingStep2() {
  const handleNext = () => {
    router.push('/(auth)/onboarding/step-3');
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Multiple Services</Text>
        <Text style={styles.description}>
          Access booking, education, healthcare, and entertainment services all in one app
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Next" 
          onPress={handleNext}
          style={styles.nextButton}
        />
        <Button 
          title="Skip" 
          onPress={handleSkip}
          variant="outline"
          style={styles.skipButton}
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
  nextButton: {
    backgroundColor: '#007AFF',
    marginBottom: 10,
  },
  skipButton: {
    borderColor: '#007AFF',
  },
});
