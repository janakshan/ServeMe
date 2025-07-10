// app/_layout.tsx - UPDATED VERSION with correct imports
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../providers/AuthProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ServicesProvider } from '../providers/ServicesProvider';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ServicesProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(services)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="(modals)" 
              options={{ 
                presentation: 'modal',
                headerShown: false 
              }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ServicesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}