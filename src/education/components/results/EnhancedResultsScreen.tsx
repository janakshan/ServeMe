import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Conditional blur import with fallback - more robust approach
let BlurView: any = null;
let hasBlurSupport = false;

try {
  const expoBlur = require('expo-blur');
  BlurView = expoBlur.BlurView;
  hasBlurSupport = true;
  console.log('✅ BlurView loaded successfully');
} catch (error) {
  console.log('⚠️ BlurView not available, using enhanced fallback');
  hasBlurSupport = false;
}
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced fallback component when BlurView is not available
const EnhancedFallbackView: React.FC<{ 
  children: React.ReactNode; 
  style?: any; 
  intensity?: number; 
  tint?: string;
  isCard?: boolean;
}> = ({ 
  children, 
  style,
  intensity = 0,
  tint = 'light',
  isCard = false
}) => {
  const backgroundColor = tint === 'light' 
    ? `rgba(255, 255, 255, ${Math.min(intensity / 100 * 0.95, 0.95)})` 
    : `rgba(0, 0, 0, ${Math.min(intensity / 100 * 0.4, 0.4)})`;
  
  const cardStyle = isCard ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  } : {};

  return (
    <View style={[style, { backgroundColor }, cardStyle]}>
      {children}
    </View>
  );
};

// Types for the enhanced results
interface QuestionResult {
  id: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  explanation?: string;
}

interface ExamResultData {
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  timeLimit: number;
  questionResults: QuestionResult[];
  achievements: string[];
  newBadges: string[];
  xpEarned: number;
  streakCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subject: string;
}

interface EnhancedResultsScreenProps {
  resultData: ExamResultData;
  onClose: () => void;
  onRetake?: () => void;
  onNextQuiz?: () => void;
  onShare?: (resultCard: any) => void;
  onShareWithStudyGroup?: () => void;
  onSendToTeacher?: () => void;
  onNotifyParents?: () => void;
}

