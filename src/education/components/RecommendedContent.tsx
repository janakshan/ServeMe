import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import * as Haptics from 'expo-haptics';

interface RecommendedCourse {
  id: string;
  title: string;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  rating: number;
  studentsCount: number;
  duration: string;
  category: string;
  isPopular?: boolean;
  isTrending?: boolean;
}

const RECOMMENDED_COURSES: RecommendedCourse[] = [
  {
    id: '1',
    title: 'Advanced Calculus',
    instructor: 'Prof. Sarah Wilson',
    level: 'advanced',
    rating: 4.9,
    studentsCount: 1200,
    duration: '8 weeks',
    category: 'Mathematics',
    isPopular: true,
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    instructor: 'Dr. Michael Chen',
    level: 'intermediate',
    rating: 4.7,
    studentsCount: 890,
    duration: '6 weeks',
    category: 'Science',
    isTrending: true,
  },
  {
    id: '3',
    title: 'English Literature',
    instructor: 'Emma Thompson',
    level: 'intermediate',
    rating: 4.8,
    studentsCount: 650,
    duration: '10 weeks',
    category: 'Language',
  },
];

export function RecommendedContent() {
  const { tokens } = useServiceTheme();
  const styles = useThemedStyles(createStyles);

  const handleCoursePress = (course: RecommendedCourse) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Course Details',
      `You selected: ${course.title}\nInstructor: ${course.instructor}`,
      [{ text: 'OK' }]
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return tokens.colors.success;
      case 'intermediate':
        return tokens.colors.warning;
      case 'advanced':
        return tokens.colors.error;
      case 'expert':
        return tokens.colors.info;
      default:
        return tokens.colors.onSurfaceVariant;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'leaf-outline';
      case 'intermediate':
        return 'flash-outline';
      case 'advanced':
        return 'flame-outline';
      case 'expert':
        return 'diamond-outline';
      default:
        return 'help-outline';
    }
  };

  // Darker card gradients for better contrast
  const getCardGradient = () => {
    const primaryColor = tokens.colors.primary;
    
    if (primaryColor === "#6A1B9A") {
      // Education purple theme - darker for better contrast
      return ['#F3E5F5', '#E8EAF6'];
    } else if (primaryColor === "#0D47A1") {
      // Blue theme - darker blue tones
      return ['#E3F2FD', '#E8F4F8'];
    } else if (primaryColor === "#2E7D32") {
      // Green theme - darker green tones
      return ['#E8F5E8', '#F1F8E9'];
    } else if (primaryColor === "#E91E63") {
      // Pink theme - darker pink tones
      return ['#FCE4EC', '#F8BBD9'];
    } else {
      // Default - darker neutral
      return ['#F5F5F5', '#EEEEEE'];
    }
  };

  return (
    <View style={styles.container}>
      {/* Recommended Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesScrollContainer}
        >
          {RECOMMENDED_COURSES.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => handleCoursePress(course)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getCardGradient()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.courseCardGradient}
              >
                {/* Course badges */}
                <View style={styles.courseCardHeader}>
                  <View style={styles.badgeContainer}>
                    {course.isPopular && (
                      <View style={[styles.badge, styles.popularBadge]}>
                        <Text style={styles.badgeText}>Popular</Text>
                      </View>
                    )}
                    {course.isTrending && (
                      <View style={[styles.badge, styles.trendingBadge]}>
                        <Text style={styles.badgeText}>Trending</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
                    <Ionicons
                      name={getLevelIcon(course.level)}
                      size={12}
                      color={tokens.colors.onPrimary}
                    />
                  </View>
                </View>

                {/* Course content */}
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                
                <Text style={styles.instructorName} numberOfLines={1}>
                  {course.instructor}
                </Text>
                
                <View style={styles.courseStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={14} color={tokens.colors.warning} />
                    <Text style={styles.statText}>{course.rating}</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="people" size={14} color={tokens.colors.onSurfaceVariant} />
                    <Text style={styles.statText}>{course.studentsCount}</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={14} color={tokens.colors.onSurfaceVariant} />
                    <Text style={styles.statText}>{course.duration}</Text>
                  </View>
                </View>
                
                <Text style={styles.categoryText}>{course.category}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.xl,
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  coursesScrollContainer: {
    paddingRight: tokens.spacing.md,
  },
  courseCard: {
    width: 200,
    marginRight: tokens.spacing.md,
  },
  courseCardGradient: {
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.lg,
    height: 220,
    justifyContent: 'space-between',
    ...tokens.shadows.md,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  badge: {
    paddingHorizontal: tokens.spacing.xs,
    paddingVertical: 2,
    borderRadius: tokens.borderRadius.sm,
  },
  popularBadge: {
    backgroundColor: tokens.colors.error + '20',
  },
  trendingBadge: {
    backgroundColor: tokens.colors.success + '20',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
    lineHeight: 22,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '500',
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.md,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 'auto',
  },
});