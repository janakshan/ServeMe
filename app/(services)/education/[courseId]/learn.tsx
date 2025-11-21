import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import { useEducationServiceLayout } from '@/hooks/useScopedServiceLayout';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { MinimalHeader } from '@/src/education/components/headers';

// Enhanced interfaces for learning experience
interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
  watchTime: number; // seconds watched
  totalDuration: number; // total duration in seconds
  description?: string;
  order: number;
}

interface LearningProgress {
  currentLessonId: string;
  currentTimestamp: number;
  completedLessons: string[];
  totalWatchTime: number;
  lastAccessed: Date;
}

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: VideoLesson[];
}

export default function CourseLearnScreen() {
  const { courseId } = useLocalSearchParams();
  const themeContext = useEducationTheme();
  const { tokens, getGradient } = themeContext;
  const { screenOptions } = useEducationServiceLayout(themeContext);
  const styles = useScopedThemedStyles(createStyles, themeContext);
  // State management
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<VideoLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [learningProgress, setLearningProgress] = useState<LearningProgress | null>(null);

  // Animation refs
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const lessonChangeAnimation = useRef(new Animated.Value(1)).current;

  // Video player setup
  const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(sampleVideoUrl);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  
  // Create video player with current URL
  const player = useVideoPlayer(currentVideoUrl, (player) => {
    player.loop = false;
    player.muted = false;
  });

  // Mock data for development
  const mockCourseData: CourseData = {
    id: courseId as string,
    title: "Advanced Tamil Literature",
    instructor: "Dr. Tamil Scholar",
    totalLessons: 12,
    completedLessons: 4,
    progress: 33,
    lessons: [
      {
        id: '1',
        title: 'Introduction to Tamil Literature',
        duration: '15:30',
        type: 'video',
        isCompleted: true,
        isLocked: false,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        watchTime: 930, // 15:30 in seconds
        totalDuration: 930,
        description: 'Overview of Tamil literature history and significance',
        order: 1,
      },
      {
        id: '2',
        title: 'Classical Tamil Poetry',
        duration: '22:45',
        type: 'video',
        isCompleted: true,
        isLocked: false,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        watchTime: 1365,
        totalDuration: 1365,
        description: 'Exploring the golden age of Tamil poetry',
        order: 2,
      },
      {
        id: '3',
        title: 'Modern Tamil Literature',
        duration: '18:20',
        type: 'video',
        isCompleted: false,
        isLocked: false,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        watchTime: 680, // Partially watched
        totalDuration: 1100,
        description: 'Contemporary writers and their contributions',
        order: 3,
      },
      {
        id: '4',
        title: 'Tamil Drama and Theatre',
        duration: '25:10',
        type: 'video',
        isCompleted: false,
        isLocked: false,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        watchTime: 0,
        totalDuration: 1510,
        description: 'Traditional and modern Tamil dramatic works',
        order: 4,
      },
      {
        id: '5',
        title: 'Literary Analysis Techniques',
        duration: '20:15',
        type: 'video',
        isCompleted: false,
        isLocked: true,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        watchTime: 0,
        totalDuration: 1215,
        description: 'Methods for analyzing Tamil literary works',
        order: 5,
      },
    ],
  };

  // Initialize component
  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  // Update video source when lesson changes
  useEffect(() => {
    if (currentLesson?.videoUrl && currentLesson.videoUrl !== currentVideoUrl) {
      console.log('Updating video for lesson:', currentLesson.title, currentLesson.videoUrl);
      
      // Clear any existing loading timeout
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }
      
      setIsVideoLoading(true);
      
      // Replace the video source directly on the player
      if (player) {
        player.replace(currentLesson.videoUrl);
        setCurrentVideoUrl(currentLesson.videoUrl);
        
        // Auto-play the new video after a short delay to ensure it's loaded
        setTimeout(() => {
          try {
            player.play();
            console.log('Auto-playing new video for lesson:', currentLesson.title);
          } catch (error) {
            console.warn('Failed to auto-play video:', error);
          }
        }, 500);
      }
    }
  }, [currentLesson?.videoUrl, currentVideoUrl, loadingTimeout, player]);

  // Handle video player state changes with improved loading management
  useEffect(() => {
    if (player && currentLesson) {
      console.log('Setting up video player listeners for lesson:', currentLesson.title);
      
      const subscription = player.addListener('statusChange', (status) => {
        console.log('Video status change:', status.status);
        
        if (status.status === 'readyToPlay') {
          // Clear any existing timeout
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
          }
          
          // Debounce the loading state change for Android stability
          const timeout = setTimeout(() => {
            setIsVideoLoading(false);
            console.log('Video ready to play - hiding loading');
          }, 300); // 300ms delay to prevent blinking
          
          setLoadingTimeout(timeout);
          
          // Resume from last watched position and auto-play
          if (currentLesson.watchTime > 0) {
            console.log('Resuming from position:', currentLesson.watchTime);
            player.currentTime = currentLesson.watchTime;
          }
          
          // Auto-play when video is ready
          try {
            player.play();
            console.log('Auto-playing video when ready for lesson:', currentLesson.title);
          } catch (error) {
            console.warn('Failed to auto-play when ready:', error);
          }
        } else if (status.status === 'loading') {
          console.log('Video loading - showing loading indicator');
          setIsVideoLoading(true);
          setIsVideoPlaying(false);
          // Clear any pending timeout to hide loading
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            setLoadingTimeout(null);
          }
        } else if (status.status === 'error') {
          console.error('Video player error');
          setIsVideoLoading(false);
          setIsVideoPlaying(false);
        }
      });

      // Set up progress tracking
      const progressSubscription = player.addListener('timeUpdate', (timeUpdate) => {
        if (currentLesson) {
          const progressPercent = (timeUpdate.currentTime / currentLesson.totalDuration) * 100;
          progressAnimation.setValue(progressPercent);
          
          // Auto-save progress every 30 seconds
          if (Math.floor(timeUpdate.currentTime) % 30 === 0) {
            saveLearningProgress(timeUpdate.currentTime);
          }

          // Auto-mark as completed when 95% watched
          if (progressPercent >= 95 && !currentLesson.isCompleted) {
            markLessonCompleted(currentLesson.id);
          }
        }
      });

      // Handle video playback state changes
      const playbackSubscription = player.addListener('playbackStateChange', (state) => {
        console.log('Video playback state change:', state.state);
        setIsVideoPlaying(state.state === 'playing');
      });

      // Handle video end - simplified approach
      const endSubscription = player.addListener('statusChange', (status) => {
        if (status.status === 'idle') {
          // Video ended or paused
          console.log('Video status changed to idle');
          setIsVideoPlaying(false);
        }
      });

      return () => {
        subscription.remove();
        progressSubscription.remove();
        playbackSubscription.remove();
        endSubscription.remove();
        
        // Clear any pending loading timeout
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          setLoadingTimeout(null);
        }
      };
    }
  }, [player, currentLesson, loadingTimeout]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []);

  // Handle initial video setup and autoplay
  useEffect(() => {
    if (player && currentLesson && !isLoading) {
      // Small delay to ensure video is ready for initial load
      const timer = setTimeout(() => {
        try {
          if (currentLesson.watchTime > 0) {
            player.currentTime = currentLesson.watchTime;
          }
          player.play();
          console.log('Initial autoplay for lesson:', currentLesson.title);
        } catch (error) {
          console.warn('Initial autoplay failed:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [player, currentLesson, isLoading]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      // In real implementation, load from API
      // const data = await educationApi.getCourseDetails(courseId as string);
      
      // Using mock data for now
      setCourseData(mockCourseData);
      
      // Set first uncompleted lesson or first lesson as current
      const firstUncompletedLesson = mockCourseData.lessons.find(lesson => !lesson.isCompleted && !lesson.isLocked);
      const initialLesson = firstUncompletedLesson || mockCourseData.lessons[0];
      setCurrentLesson(initialLesson);

      // Initialize learning progress
      const progress: LearningProgress = {
        currentLessonId: initialLesson.id,
        currentTimestamp: initialLesson.watchTime,
        completedLessons: mockCourseData.lessons.filter(l => l.isCompleted).map(l => l.id),
        totalWatchTime: mockCourseData.lessons.reduce((total, lesson) => total + lesson.watchTime, 0),
        lastAccessed: new Date(),
      };
      setLearningProgress(progress);

    } catch (error) {
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonSelect = useCallback((lesson: VideoLesson) => {
    if (lesson.isLocked) {
      Alert.alert('Lesson Locked', 'Complete previous lessons to unlock this one.');
      return;
    }

    console.log('Lesson selected:', lesson.title, lesson.videoUrl);

    // Animate lesson change
    Animated.sequence([
      Animated.timing(lessonChangeAnimation, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(lessonChangeAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Update current lesson - this will trigger video player recreation
    setCurrentLesson(lesson);
    
    // Update learning progress
    if (learningProgress) {
      setLearningProgress({
        ...learningProgress,
        currentLessonId: lesson.id,
        currentTimestamp: lesson.watchTime,
        lastAccessed: new Date(),
      });
    }

    // Note: Video player will be automatically created/updated by useEffect
    // No need to manually manipulate player here as it will be recreated with new URL
  }, [learningProgress, lessonChangeAnimation]);

  const markLessonCompleted = useCallback((lessonId: string) => {
    if (!courseData) return;

    const updatedLessons = courseData.lessons.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, isCompleted: true, watchTime: lesson.totalDuration }
        : lesson
    );

    // Unlock next lesson
    const currentLessonIndex = courseData.lessons.findIndex(l => l.id === lessonId);
    if (currentLessonIndex < courseData.lessons.length - 1) {
      updatedLessons[currentLessonIndex + 1].isLocked = false;
    }

    const completedCount = updatedLessons.filter(l => l.isCompleted).length;
    const newProgress = (completedCount / courseData.totalLessons) * 100;

    setCourseData({
      ...courseData,
      lessons: updatedLessons,
      completedLessons: completedCount,
      progress: newProgress,
    });

    // Update learning progress
    if (learningProgress) {
      setLearningProgress({
        ...learningProgress,
        completedLessons: [...learningProgress.completedLessons, lessonId],
      });
    }

    // Show completion celebration
    Alert.alert(
      '🎉 Lesson Completed!',
      'Great job! You\'ve completed this lesson.',
      [
        { text: 'Continue', onPress: () => {} }
      ]
    );
  }, [courseData, learningProgress]);


  const saveLearningProgress = useCallback((currentTime: number) => {
    if (currentLesson && learningProgress) {
      // Update lesson watch time
      const updatedLessons = courseData?.lessons.map(lesson => 
        lesson.id === currentLesson.id 
          ? { ...lesson, watchTime: currentTime }
          : lesson
      ) || [];

      // Update course data
      if (courseData) {
        setCourseData({
          ...courseData,
          lessons: updatedLessons,
        });
      }

      // Update learning progress
      setLearningProgress({
        ...learningProgress,
        currentTimestamp: currentTime,
        totalWatchTime: learningProgress.totalWatchTime + 30, // Approximate
        lastAccessed: new Date(),
      });
    }
  }, [currentLesson, learningProgress, courseData]);



  const renderLessonItem = ({ item, index }: { item: VideoLesson; index: number }) => {
    const isActive = currentLesson?.id === item.id;
    const progressPercent = (item.watchTime / item.totalDuration) * 100;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.lessonItem,
          isActive && styles.activeLessonItem,
          item.isLocked && styles.lockedLessonItem,
        ]}
        onPress={() => handleLessonSelect(item)}
        disabled={item.isLocked}
        activeOpacity={0.7}
        accessibilityLabel={`${item.isLocked ? 'Locked lesson' : isActive ? 'Currently playing' : 'Play lesson'}: ${item.title}, ${item.duration}${item.isCompleted ? ', completed' : progressPercent > 0 ? `, ${Math.round(progressPercent)}% watched` : ''}`}
        accessibilityRole="button"
        accessibilityState={{
          disabled: item.isLocked,
          selected: isActive,
        }}
      >
        <View style={styles.lessonIconContainer}>
          <View style={[
            styles.lessonIcon,
            item.isCompleted && styles.completedLessonIcon,
            isActive && styles.activeLessonIcon,
            item.isLocked && styles.lockedLessonIcon,
          ]}>
            {item.isCompleted ? (
              <Ionicons name="checkmark" size={20} color={tokens.colors.onPrimary} />
            ) : item.isLocked ? (
              <Ionicons name="lock-closed" size={16} color={tokens.colors.onSurfaceVariant} />
            ) : isActive && isVideoPlaying ? (
              <Ionicons name="pause" size={16} color={tokens.colors.onPrimary} />
            ) : (
              <Ionicons name="play" size={16} color={isActive ? tokens.colors.onPrimary : tokens.colors.onSurfaceVariant} />
            )}
          </View>
          
          {/* Progress ring for partially watched lessons */}
          {!item.isCompleted && !item.isLocked && progressPercent > 0 && (
            <View style={styles.progressRing}>
              {/* Background circle */}
              <View style={styles.progressRingTrack} />
              {/* Progress fill - using border technique but improved */}
              <View style={styles.progressRingContainer}>
                {/* Right semicircle - rotates first (0-50%) */}
                <View style={[
                  styles.progressRingRight,
                  {
                    transform: [{ 
                      rotate: `${Math.min(progressPercent * 2, 50) * 3.6}deg` 
                    }]
                  }
                ]} />
                {/* Left semicircle - shows after 50% */}
                {progressPercent > 50 && (
                  <View style={[
                    styles.progressRingLeft,
                    {
                      transform: [{ 
                        rotate: `${Math.min((progressPercent - 50) * 2, 50) * 3.6}deg` 
                      }]
                    }
                  ]} />
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.lessonContent}>
          <Text style={[
            styles.lessonTitle,
            isActive && styles.activeLessonTitle,
            item.isLocked && styles.lockedLessonTitle,
          ]}>
            {index + 1}. {item.title}
          </Text>
          <Text style={[
            styles.lessonDescription,
            item.isLocked && styles.lockedLessonDescription,
          ]}>
            {item.description}
          </Text>
          <View style={styles.lessonMeta}>
            <View style={styles.lessonDuration}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color={item.isLocked ? tokens.colors.onSurfaceVariant : tokens.colors.primary} 
              />
              <Text style={[
                styles.lessonDurationText,
                item.isLocked && { color: tokens.colors.onSurfaceVariant }
              ]}>
                {item.duration}
              </Text>
            </View>
            {progressPercent > 0 && !item.isCompleted && (
              <Text style={styles.progressText}>
                {Math.round(progressPercent)}% watched
              </Text>
            )}
          </View>
        </View>

        {isActive && (
          <View style={styles.activeIndicator}>
            <View style={styles.activeIndicatorDot} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      </>
    );
  }

  if (!courseData || !currentLesson) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
        </View>
      </>
    );
  }

  // Get education theme gradients
  const backgroundGradient = getGradient('background');
  const surfaceGradient = getGradient('surface');

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Stack.Screen options={{ 
        ...screenOptions,
        headerShown: false
      }} />
      <View style={styles.container}>
        <LinearGradient
          colors={backgroundGradient.colors as any}
          start={{ x: backgroundGradient.direction.x, y: backgroundGradient.direction.y }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Ultra-Minimal Header */}
          <MinimalHeader
            title="Learn"
            onBackPress={() => {
              console.log('Learn screen: Custom back navigation to course details for courseId:', courseId);
              router.push(`/(services)/education/${courseId}` as any);
            }}
          />

          {/* Course Title Section */}
          <View style={styles.courseTitleContainer}>
            <Text style={styles.courseTitle}>{courseData.title}</Text>
            <Text style={styles.instructorName}>by {courseData.instructor}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    })
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Lesson {currentLesson.order} of {courseData.totalLessons}
            </Text>
          </View>

          {/* Main Scrollable Content */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Video Player Section */}
            <View style={styles.videoSection}>
              <Animated.View 
                style={[
                  styles.videoContainer,
                  {
                    opacity: lessonChangeAnimation,
                    transform: [{ scale: lessonChangeAnimation }],
                  }
                ]}
              >
                <View style={styles.videoPlayer}>
                  <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                    nativeControls
                    contentFit="contain"
                    accessibilityLabel={`Video player: ${currentLesson.title}`}
                    accessibilityHint="Double tap to play or pause, pinch to zoom"
                  />
                  
                  {isVideoLoading && (
                    <View style={styles.videoLoadingOverlay}>
                      <ActivityIndicator size="large" color={tokens.colors.onPrimary} />
                      <Text style={styles.videoLoadingText}>Loading video...</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
              
              {/* Video Info with Surface Gradient */}
              <LinearGradient
                colors={surfaceGradient.colors as any}
                start={{ x: surfaceGradient.direction.x, y: surfaceGradient.direction.y }}
                end={{ x: 1, y: 1 }}
                style={styles.videoInfo}
              >
                <Text style={styles.videoTitle}>{currentLesson.title}</Text>
                <Text style={styles.videoDescription}>{currentLesson.description}</Text>
              </LinearGradient>
            </View>

            {/* Course Content Section */}
            <LinearGradient
              colors={surfaceGradient.colors as any}
              start={{ x: surfaceGradient.direction.x, y: surfaceGradient.direction.y }}
              end={{ x: 1, y: 1 }}
              style={styles.courseContentSection}
            >
              <View style={styles.courseContentHeader}>
                <Text style={styles.courseContentTitle}>Course Content</Text>
                <Text style={styles.courseContentProgress}>
                  {courseData.completedLessons} of {courseData.totalLessons} completed
                </Text>
              </View>
              
              {/* Lesson List */}
              <View style={styles.lessonContainer}>
                {courseData.lessons.map((lesson, index) => 
                  renderLessonItem({ item: lesson, index })
                )}
              </View>
            </LinearGradient>
            
            {/* Bottom spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
}

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    paddingTop: 0,
  },
  gradientBackground: {
    flex: 1,
  },
  courseTitleContainer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  courseTitle: {
    fontSize: tokens.typography.title,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
    lineHeight: tokens.typography.title * 1.2,
  },
  instructorName: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    fontWeight: '500',
    textAlign: 'center',
  },
  courseContentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border + '15',
  },
  courseContentTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: '800',
    color: tokens.colors.onSurface,
  },
  courseContentProgress: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  lessonContainer: {
    paddingBottom: tokens.spacing.md,
  },
  bottomSpacing: {
    height: tokens.spacing.xxl * 2,
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
    marginTop: tokens.spacing.md,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border + '20',
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  headerContent: {
    flex: 1,
  },
  progressBarContainer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: 'transparent',
  },
  progressBar: {
    height: 8,
    backgroundColor: tokens.colors.border + '30',
    borderRadius: 4,
    marginBottom: tokens.spacing.xs,
    overflow: 'hidden',
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  videoSection: {
    backgroundColor: 'transparent',
    paddingBottom: tokens.spacing.md,
  },
  videoContainer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000000',
    borderRadius: tokens.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLoadingText: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.body,
    marginTop: tokens.spacing.md,
  },
  videoInfo: {
    marginHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.lg,
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  videoTitle: {
    fontSize: tokens.typography.title,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.sm,
    lineHeight: tokens.typography.title * 1.3,
  },
  videoDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    lineHeight: tokens.typography.body * 1.6,
    fontWeight: '400',
  },
  courseContentSection: {
    marginTop: tokens.spacing.xl,
    marginHorizontal: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border + '15',
  },
  activeLessonItem: {
    backgroundColor: tokens.colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: tokens.colors.primary,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedLessonItem: {
    opacity: 0.5,
    backgroundColor: tokens.colors.surfaceVariant + '30',
  },
  lessonIconContainer: {
    position: 'relative',
    marginRight: tokens.spacing.md,
  },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.border + '40',
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activeLessonIcon: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
    shadowColor: tokens.colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  completedLessonIcon: {
    backgroundColor: tokens.colors.success,
    borderColor: tokens.colors.success,
    shadowColor: tokens.colors.success,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedLessonIcon: {
    backgroundColor: tokens.colors.surfaceVariant + '60',
    borderColor: tokens.colors.border + '60',
  },
  progressRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  progressRingTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 27,
    borderWidth: 3,
    borderColor: tokens.colors.border + '20',
  },
  progressRingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 27,
    overflow: 'hidden',
  },
  progressRingLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    borderTopLeftRadius: 27,
    borderBottomLeftRadius: 27,
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: tokens.colors.primary,
    backgroundColor: 'transparent',
    transformOrigin: '100% 50%',
  },
  progressRingRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    borderTopRightRadius: 27,
    borderBottomRightRadius: 27,
    borderWidth: 3,
    borderLeftWidth: 0,
    borderColor: tokens.colors.primary,
    backgroundColor: 'transparent',
    transformOrigin: '0% 50%',
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: '700',
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
    lineHeight: tokens.typography.subtitle * 1.3,
  },
  activeLessonTitle: {
    color: tokens.colors.primary,
    fontWeight: '800',
  },
  lockedLessonTitle: {
    color: tokens.colors.onSurfaceVariant + '80',
    fontWeight: '600',
  },
  lessonDescription: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurfaceVariant,
    marginBottom: tokens.spacing.sm,
    lineHeight: tokens.typography.body * 1.5,
    fontWeight: '400',
  },
  lockedLessonDescription: {
    color: tokens.colors.onSurfaceVariant + '60',
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonDurationText: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: '500',
  },
  activeIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: tokens.spacing.md,
  },
  activeIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.primary,
  },
});