import { Stack } from "expo-router";
import { useServiceLayout } from "@/hooks/useServiceLayout";
import { ServiceTypes } from "@/utils/constants";

export default function EducationLayout() {
  const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.EDUCATION);

  // Show loading state during theme transitions
  if (isTransitioning) {
    console.log(`⏳ Education Layout: Theme is transitioning...`);
    return null; // Or a loading spinner if desired
  }

  return (
    <Stack screenOptions={screenOptions}>
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