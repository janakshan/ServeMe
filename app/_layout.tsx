// app/_layout.tsx - Fast navigation transitions enabled
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../providers/AuthProvider';
import { ServicesProvider } from '../providers/ServicesProvider';
import { fastScreenOptions, instantScreenOptions, modalScreenOptions, serviceScreenOptions, authScreenOptions } from '../utils/navigationAnimations';
import { initializeSoundService } from '../src/education/services/soundService';
// import { NavigationThemeManager } from '../components/navigation/NavigationThemeManager';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize sound service early for better performance
        await initializeSoundService();
        
        // Hide splash screen after initialization
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 2000);
      } catch (error) {
        console.warn('⚠️ App initialization error:', error);
        // Hide splash screen even if sound service fails
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 2000);
      }
    };

    initializeApp();
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