// Auth stack layout - Fast transitions for smooth authentication flow

import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { authScreenOptions, instantScreenOptions } from '@/utils/navigationAnimations';
import { AuthThemeProvider, useAuthTheme } from '@/contexts/AuthThemeProvider';
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AuthLayoutContent() {
  const { isAuthenticated } = useAuth();
  const { tokens, getGradient } = useAuthTheme();
  const insets = useSafeAreaInsets();
  const backgroundGradient = getGradient('background');

  // Redirect to main app if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  const enhancedAuthScreenOptions = {
    ...authScreenOptions,
    headerStyle: {
      ...authScreenOptions.headerStyle,
      backgroundColor: tokens.colors.primary,
    },
    headerTintColor: tokens.colors.onPrimary,
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={tokens.colors.primary}
        translucent={false}
      />
      <LinearGradient
        colors={backgroundGradient.colors}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1 - backgroundGradient.direction.x, y: 1 - backgroundGradient.direction.y }}
        style={[styles.gradientBackground, { paddingTop: insets.top }]}
      >
        <Stack screenOptions={enhancedAuthScreenOptions}>
          <Stack.Screen 
            name="onboarding" 
            options={enhancedAuthScreenOptions} 
          />
          <Stack.Screen 
            name="login" 
            options={enhancedAuthScreenOptions} 
          />
          <Stack.Screen 
            name="signup" 
            options={enhancedAuthScreenOptions} 
          />
          <Stack.Screen 
            name="forgot-password" 
            options={enhancedAuthScreenOptions} 
          />
          <Stack.Screen 
            name="confirm-phone" 
            options={enhancedAuthScreenOptions} 
          />
          <Stack.Screen 
            name="enter-otp" 
            options={{...instantScreenOptions, headerStyle: { backgroundColor: tokens.colors.primary }}} // Instant for OTP flow
          />
          <Stack.Screen 
            name="signup-success" 
            options={enhancedAuthScreenOptions} 
          />
          <Stack.Screen 
            name="reset-password" 
            options={enhancedAuthScreenOptions} 
          />
        </Stack>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
});

export default function AuthLayout() {
  return (
    <AuthThemeProvider>
      <AuthLayoutContent />
    </AuthThemeProvider>
  );
}