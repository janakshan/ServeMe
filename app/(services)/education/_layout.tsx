import { Stack } from "expo-router";
import { useServiceLayout } from "@/hooks/useServiceLayout";
import { useServiceTheme } from "@/contexts/ServiceThemeContext";
import { ServiceTypes } from "@/utils/constants";
import { useEffect } from "react";

export default function EducationLayout() {
  const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.EDUCATION);
  const { setActiveService, activeService } = useServiceTheme();

  // Fallback: Ensure education theme is set directly
  useEffect(() => {
    console.log(`🎓 Education Layout: Current active service: ${activeService}`);
    if (activeService !== ServiceTypes.EDUCATION) {
      console.log(`🎓 Education Layout: Setting education theme`);
      setActiveService(ServiceTypes.EDUCATION);
    }
  }, [setActiveService, activeService]);

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