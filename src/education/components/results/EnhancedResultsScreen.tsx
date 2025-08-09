import React, { useEffect, useRef, useState } from 'react';
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
}

// Enhanced Celebration Component with multiple stages
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
  const confettiAnimations = useRef(Array.from({ length: 30 }, () => ({
    translateY: useSharedValue(-100),
    translateX: useSharedValue((Math.random() - 0.5) * screenWidth),
    rotation: useSharedValue(0),
    opacity: useSharedValue(1),
    scale: useSharedValue(1),
  }))).current;

  const getCelebrationLevel = (score: number) => {
    if (score >= 90) return 'epic';
    if (score >= 70) return 'great';
    return 'supportive';
  };

  const celebrationLevel = getCelebrationLevel(percentage);

  useEffect(() => {
    const runCelebration = async () => {
      // Stage 1: Initial burst
      stage1Opacity.value = withTiming(1, { duration: 500 });
      
      if (celebrationLevel === 'epic') {
        await new Promise(resolve => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setTimeout(resolve, 100);
        });
        
        // Epic confetti
        confettiAnimations.forEach((anim, i) => {
          const delay = Math.random() * 500;
          setTimeout(() => {
            anim.translateY.value = withTiming(screenHeight + 100, { 
              duration: 3000 + Math.random() * 1000,
              easing: Easing.out(Easing.quad)
            });
            anim.rotation.value = withTiming(360 * 3, { duration: 3000 });
            anim.opacity.value = withTiming(0, { 
              duration: 3000,
              easing: Easing.out(Easing.quad)
            });
          }, delay);
        });
      }

      // Stage 2: Achievement reveal
      setTimeout(() => {
        stage2Scale.value = withSpring(1, { 
          tension: 100, 
          friction: 6 
        });
        
        if (celebrationLevel !== 'supportive') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }, 800);

      // Stage 3: Content reveal
      setTimeout(() => {
        stage3Rotation.value = withSpring(360, { 
          tension: 80, 
          friction: 8 
        });
        runOnJS(onComplete)();
      }, 1500);
    };

    runCelebration();
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
      default: return 'Keep Learning!';
    }
  };

  return (
    <View style={styles.celebrationContainer}>
      {/* Epic confetti for high scores */}
      {celebrationLevel === 'epic' && (
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

      {/* Stage 2: Achievement text */}
      <Animated.View style={[styles.stage2Container, stage2AnimatedStyle]}>
        <Text style={styles.celebrationTitle}>{getCelebrationText()}</Text>
        <Text style={styles.celebrationSubtitle}>
          {percentage >= 90 ? 'Perfect mastery!' : 
           percentage >= 70 ? 'Excellent progress!' : 
           'Every step counts!'}
        </Text>
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
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);
  
  const [celebrationComplete, setCelebrationComplete] = useState(false);
  const [currentView, setCurrentView] = useState<'celebration' | 'summary' | 'details'>('celebration');
  
  const containerOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.8);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    // Initial entrance animation
    containerOpacity.value = withTiming(1, { duration: 300 });
    contentScale.value = withSpring(1, { tension: 100, friction: 8 });
  }, []);

  const handleCelebrationComplete = () => {
    setCelebrationComplete(true);
    setTimeout(() => {
      setCurrentView('summary');
    }, 500);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

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

  const performanceLevel = getPerformanceLevel(resultData.percentage);
  const performanceColor = getPerformanceColor(performanceLevel);

  if (currentView === 'celebration') {
    return (
      <View style={styles.overlayContainer}>
        <LinearGradient
          colors={[
            `${performanceColor}20`,
            `${performanceColor}10`,
            `${performanceColor}05`,
          ]}
          style={styles.backgroundGradient}
        >
          <MultiStageCelebration
            percentage={resultData.percentage}
            onComplete={handleCelebrationComplete}
            styles={styles}
          />
        </LinearGradient>
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
                colors={[`${performanceColor}15`, `${performanceColor}05`]}
                style={styles.summaryGradient}
              >
                <View style={styles.summaryContent}>
                  <Text style={[styles.finalScore, { color: performanceColor }]}>
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
                <Text style={[styles.statValue, { color: performanceColor }]}>
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
  backgroundGradient: {
    flex: 1,
  },
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
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