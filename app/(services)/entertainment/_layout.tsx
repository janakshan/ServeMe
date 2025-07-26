import { Stack } from "expo-router";
import { EntertainmentThemeProvider, useEntertainmentTheme } from "@/contexts/ScopedThemeProviders";
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EntertainmentLayoutContent() {
  const { tokens, getGradient } = useEntertainmentTheme();
  const insets = useSafeAreaInsets();
  const backgroundGradient = getGradient('background');

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: tokens.colors.primary,
      elevation: 8,
      shadowColor: tokens.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    headerTintColor: tokens.colors.onPrimary,
    headerTitleStyle: {
      fontWeight: '700' as const,
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
              title: "Entertainment Service",
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

export default function EntertainmentLayout() {
  return (
    <EntertainmentThemeProvider>
      <EntertainmentLayoutContent />
    </EntertainmentThemeProvider>
  );
}