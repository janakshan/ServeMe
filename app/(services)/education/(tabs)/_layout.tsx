import { Tabs } from "expo-router";
import { EducationTabBar } from "@/src/education/components";

export default function EducationTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none', // Instant tab switching for education
      }}
      tabBar={(props) => <EducationTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          animation: 'none',
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          animation: 'none',
        }}
      />
      <Tabs.Screen
        name="teachers"
        options={{
          title: "Teachers",
          animation: 'none',
        }}
      />
      <Tabs.Screen
        name="live-classes"
        options={{
          title: "Live Classes",
          animation: 'none',
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
          animation: 'none',
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          animation: 'none',
        }}
      />
    </Tabs>
  );
}