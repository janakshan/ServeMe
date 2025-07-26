import { Stack } from "expo-router";
import { BookingThemeProvider, useBookingTheme } from "@/contexts/ScopedThemeProviders";
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function BookingLayoutContent() {
  const { tokens, getGradient } = useBookingTheme();
  const insets = useSafeAreaInsets();
  const backgroundGradient = getGradient('background');

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: tokens.colors.primary,
      elevation: 6,
      shadowColor: tokens.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
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
              title: "Booking Service",
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

export default function BookingLayout() {
  return (
    <BookingThemeProvider>
      <BookingLayoutContent />
    </BookingThemeProvider>
  );
}