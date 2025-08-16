import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEducationTheme, useScopedThemedStyles } from '@/contexts/ScopedThemeProviders';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import type { ExamDetailedAnalysisData } from '@/types/examAnalysis';

interface PerformanceSummaryProps {
  analysisData: ExamDetailedAnalysisData;
  style?: ViewStyle;
}

interface ScoreCircleProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  delay?: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  percentage, 
  size, 
  strokeWidth, 
  delay = 0 
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(percentage / 100, { 
      duration: 1500 
    });
  }, [percentage]);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return tokens.colors.success;
    if (score >= 70) return tokens.colors.primary;
    if (score >= 50) return tokens.colors.warning;
    return tokens.colors.error;
  };

  const strokeColor = getPerformanceColor(percentage);

  // Enhanced circular progress with better visuals
  return (
    <View style={{ 
      width: size, 
      height: size, 
      borderRadius: size / 2,
      borderWidth: strokeWidth,
      borderColor: tokens.colors.outline + '30',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: tokens.colors.surface,
      ...tokens.shadows.md,
    }}>
      {/* Background circle */}
      <View style={{
        position: 'absolute',
        width: size - strokeWidth * 2,
        height: size - strokeWidth * 2,
        borderRadius: (size - strokeWidth * 2) / 2,
        backgroundColor: tokens.colors.surfaceVariant + '50',
      }} />
      
      {/* Progress overlay with gradient effect */}
      <View style={{
        position: 'absolute',
        top: -strokeWidth,
        left: -strokeWidth,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: 'transparent',
        borderTopColor: strokeColor,
        borderRightColor: percentage > 25 ? strokeColor : 'transparent',
        borderBottomColor: percentage > 50 ? strokeColor : 'transparent',
        borderLeftColor: percentage > 75 ? strokeColor : 'transparent',
        transform: [{ rotate: '-90deg' }],
      }} />
      
      {/* Center content is now handled by parent */}
    </View>
  );
};

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  analysisData,
  style,
}) => {
  const themeContext = useEducationTheme();
  const { tokens } = themeContext;
  const styles = useScopedThemedStyles(createStyles, themeContext);

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: tokens.colors.success, icon: 'trophy' };
    if (percentage >= 70) return { level: 'Good', color: tokens.colors.primary, icon: 'thumbs-up' };
    if (percentage >= 50) return { level: 'Fair', color: tokens.colors.warning, icon: 'trending-up' };
    return { level: 'Needs Improvement', color: tokens.colors.error, icon: 'school' };
  };

  const getTimeEfficiency = (timeUsed: number, timeLimit: number) => {
    const utilization = (timeUsed / timeLimit) * 100;
    if (utilization <= 60) return { level: 'Very Fast', color: tokens.colors.success, icon: 'flash' };
    if (utilization <= 80) return { level: 'Optimal', color: tokens.colors.primary, icon: 'speedometer' };
    if (utilization <= 95) return { level: 'Just in Time', color: tokens.colors.warning, icon: 'time' };
    return { level: 'Overtime', color: tokens.colors.error, icon: 'hourglass' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getMotivationalMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding work! You're mastering this subject! 🌟";
    if (percentage >= 80) return "Great job! You're on the right track! 🎯";
    if (percentage >= 70) return "Good effort! Keep practicing to improve! 💪";
    if (percentage >= 60) return "You're making progress! Focus on weak areas! 📚";
    return "Don't give up! Every expert was once a beginner! 🚀";
  };

  const performance = getPerformanceLevel(analysisData.percentage);
  const timeEff = getTimeEfficiency(analysisData.timeSpent, analysisData.timeLimit);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[tokens.colors.surface, tokens.colors.surfaceVariant + '40']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Performance Overview</Text>
          <Text style={styles.headerSubtitle}>
            {analysisData.subject} • {analysisData.topics.join(', ')}
          </Text>
        </View>

        {/* Hero Score Section with Progress Ring */}
        <View style={styles.heroSection}>
          <View style={styles.progressRingContainer}>
            <ScoreCircle 
              percentage={analysisData.percentage}
              size={120}
              strokeWidth={8}
            />
            <View style={styles.centerContent}>
              <Text style={[styles.heroScore, { color: performance.color }]}>
                {Math.round(analysisData.percentage)}%
              </Text>
              <Text style={styles.gradeText}>{analysisData.grade}</Text>
            </View>
          </View>
          
          <View style={styles.performanceInfo}>
            <View style={[styles.performanceBadge, { backgroundColor: performance.color + '15' }]}>
              <Ionicons 
                name={performance.icon as any} 
                size={20} 
                color={performance.color} 
              />
              <Text style={[styles.performanceText, { color: performance.color }]}>
                {performance.level}
              </Text>
            </View>
            
            <Text style={styles.motivationalText}>
              {getMotivationalMessage(analysisData.percentage)}
            </Text>
          </View>
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsGrid}>
          {/* Correct Answers Card */}
          <View style={[styles.statCard, { backgroundColor: tokens.colors.success + '08', borderColor: tokens.colors.success + '30' }]}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIconBg, { backgroundColor: tokens.colors.success + '15' }]}>
                <Ionicons name="checkmark-circle" size={18} color={tokens.colors.success} />
              </View>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>CORRECT</Text>
              <View style={styles.statValueRow}>
                <Text style={[styles.statMainNumber, { color: tokens.colors.success }]}>
                  {analysisData.correctAnswers}
                </Text>
                <Text style={styles.statTotalText}>/{analysisData.totalQuestions}</Text>
              </View>
              <Text style={styles.statDescription}>Questions right</Text>
            </View>
          </View>
          
          {/* Time Card */}
          <View style={[styles.statCard, { backgroundColor: timeEff.color + '08', borderColor: timeEff.color + '30' }]}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIconBg, { backgroundColor: timeEff.color + '15' }]}>
                <Ionicons name="time" size={18} color={timeEff.color} />
              </View>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>TIME</Text>
              <Text style={[styles.statMainNumber, { color: timeEff.color }]}>
                {formatTime(analysisData.timeSpent)}
              </Text>
              <Text style={styles.statDescription}>{timeEff.level} pace</Text>
            </View>
          </View>
          
          {/* Accuracy Card */}
          <View style={[styles.statCard, { backgroundColor: tokens.colors.primary + '08', borderColor: tokens.colors.primary + '30' }]}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIconBg, { backgroundColor: tokens.colors.primary + '15' }]}>
                <Ionicons name="trending-up" size={18} color={tokens.colors.primary} />
              </View>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={[styles.statMainNumber, { color: tokens.colors.primary }]}>
                {Math.round((analysisData.correctAnswers / analysisData.totalQuestions) * 100)}%
              </Text>
              <Text style={styles.statDescription}>Success rate</Text>
            </View>
          </View>
        </View>

        {/* Performance Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Your Score</Text>
              <View style={styles.comparisonBar}>
                <View 
                  style={[
                    styles.comparisonFill, 
                    { 
                      width: `${analysisData.percentage}%`,
                      backgroundColor: performance.color
                    }
                  ]} 
                />
              </View>
              <Text style={styles.comparisonValue}>{analysisData.percentage}%</Text>
            </View>
            
            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonLabel}>Class Average</Text>
              <View style={styles.comparisonBar}>
                <View 
                  style={[
                    styles.comparisonFill, 
                    { 
                      width: '75%',
                      backgroundColor: tokens.colors.onSurfaceVariant + '40'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.comparisonValue}>75%</Text>
            </View>
          </View>
        </View>

        {/* Achievement Section */}
        {analysisData.achievements && analysisData.achievements.length > 0 && (
          <View style={styles.achievementSection}>
            <Text style={styles.sectionTitle}>Achievements Unlocked! 🎉</Text>
            <View style={styles.achievementGrid}>
              {analysisData.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementBadge}>
                  <Ionicons name="trophy" size={16} color={tokens.colors.warning} />
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}


      </LinearGradient>
    </View>
  );
};

