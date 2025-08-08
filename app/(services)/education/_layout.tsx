import { Stack } from "expo-router";
import { EducationThemeProvider, useEducationTheme } from "@/contexts/ScopedThemeProviders";
import { contentScreenOptions } from "@/utils/navigationAnimations";
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EducationLayoutContent() {
  const { tokens, getGradient } = useEducationTheme();
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
      fontWeight: '600' as const,
      fontSize: tokens.typography.title,
    },
    headerBackTitleVisible: false,
    ...contentScreenOptions,
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
        <Stack screenOptions={screenOptions}>
          <Stack.Screen
            name="index"
            options={screenOptions}
          />
          <Stack.Screen
            name="(tabs)"
            options={screenOptions}
          />
          <Stack.Screen
            name="exam/[examId]"
            options={{
              ...screenOptions,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="exam/[examId]/take"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
          <Stack.Screen
            name="[courseId]"
            options={screenOptions}
          />
          <Stack.Screen
            name="[courseId]/learn"
            options={screenOptions}
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

export default function EducationLayout() {
  return (
    <EducationThemeProvider>
      <EducationLayoutContent />
    </EducationThemeProvider>
  );
}