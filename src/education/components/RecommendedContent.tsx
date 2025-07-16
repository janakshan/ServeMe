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

const TRENDING_TOPICS = [
  { id: '1', name: 'Machine Learning', count: '+45%' },
  { id: '2', name: 'Data Science', count: '+38%' },
  { id: '3', name: 'Web Development', count: '+29%' },
  { id: '4', name: 'Digital Marketing', count: '+22%' },
];

export function RecommendedContent() {
  const { tokens, getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  
  const cardGradient = getGradient('card');

  const handleCoursePress = (course: RecommendedCourse) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Course Details',
      `You selected: ${course.title}\nInstructor: ${course.instructor}`,
      [{ text: 'OK' }]
    );
  };

  const handleTopicPress = (topic: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Trending Topic',
      `Explore courses in ${topic.name}`,
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
          {RECOMMENDED_COURSES.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => handleCoursePress(course)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={cardGradient.colors}
                start={{ x: cardGradient.direction.x, y: cardGradient.direction.y }}
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
    padding: tokens.spacing.md,
    height: 180,
    ...tokens.shadows.sm,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.sm,
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
    backgroundColor: tokens.colors.warning + '20',
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
    fontSize: 16,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
    lineHeight: 20,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: '500',
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.sm,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: tokens.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topicsContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.md,
    ...tokens.shadows.sm,
  },
  topicCard: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.onSurface,
    marginBottom: 2,
  },
  topicCount: {
    fontSize: 12,
    fontWeight: '500',
    color: tokens.colors.success,
  },
});