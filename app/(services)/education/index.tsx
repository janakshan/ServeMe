import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import { 
  EducationHomeHeader,
  QuickAccessGrid,
  RecommendedContent
} from '@/src/education/components';

// Mock user data
const MOCK_USER_DATA = {
  name: 'Alex',
  currentStreak: 12,
  completedCourses: 8,
  currentLevel: 'Intermediate',
  totalXP: 2450,
  weeklyGoal: 5,
  completedThisWeek: 3,
  lastCourse: {
    title: 'A/L Combined Mathematics',
    progress: 78,
    nextLesson: 'Calculus Integration',
  },
  upcomingClass: {
    title: 'Physics - Mechanics',
    time: '2:00 PM',
    instructor: 'Dr. Krishnan',
  },
  recentAchievements: [
    { icon: '🏆', title: 'Math Master', description: 'Completed 5 math courses' },
    { icon: '🔥', title: 'Study Streak', description: '10 days in a row' },
    { icon: '⭐', title: 'Top Performer', description: 'Top 10% this week' },
  ],
};

export default function EducationHomeScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <EducationHomeHeader userData={MOCK_USER_DATA} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <QuickAccessGrid />
        
        <RecommendedContent />
        
        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const createStyles = (tokens: any) => {
  const getSmoothBackgroundColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#6A1B9A") {
      return {
        containerBackground: "#FDFAFF", // Very light purple tint
        contentBackground: "#F9F2FF", // Light purple tint for content area
        cardBackground: "#FFFFFF", // Pure white for cards
      };
    } else if (primaryColor === "#0D47A1") {
      return {
        containerBackground: "#F8FAFE", // Very light blue tint
        contentBackground: "#F0F6FF", // Light blue tint for content area
        cardBackground: "#FFFFFF", // Pure white for cards
      };
    } else if (primaryColor === "#2E7D32") {
      return {
        containerBackground: "#F9FDF9", // Very light green tint
        contentBackground: "#F2F8F2", // Light green tint for content area
        cardBackground: "#FFFFFF", // Pure white for cards
      };
    } else if (primaryColor === "#E91E63") {
      return {
        containerBackground: "#FFFAFC", // Very light pink tint
        contentBackground: "#FFF2F7", // Light pink tint for content area
        cardBackground: "#FFFFFF", // Pure white for cards
      };
    } else {
      return {
        containerBackground: "#F8FAFE", // Default light blue tint
        contentBackground: "#F0F6FF", // Default content background
        cardBackground: "#FFFFFF", // Pure white for cards
      };
    }
  };

  const backgroundColors = getSmoothBackgroundColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColors.containerBackground,
    },
    scrollView: {
      flex: 1,
      backgroundColor: backgroundColors.contentBackground,
      marginTop: -tokens.spacing.lg, // Overlap with header for smooth transition
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      backgroundColor: 'transparent',
    },
    bottomSpacing: {
      height: 100, // Space for tab bar
    },
  });
};