const createStyles = (tokens: any) => StyleSheet.create({
  container: {
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    ...tokens.shadows.md,
    // Remove fixed height - let content determine height
  },
  
  gradient: {
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: 0, // Remove horizontal padding
  },
  
  header: {
    marginBottom: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.lg, // Add padding only to header
  },
  
  headerTitle: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.xs,
  },
  
  headerSubtitle: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
  },
  
  // Hero Section Styles
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.md, // Reduced padding
    minHeight: 140, // Ensure consistent height
  },
  
  progressRingContainer: {
    position: 'relative',
    marginRight: tokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure content stays on top
  },
  
  heroScore: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  
  gradeText: {
    fontSize: tokens.typography.title,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurfaceVariant,
    marginTop: 2,
  },
  
  performanceInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: tokens.spacing.sm, // Reduced left padding
  },
  
  motivationalText: {
    fontSize: tokens.typography.body,
    color: tokens.colors.onSurface,
    marginTop: tokens.spacing.md,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'left', // Ensure left alignment
  },
  
  performanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    gap: tokens.spacing.xs,
    alignSelf: 'flex-start',
  },
  
  performanceText: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.semiBold,
  },

  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.xl,
    gap: tokens.spacing.sm, // Reduced gap for better fit
    paddingHorizontal: tokens.spacing.md, // Reduced padding
  },
  
  statCard: {
    flex: 1,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
    borderWidth: 1,
    ...tokens.shadows.sm,
    minHeight: 120,
    alignItems: 'center',
  },
  
  statIconContainer: {
    marginBottom: tokens.spacing.sm,
  },
  
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  statContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xs,
  },
  
  statMainNumber: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
    textAlign: 'center',
  },
  
  statTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.onSurfaceVariant,
    marginLeft: 2,
  },
  
  statDescription: {
    fontSize: tokens.typography.caption,
    color: tokens.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Comparison Section Styles  
  comparisonSection: {
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.md, // Reduced padding
  },
  
  sectionTitle: {
    fontSize: tokens.typography.subtitle,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    marginBottom: tokens.spacing.md,
  },
  
  comparisonCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    ...tokens.shadows.sm,
  },
  
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  
  comparisonLabel: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.medium,
    color: tokens.colors.onSurface,
    width: 90, // Slightly reduced width
    textAlign: 'left',
  },
  
  comparisonBar: {
    flex: 1,
    height: 8,
    backgroundColor: tokens.colors.outline + '30',
    borderRadius: 4,
    marginHorizontal: tokens.spacing.md,
    overflow: 'hidden',
  },
  
  comparisonFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  comparisonValue: {
    fontSize: tokens.typography.body,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.onSurface,
    width: 50,
    textAlign: 'right',
  },

  // Achievement Section Styles
  achievementSection: {
    paddingHorizontal: tokens.spacing.md, // Reduced padding
    marginBottom: tokens.spacing.lg,
  },
  
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.warning + '15',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    borderWidth: 1,
    borderColor: tokens.colors.warning + '30',
    gap: tokens.spacing.xs,
  },
  
  achievementText: {
    fontSize: tokens.typography.caption,
    fontWeight: tokens.typography.semiBold,
    color: tokens.colors.warning,
  },
  
});