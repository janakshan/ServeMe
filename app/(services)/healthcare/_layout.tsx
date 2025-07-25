import { Stack } from "expo-router";
import { useServiceLayout } from "@/hooks/useServiceLayout";
import { ServiceTypes } from "@/utils/constants";
import { ThemeTransitionGuard } from "@/components/ui/ThemeTransitionGuard";

export default function HealthcareServiceLayout() {
  const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.HEALTHCARE);

  return (
    <ThemeTransitionGuard 
      serviceType={ServiceTypes.HEALTHCARE}
      showLoader={isTransitioning}
      minTransitionTime={100}
    >
      <Stack screenOptions={screenOptions}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Healthcare Service'
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeTransitionGuard>
  );
}