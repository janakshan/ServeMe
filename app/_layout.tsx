// app/_layout.tsx - Fast navigation transitions enabled
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../providers/AuthProvider';
import { ServicesProvider } from '../providers/ServicesProvider';
import { fastScreenOptions, instantScreenOptions, modalScreenOptions, serviceScreenOptions, authScreenOptions } from '../utils/navigationAnimations';
// import { NavigationThemeManager } from '../components/navigation/NavigationThemeManager';

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
    <AuthProvider>
      <ServicesProvider>
        {/* Theme providers now scoped to individual route groups for complete isolation */}
        <Stack screenOptions={fastScreenOptions}>
          <Stack.Screen name="index" options={instantScreenOptions} />
          <Stack.Screen name="(auth)" options={authScreenOptions} />
          <Stack.Screen name="(app)" options={instantScreenOptions} />
          <Stack.Screen name="(services)" options={{ ...serviceScreenOptions, headerShown: false }} />
          <Stack.Screen 
            name="(modals)" 
            options={modalScreenOptions}
          />
          <Stack.Screen name="+not-found" options={fastScreenOptions} />
        </Stack>
      </ServicesProvider>
    </AuthProvider>
  );
}