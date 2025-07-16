import { Stack } from "expo-router";
import { useServiceTheme } from "@/contexts/ServiceThemeContext";
import { useEffect } from "react";
import { ServiceTypes } from "@/utils/constants";

export default function EducationLayout() {
  const { setActiveService, tokens } = useServiceTheme();

  useEffect(() => {
    setActiveService(ServiceTypes.EDUCATION);
    return () => {
      setActiveService(null);
    };
  }, [setActiveService]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: tokens.colors.primary,
        },
        headerTintColor: tokens.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}