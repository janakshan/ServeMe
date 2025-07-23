import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import { educationApi } from '@/services/api/education';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Remove unused import
// const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  instructorBio?: string;
  instructorRating?: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  price: number;
  rating: number;
  studentsCount: number;
  category: string;
  isEnrolled: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  requirements: string[];
  learningOutcomes: string[];
  lessons: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'text' | 'quiz';
    isCompleted: boolean;
    isLocked: boolean;
  }[];
  reviews: {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

type TabType = 'overview' | 'curriculum' | 'instructor' | 'reviews';

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const { tokens, getGradient } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      // Use the enhanced API to get course details
      const courseDetail = await educationApi.getCourseDetails(courseId as string);
      setCourseData(courseDetail);
    } catch (error) {
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Enroll in Course',
      `Would you like to enroll in "${courseData?.title}" for $${courseData?.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enroll', onPress: () => console.log('Enrolled in course') }
      ]
    );
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBookmarked(!isBookmarked);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Share Course', 'Share functionality will be implemented soon!');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return tokens.colors.success;
      case 'intermediate': return tokens.colors.warning;
      case 'advanced': return tokens.colors.error;
      case 'expert': return tokens.colors.info;
      default: return tokens.colors.onSurfaceVariant;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return 'leaf';
      case 'intermediate': return 'library';
      case 'advanced': return 'school';
      case 'expert': return 'trophy';
      default: return 'book';
    }
  };

  const renderTabContent = () => {
    if (!courseData) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Course Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Course</Text>
              <Text style={styles.sectionText}>{courseData.description}</Text>
            </View>

            {/* Requirements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {courseData.requirements.map((requirement, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={16} color={tokens.colors.success} />
                  <Text style={styles.listText}>{requirement}</Text>
                </View>
              ))}
            </View>

            {/* Learning Outcomes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What You'll Learn</Text>
              {courseData.learningOutcomes.map((outcome, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="bulb" size={16} color={tokens.colors.primary} />
                  <Text style={styles.listText}>{outcome}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'curriculum':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Course Content</Text>
              <Text style={styles.sectionSubtitle}>
                {courseData.totalLessons} lessons • {courseData.completedLessons} completed
              </Text>
              
              {(courseData as any).detailedLessons?.map((lesson: any, index: number) => (
                <View key={lesson.id} style={styles.lessonCard}>
                  <View style={styles.lessonHeader}>
                    <View style={styles.lessonInfo}>
                      <View style={styles.lessonStatus}>
                        {lesson.isCompleted ? (
                          <Ionicons name="checkmark-circle" size={20} color={tokens.colors.success} />
                        ) : lesson.isLocked ? (
                          <Ionicons name="lock-closed" size={20} color={tokens.colors.onSurfaceVariant} />
                        ) : (
                          <Ionicons name="play-circle" size={20} color={tokens.colors.primary} />
                        )}
                      </View>
                      <View style={styles.lessonDetails}>
                        <Text style={[styles.lessonTitle, lesson.isLocked && { color: tokens.colors.onSurfaceVariant }]}>
                          {lesson.title}
                        </Text>
                        <View style={styles.lessonMeta}>
                          <Ionicons 
                            name={lesson.type === 'video' ? 'videocam' : lesson.type === 'quiz' ? 'help-circle' : 'document-text'} 
                            size={14} 
                            color={tokens.colors.onSurfaceVariant} 
                          />
                          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      case 'instructor':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.instructorCard}>
                <View style={styles.instructorAvatar}>
                  <Text style={styles.avatarText}>{courseData.instructorAvatar}</Text>
                </View>
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{courseData.instructor}</Text>
                  <View style={styles.instructorRating}>
                    <Ionicons name="star" size={16} color={tokens.colors.warning} />
                    <Text style={styles.ratingText}>{courseData.instructorRating} instructor rating</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>About the Instructor</Text>
              <Text style={styles.sectionText}>{courseData.instructorBio}</Text>
            </View>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Student Reviews</Text>
              <Text style={styles.sectionSubtitle}>
                {courseData.rating} average rating ({courseData.studentsCount} students)
              </Text>
              
              {courseData.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.studentName}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={14} color={tokens.colors.warning} />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (!courseData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  const headerGradient = getGradient('header');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={tokens.colors.primary} translucent={false} />
      
      {/* Hero Section */}
      <LinearGradient
        colors={headerGradient.colors as any}
        start={{ x: headerGradient.direction.x, y: headerGradient.direction.y }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        {/* Header Controls */}
        <View style={[styles.headerControls, { paddingTop: insets.top + 15 }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={18} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <View style={styles.courseBadges}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{courseData.category}</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(courseData.level) }]}>
              <Ionicons name={getLevelIcon(courseData.level)} size={12} color="#FFFFFF" />
              <Text style={styles.levelText}>{courseData.level}</Text>
            </View>
          </View>
          
          <Text style={styles.courseTitle}>{courseData.title}</Text>
          <Text style={styles.courseInstructor}>by {courseData.instructor}</Text>
          
          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{courseData.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{courseData.studentsCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{courseData.duration}</Text>
            </View>
          </View>

          {courseData.isEnrolled && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Your Progress</Text>
                <Text style={styles.progressValue}>{courseData.progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#FFFFFF', '#E8F5E8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${courseData.progress}%` }]}
                />
              </View>
              <Text style={styles.progressStats}>
                {courseData.completedLessons} of {courseData.totalLessons} lessons completed
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollView}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'instructor', label: 'Instructor' },
              { id: 'reviews', label: 'Reviews' }
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as TabType)}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton
                ]}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <ScrollView 
          style={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {renderTabContent()}
        </ScrollView>
      </View>

      {/* Fixed Action Button */}
      <SafeAreaView style={styles.actionSafeArea}>
        <View style={[styles.actionSection, { paddingBottom: insets.bottom }]}>
          {courseData.isEnrolled ? (
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Continue Learning</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.enrollSection}>
              <View style={styles.priceSection}>
                <Text style={styles.price}>${courseData.price}</Text>
                <Text style={styles.priceLabel}>Full course access</Text>
              </View>
              <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
    </>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
  },
  loadingText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
  },
  errorText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.error,
  },
  heroSection: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    minHeight: 380,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: 0,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: tokens.borderRadius.full,
    padding: tokens.spacing.sm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: tokens.borderRadius.full,
    padding: tokens.spacing.sm,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.md,
  },
  courseBadges: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
  },
  categoryText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onPrimary,
    fontWeight: '600',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.full,
  },
  levelText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onPrimary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  courseTitle: {
    fontSize: tokens.typography.headline2,
    fontWeight: tokens.typography.bold,
    color: '#FFFFFF',
    marginBottom: tokens.spacing.xs,
    lineHeight: tokens.typography.headline2 * 1.2,
  },
  courseInstructor: {
    fontSize: tokens.typography.body,
    color: '#FFFFFF',
    marginBottom: tokens.spacing.lg,
    opacity: 0.9,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.md,
    minWidth: 80,
    justifyContent: 'center',
  },
  statText: {
    fontSize: tokens.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: tokens.spacing.xs,
  },
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: tokens.spacing.md,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  progressLabel: {
    fontSize: tokens.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: tokens.typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: tokens.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressStats: {
    fontSize: tokens.typography.caption,
    color: '#FFFFFF',
    marginTop: tokens.spacing.xs,
    opacity: 0.9,
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    marginTop: -tokens.spacing.lg,
    borderTopLeftRadius: tokens.borderRadius.xl,
    borderTopRightRadius: tokens.borderRadius.xl,
    paddingTop: tokens.spacing.sm,
  },
  tabNavigation: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border + '20',
    paddingBottom: tokens.spacing.sm,
  },
  tabScrollView: {
    paddingHorizontal: tokens.spacing.lg,
  },
  tabButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    marginRight: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.md,
  },
  activeTabButton: {
    backgroundColor: tokens.colors.primaryLight + '20',
  },
  tabText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  activeTabText: {
    color: tokens.colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: tokens.spacing.xxl * 2,
  },
  tabContent: {
    padding: tokens.spacing.lg,
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  sectionSubtitle: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.md,
  },
  sectionText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: tokens.typography.body * 1.5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.sm,
    paddingRight: tokens.spacing.md,
  },
  listText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    marginLeft: tokens.spacing.sm,
    flex: 1,
    lineHeight: tokens.typography.body * 1.4,
  },
  lessonCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonStatus: {
    marginRight: tokens.spacing.sm,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  lessonDuration: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  avatarText: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onPrimary,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  instructorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  ratingText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  reviewCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  reviewerName: {
    fontSize: tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.onSurface,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: tokens.typography.body * 1.4,
    marginBottom: tokens.spacing.sm,
  },
  reviewDate: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  actionSafeArea: {
    backgroundColor: tokens.colors.surface,
  },
  actionSection: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border + '20',
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  primaryButton: {
    backgroundColor: tokens.colors.primary,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    shadowColor: tokens.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'center',
    minWidth: 200,
  },
  primaryButtonText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
    letterSpacing: 0.25,
  },
  enrollSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  priceSection: {
    flex: 1,
  },
  price: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  priceLabel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  enrollButton: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.borderRadius.md,
    shadowColor: tokens.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
    maxWidth: 140,
    alignItems: 'center',
  },
  enrollButtonText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
    letterSpacing: 0.25,
  },
});