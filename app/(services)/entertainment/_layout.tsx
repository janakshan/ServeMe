import { Stack } from "expo-router";
import { useServiceLayout } from "@/hooks/useServiceLayout";
import { ServiceTypes } from "@/utils/constants";
import { ThemeTransitionGuard } from "@/components/ui/ThemeTransitionGuard";

export default function EntertainmentServiceLayout() {
  const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.ENTERTAINMENT);

  return (
    <ThemeTransitionGuard 
      serviceType={ServiceTypes.ENTERTAINMENT}
      showLoader={isTransitioning}
      minTransitionTime={100}
    >
      <Stack screenOptions={screenOptions}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Entertainment Service'
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