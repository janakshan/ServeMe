import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useServiceTheme } from "@/contexts/ServiceThemeContext";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

export default function EducationTabsLayout() {
  const { tokens } = useServiceTheme();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.border,
          borderTopWidth: 1,
          height: 90,
          paddingTop: 10,
          paddingBottom: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: tokens.colors.primary,
        },
        headerTintColor: tokens.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 24,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={handleBackPress}
            style={{
              marginLeft: 16,
              padding: 8,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={tokens.colors.onPrimary}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Courses",
          headerTitle: "ServeMe Edu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teachers"
        options={{
          title: "Teachers",
          headerTitle: "ServeMe Edu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="live-classes"
        options={{
          title: "Live Classes",
          headerTitle: "ServeMe Edu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
          headerTitle: "ServeMe Edu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          headerTitle: "ServeMe Edu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}