// Optimized Enhanced Celebration Component with performance improvements
const MultiStageCelebration = ({ 
  percentage, 
  onComplete,
  styles 
}: { 
  percentage: number; 
  onComplete: () => void;
  styles: any;
}) => {
  const stage1Opacity = useSharedValue(0);
  const stage2Scale = useSharedValue(0);
  const stage3Rotation = useSharedValue(0);
  
  // Optimized confetti - pre-initialize shared values but only render when needed
  const confettiAnimations = useRef(
    Array.from({ length: 15 }, () => ({
      translateY: useSharedValue(-100),
      translateX: useSharedValue((Math.random() - 0.5) * screenWidth),
      rotation: useSharedValue(0),
      opacity: useSharedValue(1),
      scale: useSharedValue(0.8 + Math.random() * 0.4),
    }))
  ).current;

  const [showConfetti, setShowConfetti] = useState(false);

  const getCelebrationLevel = (score: number) => {
    if (score >= 90) return 'epic';
    if (score >= 70) return 'great';
    return 'supportive';
  };

  const celebrationLevel = getCelebrationLevel(percentage);

  useEffect(() => {
    // Optimized celebration sequence with faster execution
    const runCelebration = () => {
      // Stage 1: Immediate burst (reduced from 500ms to 300ms)
      stage1Opacity.value = withTiming(1, { duration: 300 });
      
      // Initialize confetti only for epic celebrations
      if (celebrationLevel === 'epic') {
        setShowConfetti(true);
        
        // Lightweight haptic feedback without async overhead
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        // Optimized confetti animation
        setTimeout(() => {
          confettiAnimations.forEach((anim) => {
            const duration = 2000 + Math.random() * 500; // Reduced duration
            anim.translateY.value = withTiming(screenHeight + 50, { 
              duration,
              easing: Easing.out(Easing.quad)
            });
            anim.rotation.value = withTiming(180 + Math.random() * 180, { duration });
            anim.opacity.value = withTiming(0, { 
              duration,
              easing: Easing.out(Easing.quad)
            });
          });
        }, 100);
      }

      // Stage 2: Show celebration title (increased timing for readability)
      setTimeout(() => {
        stage2Scale.value = withSpring(1, { 
          tension: 80, // Slower animation for better visibility
          friction: 8 
        });
        
        if (celebrationLevel !== 'supportive') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }, 600);

      // Stage 3: Score reveal with longer display time
      setTimeout(() => {
        stage3Rotation.value = withSpring(360, { 
          tension: 60, // Slower rotation
          friction: 10 
        });
        // Give users more time to read the message
        setTimeout(() => runOnJS(onComplete)(), 1500);
      }, 1800);
    };

    // Use requestAnimationFrame for smoother initial render
    requestAnimationFrame(runCelebration);
  }, [percentage]);

  const stage1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: stage1Opacity.value,
  }));

  const stage2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stage2Scale.value }],
  }));

  const stage3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${stage3Rotation.value}deg` }],
  }));

  const getCelebrationEmoji = () => {
    switch (celebrationLevel) {
      case 'epic': return '🏆';
      case 'great': return '⭐';
      default: return '📚';
    }
  };

  const getCelebrationText = () => {
    switch (celebrationLevel) {
      case 'epic': return 'Outstanding!';
      case 'great': return 'Great Job!';
      default: return 'You\'re Growing!'; // More encouraging than "Keep Learning!"
    }
  };

  const getCelebrationSubtext = () => {
    switch (celebrationLevel) {
      case 'epic': return 'Perfect mastery achieved!';
      case 'great': return 'Excellent progress made!';
      default: return 'Every step builds strength!';
    }
  };

  return (
    <View style={styles.celebrationContainer}>
      {/* Optimized confetti for high scores - only render when needed */}
      {celebrationLevel === 'epic' && showConfetti && (
        <View style={styles.confettiContainer}>
          {confettiAnimations.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.confettiPiece,
                {
                  backgroundColor: ['#6A1B9A', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][i % 5],
                  transform: [
                    { translateX: anim.translateX.value },
                    { translateY: anim.translateY.value },
                    { rotate: `${anim.rotation.value}deg` },
                    { scale: anim.scale.value },
                  ],
                  opacity: anim.opacity.value,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Stage 1: Celebration burst */}
      <Animated.View style={[styles.stage1Container, stage1AnimatedStyle]}>
        <Text style={styles.celebrationEmoji}>{getCelebrationEmoji()}</Text>
      </Animated.View>

      {/* Stage 2: Achievement text with better messaging */}
      <Animated.View style={[styles.stage2Container, stage2AnimatedStyle]}>
        <Text style={styles.celebrationTitle}>{getCelebrationText()}</Text>
        <Text style={styles.celebrationSubtitle}>
          {getCelebrationSubtext()}
        </Text>
        {/* Progress indicator for lower scores */}
        {celebrationLevel === 'supportive' && (
          <View style={styles.progressEncouragement}>
            <Text style={styles.progressText}>
              💪 Building stronger foundations
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Stage 3: Score reveal */}
      <Animated.View style={[styles.stage3Container, stage3AnimatedStyle]}>
        <Text style={styles.scoreReveal}>{Math.round(percentage)}%</Text>
      </Animated.View>
    </View>
  );
};

export const EnhancedResultsScreen: React.FC<EnhancedResultsScreenProps> = ({
  resultData,
  onClose,
  onRetake,
  onNextQuiz,
  onShare,
  onShareWithStudyGroup,
  onSendToTeacher,
  onNotifyParents,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const [celebrationComplete, setCelebrationComplete] = useState(false);
  const [currentView, setCurrentView] = useState<'celebration' | 'summary' | 'details'>('celebration');
  const [isInitialized, setIsInitialized] = useState(false);
  const [preloadSummary, setPreloadSummary] = useState(false);
  
  const containerOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9); // Start closer to final size
  const scrollY = useSharedValue(0);

  useEffect(() => {
    // Enhanced entrance animation for immersive experience
    const initializeScreen = () => {
      setIsInitialized(true);
      
      // Dramatic entrance with scale and opacity
      containerOpacity.value = withTiming(1, { duration: 800 });
      contentScale.value = withSequence(
        withTiming(0.7, { duration: 0 }),
        withSpring(1.05, { tension: 100, friction: 8, duration: 600 }),
        withSpring(1, { tension: 120, friction: 10, duration: 300 })
      );
    };

    // Slight delay for dramatic effect
    setTimeout(() => {
      requestAnimationFrame(initializeScreen);
    }, 100);
  }, []);

  const handleCelebrationComplete = () => {
    setCelebrationComplete(true);
    // Immediate transition for faster response
    setCurrentView('summary');
  };

  // Preload summary view during celebration
  useEffect(() => {
    if (isInitialized && !preloadSummary) {
      // Preload after a short delay to allow celebration to start
      setTimeout(() => {
        setPreloadSummary(true);
      }, 200);
    }
  }, [isInitialized, preloadSummary]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  // Memoize expensive calculations
  const performanceData = useMemo(() => {
    const getPerformanceLevel = (percentage: number) => {
      if (percentage >= 90) return 'epic';
      if (percentage >= 70) return 'great';
      return 'supportive';
    };

    const getPerformanceColor = (level: string) => {
      switch (level) {
        case 'epic': return '#10B981';
        case 'great': return '#3B82F6';
        default: return '#6B7280';
      }
    };

    const level = getPerformanceLevel(resultData.percentage);
    return {
      level,
      color: getPerformanceColor(level)
    };
  }, [resultData.percentage]);

  // Show celebration view with immersive full-screen design
  if (currentView === 'celebration') {
    return (
      <View style={styles.overlayContainer}>
        {/* Full-Screen Immersive Background */}
        <TouchableOpacity 
          activeOpacity={1}
          onPress={handleCelebrationComplete}
          style={styles.fullScreenContainer}
        >
          {/* Dynamic Performance Background */}
          <LinearGradient
            colors={
              performanceData.level === 'epic' 
                ? ['#1a1a2e', '#16213e', '#0f3460', '#e94560']
                : performanceData.level === 'great'
                ? ['#667eea', '#764ba2', '#f093fb']
                : ['#4c1d95', '#5b21b6', '#7c3aed', '#a855f7']
            }
            locations={[0, 0.3, 0.7, 1]}
            style={styles.immersiveBackground}
          >
            {/* Central Celebration Content */}
            <Animated.View style={[styles.centralCelebration, containerAnimatedStyle]}>
              
              {/* Performance Badge */}
              <View style={styles.performanceBadgeContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.performanceBadge}
                >
                  <Text style={styles.performanceEmoji}>
                    {performanceData.level === 'epic' ? '🏆' : performanceData.level === 'great' ? '⭐' : '🌱'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Main Celebration Text */}
              <View style={styles.mainTextContainer}>
                <Text style={styles.immersiveCelebrationTitle}>
                  {performanceData.level === 'epic' ? 'Outstanding!' : 
                   performanceData.level === 'great' ? 'Great Job!' : 
                   'You\'re Growing!'}
                </Text>
                <Text style={styles.immersiveCelebrationSubtitle}>
                  {performanceData.level === 'epic' ? 'Perfect mastery achieved!' :
                   performanceData.level === 'great' ? 'Excellent progress made!' :
                   'Every step builds strength!'}
                </Text>
              </View>

              {/* Score Display */}
              <View style={styles.immersiveScoreContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                  style={styles.scoreCard}
                >
                  <Text style={styles.immersiveScoreText}>{Math.round(resultData.percentage)}%</Text>
                  <Text style={styles.scoreDescription}>Final Score</Text>
                </LinearGradient>
              </View>

              {/* Encouraging Message for Lower Scores */}
              {performanceData.level === 'supportive' && (
                <View style={styles.encouragementContainer}>
                  <LinearGradient
                    colors={['rgba(168, 85, 247, 0.2)', 'rgba(124, 58, 237, 0.1)']}
                    style={styles.encouragementBadge}
                  >
                    <Text style={styles.encouragementText}>💪 Building stronger foundations</Text>
                  </LinearGradient>
                </View>
              )}

              {/* Continue Hint - Better positioned */}
              <View style={styles.immersiveContinueHint}>
                <Text style={styles.immersiveContinueText}>✨ Tap anywhere to continue ✨</Text>
              </View>

            </Animated.View>

            {/* Animated Background Elements */}
            <View style={styles.backgroundEffects}>
              {/* Floating particles */}
              {Array.from({ length: 8 }, (_, i) => (
                <View 
                  key={i}
                  style={[
                    styles.floatingParticle,
                    {
                      left: `${(i * 12 + 10)}%`,
                      top: `${(i * 8 + 15)}%`,
                      animationDelay: `${i * 0.2}s`,
                    }
                  ]}
                />
              ))}
            </View>

          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.overlayContainer}>
      <LinearGradient
        colors={['#FAFBFF', '#F5F7FF', '#F0F4FF']}
        style={styles.backgroundGradient}
      >
        <Animated.View style={[styles.contentContainer, containerAnimatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={tokens.colors.onSurfaceVariant} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{resultData.examTitle}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Performance Summary Card */}
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[`${performanceData.color}15`, `${performanceData.color}05`]}
                style={styles.summaryGradient}
              >
                <View style={styles.summaryContent}>
                  <Text style={[styles.finalScore, { color: performanceData.color }]}>
                    {Math.round(resultData.percentage)}%
                  </Text>
                  <Text style={styles.scoreLabel}>Final Score</Text>
                  
                  <View style={styles.performanceMetrics}>
                    <View style={styles.metric}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text style={styles.metricValue}>{resultData.correctAnswers}</Text>
                      <Text style={styles.metricLabel}>Correct</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Ionicons name="time" size={20} color="#6B7280" />
                      <Text style={styles.metricValue}>
                        {Math.floor(resultData.timeSpent / 60)}m {resultData.timeSpent % 60}s
                      </Text>
                      <Text style={styles.metricLabel}>Time Used</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Ionicons name="flash" size={20} color="#F59E0B" />
                      <Text style={styles.metricValue}>{resultData.xpEarned}</Text>
                      <Text style={styles.metricLabel}>XP Gained</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{resultData.totalQuestions}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: performanceData.color }]}>
                  {Math.round((resultData.correctAnswers / resultData.totalQuestions) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round((resultData.timeSpent / resultData.timeLimit) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Time Used</Text>
              </View>
            </View>

            {/* Achievements Section */}
            {(resultData.achievements.length > 0 || resultData.newBadges.length > 0) && (
              <View style={styles.achievementsCard}>
                <Text style={styles.achievementsTitle}>🎉 New Achievements!</Text>
                <View style={styles.achievementsList}>
                  {resultData.achievements.map((achievement, index) => (
                    <View key={index} style={styles.achievementBadge}>
                      <Text style={styles.achievementText}>{achievement}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              {onRetake && (
                <TouchableOpacity style={styles.secondaryButton} onPress={onRetake}>
                  <LinearGradient
                    colors={['#F8FAFC', '#F1F5F9']}
                    style={styles.buttonGradient}
                  >
                    <Ionicons name="refresh" size={20} color={tokens.colors.primary} />
                    <Text style={[styles.secondaryButtonText, { color: tokens.colors.primary }]}>
                      Retake Quiz
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {onNextQuiz && (
                <TouchableOpacity style={styles.primaryButton} onPress={onNextQuiz}>
                  <LinearGradient
                    colors={[tokens.colors.primary, tokens.colors.primaryLight]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryButtonText}>Next Challenge</Text>
                    <Ionicons name="arrow-forward" size={20} color={tokens.colors.onPrimary} />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Social Sharing Section */}
            <View style={styles.socialSection}>
              <Text style={[styles.socialTitle, { color: tokens.colors.onSurface }]}>
                Share Your Success
              </Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton} onPress={onShare}>
                  <LinearGradient
                    colors={[tokens.colors.primary + '15', tokens.colors.primary + '10']}
                    style={styles.socialButtonGradient}
                  >
                    <Ionicons name="image" size={24} color={tokens.colors.primary} />
                    <Text style={[styles.socialButtonText, { color: tokens.colors.primary }]}>
                      Result Card
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {onShareWithStudyGroup && (
                  <TouchableOpacity style={styles.socialButton} onPress={onShareWithStudyGroup}>
                    <LinearGradient
                      colors={[tokens.colors.secondary + '15', tokens.colors.secondary + '10']}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="people" size={24} color={tokens.colors.secondary} />
                      <Text style={[styles.socialButtonText, { color: tokens.colors.secondary }]}>
                        Study Group
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {onSendToTeacher && (
                  <TouchableOpacity style={styles.socialButton} onPress={onSendToTeacher}>
                    <LinearGradient
                      colors={[tokens.colors.success + '15', tokens.colors.success + '10']}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="school" size={24} color={tokens.colors.success} />
                      <Text style={[styles.socialButtonText, { color: tokens.colors.success }]}>
                        Teacher
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {onNotifyParents && (
                  <TouchableOpacity style={styles.socialButton} onPress={onNotifyParents}>
                    <LinearGradient
                      colors={[tokens.colors.warning + '15', tokens.colors.warning + '10']}
                      style={styles.socialButtonGradient}
                    >
                      <Ionicons name="heart" size={24} color={tokens.colors.warning} />
                      <Text style={[styles.socialButtonText, { color: tokens.colors.warning }]}>
                        Parents
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Performance Insights Teaser */}
            <TouchableOpacity 
              style={styles.insightsTeaser}
              onPress={() => setCurrentView('details')}
            >
              <View style={styles.insightsTeaserContent}>
                <Ionicons name="analytics" size={24} color={tokens.colors.primary} />
                <View style={styles.insightsTeaserText}>
                  <Text style={styles.insightsTeaserTitle}>View Detailed Analysis</Text>
                  <Text style={styles.insightsTeaserSubtitle}>
                    See question-by-question breakdown and performance insights
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={tokens.colors.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },

  // Immersive Full-Screen Design
  fullScreenContainer: {
    flex: 1,
  },
  immersiveBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centralCelebration: {
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },

  // Performance Badge
  performanceBadgeContainer: {
    marginBottom: 30,
  },
  performanceBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  performanceEmoji: {
    fontSize: 50,
  },

  // Main Text Content
  mainTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  immersiveCelebrationTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  immersiveCelebrationSubtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Score Display
  immersiveScoreContainer: {
    marginBottom: 30,
  },
  scoreCard: {
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  immersiveScoreText: {
    fontSize: 68,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Encouragement for Lower Scores
  encouragementContainer: {
    marginBottom: 20,
  },
  encouragementBadge: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  encouragementText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Continue Hint
  immersiveContinueHint: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  immersiveContinueText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  // Background Effects
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
    opacity: 0.6,
  },
  
  // Advanced Blur System with Enhanced Fallback
  blurContainer: {
    flex: 1,
    backgroundColor: hasBlurSupport 
      ? 'rgba(0, 0, 0, 0.1)' // Light overlay when blur is available
      : 'rgba(0, 0, 0, 0.3)', // Stronger backdrop when using fallback
  },
  touchableOverlay: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationGlassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  celebrationCard: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: hasBlurSupport ? '#000' : '#6A1B9A',
    shadowOffset: { width: 0, height: hasBlurSupport ? 20 : 15 },
    shadowOpacity: hasBlurSupport ? 0.15 : 0.3,
    shadowRadius: hasBlurSupport ? 40 : 25,
    elevation: hasBlurSupport ? 25 : 20,
    borderWidth: hasBlurSupport ? 1 : 2,
    borderColor: hasBlurSupport 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(106, 27, 154, 0.2)',
  },
  cardGradient: {
    paddingHorizontal: 40,
    paddingVertical: 60,
    minWidth: screenWidth * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueHint: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Ambient Effects
  ambientEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: -1,
  },
  ambientGlow: {
    position: 'absolute',
    borderRadius: 200,
  },
  ambientGlow1: {
    width: 300,
    height: 300,
    top: '20%',
    left: '10%',
    opacity: 0.3,
  },
  ambientGlow2: {
    width: 250,
    height: 250,
    bottom: '30%',
    right: '15%',
    opacity: 0.2,
  },
  
  backgroundGradient: {
    flex: 1,
  },
  celebrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 20,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stage1Container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stage2Container: {
    position: 'absolute',
    top: '45%',
    alignItems: 'center',
    width: '100%',
  },
  stage3Container: {
    position: 'absolute',
    bottom: '30%',
    alignItems: 'center',
    width: '100%',
  },
  celebrationEmoji: {
    fontSize: 120,
    textAlign: 'center',
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#6A1B9A',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(106, 27, 154, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressEncouragement: {
    marginTop: 16,
    backgroundColor: 'rgba(106, 27, 154, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(106, 27, 154, 0.2)',
  },
  progressText: {
    fontSize: 16,
    color: '#6A1B9A',
    textAlign: 'center',
    fontWeight: '600',
  },
  scoreReveal: {
    fontSize: 72,
    fontWeight: '900',
    color: '#6A1B9A',
    textAlign: 'center',
    textShadowColor: 'rgba(106, 27, 154, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  summaryCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  summaryGradient: {
    padding: 24,
    backgroundColor: 'white',
  },
  summaryContent: {
    alignItems: 'center',
  },
  finalScore: {
    fontSize: 64,
    fontWeight: '900',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 24,
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementsCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementsList: {
    gap: 8,
  },
  achievementBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  secondaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  socialButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%', // Two buttons per row for better alignment
    minWidth: 140,
    marginBottom: 8,
  },
  socialButtonGradient: {
    flexDirection: 'column', // Stack icon and text vertically for better alignment
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  insightsTeaser: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  insightsTeaserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  insightsTeaserText: {
    flex: 1,
  },
  insightsTeaserTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  insightsTeaserSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});