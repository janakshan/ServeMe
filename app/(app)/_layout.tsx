// app/(app)/_layout.tsx - Instant navigation for main app
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';
import { instantScreenOptions } from '../../utils/navigationAnimations';
import { MainAppThemeProvider, useMainAppTheme } from '../../contexts/MainAppThemeProvider';
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AppLayoutContent() {
  const { isAuthenticated } = useAuth();
  const { tokens, getGradient } = useMainAppTheme();
  const insets = useSafeAreaInsets();
  const backgroundGradient = getGradient('background');

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const enhancedScreenOptions = {
    ...instantScreenOptions,
    headerStyle: {
      ...instantScreenOptions.headerStyle,
      backgroundColor: tokens.colors.primary,
    },
    headerTintColor: tokens.colors.onPrimary,
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={tokens.colors.primary}
        translucent={true}
      />
      <LinearGradient
        colors={backgroundGradient.colors}
        start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
        end={{ x: 1 - backgroundGradient.direction.x, y: 1 - backgroundGradient.direction.y }}
        style={styles.gradientBackground}
      >
        <Stack screenOptions={enhancedScreenOptions}>
          <Stack.Screen name="(tabs)" options={enhancedScreenOptions} />
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

export default function AppLayout() {
  return (
    <MainAppThemeProvider>
      <AppLayoutContent />
    </MainAppThemeProvider>
  );
}
