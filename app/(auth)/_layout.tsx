// Auth stack layout - Fast transitions for smooth authentication flow

import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { authScreenOptions, instantScreenOptions } from '@/utils/navigationAnimations';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // Redirect to main app if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={authScreenOptions}>
      <Stack.Screen 
        name="onboarding" 
        options={authScreenOptions} 
      />
      <Stack.Screen 
        name="login" 
        options={authScreenOptions} 
      />
      <Stack.Screen 
        name="signup" 
        options={authScreenOptions} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={authScreenOptions} 
      />
      <Stack.Screen 
        name="confirm-phone" 
        options={authScreenOptions} 
      />
      <Stack.Screen 
        name="enter-otp" 
        options={instantScreenOptions} // Instant for OTP flow
      />
      <Stack.Screen 
        name="signup-success" 
        options={authScreenOptions} 
      />
      <Stack.Screen 
        name="reset-password" 
        options={authScreenOptions} 
      />
    </Stack>
  );
}