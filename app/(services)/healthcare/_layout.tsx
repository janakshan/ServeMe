import { Stack } from "expo-router";
import { HealthcareThemeProvider, useHealthcareTheme } from "@/contexts/ScopedThemeProviders";
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HealthcareLayoutContent() {
  const { tokens, getGradient } = useHealthcareTheme();
  const insets = useSafeAreaInsets();
  const backgroundGradient = getGradient('background');

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: tokens.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
      elevation: 2,
      shadowColor: tokens.colors.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
    },
    headerTintColor: tokens.colors.onPrimary,
    headerTitleStyle: {
      fontWeight: '500' as const,
      fontSize: tokens.typography.title,
    },
    headerBackTitleVisible: false,
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
        <Stack screenOptions={screenOptions}>
          <Stack.Screen
            name="index"
            options={{
              ...screenOptions,
              title: "Healthcare Service",
            }}
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

export default function HealthcareLayout() {
  return (
    <HealthcareThemeProvider>
      <HealthcareLayoutContent />
    </HealthcareThemeProvider>
  );
}