import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Animated,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useServiceTheme, useThemedStyles } from '@/contexts/ServiceThemeContext';
import { educationApi } from '@/services/api/education';
import { EducationScreenHeader } from '@/src/education/components/headers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';


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
  lessons: Lesson[];
  detailedLessons: DetailedLesson[];
  reviews: Review[];
}

interface DetailedLesson extends Lesson {
  isLocked: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  isCompleted: boolean;
  isLocked?: boolean;
}

interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

type TabType = 'overview' | 'curriculum' | 'instructor' | 'reviews';

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  
  // Sample video URL for course preview
  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  // Setup video player with expo-video
  const player = useVideoPlayer(sampleVideoUrl, (player) => {
    player.loop = false;
    player.muted = false;
  });
  
  // Handle video player state changes
  useEffect(() => {
    if (player) {
      const subscription = player.addListener('statusChange', (status) => {
        // Handle different video states
        if (status.status === 'readyToPlay' || status.status === 'idle') {
          setIsVideoLoading(false);
        } else if (status.status === 'loading') {
          setIsVideoLoading(true);
        }
      });
      return () => subscription.remove();
    }
  }, [player]);
  
  
  // Handle video modal close
  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setIsVideoLoading(true);
    if (player) {
      player.pause();
      player.currentTime = 0; // Reset to beginning
    }
  }, [player]);
  
  // Animation values for enhanced tabs
  const tabIndicatorAnimation = useRef(new Animated.Value(0)).current;
  const tabContentFadeAnimation = useRef(new Animated.Value(1)).current;
  
  const { tokens } = useServiceTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  
  // Tab configuration with text only
  const tabs = [
    { id: 'overview', label: 'Overview', badge: null },
    { id: 'curriculum', label: 'Curriculum', badge: null },
    { id: 'instructor', label: 'Instructor', badge: null },
    { id: 'reviews', label: 'Reviews', badge: null }
  ];

  const loadCourseData = useCallback(async () => {
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
  }, [courseId]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);
  
  // Initialize tab indicator position on component mount
  useEffect(() => {
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentTabIndex !== -1) {
      const screenWidth = Dimensions.get('window').width;
      const containerPadding = tokens.spacing.lg * 2;
      const tabContainerWidth = screenWidth - containerPadding;
      const tabPadding = 12;
      const availableWidth = tabContainerWidth - tabPadding;
      const tabWidth = availableWidth / 4;
      const indicatorPosition = 6 + (currentTabIndex * tabWidth);
      
      tabIndicatorAnimation.setValue(indicatorPosition);
    }
  }, [activeTab, tabs, tokens.spacing.lg, tabIndicatorAnimation]);

  const handleEnroll = () => {
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
    setIsBookmarked(!isBookmarked);
  };


  const handleShare = () => {
    Alert.alert('Share Course', 'Share functionality will be implemented soon!');
  };

  const handlePreview = useCallback(() => {
    setIsVideoLoading(true);
    setShowVideoModal(true);
    // Auto-play when modal opens
    if (player) {
      player.play();
    }
    
    // Fallback to hide loading indicator after 3 seconds
    setTimeout(() => {
      setIsVideoLoading(false);
    }, 3000);
  }, [player]);


  // Enhanced tab handler with animations
  const handleTabPress = (tabIndex: number) => {
    const newTabId = tabs[tabIndex].id as TabType;
    
    if (newTabId === activeTab) return; // Don't animate if same tab
    
    // Calculate tab indicator position based on container width and padding
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = tokens.spacing.lg * 2; // Left + right margins
    const tabContainerWidth = screenWidth - containerPadding;
    const tabPadding = 12; // 6px padding on each side of container
    const availableWidth = tabContainerWidth - tabPadding;
    const tabWidth = availableWidth / 4; // Equal width for 4 tabs
    const indicatorPosition = 6 + (tabIndex * tabWidth); // 6px is the container padding
    
    Animated.timing(tabIndicatorAnimation, {
      toValue: indicatorPosition,
      duration: 250,
      useNativeDriver: true,
    }).start();
    
    // Fade out current content, change tab, then fade in
    Animated.timing(tabContentFadeAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(newTabId);
      Animated.timing(tabContentFadeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const getLevelColor = useCallback((level: string) => {
    switch (level) {
      case 'beginner': return tokens.colors.success;
      case 'intermediate': return tokens.colors.warning;
      case 'advanced': return tokens.colors.error;
      case 'expert': return tokens.colors.info;
      default: return tokens.colors.onSurfaceVariant;
    }
  }, [tokens.colors]);

  const getLevelIcon = useCallback((level: string) => {
    switch (level) {
      case 'beginner': return 'leaf';
      case 'intermediate': return 'library';
      case 'advanced': return 'school';
      case 'expert': return 'trophy';
      default: return 'book';
    }
  }, []);

  const renderTabContent = () => {
    if (!courseData) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Course Description Card */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="information-circle" size={24} color={tokens.colors.primary} />
                </View>
                <Text style={styles.cardTitle}>About This Course</Text>
              </View>
              <Text style={styles.cardDescription}>{courseData.description}</Text>
            </View>

            {/* Requirements Card */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="checkmark-circle" size={24} color={tokens.colors.success} />
                </View>
                <Text style={styles.cardTitle}>Requirements</Text>
              </View>
              <View style={styles.requirementsList}>
                {courseData.requirements.map((requirement, index) => (
                  <View key={index} style={styles.modernListItem}>
                    <View style={styles.listItemIcon}>
                      <Ionicons name="checkmark" size={16} color={tokens.colors.success} />
                    </View>
                    <Text style={styles.modernListText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Learning Outcomes Card */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="bulb" size={24} color={tokens.colors.warning} />
                </View>
                <Text style={styles.cardTitle}>What You'll Learn</Text>
              </View>
              <View style={styles.outcomesList}>
                {courseData.learningOutcomes.map((outcome, index) => (
                  <View key={index} style={styles.modernListItem}>
                    <View style={[styles.listItemIcon, { backgroundColor: tokens.colors.primaryLight + '20' }]}>
                      <Ionicons name="bulb-outline" size={16} color={tokens.colors.primary} />
                    </View>
                    <Text style={styles.modernListText}>{outcome}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );

      case 'curriculum':
        return (
          <View style={styles.tabContent}>
            {/* Course Progress Overview */}
            <View style={styles.progressOverviewCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Course Progress</Text>
                <Text style={styles.progressSubtitle}>
                  {courseData.completedLessons} of {courseData.totalLessons} lessons completed
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressBarFill, { width: `${(courseData.completedLessons / courseData.totalLessons) * 100}%` }]} />
                </View>
                <Text style={styles.progressPercentageText}>
                  {Math.round((courseData.completedLessons / courseData.totalLessons) * 100)}%
                </Text>
              </View>
            </View>

            {/* Enhanced Lessons List */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="list" size={24} color={tokens.colors.primary} />
                </View>
                <Text style={styles.cardTitle}>Course Content</Text>
              </View>
              
              {courseData.detailedLessons?.map((lesson, index: number) => {
                const isLocked = lesson.isLocked ?? (!lesson.isCompleted && index > 0 && !courseData.detailedLessons[index - 1]?.isCompleted);
                return (
                <TouchableOpacity 
                  key={lesson.id} 
                  style={[
                    styles.enhancedLessonCard,
                    lesson.isCompleted && styles.completedLessonCard,
                    isLocked && styles.lockedLessonCard
                  ]}
                  disabled={isLocked}
                  onPress={() => {
                    if (!isLocked) {
                      console.log('Navigate to lesson:', lesson.id);
                    }
                  }}
                >
                  <View style={styles.lessonCardContent}>
                    <View style={[
                      styles.lessonStatusIcon,
                      lesson.isCompleted && styles.completedStatusIcon,
                      isLocked && styles.lockedStatusIcon
                    ]}>
                      {lesson.isCompleted ? (
                        <Ionicons name="checkmark-circle" size={24} color={tokens.colors.success} />
                      ) : isLocked ? (
                        <Ionicons name="lock-closed" size={24} color={tokens.colors.onSurfaceVariant} />
                      ) : (
                        <Ionicons name="play-circle" size={24} color={tokens.colors.primary} />
                      )}
                    </View>
                    
                    <View style={styles.lessonInfo}>
                      <Text style={[
                        styles.enhancedLessonTitle,
                        isLocked && { color: tokens.colors.onSurfaceVariant }
                      ]}>
                        {index + 1}. {lesson.title}
                      </Text>
                      <View style={styles.lessonMetaRow}>
                        <View style={styles.lessonTypeContainer}>
                          <Ionicons 
                            name={lesson.type === 'video' ? 'videocam' : lesson.type === 'quiz' ? 'help-circle' : 'document-text'} 
                            size={16} 
                            color={isLocked ? tokens.colors.onSurfaceVariant : tokens.colors.primary} 
                          />
                          <Text style={[
                            styles.lessonType,
                            isLocked && { color: tokens.colors.onSurfaceVariant }
                          ]}>
                            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                          </Text>
                        </View>
                        <View style={styles.lessonDurationContainer}>
                          <Ionicons name="time-outline" size={16} color={tokens.colors.onSurfaceVariant} />
                          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {!isLocked && (
                      <Ionicons name="chevron-forward" size={20} color={tokens.colors.onSurfaceVariant} />
                    )}
                  </View>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 'instructor':
        return (
          <View style={styles.tabContent}>
            {/* Enhanced Instructor Profile Card */}
            <View style={styles.instructorProfileCard}>
              <View style={styles.instructorHeader}>
                <View style={styles.instructorAvatarContainer}>
                  <View style={styles.enhancedInstructorAvatar}>
                    <Text style={styles.avatarText}>{courseData.instructorAvatar}</Text>
                  </View>
                  <View style={styles.instructorBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={tokens.colors.success} />
                  </View>
                </View>
                <View style={styles.instructorDetails}>
                  <Text style={styles.enhancedInstructorName}>{courseData.instructor}</Text>
                  <Text style={styles.instructorTitle}>Course Instructor</Text>
                  <View style={styles.instructorStatsRow}>
                    <View style={styles.instructorStat}>
                      <Ionicons name="star" size={18} color={tokens.colors.warning} />
                      <Text style={styles.instructorStatText}>{courseData.instructorRating}</Text>
                    </View>
                    <View style={styles.instructorStat}>
                      <Ionicons name="people" size={18} color={tokens.colors.primary} />
                      <Text style={styles.instructorStatText}>{courseData.studentsCount}+ students</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* About Instructor Card */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="person" size={24} color={tokens.colors.primary} />
                </View>
                <Text style={styles.cardTitle}>About the Instructor</Text>
              </View>
              <Text style={styles.cardDescription}>{courseData.instructorBio}</Text>
            </View>

            {/* Instructor Achievements */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="trophy" size={24} color={tokens.colors.warning} />
                </View>
                <Text style={styles.cardTitle}>Achievements</Text>
              </View>
              <View style={styles.achievementsList}>
                <View style={styles.achievementItem}>
                  <Ionicons name="medal" size={20} color={tokens.colors.warning} />
                  <Text style={styles.achievementText}>Top-rated instructor</Text>
                </View>
                <View style={styles.achievementItem}>
                  <Ionicons name="school" size={20} color={tokens.colors.primary} />
                  <Text style={styles.achievementText}>5+ years of teaching experience</Text>
                </View>
                <View style={styles.achievementItem}>
                  <Ionicons name="heart" size={20} color={tokens.colors.error} />
                  <Text style={styles.achievementText}>Loved by {courseData.studentsCount}+ students</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {/* Reviews Overview Card */}
            <View style={styles.reviewOverviewCard}>
              <View style={styles.reviewOverviewHeader}>
                <View style={styles.ratingDisplayContainer}>
                  <Text style={styles.overallRating}>{courseData.rating}</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star}
                        name={star <= Math.floor(courseData.rating) ? "star" : "star-outline"} 
                        size={20} 
                        color={tokens.colors.warning} 
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewCount}>Based on {courseData.studentsCount} reviews</Text>
                </View>
              </View>
            </View>

            {/* Individual Reviews */}
            <View style={styles.modernCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="chatbubbles" size={24} color={tokens.colors.primary} />
                </View>
                <Text style={styles.cardTitle}>Student Reviews</Text>
              </View>
              
              {courseData.reviews.map((review) => (
                <View key={review.id} style={styles.enhancedReviewCard}>
                  <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerInitial}>{review.studentName.charAt(0)}</Text>
                    </View>
                    <View style={styles.reviewerDetails}>
                      <Text style={styles.reviewerName}>{review.studentName}</Text>
                      <View style={styles.reviewMeta}>
                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons 
                              key={star}
                              name={star <= review.rating ? "star" : "star-outline"} 
                              size={14} 
                              color={tokens.colors.warning} 
                            />
                          ))}
                        </View>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.enhancedReviewComment}>{review.comment}</Text>
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


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Standardized Header */}
        <EducationScreenHeader
          title={courseData.title}
          subtitle={`by ${courseData.instructor}`}
          rightActions={[
            {
              icon: isBookmarked ? "bookmark" : "bookmark-outline",
              onPress: handleBookmark
            },
            {
              icon: "share-outline",
              onPress: handleShare
            }
          ]}
        />

      {/* Enhanced Content Section - Now Fully Scrollable */}
      <ScrollView 
        style={styles.contentSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollableContentContainer}
      >
        {/* Course Overview Card */}
        <View style={styles.courseOverviewCard}>
          {/* Enhanced Course Preview */}
          <View style={styles.coursePreviewCard}>
            <View style={styles.previewImageContainer}>
              {/* Video Thumbnail with Sample Image */}
              <View style={styles.videoThumbnail}>
                <View style={styles.thumbnailImageContainer}>
                  {/* Placeholder for actual course thumbnail image */}
                  <TouchableOpacity style={styles.imageOverlay} onPress={handlePreview}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=225&fit=crop&crop=center' }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Video Duration Badge */}
              {/* <View style={styles.durationBadgeContainer}>
                <View style={styles.videoDurationBadge}>
                  <Ionicons name="play" size={12} color="#FFFFFF" />
                  <Text style={styles.videoDurationText}>2:30</Text>
                </View>
              </View> */}
              
              {/* Centered Play Button Overlay */}
              <TouchableOpacity onPress={handlePreview} style={styles.centeredPreviewOverlay}>
                <View style={styles.centeredPlayButton}>
                  <Ionicons name="play" size={36} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              
           
            </View>
          </View>
          
          {/* Course Meta Info */}
          <View style={styles.courseMetaInfo}>
            <View style={styles.courseBadges}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{courseData.category}</Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(courseData.level) }]}>
                <Ionicons name={getLevelIcon(courseData.level)} size={12} color="#FFFFFF" />
                <Text style={styles.levelText}>{courseData.level}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={12} color={tokens.colors.onSurfaceVariant} />
                <Text style={styles.durationText}>{courseData.duration}</Text>
              </View>
            </View>
          </View>

          {/* Course Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <View style={styles.ratingStarsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star}
                        name={star <= Math.floor(courseData.rating) ? "star" : "star-outline"} 
                        size={16} 
                        color={tokens.colors.warning} 
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.statValue}>{courseData.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
                <View style={styles.statProgress}>
                  <View style={[styles.statProgressBar, { width: `${(courseData.rating / 5) * 100}%` }]} />
                </View>
              </View>
              
              {courseData.isEnrolled ? (
                <>
                  <View style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                      <View style={styles.enhancedProgressRing}>
                        <View style={styles.progressRingBackground}>
                          <View style={[styles.progressRingFill, { 
                            transform: [{ rotate: `${(courseData.progress / 100) * 360}deg` }] 
                          }]} />
                        </View>
                        <View style={styles.progressRingCenter}>
                          <Ionicons name="trending-up" size={16} color={tokens.colors.success} />
                        </View>
                      </View>
                    </View>
                    <Text style={styles.statValue}>{courseData.progress}%</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                    <View style={styles.statProgress}>
                      <View style={[styles.statProgressBar, { width: `${courseData.progress}%`, backgroundColor: tokens.colors.success }]} />
                    </View>
                  </View>
                  <View style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                      <View style={styles.lessonsIconContainer}>
                        <Ionicons name="library" size={20} color={tokens.colors.success} />
                        <View style={styles.lessonsCountBadge}>
                          <Text style={styles.lessonsCountText}>{courseData.completedLessons}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.lessonsStatContainer}>
                      <Text style={styles.statValue}>{courseData.completedLessons}</Text>
                      <Text style={styles.lessonsSlash}>/</Text>
                      <Text style={styles.lessonsTotalValue}>{courseData.totalLessons}</Text>
                    </View>
                    <Text style={styles.statLabel}>Lessons</Text>
                    <View style={styles.statProgress}>
                      <View style={[styles.statProgressBar, { width: `${(courseData.completedLessons / courseData.totalLessons) * 100}%`, backgroundColor: tokens.colors.success }]} />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                      <Ionicons name="people" size={24} color={tokens.colors.info} />
                    </View>
                    <Text style={styles.statValue}>{courseData.studentsCount}</Text>
                    <Text style={styles.statLabel}>Students</Text>
                    <View style={styles.statProgress}>
                      <View style={[styles.statProgressBar, { width: '85%', backgroundColor: tokens.colors.info }]} />
                    </View>
                  </View>
                  <View style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                      <Ionicons name="cash" size={24} color={tokens.colors.success} />
                    </View>
                    <Text style={styles.statValue}>${courseData.price}</Text>
                    <Text style={styles.statLabel}>Price</Text>
                    <Text style={styles.statSubLabel}>One-time payment</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Enhanced Tab Navigation */}
        <View style={styles.enhancedTabNavigation}>
          <View style={styles.enhancedTabContainer}>
            <Animated.View 
              style={[
                styles.enhancedTabIndicator,
                {
                  transform: [{ translateX: tabIndicatorAnimation }]
                }
              ]}
            />
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(index)}
                style={[
                  styles.enhancedTabButton,
                  activeTab === tab.id && styles.activeEnhancedTabButton
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.tabContentWrapper}>
                  <Text
                    style={[
                      styles.enhancedTabText,
                      activeTab === tab.id && styles.activeEnhancedTabText
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                  >
                    {tab.label}
                  </Text>
                  {tab.badge && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Animated Tab Content */}
        <Animated.View 
          style={[
            styles.tabContentContainer,
            {
              opacity: tabContentFadeAnimation
            }
          ]}
        >
          {renderTabContent()}
        </Animated.View>

        {/* Bottom spacing for action button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

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

      {/* Video Preview Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeVideoModal}
      >
        <SafeAreaView style={styles.videoModalContainer}>
          <View style={styles.videoModalHeader}>
            <TouchableOpacity onPress={closeVideoModal} style={styles.videoModalCloseButton}>
              <Ionicons name="close" size={24} color={tokens.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.videoModalTitle}>Course Preview</Text>
            <View style={styles.videoModalSpacer} />
          </View>
          
          <View style={styles.videoPlayerContainer}>
            {/* Enhanced Video Player with expo-video */}
            <View style={styles.videoPlayer}>
              <VideoView 
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls
                contentFit="contain"
              />
              
              {isVideoLoading && (
                <View style={styles.videoLoadingContainer}>
                  <Animated.View style={[styles.loadingSpinner, {
                    transform: [{
                      rotate: '0deg' // You can add rotation animation here if needed
                    }]
                  }]}>
                    <Ionicons name="play-circle" size={48} color={tokens.colors.primary} />
                  </Animated.View>
                  <Text style={styles.videoLoadingText}>Loading video...</Text>
                </View>
              )}
            </View>
            
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>Course Preview Video</Text>
              <Text style={styles.videoDescription}>
                Get a preview of what you'll learn in this comprehensive Tamil Language & Literature course.
              </Text>
              <View style={styles.videoStats}>
                <View style={styles.videoStatItem}>
                  <Ionicons name="videocam" size={16} color={tokens.colors.onSurfaceVariant} />
                  <Text style={styles.videoStatText}>HD Quality</Text>
                </View>
                <View style={styles.videoStatItem}>
                  <Ionicons name="play-circle" size={16} color={tokens.colors.onSurfaceVariant} />
                  <Text style={styles.videoStatText}>Auto-play enabled</Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  courseOverviewCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 0,
    marginBottom: tokens.spacing.lg,
    padding: tokens.spacing.lg,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border + '20',
  },
  coursePreviewCard: {
    marginBottom: tokens.spacing.xs,
    alignItems: 'center',
  },
  previewImageContainer: {
    height: 180,
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: tokens.colors.surfaceVariant,
    marginBottom: tokens.spacing.md,
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: 16/9,
  },
  videoThumbnail: {
    flex: 1,
    backgroundColor: tokens.colors.primary + '08',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceVariant,
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.borderRadius.lg,
  },
  thumbnailPlaceholderText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    marginTop: tokens.spacing.xs,
    textAlign: 'center',
  },
  durationBadgeContainer: {
    position: 'absolute',
    top: tokens.spacing.sm,
    right: tokens.spacing.sm,
  },
  videoDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.borderRadius.sm,
    gap: 4,
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontSize: tokens.typography.caption,
    fontWeight: '600',
  },
  centeredPreviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  centeredPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4, // Slight offset for play icon centering
  },
  playButtonRipple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: tokens.colors.primary + '20',
    opacity: 0.6,
  },  
  previewLabel: {
    color: '#FFFFFF',
    fontSize: tokens.typography.body,
    fontWeight: '600',
    marginTop: tokens.spacing.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  previewGradientOverlay: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // height: 60,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  courseMetaInfo: {
    marginBottom: tokens.spacing.sm,
    alignItems: 'center',
  },
  courseBadges: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  durationBadge: {
    backgroundColor: tokens.colors.surfaceVariant,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.sm,
  },
  durationText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: tokens.colors.primaryLight,
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
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  instructorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorRatingText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  statsContainer: {
    marginTop: tokens.spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 95,
    maxWidth: 115,
    minHeight: 120,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: tokens.colors.border + '20',
  },
  statIconContainer: {
    marginBottom: tokens.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enhancedProgressRing: {
    width: 36,
    height: 36,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.success + '20',
    position: 'relative',
    overflow: 'hidden',
  },
  progressRingFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: tokens.colors.success,
    transformOrigin: 'right center',
  },
  progressRingCenter: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonsIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonsCountBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: tokens.colors.success,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  lessonsCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.onPrimary,
  },
  lessonsStatContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },
  lessonsSlash: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginHorizontal: 2,
  },
  lessonsTotalValue: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  statLabel: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: tokens.typography.subtitle,
    color: tokens.colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  statProgress: {
    width: '100%',
    height: 3,
    backgroundColor: tokens.colors.border,
    borderRadius: 2,
    marginTop: 4,
  },
  statProgressBar: {
    height: '100%',
    backgroundColor: tokens.colors.warning,
    borderRadius: 2,
  },
  statSubLabel: {
    fontSize: tokens.typography.caption - 2,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  progressRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: tokens.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  progressPercentage: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.success,
  },
  contentSection: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollableContentContainer: {
    paddingTop: 0, // Remove top padding
    paddingBottom: tokens.spacing.xl,
  },
  tabNavigation: {
    marginBottom: tokens.spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: 4,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modernTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.md,
    position: 'relative',
    gap: 6,
  },
  activeModernTabButton: {
    backgroundColor: tokens.colors.primary,
    shadowColor: tokens.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modernTabText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  activeModernTabText: {
    color: tokens.colors.onPrimary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: tokens.colors.primary,
    transform: [{ translateX: -2 }],
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    paddingVertical: tokens.spacing.md,
  },
  
  // Enhanced Tab Styles
  enhancedTabNavigation: {
    marginBottom: tokens.spacing.lg,
    marginHorizontal: tokens.spacing.lg,
  },
  enhancedTabContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    padding: 6,
    position: 'relative',
    ...tokens.shadows.md,
  },
  enhancedTabIndicator: {
    position: 'absolute',
    top: 6,
    left: 6,
    bottom: 6,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.borderRadius.lg,
    width: `${(100 - 3) / 4}%`, // Dynamic width calculation accounting for container padding
    ...tokens.shadows.sm,
  },
  enhancedTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: 4, // Reduced padding to give more space to text
    borderRadius: tokens.borderRadius.lg,
    position: 'relative',
    zIndex: 2,
    minWidth: 0,
  },
  activeEnhancedTabButton: {
    // Active state handled by indicator
  },
  tabContentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    paddingHorizontal: 2,
  },
  enhancedTabText: {
    fontSize: tokens.typography.caption - 2, // Smaller font to fit better
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
    width: '100%',
    includeFontPadding: false, // Remove extra font padding on Android
  },
  activeEnhancedTabText: {
    color: tokens.colors.onPrimary,
    fontWeight: '700',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: tokens.colors.error,
    borderRadius: tokens.borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    color: tokens.colors.onPrimary,
    fontWeight: '700',
  },
  
  bottomSpacing: {
    height: 100,
  },
  modernCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xl,
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: tokens.colors.border + '20',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  cardTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
  },
  cardDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: tokens.typography.body * 1.6,
  },
  requirementsList: {
    gap: tokens.spacing.sm,
  },
  outcomesList: {
    gap: tokens.spacing.sm,
  },
  modernListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: tokens.spacing.xs,
  },
  listItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    marginTop: 2,
  },
  modernListText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    flex: 1,
    lineHeight: tokens.typography.body * 1.5,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border + '20',
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  actionSection: {
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
    backgroundColor: 'transparent',
  },
  primaryButton: {
    backgroundColor: tokens.colors.primary,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: tokens.typography.body * 1.2,
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
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    shadowColor: tokens.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  enrollButtonText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onPrimary,
    letterSpacing: 0.25,
  },

  // Progress Overview Styles
  progressOverviewCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: tokens.colors.border + '40',
  },
  progressHeader: {
    marginBottom: tokens.spacing.md,
  },
  progressTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  progressSubtitle: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: tokens.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: tokens.colors.success,
    borderRadius: 4,
  },
  progressPercentageText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.success,
    minWidth: 40,
    textAlign: 'right',
  },

  // Enhanced Lesson Styles
  enhancedLessonCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  completedLessonCard: {
    backgroundColor: tokens.colors.success + '10',
    borderColor: tokens.colors.success + '40',
  },
  lockedLessonCard: {
    backgroundColor: tokens.colors.surfaceVariant,
    borderColor: tokens.colors.border,
    opacity: 0.7,
  },
  lessonCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  lessonStatusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryLight + '20',
  },
  completedStatusIcon: {
    backgroundColor: tokens.colors.success + '20',
  },
  lockedStatusIcon: {
    backgroundColor: tokens.colors.surfaceVariant,
  },
  lessonInfo: {
    flex: 1,
  },
  enhancedLessonTitle: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  lessonTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonType: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  lessonDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Instructor Profile Styles
  instructorProfileCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: tokens.colors.border + '40',
  },
  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  instructorAvatarContainer: {
    position: 'relative',
  },
  enhancedInstructorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructorBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.surface,
  },
  instructorDetails: {
    flex: 1,
  },
  enhancedInstructorName: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  instructorTitle: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.sm,
  },
  instructorStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.lg,
  },
  instructorStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorStatText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    fontWeight: '600',
  },

  // Achievements Styles
  achievementsList: {
    gap: tokens.spacing.sm,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  achievementText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    flex: 1,
  },

  // Reviews Overview Styles
  reviewOverviewCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: tokens.colors.border + '40',
  },
  reviewOverviewHeader: {
    alignItems: 'center',
  },
  ratingDisplayContainer: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewCount: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
  },

  // Enhanced Review Styles
  enhancedReviewCard: {
    backgroundColor: tokens.colors.surfaceVariant + '40',
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.border + '60',
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onPrimary,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.xs,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  enhancedReviewComment: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    lineHeight: tokens.typography.body * 1.5,
  },

  // Video Modal Styles
  videoModalContainer: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  videoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border + '40',
    backgroundColor: tokens.colors.surface,
  },
  videoModalCloseButton: {
    padding: tokens.spacing.sm,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: tokens.colors.surfaceVariant,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoModalTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
  },
  videoModalSpacer: {
    width: 44,
  },
  videoPlayerContainer: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    paddingBottom: tokens.spacing.lg,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.xl,
    backgroundColor: tokens.colors.surface,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.borderRadius.lg,
  },
  videoLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: tokens.borderRadius.lg,
  },
  loadingSpinner: {
    marginBottom: tokens.spacing.md,
    opacity: 0.8,
  },
  videoLoadingText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border + '40',
  },
  videoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  videoStatText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  videoPlayerContent: {
    flex: 1,
    backgroundColor: tokens.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoThumbnailIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    opacity: 0.3,
  },
  centeredVideoPlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  videoControlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  videoDuration: {
    color: '#FFFFFF',
    fontSize: tokens.typography.caption,
    fontWeight: '600',
  },
  videoInfo: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    marginTop: tokens.spacing.md,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  videoTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
  },
  videoDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: tokens.typography.body * 1.6,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: tokens.colors.primary + '10',
    borderRadius: tokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    borderWidth: 2,
    borderColor: tokens.colors.primary + '20',
    position: 'relative',
  },
  videoPlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    shadowColor: tokens.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  videoPlaceholderText: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.xs,
  },
  videoPlaceholderSubtext: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
  },
  videoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xl,
    marginBottom: tokens.spacing.lg,
  },
  videoControlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  videoProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: 2,
    marginBottom: tokens.spacing.sm,
  },
  videoProgress: {
    height: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: 2,
  },
  videoTimeText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
});