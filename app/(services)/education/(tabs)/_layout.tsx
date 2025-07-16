import { Tabs } from "expo-router";
import { EducationTabBar } from "@/src/education/components";

export default function EducationTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <EducationTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Courses",
        }}
      />
      <Tabs.Screen
        name="teachers"
        options={{
          title: "Teachers",
        }}
      />
      <Tabs.Screen
        name="live-classes"
        options={{
          title: "Live Classes",
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
        }}
      />
    </Tabs>
  );
}